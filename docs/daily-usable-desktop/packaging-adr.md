---
id: ARCH-ADR-MDS-DESKTOP-001
title: Windows packaging and packaged resource resolution
project: mds
phase: "03"
lifecycle_state: APPROVED
execution_state: NOT_APPLICABLE
decision_status: ACCEPTED
version: 0.1.0
owner: arch_agent
created_by: codex
created_at: 2026-08-17
approved_at: 2026-08-17
approved_by: human-architect
approval_reason: User approved Option A as part of the complete Daily-Usable Desktop planning pack.
source_refs:
  - BA-REQ-MDS-DESKTOP-001@0.1.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
links:
  - type: implements
    target: BA-REQ-MDS-DESKTOP-001
---

# ADR: Windows packaging and packaged resource resolution

## Proposed decision

Use **Option A — electron-builder with an NSIS per-user installer, an unpacked
verification target, ASAR application code, unpacked native modules and
explicit `extraResources` for MDS-owned runtime standards and the development
seed**.

The Electron main process resolves two roots explicitly:

```text
development: repository root
packaged:    process.resourcesPath
```

Runtime project data continues to resolve independently through
`MDS_DATA_DIR`, persisted settings, or the default Documents workspace. It is
never stored below the installation directory.

## Context

The current app builds and runs from the repository, but its main process
derives `repositoryRoot` from compiled source location. That works in a source
checkout and fails as a packaging contract because `mds-core/` and `workspace/`
do not naturally exist beside an installed ASAR. The application also uses the
native `better-sqlite3` module, which must be rebuilt/unpacked for Electron's
ABI and included in the package.

## Constraints and drivers

1. Preserve Electron `sandbox: true`, `contextIsolation: true` and
   `nodeIntegration: false`.
2. Keep runtime data outside application resources and uninstall scope.
3. Include only the minimal MDS-owned static resources required at runtime.
4. Package the native SQLite dependency reproducibly for Electron 43.
5. Produce both an unpacked directory for deterministic smoke and an NSIS
   installer for user installation.
6. Do not require administrator privileges for the default install path.
7. Do not claim publisher identity without Authenticode signing.

## Options

### Option A — electron-builder + NSIS + explicit resources

Benefits: established Electron packaging, native dependency rebuild support,
unpacked and installer targets from one configuration, explicit artifact
filtering. Costs: adds a build dependency and unsigned installer warnings.

### Option B — Electron Forge

Benefits: integrated maker/plugin model. Costs: larger migration surface for
the existing Vite/TypeScript build and no material benefit for this single
Windows target.

### Option C — custom portable folder or archive

Benefits: minimal packaging machinery. Costs: no installer/uninstaller,
shortcut or standard user experience; native dependency and resource copying
become custom scripts. Rejected as the primary daily-use target.

## Proposed package contract

- Product name: `MDS`.
- Target: Windows x64, NSIS per-user installer plus unpacked directory.
- ASAR: enabled; `better-sqlite3` and its native binary unpacked as required.
- Application files: compiled renderer/main/preload, package manifests and
  production runtime dependencies only.
- Extra resources:
  - `mds-core/standards/` required by graph validation;
  - `workspace/projects/index.yaml` and
    `workspace/projects/active/edumeet/` as an optional first-run sample.
- Excluded: `.git`, tests, docs, plans, backups, developer scripts, source maps
  not required at runtime, user settings and secrets.
- Artifact output: repository-local ignored `release/` directory.

## First-run and recovery behavior

1. Resolve data root from `MDS_DATA_DIR`, saved settings, then Documents.
2. Create bounded runtime directories idempotently.
3. If no project index exists, copy the bundled seed index or write
   `projects: []`.
4. If the default sample project is absent, copy the bundled sample; if the
   resource is unavailable, create the project directory and continue in a
   valid empty state.
5. Never overwrite an existing project, index, settings file or secret store.
6. A second launch proves persistence by retaining a sentinel hash.

## Verification strategy

- Build/typecheck and existing source Electron smoke.
- Package configuration and content audit.
- Launch unpacked executable with isolated user-data/cache/data roots.
- Assert typed bridge, workbench, evidence and graph views, workspace creation,
  clean exit and second-launch preservation.
- Build NSIS installer and record SHA-256, size and unsigned status.
- Do not silently install or publish during automation; an optional manual
  install/uninstall check requires explicit local release authority.

## Risks and consequences

- Unsigned binaries may trigger Windows SmartScreen warnings.
- Packaging may require network access for the packager or Electron/native
  binary acquisition even though current dependencies are installed.
- Native ABI mismatch is a release blocker until packaged smoke passes.
- The sample seed increases installer size but gives a useful first launch;
  later versions may replace it with a guided empty-project flow.
- No custom icon is required for the proving build; Windows may show the
  default Electron icon until an approved brand asset exists.

## Approval gate

Human architect approved Option A on 2026-08-17. This authorizes local
packaging implementation and creation of an installer candidate, but not
external publication or production deployment.
