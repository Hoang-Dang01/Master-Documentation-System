import path from "node:path";
import { promises as fs } from "node:fs";
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  safeStorage,
  shell,
} from "electron";
import {
  importDocument,
  listProjectArtifacts
} from "@mds/document-ingestion";
import {
  buildGraphIndex,
  createImpactReport,
  getGraphNodeDetail,
  queryGraphProjection,
  reviewRequirement,
} from "@mds/requirements";
import { listFilesystemEvidenceBundles, SqliteGraphIndexRepository } from "@mds/persistence";
import type { GraphQuery } from "@mds/domain";
import {
  advanceWorkflow,
  startWorkflow,
} from "@mds/workflow-engine";

const repositoryRoot = path.resolve(__dirname, "..", "..", "..", "..");
const seedWorkspaceRoot = path.join(repositoryRoot, "workspace");
const desktopIconPath = path.join(
  repositoryRoot,
  "apps",
  "desktop",
  "src",
  "renderer",
  "public",
  "assets",
  "mds-logo-taskbar.png",
);
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
const smokeScreenshotPath = process.env.MDS_SMOKE_SCREENSHOT;
const smokeGraphView = process.env.MDS_SMOKE_GRAPH_VIEW === "1";
let dataRootPath = "";
let activeProjectsRoot = "";
let defaultWorkspacePath = "";
let mainWindow: BrowserWindow | null = null;
let graphRepository: SqliteGraphIndexRepository | null = null;

type AppSettings = {
  dataRootPath?: string;
  provider?: string;
  model?: string;
};

type StoredSecrets = Record<string, string>;

function settingsPath(): string {
  return path.join(app.getPath("userData"), "settings.json");
}

function secretsPath(): string {
  return path.join(app.getPath("userData"), "secrets.json");
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonAtomic(filePath: string, value: unknown): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temporaryPath, filePath);
}

async function readSettings(): Promise<AppSettings> {
  return readJson<AppSettings>(settingsPath(), {});
}

async function saveSettings(patch: Partial<AppSettings>): Promise<AppSettings> {
  const settings = { ...(await readSettings()), ...patch };
  await writeJsonAtomic(settingsPath(), settings);
  return settings;
}

async function resolveDataRoot(): Promise<string> {
  const configuredRoot = process.env.MDS_DATA_DIR?.trim();
  if (configuredRoot) return path.resolve(configuredRoot);
  const settings = await readSettings();
  return settings.dataRootPath
    ? path.resolve(settings.dataRootPath)
    : path.join(app.getPath("documents"), "MDS-Workspace");
}

async function ensureDataWorkspace(): Promise<void> {
  dataRootPath = await resolveDataRoot();
  activeProjectsRoot = path.join(dataRootPath, "projects", "active");
  defaultWorkspacePath = path.join(activeProjectsRoot, "edumeet");

  await Promise.all([
    fs.mkdir(activeProjectsRoot, { recursive: true }),
    fs.mkdir(path.join(dataRootPath, "projects", "archived"), {
      recursive: true,
    }),
    fs.mkdir(path.join(dataRootPath, "imports"), { recursive: true }),
    fs.mkdir(path.join(dataRootPath, "exports"), { recursive: true }),
    fs.mkdir(path.join(dataRootPath, "backups"), { recursive: true }),
  ]);

  try {
    await fs.access(defaultWorkspacePath);
  } catch {
    const seedProjectPath = path.join(
      seedWorkspaceRoot,
      "projects",
      "active",
      "edumeet",
    );
    try {
      await fs.cp(seedProjectPath, defaultWorkspacePath, {
        recursive: true,
        errorOnExist: false,
      });
    } catch {
      await fs.mkdir(defaultWorkspacePath, { recursive: true });
    }
  }

  const seedIndexPath = path.join(seedWorkspaceRoot, "projects", "index.yaml");
  const dataIndexPath = path.join(dataRootPath, "projects", "index.yaml");
  try {
    await fs.access(dataIndexPath);
  } catch {
    try {
      await fs.copyFile(seedIndexPath, dataIndexPath);
    } catch {
      await fs.writeFile(
        dataIndexPath,
        "projects: []\n",
        "utf8",
      );
    }
  }
}

function assertActiveProjectPath(projectPath: unknown): string {
  if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
    throw new Error("Project path không hợp lệ.");
  }
  const project = path.resolve(projectPath);
  const root = path.resolve(activeProjectsRoot);
  if (project === root || !project.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project phải nằm trong MDS_DATA_DIR/projects/active.");
  }
  return project;
}

function openGraphRepository(): SqliteGraphIndexRepository {
  if (!graphRepository) {
    graphRepository = new SqliteGraphIndexRepository(path.join(dataRootPath, "mds.sqlite"));
    graphRepository.migrate();
  }
  return graphRepository;
}

