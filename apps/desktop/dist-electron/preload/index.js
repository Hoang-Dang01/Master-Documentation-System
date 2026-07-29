"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const desktopApi = {
    getAppInfo: () => electron_1.ipcRenderer.invoke("app:get-info"),
    selectWorkspace: () => electron_1.ipcRenderer.invoke("workspace:select"),
    chooseDataRoot: () => electron_1.ipcRenderer.invoke("workspace:choose-data-root"),
    openWorkspace: (workspacePath) => electron_1.ipcRenderer.invoke("workspace:open", workspacePath),
    listArtifacts: (projectPath) => electron_1.ipcRenderer.invoke("artifacts:list", projectPath),
    importDocument: (projectPath) => electron_1.ipcRenderer.invoke("document:import", projectPath),
    reviewRequirement: (projectPath, relativePath, decision, actor, reason) => electron_1.ipcRenderer.invoke("requirement:review", projectPath, relativePath, decision, actor, reason),
    createImpactReport: (projectPath, requirementPath) => electron_1.ipcRenderer.invoke("impact:create", projectPath, requirementPath),
    startWorkflow: (projectPath, workflowId, stepIds) => electron_1.ipcRenderer.invoke("workflow:start", projectPath, workflowId, stepIds),
    advanceWorkflow: (projectPath, runId, outcome, error) => electron_1.ipcRenderer.invoke("workflow:advance", projectPath, runId, outcome, error),
    saveProviderSecret: (provider, secret) => electron_1.ipcRenderer.invoke("settings:save-provider-secret", provider, secret),
    providerSecretStatus: (provider) => electron_1.ipcRenderer.invoke("settings:provider-secret-status", provider),
    deleteProviderSecret: (provider) => electron_1.ipcRenderer.invoke("settings:delete-provider-secret", provider),
    openArtifact: (projectPath, relativeArtifactPath) => electron_1.ipcRenderer.invoke("artifact:open", projectPath, relativeArtifactPath)
};
electron_1.contextBridge.exposeInMainWorld("mds", desktopApi);
