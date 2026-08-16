---
id: PM-REL-MDS-FOUND-011
title: Current Project Truth and safe implementation context evidence
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
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - PM-TSK-MDS-FOUND-011
tags: [foundation, current-project-truth, context-package, authority, evidence]
links:
  - type: verifies
    target: PM-TSK-MDS-FOUND-011
---

# Current Project Truth and safe implementation context evidence

## Delivered behavior

`projectCurrentTruth()` deterministically classifies graph artifacts into:

- `AUTHORITATIVE`: approved lineage head + `CURRENT`;
- `WARNING`: approved lineage head + `NEEDS_REVIEW`;
- `EXCLUDED`: draft/review, stale, conflicted, deprecated, archived, or
  non-head artifacts; and
- `conflicts`: the subset requiring blocking review.

Every item carries ID, version/version ID, lifecycle, validity, source path,
source references and warnings. Missing validity is fail-closed as
`NEEDS_REVIEW`; it is never silently treated as current.

`buildImplementationContext()` emits a bounded package with an explicit
authority notice. Only authoritative items are instruction-eligible. Warning
items are included as non-binding context; excluded items are represented only
by a count. The package contains no source-code mutation capability.

The projection consumes graph/source artifacts and is rebuildable. It does not
depend on SQLite or mutate Markdown, lineage manifests, managed-project source,
tests, Git, PRs or deployment state.

## Fresh verification

```text
npm.cmd run test:truth
→ exit 0
→ deterministic authoritative/warning/excluded projection and safe context authority labels passed

npm.cmd run test:impact
→ exit 0
npm.cmd run test:lineage
→ exit 0
npm.cmd run test:requirements
→ exit 0
```

The truth fixture proves authoritative inclusion, warning-bearing review
context, stale/conflicted exclusion, version labels, source references, and
instruction eligibility boundaries.

## Residual scope

- FOUND-012 still owns desktop interactions and rendering of these DTOs.
- Current Project Truth is a deterministic projection, not a replacement for
  human approval or a new authoritative database.
