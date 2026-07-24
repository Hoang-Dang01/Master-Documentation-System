#!/usr/bin/env node
/**
 * MDS vNext Linter & Drift Detector (v1.2.0 Canonical Linter)
 * Configuration-driven paths, required files, and glossary reverse-build validator.
 */

const fs = require('fs');
const path = require('path');

// Load config
const scriptDir = __dirname;
const workspaceRoot = path.resolve(scriptDir, "..", "..");
const configPath = path.join(workspaceRoot, "automation", "configs", "paths.config.json");

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

const requiredFiles = config.required_files || [];
const targetProjectsDir = config.paths.projects || "projects/active";

// Regular expressions
const FILENAME_REGEX = /^\[(DRAFT|REVIEW|APPROVED|IN_PROGRESS|DEPRECATED|ARCHIVED|BLOCKED|NOT_APPLICABLE)\]_(PM|BA|SA|ARCH|BE|FE|QA|DEVOPS|AI)-([A-Z]{2,4})-(\d{3})_([A-Z0-9_]+)_v(\d+\.\d+\.\d+)\.(md|sql|yaml|json|tf|drawio|fig|png|jpg)$/;
const ID_REGEX = /^([A-Z]{2,4})-([A-Z]{2,4})-(\d{3})$/;
const ALLOWED_STATUSES = new Set(["DRAFT", "REVIEW", "APPROVED", "IN_PROGRESS", "DEPRECATED", "ARCHIVED", "BLOCKED", "NOT_APPLICABLE"]);

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

        // Run glossary reverse-build validation
        this.validateGlossaryReverseBuild();
    }

    validateFile(filePath) {
        const filename = path.basename(filePath);
        const relPath = path.relative(this.rootPath, filePath);

        const isCoreBriefFile = ["project_brief.md", "business_context.md", "constraints.md", "status.md"].includes(filename.toLowerCase());

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

    validateGlossaryReverseBuild() {
        const glossaryScriptsDir = path.join(this.rootPath, "automation", "scripts", "glossary");
        if (!fs.existsSync(glossaryScriptsDir)) return;

        const { parseYamlFile } = require('./glossary/load_terms');
        const { validateTerms } = require('./glossary/validate_terms');

        const FILE_ARTIFACT_IDS = {
            '01_core_terms.yaml': 'AST-GLOSSARY-CORE-FILE',
            '02_relations.yaml': 'AST-GLOSSARY-REL-FILE',
            '03_artifact_types.yaml': 'AST-GLOSSARY-TYPES-FILE',
            '04_backend_terms.yaml': 'AST-GLOSSARY-BE-FILE',
            '05_database_terms.yaml': 'AST-GLOSSARY-DB-FILE',
            '06_frontend_terms.yaml': 'AST-GLOSSARY-FE-FILE',
            '07_devops_terms.yaml': 'AST-GLOSSARY-DEVOPS-FILE',
            '08_acronyms.yaml': 'AST-GLOSSARY-ACR-FILE'
        };

        const dataDir = path.join(this.rootPath, "core", "glossary", "data");
        if (!fs.existsSync(dataDir)) return;

        const manifestPath = path.join(this.rootPath, "core", "glossary", "MANIFEST.yaml");
        const files = [];
        if (fs.existsSync(manifestPath)) {
            const manifestContent = fs.readFileSync(manifestPath, 'utf8');
            let inFilesSection = false;
            for (const line of manifestContent.split('\n')) {
                if (line.trim().startsWith('files:')) {
                    inFilesSection = true;
                    continue;
                }
                if (inFilesSection) {
                    if (line.trim().startsWith('-')) {
                        files.push(line.replace('-', '').trim());
                    } else if (line.trim() !== '' && line.includes(':')) {
                        break;
                    }
                }
            }
        } else {
            files.push(...fs.readdirSync(dataDir).filter(f => f.endsWith('.yaml')));
        }
        
        let allTerms = [];
        const termFilesMap = new Map();

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            if (!fs.existsSync(filePath)) continue;
            const terms = parseYamlFile(filePath);
            for (let t of terms) {
                t._file = file;
            }
            allTerms = allTerms.concat(terms);
            termFilesMap.set(file, terms);
        }

        const validationErrors = validateTerms(allTerms);
        if (validationErrors.length > 0) {
            validationErrors.forEach(err => {
                this.errors.push({
                    file: "core/glossary/",
                    vi: `Lỗi đối soát YAML Glossary: ${err}`,
                    en: `Glossary YAML validation error: ${err}`
                });
            });
            return;
        }

        // Simulating Markdown compiler to detect manual changes (drift)
        for (const [file, terms] of termFilesMap.entries()) {
            const fileArtifactId = FILE_ARTIFACT_IDS[file] || 'AST-GLOSSARY-UNKNOWN-FILE';
            const categoryTitle = file.replace('.yaml', '').split('_').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            let expectedContent = `<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/${file} -->
---
id: ${fileArtifactId}
name: ${categoryTitle} Glossary
artifact_type: REG
domain: META
owner: MDS_CORE
status: APPROVED
version: 1.1.0
tags:
  - glossary
  - core
created_at: 2026-06-29
updated_at: 2026-06-29
last_updated_by: build_glossary.js
change_summary: Auto-compiled glossary markdown
links:
  depends_on: []
---

# ${categoryTitle} Glossary

`;

            for (const term of terms) {
                expectedContent += `## ${term.term}\n\n`;
                expectedContent += `*   **Artifact ID**: \`${term.artifact_id}\`\n`;
                expectedContent += `*   **Canonical Name**: \`${term.canonical_name}\`\n`;
                expectedContent += `*   **Category**: \`${term.category}\`\n`;
                expectedContent += `*   **Namespace**: \`${term.namespace}\`\n`;
                expectedContent += `*   **Domain**: \`${term.domain}\`\n`;
                if (term.lifecycle_phase && term.lifecycle_phase.length > 0) {
                    expectedContent += `*   **Lifecycle Phase**: ${term.lifecycle_phase.map(p => `\`${p}\``).join(', ')}\n`;
                }
                expectedContent += `*   **Version**: \`${term.version}\`\n`;
                expectedContent += `*   **Status**: \`${term.status}\`\n`;
                expectedContent += `*   **Owner**: \`${term.owner}\`\n`;
                expectedContent += `*   **Definition**: ${term.definition}\n`;

                if (term.aliases && term.aliases.length > 0) {
                    expectedContent += `*   **Aliases**: ${term.aliases.map(a => `\`${a}\``).join(', ')}\n`;
                }
                if (term.examples && term.examples.length > 0) {
                    expectedContent += `*   **Examples**:\n`;
                    for (const ex of term.examples) {
                        expectedContent += `    * ${ex}\n`;
                    }
                }
                if (term.notes && term.notes.length > 0) {
                    expectedContent += `*   **Notes**:\n`;
                    for (const n of term.notes) {
                        expectedContent += `    * ${n}\n`;
                    }
                }
                if (term.inverse_relation) {
                    expectedContent += `*   **Inverse Relation**: \`${term.inverse_relation}\`\n`;
                }
                if (term.edge_direction) {
                    expectedContent += `*   **Edge Direction**: \`${term.edge_direction}\`\n`;
                }
                if (typeof term.transitive === 'boolean') {
                    expectedContent += `*   **Transitive**: \`${term.transitive}\`\n`;
                }
                if (term.related_terms && term.related_terms.length > 0) {
                    expectedContent += `*   **Related Terms**: ${term.related_terms.map(t => `[${t}](#${t.toLowerCase()})`).join(', ')}\n`;
                }
                expectedContent += `\n---\n\n`;
            }

            expectedContent = expectedContent.trim() + '\n';
            const outName = 'glossary_' + file.replace('.yaml', '').toLowerCase() + '.md';
            const outPath = path.join(this.rootPath, 'core', 'glossary', outName);

            if (!fs.existsSync(outPath)) {
                this.errors.push({
                    file: `core/glossary/${outName}`,
                    vi: `Không tìm thấy file generated: ${outName}. Hãy chạy: node automation/scripts/glossary/build_glossary.js`,
                    en: `Missing generated file: ${outName}. Please run: node automation/scripts/glossary/build_glossary.js`
                });
                continue;
            }

            const actualContent = fs.readFileSync(outPath, 'utf8');
            if (actualContent !== expectedContent) {
                this.errors.push({
                    file: `core/glossary/${outName}`,
                    vi: `Phát hiện sửa đổi thủ công trái phép trên file generated '${outName}'! Hãy sửa file nguồn tại 'core/glossary/data/${file}' và chạy: node automation/scripts/glossary/build_glossary.js`,
                    en: `Unauthorized manual modification detected on generated file '${outName}'! Please edit the source file at 'core/glossary/data/${file}' and run: node automation/scripts/glossary/build_glossary.js`
                });
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