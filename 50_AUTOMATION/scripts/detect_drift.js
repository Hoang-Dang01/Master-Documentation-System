#!/usr/bin/env node
/**
 * MDS vNext Linter & Drift Detector (v1.1 Canonical Linter)
 * Configuration-driven paths and required files validator.
 */

const fs = require('fs');
const path = require('path');

// ==========================================
// LOAD CONFIGURATION
// ==========================================

const scriptDir = __dirname;
const workspaceRoot = path.resolve(scriptDir, "..", "..");
const configPath = path.join(workspaceRoot, "50_AUTOMATION", "configs", "paths.config.json");

if (!fs.existsSync(configPath)) {
    console.error(`[FATAL] Configuration file not found at: ${configPath}`);
    process.exit(1);
}

let config;
try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (err) {
    console.error(`[FATAL] Failed to parse paths.config.json: ${err.message}`);
    process.exit(1);
}

// Extract variables
const schemaVersion = config.schema_version || "1.0.0";
const targetProjectsDir = config.paths ? config.paths.projects : "30_PROJECTS/ACTIVE";
const requiredFiles = config.required_files || [];

console.log(`[MDS LINTER] Loaded schema version: ${schemaVersion}`);

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const ALLOWED_STATUSES = new Set([
    "DRAFT", "REVIEW", "APPROVED", "IN_PROGRESS", 
    "DEPRECATED", "ARCHIVED", "BLOCKED", "NOT_APPLICABLE"
]);

const ALLOWED_ROLES = new Set([
    "ALL", "PM", "BA", "SA", "ARCH", "BE", "FE", "QA", "DEVOPS", "AI"
]);

