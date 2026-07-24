# Vertical migration 01 — Customer Change Analysis

## Goal

Turn one imported customer document into traceable draft requirements, require
human review, and produce an impact report. This slice proves the first useful
MDS workflow on top of the consolidated repository structure.

## Current state

The import slice is implemented in `packages/application/ingestion/` and wired
to Electron through a narrow preload API. DOCX/Markdown/TXT sources are
preserved with checksums, normalized content is visible in the desktop app, and
a deterministic requirement `DRAFT` is written into the active project.

Human review, approval history, impact analysis, and downstream design remain
the next slice.

## Target slice

```text
Select DOCX
→ preserve original and checksum
→ parse normalized text
→ generate Requirement DRAFT with source spans
→ human edits/approves/rejects
→ analyze impact against known artifacts
→ persist artifacts and workflow state
→ show evidence in desktop UI
```

## Canonical inputs

| Concern | Source |
|---|---|
| Requirement structure | `mds-core/templates/ba/requirement_template.md` |
| Requirement/relationship rules | `mds-core/standards/document_standards.md` |
| BA responsibility | `mds-core/roles/ba/` |
| Lifecycle/gates | `mds-core/schemas/workflow_schema.md` |
| Runtime sequence | `workflows/definitions/customer-change-analysis.yaml` |
| Project context | `MDS_DATA_DIR/projects/active/<project-id>/`; repository `workspace/` is the development seed |

## Implementation seams

| Seam | Current boundary | First responsibility |
|---|---|---|
| Domain | `packages/core/domain/` | Requirement draft, source reference, lifecycle state |
| Application | `packages/application/` | Orchestrate import → review → impact |
| Ingestion | `packages/application/ingestion/` | DOCX adapter contract and normalized content |
| Requirement analysis | `packages/application/requirements/` | Draft extraction and ambiguity output |
| Impact analysis | `packages/application/impact/` | Traceable affected-artifact report |
| Persistence | `packages/infrastructure/persistence/` | Local artifact/workflow repository |
| Approval | `packages/core/approval/` | Human decision and immutable history |
| Workflow | `packages/workflow-engine/` | Step state and dependency execution |
| UI | `apps/desktop/` | Select, review, approve/reject, inspect impact |

These are logical seams. Do not create a separate npm package for every seam
until independent build/dependency boundaries are proven.

## Delivery order

1. [x] Define the ingestion application package and typed desktop API.
2. [x] Add a deterministic integration fixture.
3. [x] Parse DOCX through Mammoth.
4. [x] Produce draft requirements linked to the preserved source artifact.
5. Add human review and approval history.
6. Produce an impact report from approved requirements.
7. Connect the minimal desktop flow.
8. Add smoke/e2e evidence.

## Exit criteria

- [x] Original source and checksum are preserved.
- [x] Every generated requirement links to its normalized source artifact.
- [x] Generated output starts as `DRAFT`.
- [ ] Human approval is required before impact/design work continues.
- [x] Imported sources and draft artifacts survive restart as project files.
- [ ] Failed parsing is visible; resumable step execution is still pending.
- [x] Generated requirement artifacts pass MDS validation.
- [x] Desktop typecheck, build, smoke, and the ingestion test pass.
- [x] No API key or secret is stored in project artifacts or committed files.
- [ ] Migration map rows touched by this slice have evidence before status changes.

## Explicit non-goals

- Further physical restructuring unrelated to this vertical slice.
- Supporting every document format.
- Autonomous requirement approval.
- Full architecture/design generation.
- Adding another active project without a real project brief.
