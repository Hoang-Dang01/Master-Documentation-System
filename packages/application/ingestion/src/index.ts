import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import mammoth from "mammoth";

export type ArtifactSummary = {
  id: string;
  title: string;
  project: string;
  lifecycleState: string;
  version: string;
  owner: string;
  fileName: string;
  relativePath: string;
  updatedAt: string;
};

export type ImportedDocument = {
  title: string;
  preview: string;
  checksum: string;
  sourceRelativePath: string;
  normalizedRelativePath: string;
  requirementRelativePath: string;
};

const FRONTMATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/;

function parseFrontmatter(content: string): Record<string, string> | null {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) return null;

  const metadata: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-")) continue;
    const separator = trimmed.indexOf(":");
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (value) metadata[key] = value;
  }
  return metadata;
}

function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return slug || "tai-lieu";
}

function humanizeFileName(filePath: string): string {
  const baseName = path.basename(filePath, path.extname(filePath));
  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (character) => character.toUpperCase());
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function timestampSlug(): string {
  return new Date()
    .toISOString()
    .replace(/\.\d{3}Z$/, "")
    .replace(/[-:T]/g, "");
}

function assertProjectPath(projectPath: string, activeProjectsRoot: string): string {
  const resolvedProject = path.resolve(projectPath);
  const resolvedRoot = path.resolve(activeProjectsRoot);
  const isInside =
    resolvedProject === resolvedRoot ||
    resolvedProject.startsWith(`${resolvedRoot}${path.sep}`);
  if (!isInside) {
    throw new Error("Project phải nằm trong MDS_DATA_DIR/projects/active.");
  }
  return resolvedProject;
}

async function walkMarkdown(directoryPath: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkMarkdown(entryPath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

async function uniqueArtifactPath(
  directoryPath: string,
  desiredSlug: string,
): Promise<string> {
  let suffix = 1;
  let candidate = path.join(directoryPath, `${desiredSlug}.md`);
  while (true) {
    try {
      await fs.access(candidate);
      suffix += 1;
      candidate = path.join(directoryPath, `${desiredSlug}-${suffix}.md`);
    } catch {
      return candidate;
    }
  }
}

async function nextArtifactNumber(
  projectPath: string,
  idPrefix: string,
): Promise<string> {
  const files = await walkMarkdown(projectPath);
  let maximum = 0;
  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf8");
    const metadata = parseFrontmatter(content);
    const id = metadata?.id ?? "";
    if (!id.startsWith(`${idPrefix}-`)) continue;
    const match = id.match(/-(\d{3})$/);
    if (match) maximum = Math.max(maximum, Number(match[1]));
  }
  return String(maximum + 1).padStart(3, "0");
}

async function extractText(sourcePath: string): Promise<string> {
  const extension = path.extname(sourcePath).toLowerCase();
  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ path: sourcePath });
    return result.value.trim();
  }
  return (await fs.readFile(sourcePath, "utf8")).trim();
}

function extractCandidateRequirements(text: string): string[] {
  const candidates = text
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 20)
    .slice(0, 8);
  return candidates.length > 0
    ? candidates
    : ["Cần BA đọc nội dung nguồn và bổ sung yêu cầu có thể kiểm chứng."];
}

