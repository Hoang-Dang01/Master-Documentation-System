# MDS artifact truth metadata schema

## Authority and scope

This schema is the machine-facing contract for
[`../standards/artifact_truth.md`](../standards/artifact_truth.md). The
standard owns semantics; this schema owns field shape and validation.

## Common metadata extension

```yaml
lineage_id: BA-REQ-EDU-AUTH-001
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
validity_state: CURRENT | NEEDS_REVIEW | STALE | CONFLICTED
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
version: X.Y.Z

validity_evidence:
  - artifact_id: BA-REQ-EDU-AUTH-001
    artifact_version: 2.0.0
    relationship_type: implements
    evidence_ref: analysis/impact-auth-change.md

links:
  - type: supersedes
    target: BA-REQ-EDU-AUTH-001
    target_version: 1.0.0
```

## Field constraints

| Field | Required | Constraint |
|---|---|---|
| `lineage_id` | Yes for versioned governed artifacts | Stable across one lineage; valid traceability ID |
| `validity_state` | Yes for governed project artifacts | One canonical uppercase enum |
| `validity_evidence` | Conditional | Required for `NEEDS_REVIEW`, `STALE`, and `CONFLICTED` |
| `links[type=supersedes]` | Conditional | Required on a successor; points to the immediate prior version |
| `version` | Yes | SemVer without lifecycle words in filename |

During migration, absence of `validity_state` must not be silently interpreted
as `CURRENT`. It is treated as `NEEDS_REVIEW` unless a deterministic
migration proves an approved current head with no unresolved impact.

## Cross-record invariants

Validators report or reject:

1. more than one active approved head in a lineage;
2. an approved successor without a human approval record;
3. a material edit to an approved stored version;
4. a `supersedes` self-link, missing predecessor, or cross-lineage target;
5. a warning validity state without evidence;
6. authoritative truth output containing an excluded state;
7. context output that omits authority labels; and
8. derived cache loss that prevents reconstruction from source artifacts.

## Effective lifecycle authority

For a lineage implemented under `ARCH-ADR-MDS-FOUND-009@1.0.0`, the immutable
Markdown version owns content and its sealed content hash. The structured
`lineage.json` manifest owns the effective lifecycle state and
`approved_head_version_id` used by runtime decisions.

Deprecating a former approved head therefore updates the manifest atomically;
it does not rewrite the former approved Markdown bytes. A historical
frontmatter lifecycle value records the state at which that version was sealed
and must not be interpreted as the current head without resolving its manifest.

Manifest and content are one authoritative pair. A missing version file,
content-hash mismatch, invalid predecessor, or manifest with multiple approved
heads is `CONFLICTED` for authoritative reads and blocks approval until a human
reviews recovery evidence.

## Transition contract

```text
New artifact:
  DRAFT + CURRENT

Possible downstream impact:
  CURRENT → NEEDS_REVIEW

Qualified review:
  NEEDS_REVIEW → CURRENT | STALE | CONFLICTED

Resolved conflict or refreshed specification:
  create/review/approve a new version;
  do not rewrite historical approved content
```

AI may generate a transition proposal. Approval, conflict resolution, and
replacement of approved content remain human-gated.
