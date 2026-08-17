"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const electron_1 = require("electron");
const document_ingestion_1 = require("@mds/document-ingestion");
const requirements_1 = require("@mds/requirements");
const persistence_1 = require("@mds/persistence");
const workflow_engine_1 = require("@mds/workflow-engine");
const repositoryRoot = node_path_1.default.resolve(__dirname, "..", "..", "..", "..");
const seedWorkspaceRoot = node_path_1.default.join(repositoryRoot, "workspace");
const isSmokeTest = process.env.MDS_SMOKE_TEST === "1";
const smokeScreenshotPath = process.env.MDS_SMOKE_SCREENSHOT;
const smokeGraphView = process.env.MDS_SMOKE_GRAPH_VIEW === "1";
let dataRootPath = "";
let activeProjectsRoot = "";
let defaultWorkspacePath = "";
let mainWindow = null;
let graphRepository = null;
function settingsPath() {
    return node_path_1.default.join(electron_1.app.getPath("userData"), "settings.json");
}
function secretsPath() {
    return node_path_1.default.join(electron_1.app.getPath("userData"), "secrets.json");
}
async function readJson(filePath, fallback) {
    try {
        return JSON.parse(await node_fs_1.promises.readFile(filePath, "utf8"));
    }
    catch {
        return fallback;
    }
}
async function writeJsonAtomic(filePath, value) {
    await node_fs_1.promises.mkdir(node_path_1.default.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.tmp`;
    await node_fs_1.promises.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    await node_fs_1.promises.rename(temporaryPath, filePath);
}
async function readSettings() {
    return readJson(settingsPath(), {});
}
async function saveSettings(patch) {
    const settings = { ...(await readSettings()), ...patch };
    await writeJsonAtomic(settingsPath(), settings);
    return settings;
}
async function resolveDataRoot() {
    const configuredRoot = process.env.MDS_DATA_DIR?.trim();
    if (configuredRoot)
        return node_path_1.default.resolve(configuredRoot);
    const settings = await readSettings();
    return settings.dataRootPath
        ? node_path_1.default.resolve(settings.dataRootPath)
        : node_path_1.default.join(electron_1.app.getPath("documents"), "MDS-Workspace");
}
async function ensureDataWorkspace() {
    dataRootPath = await resolveDataRoot();
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
function assertActiveProjectPath(projectPath) {
    if (typeof projectPath !== "string" || projectPath.trim().length === 0) {
        throw new Error("Project path không hợp lệ.");
    }
    const project = node_path_1.default.resolve(projectPath);
    const root = node_path_1.default.resolve(activeProjectsRoot);
    if (project === root || !project.startsWith(`${root}${node_path_1.default.sep}`)) {
        throw new Error("Project phải nằm trong MDS_DATA_DIR/projects/active.");
    }
    return project;
}
function openGraphRepository() {
    if (!graphRepository) {
        graphRepository = new persistence_1.SqliteGraphIndexRepository(node_path_1.default.join(dataRootPath, "mds.sqlite"));
        graphRepository.migrate();
    }
    return graphRepository;
}
function closeGraphRepository() {
    graphRepository?.close();
    graphRepository = null;
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
        if (!result.canceled && result.filePaths[0]) {
            const selectedPath = node_path_1.default.resolve(result.filePaths[0]);
            const activeMarker = `${node_path_1.default.sep}projects${node_path_1.default.sep}active${node_path_1.default.sep}`;
            const markerIndex = selectedPath.toLowerCase().indexOf(activeMarker.toLowerCase());
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
    electron_1.ipcMain.handle("workspace:choose-data-root", async () => {
        const result = await electron_1.dialog.showOpenDialog({
            title: "Chọn thư mục dữ liệu MDS",
            defaultPath: dataRootPath,
            properties: ["openDirectory", "createDirectory"],
        });
        if (result.canceled || !result.filePaths[0]) {
            return { canceled: true, dataRootPath };
        }
        closeGraphRepository();
        await saveSettings({ dataRootPath: node_path_1.default.resolve(result.filePaths[0]) });
        await ensureDataWorkspace();
        return { canceled: false, dataRootPath };
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
    electron_1.ipcMain.handle("evidence:list", async (_event, projectPath) => {
        return (0, persistence_1.listFilesystemEvidenceBundles)(assertActiveProjectPath(projectPath));
    });
    electron_1.ipcMain.handle("graph:build-index", async (_event, projectPath) => {
        const safeProject = assertActiveProjectPath(projectPath);
        const result = await (0, requirements_1.buildGraphIndex)({
            projectPath: safeProject,
            activeProjectsRoot,
            documentStandardsPath: node_path_1.default.join(repositoryRoot, "mds-core", "standards", "document_standards.md"),
        });
        openGraphRepository().replaceProject(result);
        return result;
    });
    electron_1.ipcMain.handle("graph:query", (_event, query) => {
        if (!query || typeof query !== "object" || Array.isArray(query)) {
            throw new Error("Graph query không hợp lệ.");
        }
        const candidate = query;
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
        if (!graph)
            return { projectId: candidate.projectId, nodes: [], edges: [], issues: [] };
        return (0, requirements_1.queryGraphProjection)(graph, candidate);
    });
    electron_1.ipcMain.handle("graph:get-node", (_event, projectId, nodeId) => {
        if (typeof projectId !== "string" || typeof nodeId !== "string") {
            throw new Error("Graph node request không hợp lệ.");
        }
        const graph = openGraphRepository().readProject(projectId);
        return graph ? (0, requirements_1.getGraphNodeDetail)(graph, nodeId) : null;
    });
    electron_1.ipcMain.handle("graph:validate", (_event, projectId) => {
        if (typeof projectId !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectId)) {
            throw new Error("Graph project id không hợp lệ.");
        }
        return openGraphRepository().readProject(projectId)?.issues ?? [];
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
    electron_1.ipcMain.handle("requirement:review", async (_event, projectPath, relativePath, decision, actor, reason) => {
        if (typeof projectPath !== "string" ||
            typeof relativePath !== "string" ||
            (decision !== "APPROVED" && decision !== "REJECTED")) {
            throw new Error("Review request không hợp lệ.");
        }
        return (0, requirements_1.reviewRequirement)(projectPath, activeProjectsRoot, relativePath, decision, typeof actor === "string" ? actor : "human", typeof reason === "string" ? reason : "");
    });
    electron_1.ipcMain.handle("impact:create", async (_event, projectPath, requirementPath) => {
        if (typeof projectPath !== "string" ||
            typeof requirementPath !== "string") {
            throw new Error("Impact request không hợp lệ.");
        }
        return (0, requirements_1.createImpactReport)(projectPath, activeProjectsRoot, requirementPath);
    });
    electron_1.ipcMain.handle("workflow:start", async (_event, projectPath, workflowId, stepIds) => {
        if (typeof projectPath !== "string" ||
            typeof workflowId !== "string" ||
            !Array.isArray(stepIds) ||
            !stepIds.every((stepId) => typeof stepId === "string")) {
            throw new Error("Workflow start request không hợp lệ.");
        }
        return (0, workflow_engine_1.startWorkflow)({
            projectPath,
            activeProjectsRoot,
            project: node_path_1.default.basename(projectPath),
            workflowId,
            stepIds,
        });
    });
    electron_1.ipcMain.handle("workflow:advance", async (_event, projectPath, runId, outcome, error) => {
        if (typeof projectPath !== "string" ||
            typeof runId !== "string" ||
            (outcome !== "COMPLETED" &&
                outcome !== "WAITING_APPROVAL" &&
                outcome !== "FAILED")) {
            throw new Error("Workflow advance request không hợp lệ.");
        }
        return (0, workflow_engine_1.advanceWorkflow)(projectPath, activeProjectsRoot, runId, outcome, typeof error === "string" ? error : undefined);
    });
    electron_1.ipcMain.handle("settings:save-provider-secret", async (_event, provider, secret) => {
        if (typeof provider !== "string" ||
            !/^[a-z0-9-]{2,32}$/i.test(provider) ||
            typeof secret !== "string" ||
            secret.trim().length === 0) {
            throw new Error("Provider secret không hợp lệ.");
        }
        if (!electron_1.safeStorage.isEncryptionAvailable()) {
            throw new Error("OS secure storage chưa khả dụng trên máy này.");
        }
        const secrets = await readJson(secretsPath(), {});
        secrets[provider.toLowerCase()] = electron_1.safeStorage
            .encryptString(secret)
            .toString("base64");
        await writeJsonAtomic(secretsPath(), secrets);
        return { ok: true };
    });
    electron_1.ipcMain.handle("settings:provider-secret-status", async (_event, provider) => {
        if (typeof provider !== "string") {
            throw new Error("Provider không hợp lệ.");
        }
        const secrets = await readJson(secretsPath(), {});
        return {
            configured: Boolean(secrets[provider.toLowerCase()]),
            secureStorageAvailable: electron_1.safeStorage.isEncryptionAvailable(),
        };
    });
    electron_1.ipcMain.handle("settings:delete-provider-secret", async (_event, provider) => {
        if (typeof provider !== "string") {
            throw new Error("Provider không hợp lệ.");
        }
        const secrets = await readJson(secretsPath(), {});
        delete secrets[provider.toLowerCase()];
        await writeJsonAtomic(secretsPath(), secrets);
        return { ok: true };
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
      `));
            console.log(`[MDS] Smoke test: bridge=${result.bridgeReady}, root=${result.rootReady}, workbench=${result.workbenchReady}, evidenceView=${result.evidenceViewReady}, graph=${result.graphReady}, graphView=${result.graphViewReady}`);
            if (!result.bridgeReady || !result.rootReady || !result.workbenchReady || !result.evidenceViewReady || !result.graphReady || !result.graphViewReady) {
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
electron_1.app.on("before-quit", closeGraphRepository);
