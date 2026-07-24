"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const electron_1 = require("electron");
const repositoryRoot = node_path_1.default.resolve(__dirname, "..", "..", "..", "..");
const defaultWorkspacePath = node_path_1.default.join(repositoryRoot, "workspace", "projects");
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
let mainWindow = null;
function registerIpcHandlers() {
    electron_1.ipcMain.handle("app:get-info", () => ({
        name: "Master Documentation System",
        version: electron_1.app.getVersion(),
        repositoryRoot,
        defaultWorkspacePath
    }));
    electron_1.ipcMain.handle("workspace:select", async () => {
        const result = await electron_1.dialog.showOpenDialog({
            title: "Chọn workspace dự án",
            defaultPath: defaultWorkspacePath,
            properties: ["openDirectory", "createDirectory"]
        });
        return {
            canceled: result.canceled,
            path: result.canceled ? null : result.filePaths[0] ?? null
        };
    });
    electron_1.ipcMain.handle("workspace:open", async (_event, workspacePath) => {
        if (typeof workspacePath !== "string" || workspacePath.trim().length === 0) {
            return { ok: false, error: "Workspace path không hợp lệ." };
        }
        const error = await electron_1.shell.openPath(workspacePath);
        return error ? { ok: false, error } : { ok: true };
    });
}
function createMainWindow() {
    const window = new electron_1.BrowserWindow({
        width: 1440,
        height: 920,
        minWidth: 1080,
        minHeight: 720,
        show: !isSmokeTest,
        backgroundColor: "#f4f2ec",
        title: "MDS — Engineering OS",
        autoHideMenuBar: true,
        webPreferences: {
            preload: node_path_1.default.join(__dirname, "..", "preload", "index.js"),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true
        }
    });
    const devServerUrl = process.env.VITE_DEV_SERVER_URL;
    if (devServerUrl) {
        void window.loadURL(devServerUrl);
    }
    else {
        void window.loadFile(node_path_1.default.join(__dirname, "..", "..", "dist", "renderer", "index.html"));
    }
    window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith("https://")) {
            void electron_1.shell.openExternal(url);
        }
        return { action: "deny" };
    });
    window.webContents.on("did-fail-load", (_event, errorCode, errorDescription) => {
        console.error(`[MDS] Renderer load failed (${errorCode}): ${errorDescription}`);
        if (isSmokeTest) {
            process.exitCode = 1;
            electron_1.app.quit();
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
      `));
            console.log(`[MDS] Smoke test: bridge=${result.bridgeReady}, root=${result.rootReady}`);
            if (!result.bridgeReady || !result.rootReady) {
                process.exitCode = 1;
            }
            electron_1.app.quit();
        }
    });
    window.on("closed", () => {
        mainWindow = null;
    });
    return window;
}
electron_1.app.whenReady().then(() => {
    registerIpcHandlers();
    mainWindow = createMainWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            mainWindow = createMainWindow();
        }
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
