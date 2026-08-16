# Vertical migration 01 — Customer Change Analysis

## Goal

Turn one imported customer document into traceable draft requirements, require
human review, and produce an impact report. This slice proves the first useful
MDS workflow on top of the consolidated repository structure.

## Current state

The Foundation workflow contract is now version 1.0.0 and approved. Import,
deterministic DRAFT extraction, minimal requirement approval/audit, a keyword
impact report, persisted workflow state, and the derived Knowledge Graph have
partial runtime implementations. The approved contract is ahead of runtime:
immutable lineage transitions, graph impact traversal, validity propagation,
Current Project Truth, and safe context packaging remain pending.

## Target slice

```text
Select DOCX
→ preserve original and checksum
→ parse normalized text
→ create/resolve Requirement DRAFT version and lineage
→ validate source and truth metadata
→ human edits/approves/rejects
→ atomically transition approved head
→ rebuild derived graph
→ traverse affected artifacts with evidence
→ propose CURRENT → NEEDS_REVIEW
→ refresh Current Project Truth
→ export safe implementation context
```

The workflow stops at context export. Implementation belongs to Codex, Claude
Code, a developer, or another external Implementation Plane tool.

## Canonical inputs

| Concern | Source |
|---|---|
| Requirement structure | `mds-core/templates/ba/requirement_template.md` |
| Requirement/relationship rules | `mds-core/standards/document_standards.md` |
| BA responsibility | `mds-core/roles/ba/` |
| Lifecycle/gates | `mds-core/schemas/workflow_schema.md` |
| Validity, lineage and Project Truth | `mds-core/standards/artifact_truth.md` and `mds-core/schemas/artifact_truth_schema.md` |
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
5. [x] Approve the Foundation workflow contract.
6. Implement immutable version lineage and approved-head transition.
7. Replace keyword impact matching with evidence-backed graph traversal.
8. Add validity propagation and Current Project Truth projection.
9. Generate a safe implementation context package.
10. Connect review/history/impact/truth/context interactions in desktop.
11. Add fresh smoke/e2e evidence.

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
- [x] Workflow contract forbids managed-project source/test mutation and
  terminates at the implementation context package.
- [ ] Runtime enforces one approved active head per lineage.
- [ ] Context package excludes non-authoritative content from instructions.

## Explicit non-goals

- Further physical restructuring unrelated to this vertical slice.
- Supporting every document format.
- Autonomous requirement approval.
- Full architecture/design generation.
- Adding another active project without a real project brief.
