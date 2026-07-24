type MdsAppInfo = {
  name: string;
  version: string;
  repositoryRoot: string;
  defaultWorkspacePath: string;
};

type MdsWorkspaceSelection = {
  canceled: boolean;
  path: string | null;
};

type MdsOpenWorkspaceResult =
  | { ok: true }
  | { ok: false; error: string };

interface Window {
  mds: {
    getAppInfo(): Promise<MdsAppInfo>;
    selectWorkspace(): Promise<MdsWorkspaceSelection>;
    openWorkspace(workspacePath: string): Promise<MdsOpenWorkspaceResult>;
  };
}

