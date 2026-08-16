---
id: PM-REL-MDS-FOUND-009
title: Immutable requirement lineage and approved-head transition evidence
project: mds
lifecycle_state: DRAFT
execution_state: COMPLETED
version: 0.1.0
owner: pm_agent
created_by: codex
created_at: 2026-08-16
last_updated: 2026-08-16
source_refs:
  - BA-REQ-MDS-TRUTH-001@1.0.0
  - ARCH-ADR-MDS-FOUND-009@1.0.0
  - PM-TSK-MDS-FOUND-009
tags: [foundation, lineage, approval, immutable, evidence]
links:
  - type: verifies
    target: PM-TSK-MDS-FOUND-009
---

# Immutable requirement lineage and approved-head transition evidence

## Delivered behavior

- New imported requirements are registered under
  `artifacts/lineages/<lineage-id>/versions/<semver>.md` and receive stable
  `lineage_id` / `<lineage_id>@<version>` identities.
- `lineage.json` owns the revision, effective lifecycle states, exactly one
  active approved head, content hashes, predecessor links, and human decision
  evidence.
- Approval no longer mutates the original requirement draft or a previously
  approved version. Successor approval atomically replaces the manifest,
  selects the successor, and effectively deprecates the former head.
- Human actor, reason, decision timestamp, version identity, prior head, and
  candidate hash remain in both the lineage transition and append-preserving
  project audit stream.
- Rejection preserves the candidate and leaves the approved head unchanged.
- Identical idempotent retries do not duplicate transitions/audit; mismatched
  reuse is rejected.
- Every authoritative version read checks the sealed SHA-256. Tampering fails
  closed as `CONFLICTED`.
- Active-project and lineage path validation prevents writes outside
  `MDS_DATA_DIR/projects/active/<project-id>/`.
- Prepared staging records can reconcile a committed manifest with a missing
  global audit append. Uncommitted records do not advance the head.

## Package boundaries

- Pure identities, states, manifest invariants, and transition construction:
  `packages/core/domain/src/lineage.ts`.
- Requirement lineage application/persistence seam:
  `packages/application/requirements/src/lineage.ts`.
- Import registration and compatibility review/impact flow remain application
  use cases. No renderer, managed-project source-code, Git, PR, or deployment
  write capability was introduced.
- SQLite remains unrelated rebuildable graph/query state and is not required to
  recover lineage authority.

## Acceptance evidence

| Acceptance criterion | Fresh evidence |
|---|---|
| Approved artifact is never edited in place for a material change | Lineage integration records original approved bytes, approves a successor, then proves the former bytes are unchanged. |
| Successor approval preserves history and leaves exactly one active head | Manifest assertions prove former `DEPRECATED`, successor `APPROVED`, and one `approvedHeadVersionId`. |
| Approval evidence identifies actor, reason, timestamp, and version | Transition and JSONL assertions retain all fields plus content hash and prior head. |

## Verification

Fresh on 2026-08-16, Asia/Bangkok, against the current dirty worktree:

```text
npm.cmd run test:lineage
→ exit 0
→ immutable versions, single head, evidence, rejection, idempotency, tamper and path checks passed

npm.cmd run test:requirements
→ exit 0
→ import, governed approval, audit, successor transition and impact-through-head passed

npm.cmd run test:ingestion
→ exit 0
→ preserved source, normalized content and registered DRAFT requirement passed

npm.cmd run smoke (after a fresh full build)
→ exit 0
→ bridge=true, root=true, graph=true, graphView=true
```

The completion verification also includes typecheck, build, workflow, graph,
graph-sqlite, Electron smoke, docs/structure/skills, board DAG, and diff checks.

## Residual risks and next scope

- The local filesystem cannot provide a transaction across manifest rename and
  JSONL append; staging/recovery makes the manifest the explicit commit point.
- Windows replacement includes a recoverable backup fallback when overwrite
  rename reports `EEXIST`; platform fault injection remains part of later
  hardening, not evidence for a packaged release.
- Locking currently rejects concurrent mutation instead of reclaiming a stale
  lock automatically. This fails closed and avoids agent-authored recovery.
- Legacy approved artifacts are not silently migrated or assumed `CURRENT`.
- Graph validity propagation and Current Project Truth remain explicitly scoped
  to FOUND-010 and FOUND-011.
