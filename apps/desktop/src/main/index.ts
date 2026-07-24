import path from "node:path";
import { promises as fs } from "node:fs";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import {
  importDocument,
  listProjectArtifacts
} from "@mds/document-ingestion";

const repositoryRoot = path.resolve(__dirname, "..", "..", "..", "..");
const seedWorkspaceRoot = path.join(repositoryRoot, "workspace");
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
const smokeScreenshotPath = process.env.MDS_SMOKE_SCREENSHOT;
let dataRootPath = "";
let activeProjectsRoot = "";
let defaultWorkspacePath = "";
let mainWindow: BrowserWindow | null = null;

function resolveDataRoot(): string {
  const configuredRoot = process.env.MDS_DATA_DIR?.trim();
  return configuredRoot
    ? path.resolve(configuredRoot)
    : path.join(app.getPath("documents"), "MDS-Workspace");
}

async function ensureDataWorkspace(): Promise<void> {
  dataRootPath = resolveDataRoot();
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

    return {
      canceled: result.canceled,
      path: result.canceled ? null : result.filePaths[0] ?? null
    };
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
            window.mds?.importDocument
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
