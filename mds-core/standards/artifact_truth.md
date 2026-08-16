# MDS artifact truth and lineage standard

## Authority

This standard is canonical for artifact validity, version lineage, and Current
Project Truth. It implements the human-approved artifacts
`BA-REQ-MDS-FOUND-001@1.0.0`, `BA-REQ-MDS-TRUTH-001@1.0.0`, and
`ARCH-ADR-MDS-FOUND-001@1.0.0`.

`document_standards.md` remains authoritative for naming, lifecycle,
execution state, and relationship vocabulary. This file adds orthogonal truth
rules without redefining those concerns.

## State separation

| Axis | Question | Canonical values |
|---|---|---|
| Lifecycle | Has this content been reviewed and approved? | `DRAFT`, `REVIEW`, `APPROVED`, `DEPRECATED`, `ARCHIVED` |
| Validity | Is it still trustworthy against current upstream knowledge? | `CURRENT`, `NEEDS_REVIEW`, `STALE`, `CONFLICTED` |
| Execution | What is the operational progress? | `NOT_STARTED`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`, `NOT_APPLICABLE` |
| Lineage | Which immutable version succeeds which prior version? | stable `lineage_id` plus `supersedes` |

No axis implies another. `APPROVED` does not imply `CURRENT`, and
`COMPLETED` does not imply authoritative content.

## Validity semantics

- `CURRENT`: no known governed change or accepted evidence invalidates the
  artifact.
- `NEEDS_REVIEW`: a traceable upstream change or new evidence may affect it.
- `STALE`: it is known not to represent current approved upstream state and
  must not be used as authoritative context.
- `CONFLICTED`: authoritative or evidentiary claims disagree without an
  authorized resolution.

Validity changes require evidence references. AI may propose a value and
rationale. AI may not silently resolve `CONFLICTED`, restore `CURRENT`, or
make a binding decision reserved for a human gate.

## Version lineage invariants

1. An approved artifact version is read-only.
2. A material change creates a new `DRAFT` version in the same lineage.
3. Each version carries a stable `lineage_id`; a successor declares
   `supersedes` to its immediate predecessor.
4. Human approval of a successor and deprecation of the former approved head
   are one governed transition.
5. At most one non-deprecated `APPROVED` head exists per lineage.
6. Prior versions, source references, approval decisions, and change rationale
   remain queryable.
7. Rejection never erases the candidate or decision evidence.

`supersedes` is a relationship, not a lifecycle or validity state.

## Project State and Current Project Truth

Project State contains all observable artifacts and issues, including drafts,
warnings, conflicts, and history.

Current Project Truth is a deterministic governed projection:

| Condition | Truth treatment |
|---|---|
| Approved lineage head + `CURRENT` | Include as authoritative |
| Approved lineage head + `NEEDS_REVIEW` | Include only with a prominent warning; workflow policy may block binding decisions |
| `DRAFT` or `REVIEW` | Exclude from authoritative truth; may appear as labeled reference |
| `STALE` | Exclude from authoritative context; include in remediation views |
| `CONFLICTED` | Exclude from authoritative context; expose a blocking conflict where applicable |
| `DEPRECATED` or `ARCHIVED` | Exclude from current truth; retain for history and rollback analysis |

The projection is not a folder, renderer view, or database cache. Markdown and
structured runtime artifacts remain authoritative inputs. SQLite and Knowledge
Graph indexes are rebuildable derived state.

## Change propagation

When a new upstream version becomes approved:

1. traverse only governed, evidence-backed graph relationships;
2. retain the complete impact path and source evidence;
3. propose downstream validity consequences;
4. apply `CURRENT → NEEDS_REVIEW` for an evidence-backed possible impact;
5. apply `STALE` or `CONFLICTED` automatically only when separately approved
   deterministic policy proves the stronger state; and
6. append audit evidence and refresh derived projections.

Unrelated artifacts must not change.

## Context-package safety

Every context item includes artifact ID, version, lifecycle, validity, source
references, and unresolved warnings.

- Only approved `CURRENT` heads are authoritative instructions.
- `NEEDS_REVIEW` content is warning-bearing context.
- Draft, review, stale, conflicted, deprecated, and archived content must never
  be presented as authoritative.
- A context package is a handoff to the external Implementation Plane. It does
  not authorize MDS to modify managed-project source code.

