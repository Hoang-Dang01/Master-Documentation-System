---
id: PM-CTX-MDS-FOUNDBASE-001
title: MDS Foundation repository baseline
project: mds
lifecycle_state: DRAFT
execution_state: NOT_APPLICABLE
version: 0.1.0
owner: pm_agent
created_by: codex
created_at: 2026-08-14
last_updated: 2026-08-14
source_refs:
  - git-status-2026-08-14
  - verification-2026-08-14
tags: [foundation, baseline, evidence, dirty-worktree]
links:
  - type: references
    target: BA-REQ-MDS-FOUND-001
---

# MDS Foundation repository baseline

## Purpose

Record the state inspected before Foundation governance artifacts were added.
This is evidence, not a clean-tree claim, backup, release, or attribution of
file ownership.

## Repository identity

- Recorded: 2026-08-14, Asia/Bangkok.
- Branch: `main`.
- HEAD before Foundation artifacts: `34fa668` (`feat: add domain and workflow
  engine packages with initial implementations`, committed 2026-07-29).
- The worktree was already dirty and contained Knowledge Graph slice 2–4 work.

## Pre-existing tracked modifications

```text
apps/desktop/README.md
apps/desktop/dist-electron/main/index.js
apps/desktop/dist-electron/preload/index.js
apps/desktop/package.json
apps/desktop/src/main/index.ts
apps/desktop/src/preload/index.ts
apps/desktop/src/renderer/App.tsx
apps/desktop/src/renderer/global.d.ts
apps/desktop/src/renderer/styles.css
docs/MIGRATION_MAP.md
package-lock.json
package.json
packages/application/requirements/src/graph.ts
packages/application/requirements/src/index.ts
packages/core/domain/src/index.ts
```

## Pre-existing untracked paths

```text
apps/desktop/src/renderer/KnowledgeGraphView.tsx
docs/implementation/knowledge-graph/slice-2-adr.md
docs/implementation/knowledge-graph/slice-2-delivery-board.json
docs/implementation/knowledge-graph/slice-2-evidence.md
docs/implementation/knowledge-graph/slice-3-adr.md
docs/implementation/knowledge-graph/slice-3-delivery-board.json
docs/implementation/knowledge-graph/slice-3-evidence.md
docs/implementation/knowledge-graph/slice-4-adr.md
docs/implementation/knowledge-graph/slice-4-evidence.md
packages/application/requirements/src/graph/
packages/infrastructure/persistence/package.json
packages/infrastructure/persistence/src/
packages/infrastructure/persistence/tsconfig.json
tests/integration/graph-sqlite-benchmark.cjs
tests/integration/graph-sqlite.cjs
```

## Runtime data observation

- `MDS_DATA_DIR` was not set in the inspected shell.
- The default root `C:\Users\Legion\Documents\MDS-Workspace` existed.
- Its `projects/index.yaml` named EduMeet as current, but no active project
  directory was visible in the inspected listing at that time.
- The repository `workspace/projects/active/edumeet/` remains a development
  seed and was not treated as canonical user runtime data.

## Fresh verification before Foundation artifacts

Passed:

```text
npm.cmd run typecheck
npm.cmd run build
npm.cmd run validate:docs
npm.cmd run validate:skills
npm.cmd run test:ingestion
npm.cmd run test:requirements
npm.cmd run test:workflow
npm.cmd run test:graph
npm.cmd run test:graph-sqlite
```

Not passed:

```text
npm.cmd run smoke
→ Electron terminated before renderer assertions after Windows GPU/cache/OS
  crypt initialization failures
```

The smoke failure remained when `ELECTRON_DISABLE_GPU=1` and a temporary
user-data environment variable were attempted through the existing launcher.
It is unverified whether this is solely an execution-environment problem or a
product-launcher defect.

## Foundation follow-up verification

After the DRAFT Foundation directory was added:

```text
npm.cmd run docs:structure
→ docs/STRUCTURE.generated.md regenerated through the canonical script

npm.cmd run validate:structure
→ passed

Foundation delivery-board link validation
→ 13 tasks, 0 warnings, 0 dependency cycles

npm.cmd run validate:docs
npm.cmd run validate:skills
→ passed
```

The generated structure diff requires normal worktree review together with the
new Foundation files; it was not hand-edited.

## Preservation rules

- Do not reset, delete, stage, overwrite, or bulk-format pre-existing changes.
- Re-read overlapping files immediately before any later edit.
- Treat `dist-electron/` and `docs/STRUCTURE.generated.md` as generated output.
- Regenerate the structure document only with `npm run docs:structure`.
- Do not alter the EduMeet seed to make graph or Foundation tests pass.
- Do not write runtime project artifacts into the source repository.