export async function listProjectArtifacts(
  projectPath: string,
  activeProjectsRoot: string,
): Promise<ArtifactSummary[]> {
  const safeProjectPath = assertProjectPath(projectPath, activeProjectsRoot);
  const files = await walkMarkdown(safeProjectPath);
  const artifacts: ArtifactSummary[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf8");
    const metadata = parseFrontmatter(content);
    if (!metadata?.title) continue;
    const stat = await fs.stat(filePath);
    artifacts.push({
      id: metadata.id ?? "NO-ID",
      title: metadata.title,
      project: metadata.project ?? path.basename(safeProjectPath),
      lifecycleState:
        metadata.lifecycle_state ?? metadata.status ?? "DRAFT",
      version: metadata.version ?? "0.1.0",
      owner: metadata.owner ?? "unassigned",
      fileName: path.basename(filePath),
      relativePath: path
        .relative(safeProjectPath, filePath)
        .replaceAll("\\", "/"),
      updatedAt: stat.mtime.toISOString(),
    });
  }

  return artifacts.sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export async function importDocument(
  sourcePath: string,
  projectPath: string,
  activeProjectsRoot: string,
): Promise<ImportedDocument> {
  const safeProjectPath = assertProjectPath(projectPath, activeProjectsRoot);
  const extension = path.extname(sourcePath).toLowerCase();
  if (![".docx", ".md", ".txt"].includes(extension)) {
    throw new Error("MDS hiện hỗ trợ DOCX, Markdown và TXT.");
  }

  const sourceBuffer = await fs.readFile(sourcePath);
  const checksum = createHash("sha256").update(sourceBuffer).digest("hex");
  const extractedText = await extractText(sourcePath);
  if (!extractedText) {
    throw new Error("Tài liệu không có nội dung văn bản để nhập.");
  }

  const originalTitle = humanizeFileName(sourcePath);
  const sourceSlug = slugify(originalTitle);
  const projectName = path.basename(safeProjectPath);
  const projectCode =
    projectName === "edumeet" ? "EDU" : slugify(projectName).slice(0, 5).toUpperCase();
  const sourcesDirectory = path.join(safeProjectPath, "sources");
  const importsDirectory = path.join(safeProjectPath, "imports");
  const requirementsDirectory = path.join(safeProjectPath, "requirements");
  await Promise.all([
    fs.mkdir(sourcesDirectory, { recursive: true }),
    fs.mkdir(importsDirectory, { recursive: true }),
    fs.mkdir(requirementsDirectory, { recursive: true }),
  ]);

  const preservedSourcePath = path.join(
    sourcesDirectory,
    `${sourceSlug}-${timestampSlug()}${extension}`,
  );
  await fs.copyFile(sourcePath, preservedSourcePath);

  const sourceNumber = await nextArtifactNumber(
    safeProjectPath,
    `MDS-SRC-${projectCode}-IMPORT`,
  );
  const sourceArtifactId = `MDS-SRC-${projectCode}-IMPORT-${sourceNumber}`;
  const normalizedPath = await uniqueArtifactPath(
    importsDirectory,
    `noi-dung-${sourceSlug}`,
  );
  const normalizedContent = `---
id: ${sourceArtifactId}
title: ${yamlString(`Nội dung nhập từ ${originalTitle}`)}
project: ${projectName}
lifecycle_state: DRAFT
version: 0.1.0
owner: system
source_file: ${yamlString(path.relative(safeProjectPath, preservedSourcePath).replaceAll("\\", "/"))}
source_checksum_sha256: ${checksum}
created_at: ${today()}
---

# Nội dung nhập từ ${originalTitle}

> Nguồn gốc được bảo toàn cùng checksum SHA-256. Đây là nội dung đã chuẩn hóa,
> chưa phải requirement được phê duyệt.

${extractedText}
`;
  await fs.writeFile(normalizedPath, normalizedContent, "utf8");

  const requirementNumber = await nextArtifactNumber(
    safeProjectPath,
    `BA-REQ-${projectCode}-IMPORT`,
  );
  const requirementId = `BA-REQ-${projectCode}-IMPORT-${requirementNumber}`;
  const requirementPath = await uniqueArtifactPath(
    requirementsDirectory,
    `yeu-cau-tu-${sourceSlug}`,
  );
  const candidates = extractCandidateRequirements(extractedText);
  const requirementContent = `---
id: ${requirementId}
title: ${yamlString(`Yêu cầu từ ${originalTitle}`)}
project: ${projectName}
lifecycle_state: DRAFT
execution_state: NOT_STARTED
version: 0.1.0
owner: ba_agent
source_artifact: ${sourceArtifactId}
extraction_method: deterministic-first-pass
created_at: ${today()}
links:
  - type: elaborates
    target: ${sourceArtifactId}
---

# Yêu cầu từ ${originalTitle}

> Bản nháp do bước trích xuất deterministic tạo ra. BA phải chỉnh sửa và con
> người phải duyệt trước khi dùng cho impact analysis hoặc thiết kế.

## Nội dung ứng viên

${candidates.map((candidate, index) => `${index + 1}. ${candidate}`).join("\n")}

## Câu hỏi cần làm rõ

- Mục tiêu kinh doanh cụ thể của thay đổi này là gì?
- Tiêu chí chấp nhận có thể kiểm chứng là gì?
- Phạm vi nào không thuộc yêu cầu?
`;
  await fs.writeFile(requirementPath, requirementContent, "utf8");

  return {
    title: originalTitle,
    preview: extractedText.slice(0, 2400),
    checksum,
    sourceRelativePath: path
      .relative(safeProjectPath, preservedSourcePath)
      .replaceAll("\\", "/"),
    normalizedRelativePath: path
      .relative(safeProjectPath, normalizedPath)
      .replaceAll("\\", "/"),
    requirementRelativePath: path
      .relative(safeProjectPath, requirementPath)
      .replaceAll("\\", "/"),
  };
}
