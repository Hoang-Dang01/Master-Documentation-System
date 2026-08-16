export * from "./lineage.js";

export const LIFECYCLE_STATES = [
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "DEPRECATED",
  "ARCHIVED",
] as const;

export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

export type Project = {
  id: string;
  name: string;
  rootPath: string;
  status: "ACTIVE" | "ARCHIVED";
};

export type SourceDocument = {
  id: string;
  title: string;
  fileName: string;
  checksumSha256: string;
  relativePath: string;
  mediaType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "text/markdown" | "text/plain";
  importedAt: string;
};

export type Artifact = {
  id: string;
  title: string;
  project: string;
  lifecycleState: LifecycleState;
  version: string;
  owner: string;
  relativePath: string;
  sourceArtifact?: string;
};

export type EdgeEvidence = {
  artifactPath: string;
  fieldPath: string;
  rawValue?: string;
  lineStart?: number;
  lineEnd?: number;
  origin: "frontmatter" | "body-link" | "derived-rule" | "ai-proposal";
};

export type ArtifactNode = {
  id: string;
  projectId: string;
  artifactType: string;
  title: string;
  lifecycleState?: string;
  sourcePath: string;
  contentHash: string;
  metadata: Record<string, unknown>;
};

export type ArtifactEdge = {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  direction: "outbound";
  status: "confirmed" | "draft" | "rejected";
  origin: "parsed" | "derived" | "ai";
  evidence: EdgeEvidence[];
};

export type GraphIssueType =
  | "parse_error"
  | "broken_reference"
  | "duplicate_artifact_id"
  | "invalid_relationship"
  | "missing_required_link"
  | "cycle_detected"
  | "invalid_target_type";

export type GraphIssue = {
  id: string;
  projectId: string;
  type: GraphIssueType;
  severity: "info" | "warning" | "error";
  message: string;
  nodeId?: string;
  edgeId?: string;
  evidence?: EdgeEvidence;
};

export type GraphProjection = {
  projectId: string;
  nodes: ArtifactNode[];
  edges: ArtifactEdge[];
  issues: GraphIssue[];
};

/** Canonical, complete derived index for one project. */
export type GraphIndex = {
  projectId: string;
  nodes: ArtifactNode[];
  edges: ArtifactEdge[];
  issues: GraphIssue[];
};

/** Result metadata for a completed index build. Never represents a UI query. */
export type GraphIndexResult = GraphIndex & {
  runId: string;
  scannedFiles: number;
  indexedNodes: number;
  indexedEdges: number;
  completedAt: string;
};

export type GraphQuery = {
  projectId: string;
  artifactTypes?: string[];
  relationshipTypes?: string[];
  search?: string;
  limit?: number;
};

export type ArtifactNodeDetail = ArtifactNode & {
  incoming: ArtifactEdge[];
  outgoing: ArtifactEdge[];
  issues: GraphIssue[];
};

export type Requirement = Artifact & {
  sourceArtifact: string;
  extractionMethod: "deterministic-first-pass" | "ai-assisted" | "human-authored";
};

export type ApprovalDecision = "APPROVED" | "REJECTED";

export type Approval = {
  id: string;
  artifactId: string;
  decision: ApprovalDecision;
  actor: string;
  reason: string;
  decidedAt: string;
};

export type AuditEvent = {
  id: string;
  type:
    | "SOURCE_IMPORTED"
    | "REQUIREMENT_CREATED"
    | "REQUIREMENT_APPROVED"
    | "REQUIREMENT_REJECTED"
    | "IMPACT_REPORT_CREATED"
    | "WORKFLOW_STARTED"
    | "WORKFLOW_RESUMED"
    | "WORKFLOW_COMPLETED"
    | "WORKFLOW_FAILED";
  project: string;
  artifactId?: string;
  workflowRunId?: string;
  actor: string;
  occurredAt: string;
  data: Record<string, string | number | boolean | null>;
};

export type WorkflowStepState =
  | "PENDING"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "COMPLETED"
  | "FAILED";

export type WorkflowRun = {
  id: string;
  workflowId: string;
  project: string;
  status: WorkflowStepState;
  currentStepId: string;
  steps: Record<string, WorkflowStepState>;
  startedAt: string;
  updatedAt: string;
  error?: string;
};

const SEMVER = /^\d+\.\d+\.\d+$/;
const ID = /^[A-Z0-9]+(?:-[A-Z0-9]+){2,}$/;
const SHA256 = /^[a-f0-9]{64}$/;

export type ArtifactMetadata = {
  id?: string;
  title?: string;
  project?: string;
  lifecycle_state?: string;
  version?: string;
  owner?: string;
  source_artifact?: string;
};

export function validateArtifactMetadata(
  metadata: ArtifactMetadata,
  relativePath: string,
): string[] {
  const errors: string[] = [];
  if (!metadata.id || !ID.test(metadata.id)) {
    errors.push(`${relativePath}: id must be an uppercase traceability ID`);
  }
  if (!metadata.title || metadata.title.trim().length < 3) {
    errors.push(`${relativePath}: title is required`);
  }
  if (!metadata.project || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.project)) {
    errors.push(`${relativePath}: project must be a lowercase project id`);
  }
  if (
    !metadata.lifecycle_state ||
    !LIFECYCLE_STATES.includes(metadata.lifecycle_state as LifecycleState)
  ) {
    errors.push(`${relativePath}: lifecycle_state is invalid`);
  }
  if (!metadata.version || !SEMVER.test(metadata.version)) {
    errors.push(`${relativePath}: version must be semver`);
  }
  if (!metadata.owner || metadata.owner.trim().length < 2) {
    errors.push(`${relativePath}: owner is required`);
  }
  return errors;
}

export function assertSha256(value: string, label = "checksum"): void {
  if (!SHA256.test(value)) {
    throw new Error(`${label} must be a lowercase SHA-256 value`);
  }
}

export function assertApprovalTransition(
  current: LifecycleState,
  decision: ApprovalDecision,
): LifecycleState {
  if (current !== "DRAFT" && current !== "REVIEW") {
    throw new Error(`Cannot ${decision.toLowerCase()} an artifact in ${current}`);
  }
  return decision === "APPROVED" ? "APPROVED" : "DRAFT";
}
