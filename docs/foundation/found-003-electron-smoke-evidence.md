---
id: QA-REL-MDS-FOUND-003
title: Foundation Electron smoke disposition
project: mds
lifecycle_state: DRAFT
execution_state: COMPLETED
version: 0.1.0
owner: qa_agent
created_by: codex
created_at: 2026-08-16
last_updated: 2026-08-16
source_refs:
  - BA-REQ-MDS-FOUND-001@1.0.0
  - PM-TSK-MDS-FOUND-003
  - docs/foundation/repository-baseline.md
tags: [foundation, electron, smoke, evidence, windows]
links:
  - type: verifies
    target: PM-TSK-MDS-FOUND-003
---

# Foundation Electron smoke disposition

## Disposition

The current Electron UI and graph bridge smoke assertions pass. The prior
failure was reproducible in the managed Windows execution environment and came
from two smoke-launcher assumptions rather than renderer assertions:

1. Chromium reused ambient user-data/cache/crashpad state and failed with
   OS-crypt/cache access errors.
2. The outer managed sandbox prevented the Electron GPU child process from
   starting (`0xC0000135`), even when GPU flags were attempted through the old
   Node launcher. That launcher discarded all caller-supplied Electron flags.

The launcher now forwards explicit arguments. A dedicated smoke wrapper creates
isolated temporary data, user-data, and disk-cache roots, removes inherited
Electron/crashpad variables, and applies `--no-sandbox` only to the Windows
smoke subprocess. The production `start`/`dev` commands receive no such flag.
Renderer security settings remain unchanged: `sandbox: true`,
`contextIsolation: true`, and `nodeIntegration: false`.

## Fresh evidence

Run on 2026-08-16, Asia/Bangkok, against the current dirty worktree:

```text
npm.cmd run smoke
exit 0

[MDS] Renderer ready: MDS — Engineering OS
[MDS] Smoke test: bridge=true, root=true, graph=true, graphView=true
```

The smoke run builds the domain, requirements, workflow-engine, and ingestion
packages before launching Electron. It then exercises the typed preload bridge,
React root, graph index build/query/validation/node-detail path, and graph view
DOM assertions.

## Data safety and cleanup

- The run uses a new OS temporary directory for `MDS_DATA_DIR`, Chromium
  user-data, and disk cache.
- The repository `workspace/` tree remains a read-only development seed for the
  first-run copy; no runtime truth is written into the repository.
- The wrapper removes its temporary directory when Electron exits. A failed
  cleanup is reported with its exact path instead of being silently ignored.

## Scope and residual risk

- This evidence proves the smoke harness and current renderer/bridge assertions
  in the managed Windows environment. It is not release approval.
- `--no-sandbox` is intentionally restricted to this smoke subprocess. It must
  not be copied to normal desktop startup or production packaging.
- A separately packaged Windows application smoke remains part of future
  release verification.

