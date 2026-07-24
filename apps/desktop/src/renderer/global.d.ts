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

interface Window {
  mds: {
    getAppInfo(): Promise<MdsAppInfo>;
    selectWorkspace(): Promise<MdsWorkspaceSelection>;
    openWorkspace(workspacePath: string): Promise<MdsOpenWorkspaceResult>;
    listArtifacts(projectPath: string): Promise<MdsArtifactSummary[]>;
    importDocument(projectPath: string): Promise<MdsImportDocumentResult>;
    openArtifact(
      projectPath: string,
      relativeArtifactPath: string
    ): Promise<MdsOpenWorkspaceResult>;
  };
}
