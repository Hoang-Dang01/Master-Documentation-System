import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  assertApprovalTransition,
  type ApprovalDecision,
  type AuditEvent,
  type LifecycleState,
} from "@mds/domain";
import {
  decideRequirementVersion,
  loadRequirementLineage,
  readRequirementVersion,
  registerRequirementCandidate,
} from "./lineage.js";
import { proposeImpactFromGraph } from "./impact.js";

export * from "./lineage.js";
export * from "./impact.js";
export * from "./truth.js";

export * from "./graph.js";
export * from "./graph/ports/index.js";

const FRONTMATTER_PATTERN = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n/;
const STOP_WORDS = new Set([
  "cua",
  "cac",
  "cho",
  "mot",
  "nhung",
  "nguoi",
  "phai",
  "duoc",
  "trong",
  "thuc",
  "hien",
  "yeu",
  "requirement",
  "draft",
  "project",
]);

type Metadata = Record<string, string>;

export type RequirementReviewResult = {
  artifactId: string;
  relativePath: string;
  lifecycleState: LifecycleState;
  approvalId: string;
  lineageId: string;
  versionId: string;
  approvedHeadVersionId: string | null;
};

export type ImpactReportResult = {
  artifactId: string;
  relativePath: string;
  matchedArtifacts: string[];
};

function parseFrontmatter(content: string): Metadata | null {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) return null;
  const metadata: Metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    const separator = trimmed.indexOf(":");
    if (separator < 1 || trimmed.startsWith("#")) continue;
    metadata[trimmed.slice(0, separator).trim()] = trimmed
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return metadata;
}

function safeProjectPath(projectPath: string, activeProjectsRoot: string): string {
  const project = path.resolve(projectPath);
  const root = path.resolve(activeProjectsRoot);
  if (project !== root && !project.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project nằm ngoài MDS_DATA_DIR/projects/active.");
  }
  return project;
}

function safeArtifactPath(projectPath: string, relativePath: string): string {
  const project = path.resolve(projectPath);
  const artifact = path.resolve(project, relativePath);
  if (!artifact.startsWith(`${project}${path.sep}`)) {
    throw new Error("Artifact path nằm ngoài project.");
  }
  if (!artifact.toLowerCase().endsWith(".md")) {
    throw new Error("Chỉ hỗ trợ artifact Markdown.");
  }
  return artifact;
}

function replaceOrAppendMetadata(
  content: string,
  values: Record<string, string>,
): string {
  const match = content.match(FRONTMATTER_PATTERN);
  if (!match) throw new Error("Artifact không có frontmatter.");
  const keys = new Set(Object.keys(values));
  const lines = match[1].split(/\r?\n/).map((line) => {
    const separator = line.indexOf(":");
    if (separator < 1) return line;
    const key = line.slice(0, separator).trim();
    if (!keys.has(key)) return line;
    const value = values[key];
    keys.delete(key);
    return `${key}: ${JSON.stringify(value)}`;
  });
  for (const key of keys) lines.push(`${key}: ${JSON.stringify(values[key])}`);
  return `---\n${lines.join("\n")}\n---\n${content.slice(match[0].length)}`;
}

async function writeAtomic(filePath: string, content: string): Promise<void> {
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, content, "utf8");
  await fs.rename(temporaryPath, filePath);
}

async function appendAudit(
  projectPath: string,
  event: AuditEvent,
): Promise<void> {
  const auditDirectory = path.join(projectPath, "audit");
  await fs.mkdir(auditDirectory, { recursive: true });
  await fs.appendFile(
    path.join(auditDirectory, "events.jsonl"),
    `${JSON.stringify(event)}\n`,
    "utf8",
  );
}

function auditId(event: AuditEvent): string {
  return createHash("sha256")
    .update(`${event.type}:${event.occurredAt}:${event.artifactId ?? ""}`)
    .digest("hex")
    .slice(0, 16);
}

async function readMarkdownFiles(directoryPath: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "audit" || entry.name === "artifacts") continue;
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }
  return files;
}

export async function reviewRequirement(
  projectPath: string,
  activeProjectsRoot: string,
  relativePath: string,
  decision: ApprovalDecision,
  actor: string,
  reason: string,
): Promise<RequirementReviewResult> {
  const safeProject = safeProjectPath(projectPath, activeProjectsRoot);
  const artifactPath = safeArtifactPath(safeProject, relativePath);
  const content = await fs.readFile(artifactPath, "utf8");
  const metadata = parseFrontmatter(content);
  if (!metadata?.id || !metadata.lifecycle_state || !metadata.version) {
    throw new Error("Requirement thiếu id hoặc lifecycle_state.");
  }
  assertApprovalTransition(
    metadata.lifecycle_state as LifecycleState,
    decision,
  );
  const lineageId = metadata.lineage_id ?? metadata.id;
  let lineage;
  try {
    lineage = await loadRequirementLineage(safeProject, activeProjectsRoot, lineageId);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await registerRequirementCandidate({
      projectPath: safeProject,
      activeProjectsRoot,
      lineageId,
      version: metadata.version,
      content,
      projectId: metadata.project ?? path.basename(safeProject),
    });
    lineage = await loadRequirementLineage(safeProject, activeProjectsRoot, lineageId);
  }
  const candidateVersionId = `${lineageId}@${metadata.version}`;
  const now = new Date().toISOString();
  const transitionId = createHash("sha256")
    .update(`${lineageId}:${candidateVersionId}:${decision}:${actor.trim()}:${reason.trim()}:${now}`)
    .digest("hex")
    .slice(0, 24);
  const decided = await decideRequirementVersion({
    projectPath: safeProject,
    activeProjectsRoot,
    lineageId,
    candidateVersionId,
    decision,
    actor: actor.trim() || "human",
    reason: reason.trim() || "No reason supplied",
    transitionId,
    expectedRevision: lineage.revision,
    decidedAt: now,
  });
  return {
    artifactId: metadata.id,
    relativePath: decided.relativePath,
    lifecycleState: decided.lifecycleState,
    approvalId: decided.approvalId ?? transitionId,
    lineageId,
    versionId: candidateVersionId,
    approvedHeadVersionId: decided.approvedHeadVersionId,
  };
}

