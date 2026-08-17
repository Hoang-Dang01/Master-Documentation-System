import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  DEFAULT_EVIDENCE_LIMITS,
  normalizeEvidencePath,
  validateEvidenceManifest,
  type EvidenceLimits,
  type ValidatedEvidenceManifest,
} from "@mds/domain";

export type EvidenceSubmission = { manifestPath: string; filesRoot: string };
export type ValidatedEvidenceFile = { path: string; sha256: string; size: number; bytes: Buffer };
export type ValidatedEvidenceImport = {
  projectPath: string;
  submittedManifestBytes: Buffer;
  submittedManifestSha256: string;
  manifest: ValidatedEvidenceManifest;
  files: ValidatedEvidenceFile[];
};
export type EvidenceImportResult = {
  bundleId: string;
  relativePath: string;
  submittedManifestSha256: string;
  fileCount: number;
  totalBytes: number;
  replay: boolean;
};
export interface EvidenceBundleRepository {
  importBundle(input: ValidatedEvidenceImport): Promise<EvidenceImportResult>;
}

export type EvidenceBundleSummary = {
  bundleId: string;
  projectId: string;
  acceptedAt: string;
  contextPackageId: string;
  producerType: string;
  producerId: string;
  repository: string;
  commit: string;
  artifactVersionIds: string[];
  results: ValidatedEvidenceManifest["results"];
  submittedManifestSha256: string;
  relativePath: string;
};

function safeProjectPath(projectPath: string, activeProjectsRoot: string): string {
  const project = path.resolve(projectPath);
  const root = path.resolve(activeProjectsRoot);
  if (project !== root && !project.startsWith(`${root}${path.sep}`)) throw new Error("Project is outside MDS_DATA_DIR/projects/active");
  return project;
}

function safeEvidenceFile(filesRoot: string, relativePath: string): string {
  const root = path.resolve(filesRoot);
  const target = path.resolve(root, ...normalizeEvidencePath(relativePath).split("/"));
  if (!target.startsWith(`${root}${path.sep}`)) throw new Error("Evidence file escapes submission root");
  return target;
}

export async function importEvidenceBundle(input: {
  projectPath: string;
  activeProjectsRoot: string;
  submission: EvidenceSubmission;
  repository: EvidenceBundleRepository;
  limits?: EvidenceLimits;
}): Promise<EvidenceImportResult> {
  const project = safeProjectPath(input.projectPath, input.activeProjectsRoot);
  const limits = input.limits ?? DEFAULT_EVIDENCE_LIMITS;
  const manifestStat = await fs.lstat(input.submission.manifestPath);
  if (!manifestStat.isFile() || manifestStat.isSymbolicLink() || manifestStat.size > limits.maxManifestBytes) throw new Error("Evidence manifest is unsafe or exceeds bounds");
  const submittedManifestBytes = await fs.readFile(input.submission.manifestPath);
  let parsed: unknown;
  try { parsed = JSON.parse(submittedManifestBytes.toString("utf8")); } catch { throw new Error("Evidence manifest is not valid JSON"); }
  const manifest = validateEvidenceManifest(parsed, path.basename(project), limits);
  const files: ValidatedEvidenceFile[] = [];
  for (const declaration of manifest.files) {
    const filePath = safeEvidenceFile(input.submission.filesRoot, declaration.path);
    const stat = await fs.lstat(filePath);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Evidence file is not a regular file: ${declaration.path}`);
    if (stat.size !== declaration.size) throw new Error(`Evidence size mismatch: ${declaration.path}`);
    const bytes = await fs.readFile(filePath);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    if (sha256 !== declaration.sha256) throw new Error(`Evidence checksum mismatch: ${declaration.path}`);
    files.push({ ...declaration, bytes });
  }
  return input.repository.importBundle({
    projectPath: project,
    submittedManifestBytes,
    submittedManifestSha256: createHash("sha256").update(submittedManifestBytes).digest("hex"),
    manifest,
    files,
  });
}
