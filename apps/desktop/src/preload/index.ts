import { contextBridge, ipcRenderer } from "electron";

export type AppInfo = {
  name: string;
  version: string;
  repositoryRoot: string;
  dataRootPath: string;
  defaultWorkspacePath: string;
};

export type WorkspaceSelection = {
  canceled: boolean;
  path: string | null;
};

export type OpenWorkspaceResult =
  | { ok: true }
  | { ok: false; error: string };

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

export type ImportDocumentResult =
  | { canceled: true }
  | { canceled: false; document: ImportedDocument };

export type RequirementReviewResult = {
  artifactId: string;
  relativePath: string;
  lifecycleState: string;
  approvalId: string;
};

export type ImpactReportResult = {
  artifactId: string;
  relativePath: string;
  matchedArtifacts: string[];
};

export type WorkflowRunResult = {
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

export type DataRootSelection = {
  canceled: boolean;
  dataRootPath: string;
};

export type GraphEvidence = {
  artifactPath: string;
  fieldPath: string;
  rawValue?: string;
  lineStart?: number;
  lineEnd?: number;
  origin: string;
};

export type GraphNode = {
  id: string;
  projectId: string;
  artifactType: string;
  title: string;
  lifecycleState?: string;
  sourcePath: string;
  contentHash: string;
  metadata: Record<string, unknown>;
};

export type GraphEdge = {
  id: string;
  projectId: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  direction: "outbound";
  status: string;
  origin: string;
  evidence: GraphEvidence[];
};

export type GraphIssue = {
  id: string;
  projectId: string;
  type: string;
  severity: string;
  message: string;
  nodeId?: string;
  edgeId?: string;
  evidence?: GraphEvidence;
};

export type GraphProjection = {
  projectId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  issues: GraphIssue[];
};

export type GraphIndexResult = GraphProjection & {
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

export type GraphNodeDetail = GraphNode & {
  incoming: GraphEdge[];
  outgoing: GraphEdge[];
  issues: GraphIssue[];
};

export type EvidenceBundleSummary = {
  bundleId: string; projectId: string; acceptedAt: string; contextPackageId: string;
  producerType: string; producerId: string; repository: string; commit: string;
  artifactVersionIds: string[];
  results: Array<{ kind: string; status: string; command_label: string; evidence_file: string }>;
  submittedManifestSha256: string; relativePath: string;
};

const desktopApi = {
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke("app:get-info"),
  selectWorkspace: (): Promise<WorkspaceSelection> =>
    ipcRenderer.invoke("workspace:select"),
  chooseDataRoot: (): Promise<DataRootSelection> =>
    ipcRenderer.invoke("workspace:choose-data-root"),
  openWorkspace: (workspacePath: string): Promise<OpenWorkspaceResult> =>
    ipcRenderer.invoke("workspace:open", workspacePath),
  listArtifacts: (projectPath: string): Promise<ArtifactSummary[]> =>
    ipcRenderer.invoke("artifacts:list", projectPath),
  listEvidenceBundles: (projectPath: string): Promise<EvidenceBundleSummary[]> =>
    ipcRenderer.invoke("evidence:list", projectPath),
  importDocument: (projectPath: string): Promise<ImportDocumentResult> =>
    ipcRenderer.invoke("document:import", projectPath),
  reviewRequirement: (
    projectPath: string,
    relativePath: string,
    decision: "APPROVED" | "REJECTED",
    actor: string,
    reason: string,
  ): Promise<RequirementReviewResult> =>
    ipcRenderer.invoke(
      "requirement:review",
      projectPath,
      relativePath,
      decision,
      actor,
      reason,
    ),
  createImpactReport: (
    projectPath: string,
    requirementPath: string,
  ): Promise<ImpactReportResult> =>
    ipcRenderer.invoke("impact:create", projectPath, requirementPath),
  startWorkflow: (
    projectPath: string,
    workflowId: string,
    stepIds: string[],
  ): Promise<WorkflowRunResult> =>
    ipcRenderer.invoke("workflow:start", projectPath, workflowId, stepIds),
  advanceWorkflow: (
    projectPath: string,
    runId: string,
    outcome: "COMPLETED" | "WAITING_APPROVAL" | "FAILED",
    error?: string,
  ): Promise<WorkflowRunResult> =>
    ipcRenderer.invoke("workflow:advance", projectPath, runId, outcome, error),
  saveProviderSecret: (
    provider: string,
    secret: string,
  ): Promise<{ ok: true }> =>
    ipcRenderer.invoke("settings:save-provider-secret", provider, secret),
  providerSecretStatus: (
    provider: string,
  ): Promise<{
    configured: boolean;
    secureStorageAvailable: boolean;
  }> => ipcRenderer.invoke("settings:provider-secret-status", provider),
  deleteProviderSecret: (provider: string): Promise<{ ok: true }> =>
    ipcRenderer.invoke("settings:delete-provider-secret", provider),
  openArtifact: (
    projectPath: string,
    relativeArtifactPath: string
  ): Promise<OpenWorkspaceResult> =>
    ipcRenderer.invoke("artifact:open", projectPath, relativeArtifactPath),
  buildGraphIndex: (projectPath: string): Promise<GraphIndexResult> =>
    ipcRenderer.invoke("graph:build-index", projectPath),
  queryGraph: (query: GraphQuery): Promise<GraphProjection> =>
    ipcRenderer.invoke("graph:query", query),
  getGraphNode: (projectId: string, nodeId: string): Promise<GraphNodeDetail | null> =>
    ipcRenderer.invoke("graph:get-node", projectId, nodeId),
  validateGraph: (projectId: string): Promise<GraphIssue[]> =>
    ipcRenderer.invoke("graph:validate", projectId),
};

contextBridge.exposeInMainWorld("mds", desktopApi);
