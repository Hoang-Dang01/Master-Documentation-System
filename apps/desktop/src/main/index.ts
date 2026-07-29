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
  createImpactReport,
  reviewRequirement,
} from "@mds/requirements";
import {
  advanceWorkflow,
  startWorkflow,
} from "@mds/workflow-engine";

const repositoryRoot = path.resolve(__dirname, "..", "..", "..", "..");
const seedWorkspaceRoot = path.join(repositoryRoot, "workspace");
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
const smokeScreenshotPath = process.env.MDS_SMOKE_SCREENSHOT;
let dataRootPath = "";
let activeProjectsRoot = "";
let defaultWorkspacePath = "";
let mainWindow: BrowserWindow | null = null;

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
      const result = (await window.webContents.executeJavaScript(`
        ({
          bridgeReady: Boolean(
            window.mds?.getAppInfo &&
            window.mds?.listArtifacts &&
            window.mds?.importDocument &&
            window.mds?.reviewRequirement &&
            window.mds?.createImpactReport &&
            window.mds?.startWorkflow &&
            window.mds?.chooseDataRoot &&
            window.mds?.providerSecretStatus
          ),
          rootReady: Boolean(document.querySelector("#root")?.children.length)
        })
      `)) as { bridgeReady: boolean; rootReady: boolean };

      console.log(
        `[MDS] Smoke test: bridge=${result.bridgeReady}, root=${result.rootReady}`
      );

      if (!result.bridgeReady || !result.rootReady) {
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