function closeGraphRepository(): void {
  graphRepository?.close();
  graphRepository = null;
}

function registerIpcHandlers(): void {
  ipcMain.handle("app:get-info", () => ({
    name: "Master Documentation System",
    version: app.getVersion(),
    repositoryRoot,
    dataRootPath,
    defaultWorkspacePath
  }));

  ipcMain.handle("workspace:select", async () => {
    const result = await dialog.showOpenDialog({
      title: "Chọn workspace dự án",
      defaultPath: defaultWorkspacePath,
      properties: ["openDirectory", "createDirectory"]
    });

    if (!result.canceled && result.filePaths[0]) {
      const selectedPath = path.resolve(result.filePaths[0]);
      const activeMarker = `${path.sep}projects${path.sep}active${path.sep}`;
      const markerIndex = selectedPath.toLowerCase().indexOf(
        activeMarker.toLowerCase(),
      );
      if (markerIndex >= 0) {
        await saveSettings({
          dataRootPath: selectedPath.slice(0, markerIndex),
        });
      }
    }
    return {
      canceled: result.canceled,
      path: result.canceled ? null : result.filePaths[0] ?? null
    };
  });

  ipcMain.handle("workspace:choose-data-root", async () => {
    const result = await dialog.showOpenDialog({
      title: "Chọn thư mục dữ liệu MDS",
      defaultPath: dataRootPath,
      properties: ["openDirectory", "createDirectory"],
    });
    if (result.canceled || !result.filePaths[0]) {
      return { canceled: true, dataRootPath };
    }
    closeGraphRepository();
    await saveSettings({ dataRootPath: path.resolve(result.filePaths[0]) });
    await ensureDataWorkspace();
    return { canceled: false, dataRootPath };
  });

  ipcMain.handle("workspace:open", async (_event, workspacePath: unknown) => {
    if (typeof workspacePath !== "string" || workspacePath.trim().length === 0) {
      return { ok: false, error: "Workspace path không hợp lệ." };
    }

    const error = await shell.openPath(workspacePath);
    return error ? { ok: false, error } : { ok: true };
  });

  ipcMain.handle("artifacts:list", async (_event, projectPath: unknown) => {
    if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
      throw new Error("Project path không hợp lệ.");
    }
    return listProjectArtifacts(projectPath, activeProjectsRoot);
  });

  ipcMain.handle("evidence:list", async (_event, projectPath: unknown) => {
    return listFilesystemEvidenceBundles(assertActiveProjectPath(projectPath));
  });

  ipcMain.handle("graph:build-index", async (_event, projectPath: unknown) => {
    const safeProject = assertActiveProjectPath(projectPath);
    const result = await buildGraphIndex({
      projectPath: safeProject,
      activeProjectsRoot,
      documentStandardsPath: path.join(repositoryRoot, "mds-core", "standards", "document_standards.md"),
    });
    openGraphRepository().replaceProject(result);
    return result;
  });

  ipcMain.handle("graph:query", (_event, query: unknown) => {
    if (!query || typeof query !== "object" || Array.isArray(query)) {
      throw new Error("Graph query không hợp lệ.");
    }
    const candidate = query as Partial<GraphQuery>;
    if (typeof candidate.projectId !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate.projectId)) {
      throw new Error("Graph project id không hợp lệ.");
    }
    if (candidate.limit !== undefined && (!Number.isInteger(candidate.limit) || candidate.limit < 1 || candidate.limit > 2000)) {
      throw new Error("Graph query limit phải từ 1 đến 2000.");
    }
    for (const values of [candidate.artifactTypes, candidate.relationshipTypes]) {
      if (values !== undefined && (!Array.isArray(values) || !values.every((value) => typeof value === "string"))) {
        throw new Error("Graph query filter không hợp lệ.");
      }
    }
    if (candidate.search !== undefined && typeof candidate.search !== "string") {
      throw new Error("Graph search không hợp lệ.");
    }
    const graph = openGraphRepository().readProject(candidate.projectId);
    if (!graph) return { projectId: candidate.projectId, nodes: [], edges: [], issues: [] };
    return queryGraphProjection(graph, candidate as GraphQuery);
  });

  ipcMain.handle("graph:get-node", (_event, projectId: unknown, nodeId: unknown) => {
    if (typeof projectId !== "string" || typeof nodeId !== "string") {
      throw new Error("Graph node request không hợp lệ.");
    }
    const graph = openGraphRepository().readProject(projectId);
    return graph ? getGraphNodeDetail(graph, nodeId) : null;
  });

  ipcMain.handle("graph:validate", (_event, projectId: unknown) => {
    if (typeof projectId !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectId)) {
      throw new Error("Graph project id không hợp lệ.");
    }
    return openGraphRepository().readProject(projectId)?.issues ?? [];
  });

  ipcMain.handle("document:import", async (_event, projectPath: unknown) => {
    if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
      throw new Error("Project path không hợp lệ.");
    }

    const result = await dialog.showOpenDialog({
      title: "Chọn tài liệu cần nhập",
      defaultPath: projectPath,
      properties: ["openFile"],
      filters: [
        { name: "Tài liệu", extensions: ["docx", "md", "txt"] },
        { name: "Tất cả file", extensions: ["*"] }
      ]
    });

    if (result.canceled || !result.filePaths[0]) {
      return { canceled: true };
    }

    const imported = await importDocument(
      result.filePaths[0],
      projectPath,
      activeProjectsRoot
    );
    return { canceled: false, document: imported };
  });

  ipcMain.handle(
    "requirement:review",
    async (
      _event,
      projectPath: unknown,
      relativePath: unknown,
      decision: unknown,
      actor: unknown,
      reason: unknown,
    ) => {
      if (
        typeof projectPath !== "string" ||
        typeof relativePath !== "string" ||
        (decision !== "APPROVED" && decision !== "REJECTED")
      ) {
        throw new Error("Review request không hợp lệ.");
      }
      return reviewRequirement(
        projectPath,
        activeProjectsRoot,
        relativePath,
        decision,
        typeof actor === "string" ? actor : "human",
        typeof reason === "string" ? reason : "",
      );
    },
  );

  ipcMain.handle(
    "impact:create",
    async (_event, projectPath: unknown, requirementPath: unknown) => {
      if (
        typeof projectPath !== "string" ||
        typeof requirementPath !== "string"
      ) {
        throw new Error("Impact request không hợp lệ.");
      }
      return createImpactReport(
        projectPath,
        activeProjectsRoot,
        requirementPath,
      );
    },
  );

  ipcMain.handle(
    "workflow:start",
    async (_event, projectPath: unknown, workflowId: unknown, stepIds: unknown) => {
      if (
        typeof projectPath !== "string" ||
        typeof workflowId !== "string" ||
        !Array.isArray(stepIds) ||
        !stepIds.every((stepId) => typeof stepId === "string")
      ) {
        throw new Error("Workflow start request không hợp lệ.");
      }
      return startWorkflow({
        projectPath,
        activeProjectsRoot,
        project: path.basename(projectPath),
        workflowId,
        stepIds,
      });
    },
  );

  ipcMain.handle(
    "workflow:advance",
    async (
      _event,
      projectPath: unknown,
      runId: unknown,
      outcome: unknown,
      error: unknown,
    ) => {
      if (
        typeof projectPath !== "string" ||
        typeof runId !== "string" ||
        (outcome !== "COMPLETED" &&
          outcome !== "WAITING_APPROVAL" &&
          outcome !== "FAILED")
      ) {
        throw new Error("Workflow advance request không hợp lệ.");
      }
      return advanceWorkflow(
        projectPath,
        activeProjectsRoot,
        runId,
        outcome,
        typeof error === "string" ? error : undefined,
      );
    },
  );

  ipcMain.handle(
    "settings:save-provider-secret",
    async (_event, provider: unknown, secret: unknown) => {
      if (
        typeof provider !== "string" ||
        !/^[a-z0-9-]{2,32}$/i.test(provider) ||
        typeof secret !== "string" ||
        secret.trim().length === 0
      ) {
        throw new Error("Provider secret không hợp lệ.");
      }
      if (!safeStorage.isEncryptionAvailable()) {
        throw new Error("OS secure storage chưa khả dụng trên máy này.");
      }
      const secrets = await readJson<StoredSecrets>(secretsPath(), {});
      secrets[provider.toLowerCase()] = safeStorage
        .encryptString(secret)
        .toString("base64");
      await writeJsonAtomic(secretsPath(), secrets);
      return { ok: true };
    },
  );

  ipcMain.handle(
    "settings:provider-secret-status",
    async (_event, provider: unknown) => {
      if (typeof provider !== "string") {
        throw new Error("Provider không hợp lệ.");
      }
      const secrets = await readJson<StoredSecrets>(secretsPath(), {});
      return {
        configured: Boolean(secrets[provider.toLowerCase()]),
        secureStorageAvailable: safeStorage.isEncryptionAvailable(),
      };
    },
  );

  ipcMain.handle(
    "settings:delete-provider-secret",
    async (_event, provider: unknown) => {
      if (typeof provider !== "string") {
        throw new Error("Provider không hợp lệ.");
      }
      const secrets = await readJson<StoredSecrets>(secretsPath(), {});
      delete secrets[provider.toLowerCase()];
      await writeJsonAtomic(secretsPath(), secrets);
      return { ok: true };
    },
  );

  ipcMain.handle(
    "artifact:open",
    async (
      _event,
      projectPath: unknown,
      relativeArtifactPath: unknown
    ) => {
      if (
        typeof projectPath !== "string" ||
        typeof relativeArtifactPath !== "string"
      ) {
        return { ok: false, error: "Artifact path không hợp lệ." };
      }
      const resolvedProject = path.resolve(projectPath);
      const resolvedArtifact = path.resolve(
        resolvedProject,
        relativeArtifactPath
      );
      if (
        !resolvedArtifact.startsWith(`${resolvedProject}${path.sep}`)
      ) {
        return { ok: false, error: "Artifact nằm ngoài project." };
      }
      const error = await shell.openPath(resolvedArtifact);
      return error ? { ok: false, error } : { ok: true };
    }
  );
}

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    show: !isSmokeTest || Boolean(smokeScreenshotPath),
    backgroundColor: "#f4f2ec",
    icon: desktopIconPath,
    title: "MDS — Engineering OS",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    void window.loadURL(devServerUrl);
  } else {
    void window.loadFile(path.join(__dirname, "..", "..", "dist", "renderer", "index.html"));
  }

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) {
      void shell.openExternal(url);
    }
    return { action: "deny" };
  });

  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
    console.error(`[MDS] Renderer load failed (${errorCode}): ${errorDescription}`);
    if (isSmokeTest) {
      process.exitCode = 1;
      app.quit();
    }
  });

  window.webContents.on("did-finish-load", async () => {
    console.log(`[MDS] Renderer ready: ${window.webContents.getTitle()}`);

    if (isSmokeTest) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (smokeGraphView) {
        await window.webContents.executeJavaScript(`
          [...document.querySelectorAll("button")]
            .find((button) => button.textContent?.includes("Bản đồ tri thức"))
            ?.click()
        `);
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      const result = (await window.webContents.executeJavaScript(`
        (async () => {
          const appInfo = await window.mds.getAppInfo();
          const builtGraph = await window.mds.buildGraphIndex(appInfo.defaultWorkspacePath);
          const graphProjection = await window.mds.queryGraph({ projectId: "edumeet", limit: 100 });
          const graphIssues = await window.mds.validateGraph("edumeet");
          const firstNode = graphProjection.nodes[0]
            ? await window.mds.getGraphNode("edumeet", graphProjection.nodes[0].id)
            : null;
          return ({
          bridgeReady: Boolean(
            window.mds?.getAppInfo &&
            window.mds?.listArtifacts &&
            window.mds?.listEvidenceBundles &&
            window.mds?.importDocument &&
            window.mds?.reviewRequirement &&
            window.mds?.createImpactReport &&
            window.mds?.startWorkflow &&
            window.mds?.chooseDataRoot &&
            window.mds?.providerSecretStatus
            && window.mds?.buildGraphIndex
            && window.mds?.queryGraph
            && window.mds?.getGraphNode
            && window.mds?.validateGraph
          ),
          rootReady: Boolean(document.querySelector("#root")?.children.length),
          workbenchReady: Boolean(
            document.querySelector(".review-workbench") &&
            document.querySelector(".truth-panel") &&
            document.querySelector(".impact-panel") &&
            document.querySelector(".context-authority")
          ),
          evidenceViewReady: Boolean(
            document.querySelector(".evidence-ledger") &&
            document.querySelector(".evidence-inspector") &&
            document.querySelector(".evidence-authority-notice")
          ),
          graphViewReady: ${smokeGraphView ? "Boolean(document.querySelector('.graph-workbench') && document.querySelector('.graph-canvas'))" : "true"},
          graphReady: Boolean(
            builtGraph.indexedNodes === 5 &&
            graphProjection.nodes.length === 5 &&
            graphIssues.some((issue) => issue.type === "broken_reference") &&
            firstNode
          )
          });
        })()
      `)) as { bridgeReady: boolean; rootReady: boolean; workbenchReady: boolean; evidenceViewReady: boolean; graphReady: boolean; graphViewReady: boolean };

      console.log(
        `[MDS] Smoke test: bridge=${result.bridgeReady}, root=${result.rootReady}, workbench=${result.workbenchReady}, evidenceView=${result.evidenceViewReady}, graph=${result.graphReady}, graphView=${result.graphViewReady}`
      );

      if (!result.bridgeReady || !result.rootReady || !result.workbenchReady || !result.evidenceViewReady || !result.graphReady || !result.graphViewReady) {
        process.exitCode = 1;
      }

      if (smokeScreenshotPath) {
        const image = await window.webContents.capturePage();
        await fs.writeFile(smokeScreenshotPath, image.toPNG());
        console.log(`[MDS] Smoke screenshot: ${smokeScreenshotPath}`);
      }

      app.quit();
    }
  });

  window.on("closed", () => {
    mainWindow = null;
  });

  return window;
}

app.whenReady().then(async () => {
  await ensureDataWorkspace();
  registerIpcHandlers();
  mainWindow = createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", closeGraphRepository);
