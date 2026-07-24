"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const electron_1 = require("electron");
const document_ingestion_1 = require("@mds/document-ingestion");
const repositoryRoot = node_path_1.default.resolve(__dirname, "..", "..", "..", "..");
const seedWorkspaceRoot = node_path_1.default.join(repositoryRoot, "workspace");
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
const smokeScreenshotPath = process.env.MDS_SMOKE_SCREENSHOT;
let dataRootPath = "";
let activeProjectsRoot = "";
let defaultWorkspacePath = "";
let mainWindow = null;
function resolveDataRoot() {
    const configuredRoot = process.env.MDS_DATA_DIR?.trim();
    return configuredRoot
        ? node_path_1.default.resolve(configuredRoot)
        : node_path_1.default.join(electron_1.app.getPath("documents"), "MDS-Workspace");
}
async function ensureDataWorkspace() {
    dataRootPath = resolveDataRoot();
    activeProjectsRoot = node_path_1.default.join(dataRootPath, "projects", "active");
    defaultWorkspacePath = node_path_1.default.join(activeProjectsRoot, "edumeet");
    await Promise.all([
        node_fs_1.promises.mkdir(activeProjectsRoot, { recursive: true }),
        node_fs_1.promises.mkdir(node_path_1.default.join(dataRootPath, "projects", "archived"), {
            recursive: true,
        }),
        node_fs_1.promises.mkdir(node_path_1.default.join(dataRootPath, "imports"), { recursive: true }),
        node_fs_1.promises.mkdir(node_path_1.default.join(dataRootPath, "exports"), { recursive: true }),
        node_fs_1.promises.mkdir(node_path_1.default.join(dataRootPath, "backups"), { recursive: true }),
    ]);
    try {
        await node_fs_1.promises.access(defaultWorkspacePath);
    }
    catch {
        const seedProjectPath = node_path_1.default.join(seedWorkspaceRoot, "projects", "active", "edumeet");
        try {
            await node_fs_1.promises.cp(seedProjectPath, defaultWorkspacePath, {
                recursive: true,
                errorOnExist: false,
            });
        }
        catch {
            await node_fs_1.promises.mkdir(defaultWorkspacePath, { recursive: true });
        }
    }
    const seedIndexPath = node_path_1.default.join(seedWorkspaceRoot, "projects", "index.yaml");
    const dataIndexPath = node_path_1.default.join(dataRootPath, "projects", "index.yaml");
    try {
        await node_fs_1.promises.access(dataIndexPath);
    }
    catch {
        try {
            await node_fs_1.promises.copyFile(seedIndexPath, dataIndexPath);
        }
        catch {
            await node_fs_1.promises.writeFile(dataIndexPath, "projects: []\n", "utf8");
        }
    }
}
function registerIpcHandlers() {
    electron_1.ipcMain.handle("app:get-info", () => ({
        name: "Master Documentation System",
        version: electron_1.app.getVersion(),
        repositoryRoot,
        dataRootPath,
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
    electron_1.ipcMain.handle("artifacts:list", async (_event, projectPath) => {
        if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
            throw new Error("Project path không hợp lệ.");
        }
        return (0, document_ingestion_1.listProjectArtifacts)(projectPath, activeProjectsRoot);
    });
    electron_1.ipcMain.handle("document:import", async (_event, projectPath) => {
        if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
            throw new Error("Project path không hợp lệ.");
        }
        const result = await electron_1.dialog.showOpenDialog({
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
        const imported = await (0, document_ingestion_1.importDocument)(result.filePaths[0], projectPath, activeProjectsRoot);
        return { canceled: false, document: imported };
    });
    electron_1.ipcMain.handle("artifact:open", async (_event, projectPath, relativeArtifactPath) => {
        if (typeof projectPath !== "string" ||
            typeof relativeArtifactPath !== "string") {
            return { ok: false, error: "Artifact path không hợp lệ." };
        }
        const resolvedProject = node_path_1.default.resolve(projectPath);
        const resolvedArtifact = node_path_1.default.resolve(resolvedProject, relativeArtifactPath);
        if (!resolvedArtifact.startsWith(`${resolvedProject}${node_path_1.default.sep}`)) {
            return { ok: false, error: "Artifact nằm ngoài project." };
        }
        const error = await electron_1.shell.openPath(resolvedArtifact);
        return error ? { ok: false, error } : { ok: true };
    });
}
function createMainWindow() {
    const window = new electron_1.BrowserWindow({
        width: 1440,
        height: 920,
        minWidth: 1080,
        minHeight: 720,
        show: !isSmokeTest || Boolean(smokeScreenshotPath),
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
      `));
            console.log(`[MDS] Smoke test: bridge=${result.bridgeReady}, root=${result.rootReady}`);
            if (!result.bridgeReady || !result.rootReady) {
                process.exitCode = 1;
            }
            if (smokeScreenshotPath) {
                const image = await window.webContents.capturePage();
                await node_fs_1.promises.writeFile(smokeScreenshotPath, image.toPNG());
                console.log(`[MDS] Smoke screenshot: ${smokeScreenshotPath}`);
            }
            electron_1.app.quit();
        }
    });
    window.on("closed", () => {
        mainWindow = null;
    });
    return window;
}
electron_1.app.whenReady().then(async () => {
    await ensureDataWorkspace();
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
