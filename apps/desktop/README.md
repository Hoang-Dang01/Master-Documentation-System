---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Desktop application

Electron is the delivery shell for MDS. This app owns windows, menus, file
pickers, IPC, the preload bridge, and the React user interface. Document
ingestion and draft extraction live in `packages/application/ingestion/`.

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

Runtime project data lives outside the repository. The default data root is
`%USERPROFILE%\Documents\MDS-Workspace`; override it for development or a
portable local workspace:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
npm.cmd run dev
```

On first run, the app creates the minimal data tree and copies the EduMeet
development seed only when the target project does not already exist. Existing
external data is never replaced. See
[`../../docs/DATA_LAYOUT.md`](../../docs/DATA_LAYOUT.md).

Use `npm.cmd run build` to create the renderer and Electron output, then `npm.cmd start` to launch that build.

## Implemented vertical slice

The desktop app can now:

1. select a DOCX, Markdown, or TXT document;
2. preserve the original under the active project with a SHA-256 checksum;
3. extract and display normalized text;
4. create a human-readable requirement artifact in `DRAFT`;
5. list documents by `title`, with ID/path hidden until technical mode is on.
