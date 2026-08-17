# FOUND-013 — Foundation Definition of Done evidence

Evidence date: 2026-08-16 (Asia/Bangkok)

Status: APPROVED — technical Definition of Done evidence accepted by the human
release authority on 2026-08-16.

Approval record:

```yaml
decision: APPROVED
approver: human-release-authority
approved_at: 2026-08-16
scope: MDS Foundation v1 / Customer Change Analysis proving slice
deployment_authorized: false
```

## Proving slice

`tests/integration/foundation-dod.cjs` creates an isolated runtime project under
the OS temporary directory and demonstrates one customer source change through:

```text
source preservation + normalized DRAFT requirement
  -> human-triggered approval
  -> immutable lineage and one approved head
  -> evidence-backed graph traversal
  -> CURRENT -> NEEDS_REVIEW proposals for API and test artifacts
  -> Current Project Truth warnings
  -> safe context package with no impacted warning promoted to instructions
```

The fixture also creates a managed-project source file before analysis, records
its SHA-256, and verifies the same hash after the complete proving slice. The
fresh run reported:

```text
approved head: BA-REQ-PROOF-IMPORT-001@0.1.0
affected artifacts: BE-API-PRF-NOTIFY-001, QA-TST-PRF-NOTIFY-001
truth warnings: BE-API-PRF-NOTIFY-001, QA-TST-PRF-NOTIFY-001
context instructions: none
managed-project source unchanged: true
```

The proving slice revealed and fixed one fail-closed integration defect:
`projectCurrentTruth()` previously attached impact proposal text to an
authoritative item without reclassifying it. It now projects an approved
`CURRENT` artifact with an evidence-backed proposal as `WARNING` /
`NEEDS_REVIEW`, and the context builder does not make it instruction-eligible.

## Fresh verification results

All commands below completed with exit code `0` on the current worktree:

```text
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:ingestion
npm.cmd run test:requirements
npm.cmd run test:lineage
npm.cmd run test:impact
npm.cmd run test:truth
npm.cmd run test:workflow
npm.cmd run test:graph
npm.cmd run test:graph-sqlite
npm.cmd run test:foundation-dod
npm.cmd run smoke
```

Electron smoke result:

```text
bridge=true, root=true, workbench=true, graph=true, graphView=true
```

Repository governance validation also passed after regenerating the generated
structure view:

```text
npm.cmd run validate:docs
npm.cmd run validate:structure
npm.cmd run validate:skills
validate-task-links: 13 tasks, 0 warnings
detect-blocked-chain: 0 blocked, 0 cycles
git diff --check: no whitespace errors
```

## Traceability

- Requirements: `BA-REQ-MDS-FOUND-001`, `BA-REQ-MDS-TRUTH-001`
- Architecture: `ARCH-ADR-MDS-FOUND-001`, `ARCH-ADR-MDS-FOUND-009`
- Workflow: `customer-change-analysis@1.0.0`
- Delivery task: `PM-TSK-MDS-FOUND-013`
- Prior evidence: `found-009-evidence.md`, `found-010-evidence.md`,
  `found-011-evidence.md`, `found-012-evidence.md`

## Residual risks and unverified items

- No packaged Windows installer/application smoke was performed.
- No agent-browser or Python Playwright click-through suite was available; the
  Electron smoke verifies renderer/workbench selectors and typed bridge access.
- Runtime persistence of graph validity proposals remains a later slice; this
  Foundation proof applies them deterministically to the truth projection.
- The worktree contains pre-existing user changes and remains uncommitted. No
  unrelated path was reset, deleted, staged, or overwritten.
- Deployment is outside Foundation scope. No deployment or external write was
  performed.

## Release gate

The human release authority approved the Foundation milestone with the
residual risks above. This approval covers the local Foundation milestone only;
it does not authorize deployment, packaged release distribution, or managed-
project source/test mutation.
