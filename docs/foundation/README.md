---
ownership: mds
status: transitional
source: internal-foundation-draft
safe_to_modify: approval-gated
canonical_target: mds-core/standards/ and docs/ARCHITECTURE.md
---

# MDS Foundation v1

This directory contains the approval and delivery pack for MDS Foundation v1.
The product boundary, artifact truth model, and control-plane architecture
decision were approved by the human project authority on 2026-08-14. The
Foundation Definition of Done and local milestone release gate were approved
by the human release authority on 2026-08-16. Deployment and packaged release
distribution remain out of scope.

## Review order

1. [`product-boundary.md`](product-boundary.md) — proposed product scope and
   the MDS/Implementation Plane boundary.
2. [`artifact-truth-model.md`](artifact-truth-model.md) — proposed lifecycle,
   validity, lineage, and Current Project Truth rules.
3. [`architecture-decision.md`](architecture-decision.md) — proposed
   Architecture Decision 0 and migration consequences.
4. [`roadmap.md`](roadmap.md) — outcome sequence for the foundation milestone.
5. [`delivery-board.json`](delivery-board.json) — structured draft task graph.
6. [`repository-baseline.md`](repository-baseline.md) — evidence about the
   current dirty worktree and verification state.
7. [`found-009-lineage-storage-adr.md`](found-009-lineage-storage-adr.md) —
   DRAFT detailed storage decision for immutable versions and approved-head
   transitions.
8. [`found-009-implementation-plan.md`](found-009-implementation-plan.md) —
   blocked execution proposal and fault-oriented test matrix pending approval
   of the detailed ADR.
9. [`found-003-electron-smoke-evidence.md`](found-003-electron-smoke-evidence.md)
   — current Windows Electron smoke disposition and fresh renderer/graph bridge
   assertions.
10. [`found-009-evidence.md`](found-009-evidence.md) — fresh immutable lineage,
    approved-head, recovery, tamper, and compatibility evidence.
11. [`found-010-evidence.md`](found-010-evidence.md) — graph traversal paths,
    relationship evidence, and `NEEDS_REVIEW`-only validity proposals.
12. [`found-011-evidence.md`](found-011-evidence.md) — deterministic Current
    Project Truth classification and safe authority-labeled context package.

13. [`found-012-evidence.md`](found-012-evidence.md) — desktop review, truth,
    impact, and context-authority interaction evidence.
14. [`found-013-definition-of-done-evidence.md`](found-013-definition-of-done-evidence.md)
    — fresh end-to-end proving slice, verification matrix, source immutability
    evidence, residual risks, and the human release gate.

## Current authority

- `BA-REQ-MDS-FOUND-001`, `BA-REQ-MDS-TRUTH-001`, and
  `ARCH-ADR-MDS-FOUND-001` are approved Foundation authority.
- Existing canonical sources continue to govern their current concern under
  [`../CANONICAL_SOURCES.md`](../CANONICAL_SOURCES.md) until a versioned
  migration replaces or redirects them through the applicable artifact gate.
- The approved Foundation artifacts authorize migration planning. The local
  Foundation milestone is now approved with residual risks recorded in
  `found-013-definition-of-done-evidence.md`; this does not authorize deployment
  or replacement of another approved artifact.
- Runtime project data remains under
  `MDS_DATA_DIR/projects/active/<project-id>/`; repository `workspace/` remains
  a seed/fixture.

## Gate sequence

```text
Foundation scope approval
        ↓
Product boundary / architecture approval
        ↓
Artifact truth model approval
        ↓
Executable backlog approval
        ↓
One Customer Change Analysis vertical slice
        ↓
Fresh Definition of Done evidence
        ↓
Release approval
```
