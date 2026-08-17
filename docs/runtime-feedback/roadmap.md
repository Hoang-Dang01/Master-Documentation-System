---
id: PM-REL-MDS-FEEDBACK-001
title: Runtime Feedback Verification roadmap
project: mds
lifecycle_state: DRAFT
execution_state: NOT_APPLICABLE
version: 0.1.0
owner: PM
created_at: 2026-08-17
source_refs:
  - BA-REQ-MDS-FEEDBACK-001@0.1.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
---

# Runtime Feedback Verification roadmap

## Outcome

Close the read-only feedback loop between MDS and the external Implementation
Plane while preserving the approved control-plane boundary.

## Priority decision

- Commitment framework: MoSCoW.
- Execution order: risk-first followed by hard dependencies.
- `MUST`: evidence contract/security, immutable import, correlation, findings,
  human review, proving slice.
- `SHOULD`: desktop evidence inspector and filtered history.
- `COULD`: provider-specific exporters after one generic bundle works.
- `WON'T` in this milestone: autonomous coding, Git writes, test execution,
  deployment and AI verdicts.

The evidence contract and fail-closed path/checksum rules come first because an
ambiguous or unsafe evidence boundary would invalidate every later finding.

## Releases

| Release | Outcome | Scope/REQ links | Exit evidence | Approval |
|---|---|---|---|---|
| RF0 — Contract gate | Human-approved evidence bundle, finding and authority contract | BA-REQ-MDS-FEEDBACK-001 | Approved requirement and ADR, security examples | DRAFT |
| RF1 — Read-only evidence intake | Valid bundles are preserved, invalid bundles fail closed, source remains unchanged | BA-REQ-MDS-FEEDBACK-001 | Integration/security tests and audit evidence | DRAFT |
| RF2 — Verification feedback | Evidence maps to truth/context and creates reviewable findings | BA-REQ-MDS-FEEDBACK-001 | Application and desktop tests | DRAFT |
| RF3 — Proving slice | One external implementation result completes the read-only feedback loop | BA-REQ-MDS-FEEDBACK-001 | Fresh DoD and human release decision | DRAFT |

## Dependency map

```text
Scope/requirement approval
  -> evidence/finding ADR approval
  -> immutable evidence intake
  -> truth/context correlation
  -> deterministic finding projection
  -> desktop review surface
  -> fresh Definition of Done evidence
```

## Capacity and assumptions

- Effort estimate: 30 relative points across 8 vertical tasks.
- Runtime data remains below `MDS_DATA_DIR/projects/active/<project-id>/`.
- Existing Foundation APIs remain compatible; any breaking change requires a
  separate human architecture gate.
- Confidence: medium until a real Implementation Plane evidence sample exists.

## Decisions required

- [x] Scope and requirement approval — human project authority, 2026-08-17.
- [ ] Evidence bundle/finding ADR approval — human architect.
- [ ] Executable backlog approval — human PM/project authority.
- [ ] Milestone release approval — human release authority.
