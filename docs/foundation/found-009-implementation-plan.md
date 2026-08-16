---
id: PM-TSK-MDS-FOUND-009-PLAN
title: Immutable lineage implementation readiness and test matrix
project: mds
phase: "05"
lifecycle_state: DRAFT
execution_state: BLOCKED
blocked_reason: Awaiting human approval of ARCH-ADR-MDS-FOUND-009@0.1.0
version: 0.1.0
owner: be_agent
created_by: codex
created_at: 2026-08-15
last_updated: 2026-08-15
source_refs:
  - BA-REQ-MDS-TRUTH-001@1.0.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - ARCH-ADR-MDS-FOUND-009@0.1.0
  - PM-TSK-MDS-FOUND-009
tags: [foundation, implementation-plan, lineage, test-matrix, blocked]
links:
  - type: implements
    target: PM-TSK-MDS-FOUND-009
  - type: depends_on
    target: ARCH-ADR-MDS-FOUND-009
---

# Immutable lineage implementation readiness and test matrix

## Activation gate

This is a reviewable execution proposal, not authorization to change runtime
code. Work starts only after the human architecture authority approves a
version of `ARCH-ADR-MDS-FOUND-009`. If another option is selected, this plan
must be revised before implementation.

## Deliverable

Migrate requirement approval from in-place Markdown mutation to one governed
vertical slice that:

```text
create/resolve lineage candidate
        → freeze reviewed bytes
        → record human decision
        → commit exactly one approved head
        → preserve prior version and evidence
        → recover or retry deterministically
```

The slice stops after requirement lineage/approval. Graph impact propagation,
Current Project Truth, desktop workflow UI, and context export remain in
`FOUND-010` through `FOUND-012`.

## Proposed implementation sequence after approval

### 1. Domain contract

- Add `ValidityState`, `LineageId`, `VersionId`, version record, manifest, and
  approval transition types under `packages/core/domain/`.
- Add pure invariant checks for SemVer uniqueness, same-lineage supersession,
  expected revision, one active head, decision evidence, and content hashes.
- Keep filesystem, Electron, SQLite, and wall-clock operations outside domain.

Exit signal: pure tests demonstrate valid initial approval, valid successor
approval, rejection, duplicate head rejection, and cross-lineage rejection.

### 2. Application ports and use cases

- Define a lineage repository port in `packages/application/`.
- Add narrow use cases to create/register a candidate, enter review, decide,
  load the current head, and recover an interrupted transition.
- Require caller-supplied actor, reason, decision, and idempotency key. The use
  case never substitutes AI/system approval.

Exit signal: use-case tests pass against an in-memory fake and expose no
provider-specific object.

### 3. Filesystem persistence adapter

- Implement the approved project-relative layout in
  `packages/infrastructure/persistence/`.
- Enforce the active-project root and validated lineage/version path segments.
- Implement same-directory staged writes, content sealing, exclusive lineage
  lock, manifest revision check, commit-point replacement, recovery, and
  idempotent audit reconciliation.
- Treat SQLite updates as post-commit projections that can be rebuilt.

Exit signal: filesystem fault-injection tests pass, including the supported
Windows/Node atomic-replacement check.

### 4. Requirement compatibility migration

- Route `reviewRequirement()` through the new use case without changing the
  managed-project boundary.
- Update ingestion to create/register a version candidate and return its
  lineage/version identity.
- Resolve approved requirement content through the lineage repository before
  deterministic impact analysis.
- Preserve legacy files and refuse ambiguous approved-head migration.

Exit signal: the existing ingestion/review/impact scenario passes with version
history and approved-head assertions added.

### 5. Verification and evidence

- Run the test matrix below plus typecheck, requirements integration, workflow
  regression, graph regression, documentation validation, and structure check.
- Record commands, timestamps, platform, runtime versions, injected crash
  points, observed files, hashes, and unresolved limitations in a new evidence
  artifact.
- Keep `FOUND-009` open if any acceptance criterion lacks fresh evidence.

