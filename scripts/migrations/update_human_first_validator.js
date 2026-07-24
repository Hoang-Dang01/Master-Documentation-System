#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..", "..");
const targetPath = path.join(
  repositoryRoot,
  "scripts",
  "automation",
  "scripts",
  "detect_drift.js",
);

function validateFile(filePath) {
    const filename = path.basename(filePath);
    const extension = path.extname(filename).toLowerCase();
    const relPath = path.relative(this.rootPath, filePath);
    const isReservedSystemFile = RESERVED_SYSTEM_FILENAMES.has(filename.toLowerCase());

    if (!isReservedSystemFile) {
        const match = filename.match(FILENAME_REGEX);
        if (!match) {
            this.reportError(
                filePath,
                "Tên file phải là slug dễ đọc, viết thường và ngăn cách bằng dấu gạch ngang. Ví dụ: dao-tao-mo-hinh-phat-hien-url.md",
                "Filename must be a readable lowercase kebab-case slug, for example: dao-tao-mo-hinh-phat-hien-url.md"
            );
            return;
        }

        const slug = filename.slice(0, -extension.length);
        const slugTokens = slug.split("-");
        const hasForbiddenToken = slugTokens.some((token) =>
            FORBIDDEN_FILENAME_TOKENS.has(token) || /^v\d+(?:\.\d+){0,2}$/.test(token)
        ) || slug.includes("in-progress");

        if (hasForbiddenToken) {
            this.reportError(
                filePath,
                "Filename không được chứa trạng thái, phiên bản hoặc nhãn FINAL/LATEST/UPDATED; hãy đặt các giá trị đó trong metadata.",
                "Filename must not contain status, version, or FINAL/LATEST/UPDATED labels; store them in metadata."
            );
        }

        if (slug.length > 80) {
            this.reportError(
                filePath,
                `Slug dài ${slug.length} ký tự; giới hạn là 80 ký tự.`,
                `Slug is ${slug.length} characters; the limit is 80.`
            );
        }
    }

    if (extension !== ".md") return;

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

    const metadata = parseFrontmatter(content);
    if (!metadata) {
        this.reportError(
            filePath,
            "Thiếu hoặc không thể parse YAML Frontmatter.",
            "Missing or invalid YAML Frontmatter."
        );
        return;
    }

    const yamlId = metadata.id;
    if (!yamlId) {
        this.reportError(filePath, "Thiếu trường 'id' trong YAML.", "Missing 'id' field in YAML.");
    } else {
        if (!isReservedSystemFile && !ID_REGEX.test(yamlId)) {
            this.reportError(
                filePath,
                `ID '${yamlId}' không đúng định dạng ROLE-TYPE-PROJECT-COMPONENT-NUMBER.`,
                `ID '${yamlId}' must use ROLE-TYPE-PROJECT-COMPONENT-NUMBER.`
            );
        }

        if (this.registry[yamlId]) {
            this.reportError(
                filePath,
                `ID trùng lặp '${yamlId}', đã có tại ${this.registry[yamlId]}.`,
                `Duplicate ID '${yamlId}', already declared in ${this.registry[yamlId]}.`
            );
        } else {
            this.registry[yamlId] = relPath;
        }
    }

    const title = metadata.title;
    if (!title) {
        this.reportError(filePath, "Thiếu trường 'title' dành cho người đọc.", "Missing human-readable 'title' field.");
    } else if (TECHNICAL_TITLE_PREFIX.test(title)) {
        this.reportError(
            filePath,
            `Title '${title}' bắt đầu bằng mã kỹ thuật; hãy dùng tên tự nhiên.`,
            `Title '${title}' starts with a technical code; use a natural human-readable title.`
        );
    }

    const project = metadata.project;
    if (!project) {
        this.reportError(filePath, "Thiếu trường 'project' trong YAML.", "Missing 'project' field in YAML.");
    } else if (!PROJECT_ID_REGEX.test(project)) {
        this.reportError(
            filePath,
            `Project id '${project}' phải dùng lowercase kebab-case.`,
            `Project id '${project}' must use lowercase kebab-case.`
        );
    }

    const lifecycleState = metadata.lifecycle_state;
    if (!lifecycleState) {
        this.reportError(
            filePath,
            "Thiếu trường 'lifecycle_state' trong YAML.",
            "Missing 'lifecycle_state' field in YAML."
        );
    } else if (!ALLOWED_STATUSES.has(lifecycleState)) {
        this.reportError(
            filePath,
            `Lifecycle state '${lifecycleState}' không hợp lệ.`,
            `Lifecycle state '${lifecycleState}' is invalid.`
        );
    }

    const version = metadata.version;
    if (!version) {
        this.reportError(filePath, "Thiếu trường 'version' trong YAML.", "Missing 'version' field in YAML.");
    } else if (!SEMVER_REGEX.test(version)) {
        this.reportError(
            filePath,
            `Version '${version}' phải theo SemVer X.Y.Z.`,
            `Version '${version}' must use SemVer X.Y.Z.`
        );
    }

    if (!metadata.owner) {
        this.reportError(filePath, "Thiếu trường 'owner' trong YAML.", "Missing 'owner' field in YAML.");
    }
}

const original = fs.readFileSync(targetPath, "utf8");
const startMarker = "    validateFile(filePath) {";
const endMarker = "    validateGlossaryReverseBuild() {";
const start = original.indexOf(startMarker);
const end = original.indexOf(endMarker);

if (start < 0 || end < 0 || end <= start) {
  throw new Error("Could not locate validateFile method boundaries.");
}

const methodSource = validateFile
  .toString()
  .replace(/^function\s+/, "")
  .split("\n")
  .map((line) => (line ? `    ${line}` : ""))
  .join("\n");

const updated = `${original.slice(0, start)}${methodSource}\n\n${original.slice(end)}`;
fs.writeFileSync(targetPath, updated, "utf8");
console.log("[HUMAN-FIRST] Updated detect_drift.js validator.");
