# Vertical migration 01 — Customer Change Analysis

## Goal

Turn one imported customer document into traceable draft requirements, require
human review, and produce an impact report. This slice proves the first useful
MDS workflow on top of the consolidated repository structure.

## Current state

The workflow definition exists at
`workflows/definitions/customer-change-analysis.yaml`, while most package
boundaries remain scaffolds. Executors and persistence contracts are not yet
implemented end to end.

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
| Project context | `workspace/projects/active/<project-id>/` selected through `workspace/projects/index.yaml` |

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

1. Define domain and application ports with tests.
2. Implement one deterministic text fixture before DOCX integration.
3. Add DOCX parsing behind the ingestion port.
4. Produce draft requirements with exact source references.
5. Add human review and approval history.
6. Produce an impact report from approved requirements.
7. Connect the minimal desktop flow.
8. Add smoke/e2e evidence.

## Exit criteria

- [ ] Original source and checksum are preserved.
- [ ] Every generated requirement links to a source span.
- [ ] AI output starts as `DRAFT`.
- [ ] Human approval is required before impact/design work continues.
- [ ] Workflow state survives restart.
- [ ] Failed parsing or AI calls are visible and resumable.
- [ ] Requirement and impact artifacts pass MDS validation.
- [ ] Desktop typecheck, build, smoke, and the slice test pass.
- [ ] No API key or secret is stored in project artifacts or committed files.
- [ ] Migration map rows touched by this slice have evidence before status changes.

## Explicit non-goals

- Further physical restructuring unrelated to this vertical slice.
- Supporting every document format.
- Autonomous requirement approval.
- Full architecture/design generation.
- Adding another active project without a real project brief.