## Test matrix

| ID | Scenario | Required assertion | Level |
|---|---|---|---|
| LIN-001 | Approve the first reviewed version | Manifest revision increments; one active approved head; actor/reason/time/hash retained | Domain + integration |
| LIN-002 | Approve a successor | New head selected; former head effectively deprecated; former bytes/hash unchanged | Integration |
| LIN-003 | Two draft successors | Both remain queryable; neither changes the approved head before human decision | Integration |
| LIN-004 | Reject a candidate | Head unchanged; candidate and rejection evidence retained | Domain + integration |
| LIN-005 | Retry committed transition | Same idempotency key/input returns the same result without duplicate evidence | Integration |
| LIN-006 | Reuse idempotency key with different input | Operation fails without state change | Domain + integration |
| LIN-007 | Stale manifest revision/concurrent decision | One decision commits; stale writer is rejected; never two heads | Integration |
| LIN-008 | Cross-lineage or missing predecessor | Validation rejects before persistent mutation | Domain |
| LIN-009 | Crash before candidate seal | Head/manifest unchanged; recovery is safe | Fault injection |
| LIN-010 | Crash after seal, before manifest commit | No head advance; orphan is diagnosed; no auto-approval | Fault injection |
| LIN-011 | Crash after manifest commit, before global audit append | Recovery recognizes commit and appends exactly one matching audit event | Fault injection |
| LIN-012 | Approved content tampered externally | Hash mismatch blocks authoritative read and surfaces conflict | Integration |
| LIN-013 | SQLite cache deleted | Lineage, head, versions, and evidence rebuild from authoritative files | Integration |
| LIN-014 | Project/path escape attempt | Request is rejected outside `MDS_DATA_DIR/projects/active/<project-id>/` | Security integration |
| LIN-015 | Unsupported/invalid manifest | Read fails closed with actionable evidence; no implicit `CURRENT` | Integration |
| LIN-016 | Windows atomic replacement | Repeated replacement never exposes partial JSON on the supported Node/Electron runtime | Platform integration |
| LIN-017 | Existing requirement review regression | Import, human approval, audit, and impact still work through lineage resolution | End-to-end integration |
| LIN-018 | Managed-project boundary | No source/test code, Git, PR, or deployment write capability is introduced | Static review |

## Planned verification commands

Commands may be refined after ADR approval, but the minimum suite is:

```powershell
npm.cmd run typecheck
npm.cmd run test:requirements
npm.cmd run test:workflow
npm.cmd run test:graph
npm.cmd run test:graph-sqlite
npm.cmd run validate:docs
npm.cmd run validate:structure
node skills/mds/mds-project-management/scripts/validate-task-links.mjs docs/foundation/delivery-board.json
node skills/mds/mds-project-management/scripts/detect-blocked-chain.mjs docs/foundation/delivery-board.json
```

The implementation should add a dedicated lineage integration command instead
of hiding fault-injection coverage inside an unrelated test.

## Rollback and recovery note

Before the first manifest commit, the old `reviewRequirement()` path remains
the operational baseline. Once a lineage transition commits, rollback means
disable the new entry point and read preserved history; it never means restore
an old file over the new version or erase approval evidence. Any compatibility
fallback must be read-only for already governed lineages.

## Risks and unverified items

- Same-directory atomic replacement on the supported Windows/Node/Electron
  runtime is not yet proven.
- Lock lease and stale-lock reclamation details need implementation review.
- Existing frontmatter consumers may infer lifecycle without reading the
  manifest; all such consumers have not yet been enumerated.
- The legacy single-file requirement migration policy has not been exercised
  against real runtime project data.
- No runtime code or test currently proves the proposed manifest contract.

## Completion rule

`FOUND-009` may move to `COMPLETED` only when every acceptance criterion on the
approved delivery board has fresh evidence, the approved ADR is linked, the
full task-level checks pass, and no failed atomicity/tamper test is waived by
the agent.

