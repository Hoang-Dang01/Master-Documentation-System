import { createHash } from "node:crypto";

export const VALIDITY_STATES = [
  "CURRENT",
  "NEEDS_REVIEW",
  "STALE",
  "CONFLICTED",
] as const;

export type ValidityState = (typeof VALIDITY_STATES)[number];

export type ArtifactVersionRecord = {
  versionId: string;
  version: string;
  relativePath: string;
  contentSha256: string;
  effectiveLifecycleState: "DRAFT" | "REVIEW" | "APPROVED" | "DEPRECATED";
  validityState: ValidityState;
  supersedes: string | null;
  registeredAt: string;
  sealedAt?: string;
};

export type LineageTransition = {
  transitionId: string;
  decision: "APPROVED" | "REJECTED";
  actor: string;
  reason: string;
  decidedAt: string;
  expectedRevision: number;
  fromHead: string | null;
  candidateVersionId: string;
  candidateSha256: string;
};

export type ArtifactLineageManifest = {
  schemaVersion: "1.0.0";
  lineageId: string;
  artifactType: string;
  projectId: string;
  revision: number;
  approvedHeadVersionId: string | null;
  versions: Record<string, ArtifactVersionRecord>;
  transitions: LineageTransition[];
};

export type LineageDecisionInput = Omit<
  LineageTransition,
  "fromHead" | "candidateSha256"
>;

const TRACE_ID = /^[A-Z0-9]+(?:-[A-Z0-9]+){2,}$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const SHA256 = /^[a-f0-9]{64}$/;

export function versionId(lineageId: string, version: string): string {
  return `${lineageId}@${version}`;
}

export function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function assertLineageId(value: string): void {
  if (!TRACE_ID.test(value) || /[\\/]/.test(value)) {
    throw new Error("lineage_id must be a safe uppercase traceability ID");
  }
}

export function assertArtifactLineageManifest(
  manifest: ArtifactLineageManifest,
): void {
  assertLineageId(manifest.lineageId);
  if (manifest.schemaVersion !== "1.0.0") {
    throw new Error("Unsupported lineage schema version");
  }
  if (!Number.isSafeInteger(manifest.revision) || manifest.revision < 0) {
    throw new Error("Lineage revision must be a non-negative integer");
  }

  let approvedHeads = 0;
  const semvers = new Set<string>();
  for (const [key, record] of Object.entries(manifest.versions)) {
    if (key !== record.versionId || key !== versionId(manifest.lineageId, record.version)) {
      throw new Error(`Invalid version identity ${key}`);
    }
    if (!SEMVER.test(record.version) || semvers.has(record.version)) {
      throw new Error(`Invalid or duplicate version ${record.version}`);
    }
    semvers.add(record.version);
    if (!SHA256.test(record.contentSha256)) {
      throw new Error(`${key}: invalid content SHA-256`);
    }
    if (
      record.supersedes &&
      (!record.supersedes.startsWith(`${manifest.lineageId}@`) ||
        !manifest.versions[record.supersedes] ||
        record.supersedes === key)
    ) {
      throw new Error(`${key}: invalid supersedes reference`);
    }
    if (record.effectiveLifecycleState === "APPROVED") approvedHeads += 1;
  }

  if (manifest.approvedHeadVersionId === null) {
    if (approvedHeads !== 0) throw new Error("Approved version exists without a head");
  } else {
    const head = manifest.versions[manifest.approvedHeadVersionId];
    if (!head || head.effectiveLifecycleState !== "APPROVED" || approvedHeads !== 1) {
      throw new Error("Lineage must have exactly one active approved head");
    }
  }

  const transitionIds = new Set<string>();
  for (const transition of manifest.transitions) {
    if (transitionIds.has(transition.transitionId)) {
      throw new Error(`Duplicate transition ${transition.transitionId}`);
    }
    transitionIds.add(transition.transitionId);
    if (!manifest.versions[transition.candidateVersionId]) {
      throw new Error(`Transition candidate is missing: ${transition.candidateVersionId}`);
    }
  }
}

export function createLineageManifest(input: {
  lineageId: string;
  artifactType: string;
  projectId: string;
  version: string;
  relativePath: string;
  contentSha256: string;
  registeredAt: string;
  supersedes?: string | null;
}): ArtifactLineageManifest {
  assertLineageId(input.lineageId);
  const id = versionId(input.lineageId, input.version);
  const manifest: ArtifactLineageManifest = {
    schemaVersion: "1.0.0",
    lineageId: input.lineageId,
    artifactType: input.artifactType,
    projectId: input.projectId,
    revision: 0,
    approvedHeadVersionId: null,
    versions: {
      [id]: {
        versionId: id,
        version: input.version,
        relativePath: input.relativePath,
        contentSha256: input.contentSha256,
        effectiveLifecycleState: "DRAFT",
        validityState: "CURRENT",
        supersedes: input.supersedes ?? null,
        registeredAt: input.registeredAt,
      },
    },
    transitions: [],
  };
  assertArtifactLineageManifest(manifest);
  return manifest;
}

function sameTransition(
  prior: LineageTransition,
  next: LineageTransition,
): boolean {
  return JSON.stringify(prior) === JSON.stringify(next);
}

export function buildLineageDecision(
  manifest: ArtifactLineageManifest,
  input: LineageDecisionInput,
): { manifest: ArtifactLineageManifest; transition: LineageTransition; replay: boolean } {
  assertArtifactLineageManifest(manifest);
  const candidate = manifest.versions[input.candidateVersionId];
  if (!candidate) throw new Error("Candidate version is not registered in this lineage");
  if (input.expectedRevision !== manifest.revision) {
    throw new Error("Lineage revision conflict");
  }
  const actor = input.actor.trim();
  const reason = input.reason.trim();
  if (!actor || !reason || !input.transitionId.trim()) {
    throw new Error("Human actor, reason, and transition ID are required");
  }
  if (Number.isNaN(Date.parse(input.decidedAt))) {
    throw new Error("Decision timestamp must be ISO-8601 compatible");
  }
  const transition: LineageTransition = {
    ...input,
    actor,
    reason,
    fromHead: manifest.approvedHeadVersionId,
    candidateSha256: candidate.contentSha256,
  };
  const existing = manifest.transitions.find(
    (item) => item.transitionId === transition.transitionId,
  );
  if (existing) {
    if (!sameTransition(existing, transition)) {
      throw new Error("Idempotency key was reused with different decision input");
    }
    return { manifest, transition: existing, replay: true };
  }
  if (
    input.decision === "APPROVED" &&
    candidate.supersedes !== manifest.approvedHeadVersionId
  ) {
    throw new Error("Approved successor must supersede the current approved head");
  }

  const versions = Object.fromEntries(
    Object.entries(manifest.versions).map(([key, value]) => [key, { ...value }]),
  );
  if (input.decision === "APPROVED") {
    if (manifest.approvedHeadVersionId) {
      versions[manifest.approvedHeadVersionId].effectiveLifecycleState = "DEPRECATED";
    }
    versions[input.candidateVersionId].effectiveLifecycleState = "APPROVED";
    versions[input.candidateVersionId].sealedAt = input.decidedAt;
  }

  const next: ArtifactLineageManifest = {
    ...manifest,
    revision: manifest.revision + 1,
    approvedHeadVersionId:
      input.decision === "APPROVED"
        ? input.candidateVersionId
        : manifest.approvedHeadVersionId,
    versions,
    transitions: [...manifest.transitions, transition],
  };
  assertArtifactLineageManifest(next);
  return { manifest: next, transition, replay: false };
}
