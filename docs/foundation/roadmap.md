---
id: PM-REL-MDS-FOUND-001
title: MDS Foundation milestone roadmap
project: mds
lifecycle_state: DRAFT
execution_state: NOT_APPLICABLE
version: 0.1.0
owner: pm_agent
created_by: codex
created_at: 2026-08-14
last_updated: 2026-08-14
source_refs:
  - BA-REQ-MDS-FOUND-001@1.0.0
  - BA-REQ-MDS-TRUTH-001@1.0.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
tags: [foundation, roadmap, change-governance]
links:
  - type: depends_on
    target: BA-REQ-MDS-FOUND-001
  - type: depends_on
    target: BA-REQ-MDS-TRUTH-001
  - type: depends_on
    target: ARCH-ADR-MDS-FOUND-001
---

# MDS Foundation milestone roadmap

## Outcome

MDS can prove one customer change from preserved source through human approval,
version lineage, evidence-backed impact, downstream validity warnings, Current
Project Truth, and a safe implementation context package—without modifying the
managed project's source code.

## Releases

| Release | Outcome | Scope/REQ links | Exit evidence | Approval |
|---|---|---|---|---|
| F0 — Known baseline | Current graph/runtime work has reproducible evidence and explicit gaps. | BA-REQ-MDS-FOUND-001 | Baseline, green non-UI tests, structure check result, smoke disposition | DRAFT |
| F1 — Governed foundation | Boundary, state axes, lineage invariants, truth rules, and migration routing are canonical. | BA-REQ-MDS-FOUND-001, BA-REQ-MDS-TRUTH-001 | Approved versioned artifacts, validators/spec tests, migration map | DRAFT |
| F2 — Customer change vertical slice | One approved change creates a new version, marks affected artifacts for review, refreshes truth, and emits context. | BA-REQ-MDS-TRUTH-001 plus a versioned workflow requirement | Integration/UI evidence and no managed-project source mutation | DRAFT |
| F3 — Feedback verification | Read-only repository/test evidence can produce drift/verification findings linked to truth. | Future scoped requirement | Evidence adapter tests and human-reviewed finding | DEFERRED |

## Dependency map

```text
Baseline
   ↓
Boundary + truth approvals
   ↓
Canonical policy/schema migration
   ↓
Customer Change Analysis contracts
   ↓
Domain/use-case implementation
   ↓
Desktop review/truth/context views
   ↓
Fresh DoD evidence
```

## Priority

Use risk-first ordering. Boundary and truth ambiguity can invalidate every later
feature, so the first two releases precede AI runtime expansion, additional
dashboards, rollback UI, Git collection, and workflow builder work.

## Constraints and assumptions

- Existing uncommitted Knowledge Graph work belongs to the user and is
  preserved.
- Approved artifacts are replaced only by new versions and explicit human
  approval.
- `workspace/` is a development seed; runtime project data is external.
- The current Electron smoke failure must remain visible until reproduced or
  resolved; it cannot be waived by a documentation claim.
- Confidence: high for sequencing; medium for implementation effort until the
  lineage persistence ADR is approved.

## Decisions required

- [x] Scope: `BA-REQ-MDS-FOUND-001@1.0.0` approved 2026-08-14.
- [x] Requirement: `BA-REQ-MDS-TRUTH-001@1.0.0` approved 2026-08-14.
- [x] Architecture: `ARCH-ADR-MDS-FOUND-001@1.0.0` Option A accepted
      2026-08-14.
- [ ] Backlog: approve a future version of `delivery-board.json` after the three
      upstream decisions are approved and task links are revalidated.
