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

const desktopApi = {
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke("app:get-info"),
  selectWorkspace: (): Promise<WorkspaceSelection> =>
    ipcRenderer.invoke("workspace:select"),
  openWorkspace: (workspacePath: string): Promise<OpenWorkspaceResult> =>
    ipcRenderer.invoke("workspace:open", workspacePath),
  listArtifacts: (projectPath: string): Promise<ArtifactSummary[]> =>
    ipcRenderer.invoke("artifacts:list", projectPath),
  importDocument: (projectPath: string): Promise<ImportDocumentResult> =>
    ipcRenderer.invoke("document:import", projectPath),
  openArtifact: (
    projectPath: string,
    relativeArtifactPath: string
  ): Promise<OpenWorkspaceResult> =>
    ipcRenderer.invoke("artifact:open", projectPath, relativeArtifactPath)
};

contextBridge.exposeInMainWorld("mds", desktopApi);
