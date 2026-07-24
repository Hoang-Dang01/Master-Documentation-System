import path from "node:path";
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";

const repositoryRoot = path.resolve(__dirname, "..", "..", "..", "..");
const defaultWorkspacePath = path.join(repositoryRoot, "workspace", "projects");
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
let mainWindow: BrowserWindow | null = null;

function registerIpcHandlers(): void {
  ipcMain.handle("app:get-info", () => ({
    name: "Master Documentation System",
    version: app.getVersion(),
    repositoryRoot,
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
}

function createMainWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1080,
    minHeight: 720,
    show: !isSmokeTest,
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
      const result = (await window.webContents.executeJavaScript(`
        ({
          bridgeReady: Boolean(window.mds?.getAppInfo),
          rootReady: Boolean(document.querySelector("#root")?.children.length)
        })
      `)) as { bridgeReady: boolean; rootReady: boolean };

      console.log(
        `[MDS] Smoke test: bridge=${result.bridgeReady}, root=${result.rootReady}`
      );

      if (!result.bridgeReady || !result.rootReady) {
        process.exitCode = 1;
      }

      app.quit();
    }
  });

  window.on("closed", () => {
    mainWindow = null;
  });

  return window;
}

app.whenReady().then(() => {
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