// Rule 1: Filename Regex (strictly requiring 3-digit SemVer e.g. v1.0.0)
// [STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension
const FILENAME_REGEX = /^\[(DRAFT|REVIEW|APPROVED|IN_PROGRESS|DEPRECATED|ARCHIVED|BLOCKED|NOT_APPLICABLE)\]_(PM|BA|SA|ARCH|BE|FE|QA|DEVOPS|AI)-([A-Z]{2,4})-(\d{3})_([A-Z0-9_]+)_v(\d+\.\d+\.\d+)\.(md|sql|yaml|json|tf|drawio|fig|png|jpg)$/;

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

        const isIndented = line.startsWith(" ") || line.startsWith("\t");

        if (trimmed.startsWith("-")) {
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
            if (trimmed.includes(":")) {
                const index = trimmed.indexOf(":");
                const k = trimmed.substring(0, index).trim();
                const v = trimmed.substring(index + 1).trim().replace(/^["']|["']$/g, "");
                if (currentItem && typeof currentItem === "object") {
                    currentItem[k] = v;
                }
            }
        } else {
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
    if (!fs.existsSync(dir)) return;
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
    }

    reportError(filePath, messageVi, messageEn) {
        const relPath = path.relative(this.rootPath, filePath);
        this.errors.push({
            file: relPath,
            vi: messageVi,
            en: messageEn
        });
    }

    validateRequiredFiles() {
        console.log("[MDS LINTER] Validating critical required files...");
        for (const reqFile of requiredFiles) {
            const fullPath = path.join(this.rootPath, reqFile);
            if (!fs.existsSync(fullPath)) {
                this.errors.push({
                    file: reqFile,
                    vi: `Thiếu file yêu cầu bắt buộc: ${reqFile}`,
                    en: `Missing critical required file: ${reqFile}`
                });
            }
        }
    }

    scanAndValidate() {
        console.log(`[MDS LINTER] Scanning projects directory: ${targetProjectsDir}`);
        const dirPath = path.join(this.rootPath, targetProjectsDir);
        
        walkDir(dirPath, (filePath) => {
            const filename = path.basename(filePath);
            if (filename.startsWith('.')) return;
            this.validateFile(filePath);
        });
    }

    validateFile(filePath) {
        const filename = path.basename(filePath);
        const relPath = path.relative(this.rootPath, filePath);

        // Core project context files brief/context/constraints/status can bypass filename convention
        const isCoreBriefFile = ["PROJECT_BRIEF.md", "BUSINESS_CONTEXT.md", "CONSTRAINTS.md", "STATUS.md"].includes(filename);

        if (!isCoreBriefFile) {
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

            if (!filename.endsWith(".md")) return;

            let content;
            try {
                content = fs.readFileSync(filePath, "utf8");
            } catch (err) {
                this.reportError(filePath, `Không thể đọc file: ${err.message}`, `Failed to read file: ${err.message}`);
                return;
            }

            // Parse YAML Frontmatter
            const metadata = parseFrontmatter(content);
            if (!metadata) {
                this.reportError(
                    filePath,
                    "Không tìm thấy hoặc không thể parse YAML Frontmatter. File phải bắt đầu và kết thúc bằng ---",
                    "Missing or invalid YAML Frontmatter. File must start and end metadata with ---"
                );
                return;
            }

            // --- RULE 2: ID Convention & Matching ---
            const yamlId = metadata.id;
            if (!yamlId) {
                this.reportError(filePath, "Thiếu trường 'id' trong YAML.", "Missing 'id' field in YAML.");
            } else {
                const idMatch = yamlId.match(ID_REGEX);
                if (!idMatch) {
                    this.reportError(
                        filePath,
                        `ID '${yamlId}' không đúng định dạng. Chuẩn: [TYPE]-[COMPONENT]-[NUMBER] (Ví dụ: REQ-AUTH-001)`,
                        `ID '${yamlId}' does not match Rule 2 ID Convention. Expected: [TYPE]-[COMPONENT]-[NUMBER] (e.g. REQ-AUTH-001)`
                    );
                } else {
                    const [__, idType, idComp, idNum] = idMatch;

                    if (idType !== fnType) {
                        this.reportError(
                            filePath,
                            `Loại thực thể trong ID YAML (${idType}) không khớp với tên file (${fnType}).`,
                            `Entity TYPE in YAML ID (${idType}) does not match TYPE in filename (${fnType}).`
                        );
                    }
                    if (idNum !== fnNum) {
                        this.reportError(
                            filePath,
                            `Số thứ tự trong ID YAML (${idNum}) không khớp với tên file (${fnNum}).`,
                            `Entity NUMBER in YAML ID (${idNum}) does not match NUMBER in filename (${fnNum}).`
                        );
                    }

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

            // --- RULE 3: Status Matching ---
            const yamlStatus = metadata.status;
            if (!yamlStatus) {
                this.reportError(filePath, "Thiếu trường 'status' trong YAML.", "Missing 'status' field in YAML.");
            } else {
                if (!ALLOWED_STATUSES.has(yamlStatus)) {
                    this.reportError(
                        filePath,
                        `Trạng thái '${yamlStatus}' không hợp lệ.`,
                        `Status '${yamlStatus}' is invalid.`
                    );
                } else if (yamlStatus !== fnStatus) {
                    this.reportError(
                        filePath,
                        `Trạng thái trong YAML (${yamlStatus}) không khớp với tên file (${fnStatus}).`,
                        `Status in YAML (${yamlStatus}) does not match status in filename (${fnStatus}).`
                    );
                }
            }

            // --- RULE 1: Version Matching ---
            const yamlVersion = metadata.version;
            if (!yamlVersion) {
                this.reportError(filePath, "Thiếu trường 'version' trong YAML.", "Missing 'version' field in YAML.");
            } else {
                if (yamlVersion !== fnVer) {
                    this.reportError(
                        filePath,
                        `Phiên bản trong YAML (${yamlVersion}) không khớp với tên file (${fnVer}).`,
                        `Version in YAML (${yamlVersion}) does not match version in filename (${fnVer}).`
                    );
                }
            }
        } else {
            // Validate YAML for core brief files
            if (!filename.endsWith(".md")) return;
            let content = fs.readFileSync(filePath, "utf8");
            const metadata = parseFrontmatter(content);
            if (metadata && metadata.id) {
                this.registry[metadata.id] = relPath;
            }
        }
    }
}

// ==========================================
// MAIN EXECUTION
// ==========================================

const linter = new MDSLinter(workspaceRoot);
linter.validateRequiredFiles();
linter.scanAndValidate();

const totalErrors = linter.errors.length;
if (totalErrors > 0) {
    console.log(`\n[FAIL] Found ${totalErrors} errors.`);
    linter.errors.forEach(e => console.error(` - ${e.file}: ${e.vi}`));
    process.exit(1);
} else {
    console.log("\n[SUCCESS] Validation passed successfully!");
    process.exit(0);
}