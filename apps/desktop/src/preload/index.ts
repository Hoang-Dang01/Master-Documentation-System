import { contextBridge, ipcRenderer } from "electron";

export type AppInfo = {
  name: string;
  version: string;
  repositoryRoot: string;
  defaultWorkspacePath: string;
};

export type WorkspaceSelection = {
  canceled: boolean;
  path: string | null;
};

export type OpenWorkspaceResult =
  | { ok: true }
  | { ok: false; error: string };

const desktopApi = {
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke("app:get-info"),
  selectWorkspace: (): Promise<WorkspaceSelection> =>
    ipcRenderer.invoke("workspace:select"),
  openWorkspace: (workspacePath: string): Promise<OpenWorkspaceResult> =>
    ipcRenderer.invoke("workspace:open", workspacePath)
};

contextBridge.exposeInMainWorld("mds", desktopApi);

