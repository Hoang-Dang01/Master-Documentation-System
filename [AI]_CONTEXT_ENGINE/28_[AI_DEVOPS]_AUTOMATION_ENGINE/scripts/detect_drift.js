#!/usr/bin/env node
/**
 * MDS (Master Documentation System) Linter & Drift Detector
 * Enforces the 4 Canonical Rules on the workspace.
 * Written in native Node.js (zero dependencies) to run in any Node environment.
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const TARGET_DIRS = [
    "[HUMAN]_DOCUMENTATION_SYSTEM",
    "[SYSTEM]_KNOWLEDGE_GRAPH",
    "[AI]_CONTEXT_ENGINE"
];

// Subdirectories completely excluded from linting
const EXCLUDE_SUBDIRS = [
    path.join("[HUMAN]_DOCUMENTATION_SYSTEM", "00_[ALL]_META"),
];

// Structural system-wide files exempt from Rule 1
const EXCLUDE_FILENAMES = [
    "README.md",
    "STRUCTURE.md",
    "TEMPLATES.md",
    "ENTITY_SCHEMA.md",
    "ai_agent_prompts.md",
    "ci_gate_config.yml"
];

const ALLOWED_STATUSES = new Set([
    "DRAFT", "REVIEW", "APPROVED", "IN_PROGRESS", 
    "DEPRECATED", "ARCHIVED", "BLOCKED", "NOT_APPLICABLE"
]);

const ALLOWED_ROLES = new Set([
    "ALL", "PM", "BA", "SA", "ARC", "DBA", "BE", "FE", 
    "QA", "DEVOPS", "SEC", "SRE", "OPS", "AI"
]);

const ALLOWED_RELATIONS = new Set([
    "depends_on", "implements", "tested_by", "broken_by", "impacts_cost"
]);

// Rule 1: Filename Regex (strictly requiring 3-digit SemVer e.g. v1.0.0)
// [STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension
const FILENAME_REGEX = /^\[(DRAFT|REVIEW|APPROVED|IN_PROGRESS|DEPRECATED|ARCHIVED|BLOCKED|NOT_APPLICABLE)\]_(ALL|PM|BA|SA|ARC|DBA|BE|FE|QA|DEVOPS|SEC|SRE|OPS|AI)-([A-Z]{2,4})-(\d{3})_([A-Z0-9_]+)_v(\d+\.\d+\.\d+)\.(md|sql|yaml|json|tf|drawio|fig|png|jpg)$/;

// Rule 2: ID Regex
const ID_REGEX = /^([A-Z]{3,4})-([A-Z0-9_]{3,10})-(\d{3})$/;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function parseFrontmatter(content) {
    const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/);
    if (!match) return null;

    const yamlText = match[1];
    const data = {};
    let currentKey = null;
    let currentList = null;
    let currentItem = null;

    const lines = yamlText.split(/\r?\n/);
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        // Check if the original line had indentation (starts with space or tab)
        const isIndented = line.startsWith(" ") || line.startsWith("\t");

        if (trimmed.startsWith("-")) {
            // New list item
            const itemText = trimmed.substring(1).trim();
            if (!currentKey) continue;

            if (!data[currentKey] || !Array.isArray(data[currentKey])) {
                data[currentKey] = [];
            }
            currentList = data[currentKey];

            if (itemText.includes(":")) {
                const index = itemText.indexOf(":");
                const k = itemText.substring(0, index).trim();
                const v = itemText.substring(index + 1).trim().replace(/^["']|["']$/g, "");
                currentItem = { [k]: v };
                currentList.push(currentItem);
            } else {
                const v = itemText.replace(/^["']|["']$/g, "");
                currentList.push(v);
                currentItem = null;
            }
        } else if (isIndented) {
            // Nested property of the current list item or object
            if (trimmed.includes(":")) {
                const index = trimmed.indexOf(":");
                const k = trimmed.substring(0, index).trim();
                const v = trimmed.substring(index + 1).trim().replace(/^["']|["']$/g, "");
                if (currentItem && typeof currentItem === "object") {
                    currentItem[k] = v;
                }
            }
        } else {
            // Top-level key (no indentation)
            if (trimmed.includes(":")) {
                const index = trimmed.indexOf(":");
                const k = trimmed.substring(0, index).trim();
                const v = trimmed.substring(index + 1).trim().replace(/^["']|["']$/g, "");
                currentKey = k;
                if (v) {
                    data[k] = v;
                } else {
                    data[k] = null;
                }
                currentItem = null;
                currentList = null;
            }
        }
    }
    return data;
}

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath, callback);
        } else {
            callback(filePath);
        }
    }
}

// ==========================================
// LINTER CLASS
// ==========================================

class MDSLinter {
    constructor(rootPath) {
        this.rootPath = rootPath;
        this.errors = [];
        this.registry = {}; // ID -> FilePath
        this.linksToVerify = []; // array of { fromFile, fromId, toId, relation }
    }

    reportError(filePath, messageVi, messageEn) {
        const relPath = path.relative(this.rootPath, filePath);
        this.errors.push({
            file: relPath,
            vi: messageVi,
            en: messageEn
        });
    }

    isExcluded(filePath) {
        const relPath = path.relative(this.rootPath, filePath);
        const filename = path.basename(filePath);

        // 1. Exclude Git / hidden files (e.g. .gitkeep, .gitignore)
        if (filename.startsWith('.')) return true;

        // 2. Exclude system-level configuration & framework files
        if (EXCLUDE_FILENAMES.includes(filename)) return true;

        // 3. Exclude explicit system subdirectories (like templates)
        for (const excludedDir of EXCLUDE_SUBDIRS) {
            if (relPath.startsWith(excludedDir)) return true;
        }

        // 4. Exclude system registries, organizational models, active contexts, and code scripts
        const systemExclusions = [
            path.join("[SYSTEM]_KNOWLEDGE_GRAPH", "23_[ALL]_SYSTEM_REGISTRY"),
            path.join("[SYSTEM]_KNOWLEDGE_GRAPH", "26_[ALL]_ORGANIZATIONAL_ARCHITECTURE"),
            path.join("[AI]_CONTEXT_ENGINE", "28_[AI_DEVOPS]_AUTOMATION_ENGINE"),
            path.join("[AI]_CONTEXT_ENGINE", "90_[ALL]_ORCHESTRATION_ENGINE")
        ];

        for (const sysEx of systemExclusions) {
            if (relPath.startsWith(sysEx)) {
                return true;
            }
        }

        return false;
    }

    scanAndValidate() {
        console.log("[MDS LINTER] Scanning workspace...");

        for (const targetDir of TARGET_DIRS) {
            const dirPath = path.join(this.rootPath, targetDir);
            if (!fs.existsSync(dirPath)) continue;

            walkDir(dirPath, (filePath) => {
                if (this.isExcluded(filePath)) return;
                this.validateFile(filePath);
            });
        }

        this.validateRelationships();
    }

    validateFile(filePath) {
        const filename = path.basename(filePath);
        const relPath = path.relative(this.rootPath, filePath);

        // --- RULE 1: Naming Convention ---
        const match = filename.match(FILENAME_REGEX);
        if (!match) {
            this.reportError(
                filePath,
                "Tên file không đúng quy chuẩn Rule 1. Định dạng chuẩn: [STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension",
                "Filename does not match Rule 1 Naming Convention. Expected: [STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension"
            );
            return;
        }

        const [_, fnStatus, fnRole, fnType, fnNum, fnName, fnVer, fnExt] = match;

        // Only validate YAML frontmatter for Markdown files
        if (!filename.endsWith(".md")) return;

        let content;
        try {
            content = fs.readFileSync(filePath, "utf8");
        } catch (err) {
            this.reportError(
                filePath,
                `Không thể đọc file: ${err.message}`,
                `Failed to read file: ${err.message}`
            );
            return;
        }

        // Parse YAML Frontmatter
        const metadata = parseFrontmatter(content);
        if (!metadata) {
            this.reportError(
                filePath,
                "Không tìm thấy hoặc không thể parse YAML Frontmatter ở đầu file. File phải bắt đầu và kết thúc phần metadata bằng ---",
                "Missing or invalid YAML Frontmatter at the top. File must start and end metadata with ---"
            );
            return;
        }

        // --- RULE 2: ID Convention & Matching ---
        const yamlId = metadata.id;
        if (!yamlId) {
            this.reportError(
                filePath,
                "Thiếu trường 'id' trong YAML Frontmatter.",
                "Missing 'id' field in YAML Frontmatter."
            );
        } else {
            const idMatch = yamlId.match(ID_REGEX);
            if (!idMatch) {
                this.reportError(
                    filePath,
                    `ID '${yamlId}' không đúng định dạng Rule 2. Định dạng chuẩn: [TYPE]-[COMPONENT]-[NUMBER] (Ví dụ: REQ-ATT-001)`,
                    `ID '${yamlId}' does not match Rule 2 ID Convention. Expected: [TYPE]-[COMPONENT]-[NUMBER] (e.g. REQ-ATT-001)`
                );
            } else {
                const [__, idType, idComp, idNum] = idMatch;

                // Cross-check type and number with filename
                if (idType !== fnType) {
                    this.reportError(
                        filePath,
                        `Loại thực thể trong ID YAML (${idType}) không khớp với loại thực thể trong tên file (${fnType}).`,
                        `Entity TYPE in YAML ID (${idType}) does not match TYPE in filename (${fnType}).`
                    );
                }
                if (idNum !== fnNum) {
                    this.reportError(
                        filePath,
                        `Số thứ tự trong ID YAML (${idNum}) không khớp với số thứ tự trong tên file (${fnNum}).`,
                        `Entity NUMBER in YAML ID (${idNum}) does not match NUMBER in filename ({fnNum}).`
                    );
                }

                // Check for duplicate IDs
                if (this.registry[yamlId]) {
                    this.reportError(
                        filePath,
                        `ID trùng lặp! ID '${yamlId}' đã được khai báo tại file: ${this.registry[yamlId]}`,
                        `Duplicate ID found! ID '${yamlId}' is already declared in: ${this.registry[yamlId]}`
                    );
                } else {
                    this.registry[yamlId] = relPath;
                }
            }
        }

        // --- RULE 3: Document Lifecycle & Status Matching ---
        const yamlStatus = metadata.status;
        if (!yamlStatus) {
            this.reportError(
                filePath,
                "Thiếu trường 'status' trong YAML Frontmatter.",
                "Missing 'status' field in YAML Frontmatter."
            );
        } else {
            if (!ALLOWED_STATUSES.has(yamlStatus)) {
                this.reportError(
                    filePath,
                    `Trạng thái '${yamlStatus}' không hợp lệ. Các trạng thái cho phép: ${Array.from(ALLOWED_STATUSES).sort().join(", ")}`,
                    `Status '${yamlStatus}' is invalid. Allowed statuses: ${Array.from(ALLOWED_STATUSES).sort().join(", ")}`
                );
            } else if (yamlStatus !== fnStatus) {
                this.reportError(
                    filePath,
                    `Trạng thái trong YAML (${yamlStatus}) không khớp với trạng thái trong tên file (${fnStatus}).`,
                    `Status in YAML (${yamlStatus}) does not match status in filename (${fnStatus}).`
                );
            }
        }

        // --- RULE 1: Version Validation & Matching (Strict SemVer) ---
        const yamlVersion = metadata.version;
        if (!yamlVersion) {
            this.reportError(
                filePath,
                "Thiếu trường 'version' trong YAML Frontmatter.",
                "Missing 'version' field in YAML Frontmatter."
            );
        } else {
            const versionRegex = /^\d+\.\d+\.\d+$/;
            if (!versionRegex.test(yamlVersion)) {
                this.reportError(
                    filePath,
                    `Phiên bản '${yamlVersion}' không đúng định dạng SemVer. Yêu cầu định dạng 3 chữ số: MAJOR.MINOR.PATCH (Ví dụ: 1.0.0)`,
                    `Version '${yamlVersion}' does not match SemVer format. Expected 3 digits: MAJOR.MINOR.PATCH (e.g. 1.0.0)`
                );
            } else if (yamlVersion !== fnVer) {
                this.reportError(
                    filePath,
                    `Phiên bản trong YAML (${yamlVersion}) không khớp với phiên bản trong tên file (${fnVer}).`,
                    `Version in YAML (${yamlVersion}) does not match version in filename (${fnVer}).`
                );
            }
        }

        // --- Collect Links for Rule 4 ---
        const links = metadata.links;
        if (links && Array.isArray(links)) {
            for (const link of links) {
                if (typeof link !== "object" || link === null) continue;
                const toId = link.id;
                const relation = link.relation;
                if (toId && relation) {
                    this.linksToVerify.push({
                        fromFile: relPath,
                        fromId: yamlId,
                        toId: toId,
                        relation: relation
                    });
                }
            }
        }
    }

    validateRelationships() {
        for (const link of this.linksToVerify) {
            const { fromFile, fromId, toId, relation } = link;
            const fullPath = path.join(this.rootPath, fromFile);

            // 1. Check relation type
            if (!ALLOWED_RELATIONS.has(relation)) {
                this.reportError(
                    fullPath,
                    `Mối quan hệ '${relation}' không hợp lệ. Các quan hệ cho phép: ${Array.from(ALLOWED_RELATIONS).sort().join(", ")}`,
                    `Relationship '${relation}' is invalid. Allowed relations: ${Array.from(ALLOWED_RELATIONS).sort().join(", ")}`
                );
            }

            // 2. Check for orphan link
            if (!this.registry[toId]) {
                this.reportError(
                    fullPath,
                    `Liên kết mồ côi! Thực thể '${fromId}' trỏ tới ID '${toId}' không tồn tại trong hệ thống.`,
                    `Orphan link detected! Entity '${fromId}' references ID '${toId}' which does not exist in the workspace.`
                );
            }
        }
    }
}

// ==========================================
// MAIN EXECUTION
// ==========================================

const scriptDir = __dirname;
// Ascend 3 levels to reach the workspace root
const workspaceRoot = path.resolve(scriptDir, "..", "..", "..");

console.log(`MDS Linter initialized at: ${workspaceRoot}`);

const linter = new MDSLinter(workspaceRoot);
linter.scanAndValidate();

const totalErrors = linter.errors.length;
const totalEntities = Object.keys(linter.registry).length;

console.log("\n" + "=".repeat(50));
console.log("MDS LINTER VALIDATION SUMMARY");
console.log("=".repeat(50));
console.log(`Total Registered Entities: ${totalEntities}`);
console.log(`Total Validation Errors:   ${totalErrors}`);
console.log("=".repeat(50));

if (totalErrors > 0) {
    console.log("\n[FAIL] VALIDATION FAILED! Found the following errors:\n");
    
    // Group errors by file for cleaner output
    const errorsByFile = {};
    for (const err of linter.errors) {
        if (!errorsByFile[err.file]) {
            errorsByFile[err.file] = [];
        }
        errorsByFile[err.file].push(err);
    }

    for (const [file, errs] of Object.entries(errorsByFile)) {
        console.log(`File: [ ${file} ]`);
        for (const e of errs) {
            console.log(`   - VI: ${e.vi}`);
            console.log(`   - EN: ${e.en}`);
        }
        console.log("-".repeat(50));
    }
    process.exit(1);
} else {
    console.log("\n[SUCCESS] VALIDATION SUCCESSFUL! All files and relationships comply with the 4 Canonical Rules.\n");
    process.exit(0);
}
