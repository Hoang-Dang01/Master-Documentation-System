---
id: BA-REQ-MDS-TRUTH-001
title: Artifact truth, validity and lineage model
project: mds
phase: "02"
lifecycle_state: APPROVED
execution_state: NOT_APPLICABLE
version: 1.0.0
owner: ba_agent
created_by: codex
created_at: 2026-08-14
last_updated: 2026-08-14
approved_by: human-project-authority
approved_at: 2026-08-14
approval_reason: User explicitly accepted MDS operating by this method.
source_refs:
  - BA-REQ-MDS-FOUND-001
  - mds-core/standards/document_standards.md
  - mds-core/standards/versioning_rules.md
tags: [foundation, project-truth, lifecycle, validity, lineage]
links:
  - type: elaborates
    target: BA-REQ-MDS-FOUND-001
---

# Artifact truth, validity and lineage model

## Goal

Give MDS an unambiguous, machine-testable answer to four different questions:

1. How mature and authoritative is this artifact?
2. Is its content still trustworthy after surrounding knowledge changed?
3. What is the operational progress associated with it?
4. Which version in its lineage is currently authoritative?

One overloaded `status` field cannot answer all four questions.

## Proposed state axes

### Lifecycle state

Lifecycle remains the existing canonical maturity and approval axis:

```text
DRAFT → REVIEW → APPROVED → DEPRECATED → ARCHIVED
```

- `DRAFT`: editable proposal; never authoritative.
- `REVIEW`: frozen review candidate awaiting an authorized decision.
- `APPROVED`: content was accepted by the relevant human authority.
- `DEPRECATED`: read-only content replaced or retired from active use.
- `ARCHIVED`: read-only historical content excluded from active decisions.

### Validity state

Validity is a proposed new axis and is not canonical until approved and merged
into `mds-core/standards/`:

```text
CURRENT | NEEDS_REVIEW | STALE | CONFLICTED
```

- `CURRENT`: no known governed change invalidates the artifact.
- `NEEDS_REVIEW`: an upstream change or new evidence may affect it; a qualified
  reviewer must assess it.
- `STALE`: it is known not to reflect the current approved upstream state and
  must not be used as authoritative context.
- `CONFLICTED`: two or more authoritative/evidentiary claims disagree and no
  authorized resolution has been recorded.

Validity is evidence-backed. AI may propose a validity transition and identify
the evidence, but it may not silently resolve `CONFLICTED` or restore
`CURRENT` where a human decision is required.

### Execution state

Execution remains the existing operational progress axis:

```text
NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
```

Execution does not grant authority. For example, an implementation may be
`COMPLETED` while its approved API specification is `NEEDS_REVIEW`.

## Lineage model

Every versioned artifact must have a stable lineage identity distinct from the
version artifact ID or storage path. The exact identifier representation is an
architecture decision for the implementation slice; the behavioral rules are:

1. approved content is read-only;
2. a material change creates a new `DRAFT` version;
3. the new version retains a source/change reference and links to the prior
   version through `supersedes`;
4. approval of the new version deprecates the former approved head in the same
   atomic governed operation;
5. at most one approved active head exists in one lineage; and
6. prior versions and approval evidence remain queryable for history and
   rollback analysis.

`supersedes` is a relationship, not a lifecycle state.

## Project State versus Current Project Truth

Project State is the complete observable state of every artifact, including
drafts, review candidates, stale content, conflicts, deprecated history, and
archived history.

Current Project Truth is a governed projection used for decisions and bounded
implementation context. It is not a folder and is not the graph cache.

### Proposed projection rules

| Artifact condition | Truth treatment |
|---|---|
| Approved lineage head + `CURRENT` | Include as authoritative |
| Approved lineage head + `NEEDS_REVIEW` | Include only with a prominent review warning; block dependent binding decisions when policy requires |
| `DRAFT` or `REVIEW` | Exclude from authoritative truth; optional labeled reference |
| `STALE` | Exclude from authoritative context; include in remediation/warning views |
| `CONFLICTED` | Exclude from authoritative context and raise a blocking conflict where applicable |
| `DEPRECATED` or `ARCHIVED` | Exclude from current truth; retain for history/rollback analysis |

Context packages must render each included item with its artifact ID, version,
lifecycle, validity, source references, and unresolved warnings.

## Change propagation

When a new upstream version becomes approved, MDS traverses governed graph
relationships and produces an impact proposal:

```text
Changed approved upstream artifact
        ↓
Evidence-backed affected-artifact set
        ↓
Policy classifies review consequence
        ↓
Validity transition proposal
        ↓
Human/rule gate where required
        ↓
Audit event + refreshed truth projection
```

The first implementation slice should support deterministic
`CURRENT → NEEDS_REVIEW` propagation. Automatic promotion to `STALE` should be
limited to explicitly approved rules where incompatibility is deterministic;
otherwise it remains a review decision.

## Approval and history invariants

- AI and automation cannot create an authoritative approval decision.
- Approval records identify artifact version, actor, timestamp, reason, and
  source evidence.
- Rejection returns a review candidate to an editable draft without erasing the
  rejection event.
- Content and approval history are append-preserving; audit events alone are
  not a substitute for version snapshots.
- A derived index may be deleted and rebuilt without losing project truth.
- A context package cannot label draft, stale, conflicted, deprecated, or
  archived content as authoritative.

## Acceptance criteria for approval

1. Lifecycle, validity, execution, and lineage are accepted as separate
   concepts.
2. The four validity values and their semantics are accepted.
3. The single approved active head invariant is accepted.
4. The proposed Current Project Truth inclusion/warning/exclusion rules are
   accepted.
5. The initial impact transition is limited to evidence-backed
   `NEEDS_REVIEW`; stricter transitions require explicit policy.
6. Version snapshots and approval evidence are retained without overwriting
   prior approved content.

## Approval record

The human project authority approved this truth model on 2026-08-14 as part of
the accepted MDS operating method.

The model now authorizes a versioned canonical migration. It does not permit
direct mutation of previously approved standards or implementation before the
corresponding replacement/design and backlog gates are satisfied.
