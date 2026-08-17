const BUNDLE_ID = /^IMP-EVD-[A-Z0-9]+(?:-[A-Z0-9]+)*-[A-Z0-9]{10,32}$/;
const PROJECT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA256 = /^[a-f0-9]{64}$/;
const VERSION_ID = /^[A-Z0-9]+(?:-[A-Z0-9]+){2,}@\d+\.\d+\.\d+$/;
const RESULT_KINDS = new Set(["test", "build", "diff", "static-analysis", "other"]);
const RESULT_STATUSES = new Set(["PASSED", "FAILED", "NOT_RUN", "INCOMPLETE"]);
const PRODUCER_TYPES = new Set(["codex", "developer", "ci", "other"]);
const WINDOWS_RESERVED = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

export const DEFAULT_EVIDENCE_LIMITS = {
  maxFiles: 100,
  maxFileBytes: 25 * 1024 * 1024,
  maxTotalBytes: 100 * 1024 * 1024,
  maxManifestBytes: 1024 * 1024,
} as const;

export type EvidenceLimits = {
  maxFiles: number;
  maxFileBytes: number;
  maxTotalBytes: number;
  maxManifestBytes: number;
};

export type EvidenceResultStatus = "PASSED" | "FAILED" | "NOT_RUN" | "INCOMPLETE";
export type EvidenceResultKind = "test" | "build" | "diff" | "static-analysis" | "other";
export type EvidenceProducerType = "codex" | "developer" | "ci" | "other";

export type EvidenceFileDeclaration = { path: string; sha256: string; size: number };
export type EvidenceResultDeclaration = {
  kind: EvidenceResultKind;
  status: EvidenceResultStatus;
  command_label: string;
  evidence_file: string;
};
export type EvidenceBundleManifest = {
  schema_version: "1.0.0";
  bundle_id: string;
  project_id: string;
  producer: { type: EvidenceProducerType; id: string };
  produced_at: string;
  source_identity: { repository: string; commit: string };
  context_package_id: string;
  artifact_version_ids: string[];
  results: EvidenceResultDeclaration[];
  files: EvidenceFileDeclaration[];
  signature?: { algorithm: "none" | "ed25519"; key_id?: string; value?: string };
};

export type ValidatedEvidenceManifest = EvidenceBundleManifest;

export function normalizeEvidencePath(value: string): string {
  if (typeof value !== "string" || value.length === 0 || value.includes("\0")) throw new Error("Evidence path is invalid");
  const normalized = value.replaceAll("\\", "/");
  if (normalized.startsWith("/") || normalized.startsWith("//") || /^[A-Za-z]:/.test(normalized)) throw new Error("Evidence path must be relative");
  const parts = normalized.split("/");
  if (parts.some((part) => !part || part === "." || part === ".." || /[. ]$/.test(part) || WINDOWS_RESERVED.test(part))) {
    throw new Error("Evidence path contains an unsafe segment");
  }
  return parts.join("/");
}

function object(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} is required`);
  return value.trim();
}

export function validateEvidenceManifest(
  input: unknown,
  expectedProjectId: string,
  limits: EvidenceLimits = DEFAULT_EVIDENCE_LIMITS,
): ValidatedEvidenceManifest {
  const value = object(input, "manifest");
  if (value.schema_version !== "1.0.0") throw new Error("Unsupported evidence schema version");
  const bundleId = text(value.bundle_id, "bundle_id");
  if (!BUNDLE_ID.test(bundleId)) throw new Error("bundle_id is invalid");
  const projectId = text(value.project_id, "project_id");
  if (!PROJECT_ID.test(projectId) || projectId !== expectedProjectId) throw new Error("Evidence project identity mismatch");
  const producer = object(value.producer, "producer");
  const producerType = text(producer.type, "producer.type");
  if (!PRODUCER_TYPES.has(producerType)) throw new Error("producer.type is invalid");
  const producedAt = text(value.produced_at, "produced_at");
  if (!Number.isFinite(Date.parse(producedAt))) throw new Error("produced_at must be RFC3339-compatible");
  const sourceIdentity = object(value.source_identity, "source_identity");
  const commit = text(sourceIdentity.commit, "source_identity.commit");
  if (!/^[a-f0-9]{7,128}$/i.test(commit)) throw new Error("source_identity.commit is invalid");
  if (!Array.isArray(value.artifact_version_ids) || !value.artifact_version_ids.every((id) => typeof id === "string" && VERSION_ID.test(id))) {
    throw new Error("artifact_version_ids are invalid");
  }
  if (!Array.isArray(value.files) || value.files.length === 0 || value.files.length > limits.maxFiles) throw new Error("Evidence file count exceeds bounds");
  const paths = new Set<string>();
  let total = 0;
  const files = value.files.map((entry, index) => {
    const item = object(entry, `files[${index}]`);
    const filePath = normalizeEvidencePath(text(item.path, `files[${index}].path`));
    if (paths.has(filePath)) throw new Error("Duplicate evidence path");
    paths.add(filePath);
    const sha256 = text(item.sha256, `files[${index}].sha256`);
    if (!SHA256.test(sha256)) throw new Error("Evidence SHA-256 is invalid");
    if (!Number.isSafeInteger(item.size) || (item.size as number) < 0 || (item.size as number) > limits.maxFileBytes) throw new Error("Evidence file size exceeds bounds");
    total += item.size as number;
    return { path: filePath, sha256, size: item.size as number };
  });
  if (total > limits.maxTotalBytes) throw new Error("Evidence total size exceeds bounds");
  if (!Array.isArray(value.results)) throw new Error("results must be an array");
  const results = value.results.map((entry, index) => {
    const item = object(entry, `results[${index}]`);
    const kind = text(item.kind, "result.kind");
    const status = text(item.status, "result.status");
    if (!RESULT_KINDS.has(kind) || !RESULT_STATUSES.has(status)) throw new Error("Evidence result enum is invalid");
    const evidenceFile = normalizeEvidencePath(text(item.evidence_file, "result.evidence_file"));
    if (!paths.has(evidenceFile)) throw new Error("Result references an undeclared evidence file");
    return { kind: kind as EvidenceResultKind, status: status as EvidenceResultStatus, command_label: text(item.command_label, "result.command_label"), evidence_file: evidenceFile };
  });
  let signature: EvidenceBundleManifest["signature"];
  if (value.signature !== undefined) {
    const item = object(value.signature, "signature");
    if (item.algorithm !== "none" && item.algorithm !== "ed25519") throw new Error("signature.algorithm is invalid");
    signature = { algorithm: item.algorithm, key_id: typeof item.key_id === "string" ? item.key_id : undefined, value: typeof item.value === "string" ? item.value : undefined };
  }
  return {
    schema_version: "1.0.0", bundle_id: bundleId, project_id: projectId,
    producer: { type: producerType as EvidenceProducerType, id: text(producer.id, "producer.id") },
    produced_at: producedAt,
    source_identity: { repository: text(sourceIdentity.repository, "source_identity.repository"), commit },
    context_package_id: text(value.context_package_id, "context_package_id"),
    artifact_version_ids: [...value.artifact_version_ids] as string[], results, files, signature,
  };
}
