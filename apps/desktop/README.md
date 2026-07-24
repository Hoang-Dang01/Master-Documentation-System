---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Desktop application

Electron is the delivery shell for MDS. This app owns windows, menus, file pickers, IPC, the preload bridge, and the React user interface. It must not contain requirement extraction, impact analysis, workflow policy, or other domain logic.

Planned source boundaries:

```text
src/
├── main/       # Electron main process, file system and security
├── preload/    # Narrow, typed desktop API
└── renderer/   # React UI, routes, features and state
```

Required Electron defaults:

```text
contextIsolation: true
nodeIntegration: false
sandbox: true
```

## Run locally

From the repository root:

```powershell
npm.cmd install
npm.cmd run dev
```

Use `npm.cmd run build` to create the renderer and Electron output, then `npm.cmd start` to launch that build.
