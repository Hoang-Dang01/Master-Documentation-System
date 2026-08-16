type MdsAppInfo = {
  name: string;
  version: string;
  repositoryRoot: string;
  dataRootPath: string;
  defaultWorkspacePath: string;
};

type MdsWorkspaceSelection = {
  canceled: boolean;
  path: string | null;
};

type MdsOpenWorkspaceResult =
  | { ok: true }
  | { ok: false; error: string };

type MdsArtifactSummary = {
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

type MdsImportedDocument = {
  title: string;
  preview: string;
  checksum: string;
  sourceRelativePath: string;
  normalizedRelativePath: string;
  requirementRelativePath: string;
};

type MdsImportDocumentResult =
  | { canceled: true }
  | { canceled: false; document: MdsImportedDocument };

type MdsRequirementReviewResult = {
  artifactId: string;
  relativePath: string;
  lifecycleState: string;
  approvalId: string;
};

type MdsImpactReportResult = {
  artifactId: string;
  relativePath: string;
  matchedArtifacts: string[];
};

type MdsWorkflowRunResult = {
  id: string;
  workflowId: string;
  project: string;
  status: string;
  currentStepId: string;
  steps: Record<string, string>;
  startedAt: string;
  updatedAt: string;
  error?: string;
};

type MdsDataRootSelection = {
  canceled: boolean;
  dataRootPath: string;
};

type MdsGraphEvidence = {
  artifactPath: string;
  fieldPath: string;
  rawValue?: string;
  lineStart?: number;
  lineEnd?: number;
  origin: string;
};

type MdsGraphNode = {
  id: string;
  projectId: string;
  artifactType: string;
  title: string;
  lifecycleState?: string;
  sourcePath: string;
  contentHash: string;
  metadata: Record<string, unknown>;
};

type MdsGraphEdge = {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  direction: "outbound";
  status: string;
  origin: string;
  evidence: MdsGraphEvidence[];
};

type MdsGraphIssue = {
  id: string;
  projectId: string;
  type: string;
  severity: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
  evidence?: MdsGraphEvidence;
};

type MdsGraphProjection = {
  projectId: string;
  nodes: MdsGraphNode[];
  edges: MdsGraphEdge[];
  issues: MdsGraphIssue[];
};

type MdsGraphIndexResult = MdsGraphProjection & {
  runId: string;
  scannedFiles: number;
  indexedNodes: number;
  indexedEdges: number;
  completedAt: string;
};

type MdsGraphQuery = {
  projectId: string;
  artifactTypes?: string[];
  relationshipTypes?: string[];
  search?: string;
  limit?: number;
};

type MdsGraphNodeDetail = MdsGraphNode & {
  incoming: MdsGraphEdge[];
  outgoing: MdsGraphEdge[];
  issues: MdsGraphIssue[];
};

interface Window {
  mds: {
    getAppInfo(): Promise<MdsAppInfo>;
    selectWorkspace(): Promise<MdsWorkspaceSelection>;
    chooseDataRoot(): Promise<MdsDataRootSelection>;
    openWorkspace(workspacePath: string): Promise<MdsOpenWorkspaceResult>;
    listArtifacts(projectPath: string): Promise<MdsArtifactSummary[]>;
    importDocument(projectPath: string): Promise<MdsImportDocumentResult>;
    reviewRequirement(
      projectPath: string,
      relativePath: string,
      decision: "APPROVED" | "REJECTED",
      actor: string,
      reason: string,
    ): Promise<MdsRequirementReviewResult>;
    createImpactReport(
      projectPath: string,
      requirementPath: string,
    ): Promise<MdsImpactReportResult>;
    startWorkflow(
      projectPath: string,
      workflowId: string,
      stepIds: string[],
    ): Promise<MdsWorkflowRunResult>;
    advanceWorkflow(
      projectPath: string,
      runId: string,
      outcome: "COMPLETED" | "WAITING_APPROVAL" | "FAILED",
      error?: string,
    ): Promise<MdsWorkflowRunResult>;
    saveProviderSecret(
      provider: string,
      secret: string,
    ): Promise<{ ok: true }>;
    providerSecretStatus(provider: string): Promise<{
      configured: boolean;
      secureStorageAvailable: boolean;
    }>;
    deleteProviderSecret(provider: string): Promise<{ ok: true }>;
    openArtifact(
      projectPath: string,
      relativeArtifactPath: string
    ): Promise<MdsOpenWorkspaceResult>;
    buildGraphIndex(projectPath: string): Promise<MdsGraphIndexResult>;
    queryGraph(query: MdsGraphQuery): Promise<MdsGraphProjection>;
    getGraphNode(projectId: string, nodeId: string): Promise<MdsGraphNodeDetail | null>;
    validateGraph(projectId: string): Promise<MdsGraphIssue[]>;
  };
}
