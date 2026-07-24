"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const desktopApi = {
    getAppInfo: () => electron_1.ipcRenderer.invoke("app:get-info"),
    selectWorkspace: () => electron_1.ipcRenderer.invoke("workspace:select"),
    openWorkspace: (workspacePath) => electron_1.ipcRenderer.invoke("workspace:open", workspacePath),
    listArtifacts: (projectPath) => electron_1.ipcRenderer.invoke("artifacts:list", projectPath),
    importDocument: (projectPath) => electron_1.ipcRenderer.invoke("document:import", projectPath),
    openArtifact: (projectPath, relativeArtifactPath) => electron_1.ipcRenderer.invoke("artifact:open", projectPath, relativeArtifactPath)
};
electron_1.contextBridge.exposeInMainWorld("mds", desktopApi);
