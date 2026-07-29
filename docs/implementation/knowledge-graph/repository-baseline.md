---
id: PM-CTX-MDS-KGBASE-001
title: Knowledge Graph Slice 1 repository baseline
project: mds
lifecycle_state: DRAFT
execution_state: NOT_APPLICABLE
version: 0.1.0
owner: pm_agent
created_by: system
created_at: 2026-07-27
last_updated: 2026-07-27
tags: [baseline, knowledge-graph, slice-1]
links:
  - type: references
    target: BA-REQ-MDS-KG-001
  - type: references
    target: ARCH-ADR-MDS-KG-001
---

# Knowledge Graph Slice 1 repository baseline

This snapshot was recorded before creating the four requested review
artifacts. It documents pre-existing work that a later implementation must
preserve. It is not a clean-tree claim and does not assign ownership of those
changes.

## Git identity

- Recorded at: 2026-07-27 (Asia/Bangkok)
- Branch: `main`
- HEAD: `3184a689f279802e4463d0b84c5c582bfb8c5064`
- Initial tracked diff summary: 16 files changed, 815 insertions, 33 deletions
- Working tree: dirty before this approval pack was created

## Pre-existing tracked modifications

```text
apps/desktop/dist-electron/main/index.js
apps/desktop/dist-electron/preload/index.js
apps/desktop/package.json
apps/desktop/src/main/index.ts
apps/desktop/src/preload/index.ts
apps/desktop/src/renderer/global.d.ts
docs/DATA_LAYOUT.md
docs/STRUCTURE.generated.md
docs/SYSTEM_OVERVIEW.md
package-lock.json
package.json
packages/application/README.md
packages/application/ingestion/package.json
packages/application/ingestion/src/index.ts
packages/core/README.md
packages/workflow-engine/README.md
```

## Pre-existing untracked paths

```text
packages/application/requirements/package.json
packages/application/requirements/src/
packages/application/requirements/tsconfig.json
packages/core/domain/package.json
packages/core/domain/src/
packages/core/domain/tsconfig.json
packages/workflow-engine/package.json
packages/workflow-engine/src/
packages/workflow-engine/tsconfig.json
tests/integration/requirements-review.cjs
tests/integration/workflow-runtime.cjs
```

## Preservation rules for a future Slice 1

- Do not reset, overwrite, delete, stage, or reformat pre-existing changes as a
  side effect.
- Re-read overlapping files immediately before editing because the working tree
  may continue to change.
- Treat `apps/desktop/dist-electron/` as generated output; Slice 1 does not need
  to edit it.
- Do not hand-edit `docs/STRUCTURE.generated.md`; regenerate it only when an
  approved structural change requires `npm run docs:structure`.
- Do not modify `workspace/` seed Markdown to make graph tests pass. Fixtures
  may copy it into a temporary test project.
- Do not write runtime artifacts into the repository; resolve
  `MDS_DATA_DIR` through the existing boundary.

## Proposed Slice 1 edit boundary (not yet authorized)

Likely allowed after backlog and architecture approval:

```text
packages/core/domain/src/                 # graph contracts, preserving current exports
packages/application/                     # logical graph use cases/ports
packages/infrastructure/                  # YAML/scanner adapter seam if required
tests/fixtures/graph/
tests/integration/graph-index.cjs
package.json and package-lock.json         # only if approved parser dependency is needed
docs/implementation/knowledge-graph/       # evidence updates/new version
docs/MIGRATION_MAP.md                      # consolidation decision/evidence when applicable
```

Not authorized in Slice 1:

```text
apps/desktop/
workflows/definitions/
workspace/
mds-core/standards/
mds-core/templates/
SQLite persistence or graph UI files
```

## Baseline limitations

- No content ownership attribution for the pre-existing changes was available.
- Git status emitted warnings because the user-level Git ignore file was not
  readable; repository status itself was still returned.
- The baseline records paths and diff totals, not a backup. Git history and the
  current working tree remain the recovery sources.

