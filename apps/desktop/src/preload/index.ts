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
    ipcRenderer.invoke("artifact:open", projectPath, relativeArtifactPath)
};

contextBridge.exposeInMainWorld("mds", desktopApi);
