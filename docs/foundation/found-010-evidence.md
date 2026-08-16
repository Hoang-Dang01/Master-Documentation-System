---
id: PM-REL-MDS-FOUND-010
title: Evidence-backed graph impact and validity proposals
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
  - BA-REQ-MDS-KG-001@0.1.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - ARCH-ADR-MDS-KG-001@0.1.0
  - PM-TSK-MDS-FOUND-010
tags: [foundation, impact, graph, validity, needs-review, evidence]
links:
  - type: verifies
    target: PM-TSK-MDS-FOUND-010
---

# Evidence-backed graph impact and validity proposals

## Delivered behavior

`traverseImpact()` now consumes the deterministic graph projection and traverses
governed lineage in the semantically correct direction: an upstream changed
requirement reaches downstream API/DB/UI/task/test artifacts through reverse
declared links such as `implements`, `produces`, `elaborates`, `verifies`, and
`depends_on`. Every path retains edge evidence and source references.

The result contains:

- source artifact and version;
- complete deterministic impact paths;
- affected artifact IDs, versions, source paths, lifecycle and validity;
- proposals limited to `CURRENT → NEEDS_REVIEW`; and
- a stable report ID derived from graph run, source and paths.

Existing `NEEDS_REVIEW`, `STALE`, or `CONFLICTED` artifacts are not overwritten,
and unrelated artifacts are not included in proposals. The use case only
returns proposals; it does not silently mutate project artifacts or approve a
validity transition.

## Package boundary

- Traversal and proposal policy: `packages/application/requirements/src/impact.ts`.
- Graph parser/index remains the governed derived projection in `graph.ts`.
- Domain graph DTOs remain type-only; no renderer or SQLite authority was added.

## Fresh verification

```text
npm.cmd run test:impact
→ exit 0
→ governed reverse-lineage traversal, complete evidence paths, NEEDS_REVIEW-only proposals, and unrelated validity preservation passed

npm.cmd run test:graph
→ exit 0
→ deterministic graph parser/index and known EduMeet broken-reference evidence passed

npm.cmd run test:graph-sqlite
→ exit 0
→ derived SQLite projection rebuild equivalence passed
```

The synthetic impact fixture proves `REQ → API → DB` traversal, reverse
`implements`/`verifies` interpretation, evidence retention, and exclusion of a
pre-existing `NEEDS_REVIEW` test from automatic proposals.

## Residual scope

- FOUND-010 emits proposals; FOUND-011 owns durable Current Project Truth and
  context projection.
- The current keyword report compatibility path remains available for the
  existing review UI until FOUND-012 wires the graph proposal DTO into desktop.
- No `STALE`, `CONFLICTED`, `CURRENT` restoration, source-code mutation, Git
  write, or automatic human decision is performed.