function meaningfulWords(value: string): string[] {
  return [...new Set(
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length >= 5 && !STOP_WORDS.has(word)),
  )].slice(0, 24);
}

function slug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "requirement";
}

export async function createImpactReport(
  projectPath: string,
  activeProjectsRoot: string,
  requirementRelativePath: string,
): Promise<ImpactReportResult> {
  const safeProject = safeProjectPath(projectPath, activeProjectsRoot);
  const requestedPath = safeArtifactPath(safeProject, requirementRelativePath);
  const requestedContent = await fs.readFile(requestedPath, "utf8");
  const requestedMetadata = parseFrontmatter(requestedContent);
  if (!requestedMetadata?.id) {
    throw new Error("Requirement is missing identity metadata.");
  }
  const approved = await readRequirementVersion(
    safeProject,
    activeProjectsRoot,
    requestedMetadata.lineage_id ?? requestedMetadata.id,
  );
  const requirementPath = path.join(safeProject, approved.result.relativePath);
  const requirementContent = approved.content;
  const requirementMetadata = parseFrontmatter(requirementContent);
  if (!requirementMetadata?.id || !requirementMetadata.title) {
    throw new Error("Requirement thiếu metadata để phân tích tác động.");
  }
  if (approved.result.lifecycleState !== "APPROVED") {
    throw new Error("Chỉ requirement APPROVED mới được phân tích tác động.");
  }

  const terms = meaningfulWords(
    `${requirementMetadata.title}\n${requirementContent}`,
  );
  const files = await readMarkdownFiles(safeProject);
  const matches: Array<{ file: string; title: string; score: number }> = [];
  for (const file of files) {
    if (path.resolve(file) === path.resolve(requirementPath)) continue;
    const content = await fs.readFile(file, "utf8");
    const metadata = parseFrontmatter(content);
    if (!metadata?.title) continue;
    const haystack = meaningfulWords(`${metadata.title}\n${content}`);
    const score = terms.filter((term) => haystack.includes(term)).length;
    if (score > 0) {
      matches.push({
        file: path.relative(safeProject, file).replaceAll("\\", "/"),
        title: metadata.title,
        score,
      });
    }
  }
  matches.sort((left, right) => right.score - left.score);

  const projectName = path.basename(safeProject);
  const reportDirectory = path.join(safeProject, "analysis");
  await fs.mkdir(reportDirectory, { recursive: true });
  const reportSlug = `phan-tich-tac-dong-${slug(requirementMetadata.title)}`;
  let reportNumber = 1;
  let reportPath = path.join(reportDirectory, `${reportSlug}.md`);
  while (true) {
    try {
      await fs.access(reportPath);
      reportNumber += 1;
      reportPath = path.join(reportDirectory, `${reportSlug}-${reportNumber}.md`);
    } catch {
      break;
    }
  }
  const projectCode = projectName.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5);
  const reportId = `SA-IMP-${projectCode || "PROJ"}-CHANGE-${String(reportNumber).padStart(3, "0")}`;
  const reportContent = `---
id: ${reportId}
title: ${JSON.stringify(`Phân tích tác động cho ${requirementMetadata.title}`)}
project: ${projectName}
lifecycle_state: DRAFT
version: 0.1.0
owner: sa_agent
source_requirement: ${requirementMetadata.id}
analysis_method: deterministic-keyword-first-pass
created_at: ${new Date().toISOString().slice(0, 10)}
---

# Phân tích tác động cho ${requirementMetadata.title}

> Bản nháp deterministic. Cần người có chuyên môn xác nhận trước khi dùng để
> thay đổi thiết kế hoặc kế hoạch triển khai.

## Requirement nguồn

- ${requirementMetadata.id}
- \`${requirementRelativePath}\`

## Artifact có khả năng bị ảnh hưởng

${matches.length
    ? matches
        .slice(0, 20)
        .map((match) => `- **${match.title}** — \`${match.file}\` (trùng ${match.score} từ khóa)`)
        .join("\n")
    : "- Chưa tìm thấy artifact có từ khóa giao nhau trong project."}

## Việc cần xác minh

- Phạm vi ảnh hưởng thực tế có vượt khỏi các artifact được liệt kê không?
- Có API, database, UI hoặc test case nào cần cập nhật không?
- Có dependency hoặc rủi ro backward compatibility nào không?
`;
  await writeAtomic(reportPath, reportContent);
  const event: AuditEvent = {
    id: "",
    type: "IMPACT_REPORT_CREATED",
    project: projectName,
    artifactId: reportId,
    actor: "system",
    occurredAt: new Date().toISOString(),
    data: {
      sourceRequirement: requirementMetadata.id,
      matchedArtifacts: matches.length,
    },
  };
  event.id = auditId(event);
  await appendAudit(safeProject, event);
  return {
    artifactId: reportId,
    relativePath: path.relative(safeProject, reportPath).replaceAll("\\", "/"),
    matchedArtifacts: matches.map((match) => match.file),
  };
}

export function createGraphImpactProposal(
  graph: import("@mds/domain").GraphIndexResult,
  sourceArtifactId: string,
  sourceVersion?: string,
) {
  return proposeImpactFromGraph(graph, sourceArtifactId, { sourceVersion });
}
