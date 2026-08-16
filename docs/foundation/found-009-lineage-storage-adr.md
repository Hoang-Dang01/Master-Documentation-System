---
id: ARCH-ADR-MDS-FOUND-009
title: Store immutable artifact versions with an authoritative lineage manifest
project: mds
phase: "03"
lifecycle_state: APPROVED
execution_state: NOT_APPLICABLE
decision_status: ACCEPTED
version: 1.0.0
owner: arch_agent
created_by: codex
created_at: 2026-08-15
last_updated: 2026-08-16
approved_by: human-project-authority
approved_at: 2026-08-16
approval_reason: User approved continuing through the goal after Option A was presented as the sole architecture gate.
source_refs:
  - BA-REQ-MDS-TRUTH-001@1.0.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - PM-TSK-MDS-FOUND-009
  - mds-core/standards/artifact_truth.md
  - mds-core/schemas/artifact_truth_schema.md
tags: [foundation, adr, lineage, immutable-versions, approval]
links:
  - type: implements
    target: BA-REQ-MDS-TRUTH-001
  - type: depends_on
    target: ARCH-ADR-MDS-FOUND-001
---

# Store immutable artifact versions with an authoritative lineage manifest

## Approval record

The human project authority accepted Option A on 2026-08-16 by instructing MDS
to continue through the goal after the Option A architecture gate was
presented. This approval authorizes the bounded FOUND-009 implementation; it
does not approve a release or later FOUND-010 through FOUND-012 scope.

## Context

The approved artifact truth model requires MDS to preserve every approved
version, create material changes as new drafts, and leave exactly one active
approved head in each lineage. The current `reviewRequirement()` use case edits
the reviewed Markdown file in place and appends a separate audit event. It does
not store a stable lineage, immutable version seal, approved-head pointer, or a
recoverable multi-record transition.

The storage design must also preserve the approved architecture constraints:

- runtime data lives below `MDS_DATA_DIR/projects/active/<project-id>/`;
- Markdown and structured files remain authoritative;
- SQLite is a rebuildable query/index projection; and
- approval stays human-gated and retains actor, reason, timestamp, and source
  evidence.

## Decision drivers

- Approved content must be tamper-evident and never rewritten for a material
  change.
- One governed operation must select the successor and deprecate the previous
  active head.
- A crash or retry must not produce two active heads or lose approval evidence.
- History must remain understandable without SQLite or Git.
- The representation must work on the local Windows-first Electron runtime.
- The first slice should not require migrating every artifact type at once.

## Options

### A — Immutable Markdown versions plus a structured lineage manifest

Store each version as a separate Markdown file. Store stable lineage identity,
the active approved head, version hashes, effective states, and transition
evidence in one structured manifest per lineage. Treat SQLite and the global
audit stream as rebuildable projections of these authoritative files.

Benefits:

- preserves readable, portable project artifacts;
- makes content history independent of Git and SQLite;
- gives one small manifest as the atomic approved-head commit point; and
- fits the approved storage and control-plane boundaries.

Costs:

- requires a transaction/recovery protocol around filesystem operations;
- requires consumers to resolve current state through the manifest instead of
  inferring authority from a Markdown file alone; and
- requires a narrow migration from the current in-place requirement layout.

### B — SQLite as the authoritative lineage and content store

Store content blobs, version rows, the approved head, and approval records in a
database transaction. Markdown becomes an export or view.

Benefits:

- real multi-row transactions and straightforward concurrency control; and
- efficient queries.

Costs:

- conflicts with the approved rule that structured project artifacts remain
  authoritative and SQLite is rebuildable derived state;
- makes history less portable and less inspectable without MDS; and
- raises recovery and migration risk for a local-first project.

### C — Git history or in-place Markdown as version history

Continue editing the artifact file and use Git commits, backup copies, or audit
events to reconstruct prior state.

Benefits:

- smallest immediate code change.

Costs:

- cannot enforce immutable approved versions or one active head reliably;
- makes MDS correctness depend on an optional external repository workflow;
- cannot make file mutation and audit append one governed operation; and
- does not satisfy the approved truth model.

## Decision

Select **Option A**.

### Authority split

The authoritative record for one lineage is the pair:

1. immutable/sealed Markdown version files, which own artifact content and
   content-level metadata; and
2. `lineage.json`, which owns stable identity, effective lifecycle state,
   active approved head, content hashes, and approval transition evidence.

SQLite may index that pair, but deleting SQLite must not remove knowledge or
prevent a full rebuild. `audit/events.jsonl` remains append-preserving and is a
project-wide event view; the transition evidence stored in `lineage.json` is
the recovery source if a crash occurs before the global audit append.

### Runtime layout

The first implementation slice uses the following project-relative structure:

```text
artifacts/
  lineages/
    <lineage-id>/
      lineage.json
      versions/
        <semver>.md
      staging/
        <transition-id>.json
audit/
  events.jsonl
```

`<lineage-id>` is validated before it becomes a path segment. A title or user
provided relative path never controls the lineage directory. Temporary files
must remain within the same lineage directory so the final rename does not
cross filesystems.

The repository `workspace/` tree remains a fixture. Production callers must
resolve the project root through the Electron main process or explicit
`MDS_DATA_DIR` configuration.

### Identity contract

- `lineage_id` is stable for the conceptual artifact, for example
  `BA-REQ-EDU-AUTH-001`.
- `version` is SemVer and unique inside that lineage.
- `version_id` is the composite `<lineage_id>@<version>` and identifies exactly
  one stored version.
- Existing `id` may equal `lineage_id` during migration, but consumers must use
  `version_id` when they mean a particular version.
- `supersedes` points to the immediate predecessor `version_id` in the same
  lineage. Branching successors may exist as drafts, but only one may become
  the active approved head.

### Minimum manifest contract

The implementation may use JSON because the runtime already consumes JSON and
JSONL deterministically. Field names and invariants are normative; formatting
is not.

```json
{
  "schema_version": "1.0.0",
  "lineage_id": "BA-REQ-EDU-AUTH-001",
  "artifact_type": "REQ",
  "revision": 2,
  "approved_head_version_id": "BA-REQ-EDU-AUTH-001@1.1.0",
  "versions": {
    "BA-REQ-EDU-AUTH-001@1.0.0": {
      "version": "1.0.0",
      "relative_path": "versions/1.0.0.md",
      "content_sha256": "<lowercase-sha256>",
      "effective_lifecycle_state": "DEPRECATED",
      "supersedes": null
    },
    "BA-REQ-EDU-AUTH-001@1.1.0": {
      "version": "1.1.0",
      "relative_path": "versions/1.1.0.md",
      "content_sha256": "<lowercase-sha256>",
      "effective_lifecycle_state": "APPROVED",
      "supersedes": "BA-REQ-EDU-AUTH-001@1.0.0"
    }
  },
  "transitions": [
    {
      "transition_id": "<idempotency-key>",
      "decision": "APPROVED",
      "actor": "human-project-authority",
      "reason": "<non-empty reason>",
      "decided_at": "<ISO-8601 timestamp>",
      "from_head": "BA-REQ-EDU-AUTH-001@1.0.0",
      "to_head": "BA-REQ-EDU-AUTH-001@1.1.0",
      "candidate_sha256": "<lowercase-sha256>"
    }
  ]
}
```

The final schema must reject unknown or inconsistent version references,
duplicate SemVer values, a cross-lineage `supersedes`, a missing content file,
a hash mismatch, and more than one effective active approved head.

### Effective lifecycle and immutable content

A candidate Markdown file may change while it is `DRAFT`. Entering `REVIEW`
freezes the reviewed bytes and records their hash. Approval seals the final
version bytes and then makes the manifest transition authoritative. After the
manifest references an approved version hash, application write use cases must
refuse to alter those bytes.

The previous approved Markdown file is never edited just to write
`DEPRECATED`. Its effective lifecycle changes in the atomic manifest. Readers
must therefore resolve current authority through `lineage.json`; a historical
frontmatter value records the version's state when sealed and is not an active
head pointer. Rendered views may display `DEPRECATED` from the manifest without
rewriting the historical file.

This distinction requires a small follow-up clarification in the machine-facing
artifact truth schema when this ADR is approved. It must not be implemented by
silently changing canonical semantics.

## Approved-head transition protocol

The filesystem does not provide a portable transaction across the version
file, manifest, and global JSONL audit stream. The adapter therefore uses one
manifest replacement as the commit point:

1. Acquire an exclusive per-lineage lock and record a bounded lock owner/lease.
2. Load `lineage.json`, validate its revision, current head, candidate state,
   `supersedes`, human actor/reason, and content hash.
3. Reject a reused `transition_id` with different input. Return the prior result
   for an identical committed transition.
4. Write and sync the sealed candidate bytes to a same-directory temporary
   file, then rename them to the final version path. A pre-existing final path
   must match the expected hash; it is never overwritten with different bytes.
5. Write a `PREPARED` staging record containing expected manifest revision,
   old/new heads, hashes, and decision evidence.
6. Build the next complete manifest: increment `revision`, mark the prior head
   effectively `DEPRECATED`, mark the candidate effectively `APPROVED`, select
   it as `approved_head_version_id`, and include the transition evidence.
7. Write and sync the next manifest in the lineage directory, then atomically
   rename it over `lineage.json`. This rename is the commit point.
8. Append the project-wide audit event with the same `transition_id` and remove
   or mark the staging record recovered.
9. Release the lock and rebuild derived SQLite/graph projections as a separate,
   retryable operation.

Before implementation, the adapter test suite must prove that same-directory
replacement behaves atomically on the supported Windows/Node runtime. A failed
platform check blocks the slice and requires a revised commit-point design.

### Recovery and idempotency

On project open or before the next lineage mutation, recovery inspects staging
records:

- If the manifest does not contain `transition_id`, the operation is
  uncommitted. Keep any sealed orphan for diagnosis or remove it only through a
  separately verified cleanup policy; do not advance the head.
- If the manifest contains `transition_id`, the transition committed. Ensure
  the matching audit event exists, append it if missing, and finalize staging.
- If the manifest references missing or hash-mismatched content, mark the
  lineage `CONFLICTED` for reads and block further approval. Do not invent or
  repair content automatically.
- Retrying the same input and `transition_id` returns the committed outcome.
  Reusing the ID with different actor, decision, candidate, or hash is an error.

Rejection also records immutable decision evidence but does not change the
approved head or erase the candidate version.

## Application and package boundaries

- `packages/core/domain/` owns lineage identities, invariants, transition
  validation, and result types without filesystem imports.
- `packages/application/` owns create-version, submit-for-review, decide, load,
  and recovery use cases through a lineage repository port.
- `packages/infrastructure/persistence/` owns the filesystem adapter, atomic
  replacement, locks, recovery journal, and derived SQLite projection.
- `apps/desktop/` only calls typed application APIs through preload; it does
  not interpret manifests or touch project files directly.

## Migration of the current requirement review

The first vertical migration is requirement approval only:

1. New imported requirements receive `lineage_id`, `version_id`, and a lineage
   manifest under the runtime project root.
2. `reviewRequirement()` becomes a compatibility boundary over the governed
   decision use case; it no longer performs an in-place approval write.
3. Existing single-file requirements are registered as a candidate version
   without assuming `CURRENT`. Existing approved files require explicit
   migration evidence before becoming an approved head.
4. Impact analysis resolves the approved version through the manifest.
5. Other artifact types remain unchanged until their own vertical migration.

No migration overwrites or deletes existing approved/source artifacts.

## Consequences

Positive:

- the approved-head invariant has one authoritative commit point;
- history remains readable and reconstructable without SQLite;
- retries and post-crash recovery can be deterministic; and
- the design is reusable by impact, Current Project Truth, and context export.

Costs and residual risks:

- filesystem atomicity and lock recovery need platform-specific proof;
- manifest growth is acceptable for the first slice but may later require a
  separately approved compaction policy;
- old consumers that read Markdown lifecycle metadata directly must migrate;
- backup/sync tools observing mid-transition files need documented behavior;
  and
- external editors can still mutate files, so every authoritative read must
  verify the sealed hash and surface conflict rather than trusting permissions.

## Rejected shortcuts

- Do not use SQLite as the only source of truth.
- Do not treat Git commits as the lineage database.
- Do not overwrite an approved version to mark it deprecated.
- Do not update the manifest head before the sealed candidate exists.
- Do not auto-repair a hash mismatch or auto-approve a recovered candidate.
- Do not present a derived cache as approval evidence.

## Decision authority

The approved scope includes the identity contract, runtime layout, manifest as
approved-head authority, and manifest replacement as the commit point. Any
material change to those choices requires a new ADR version and human approval.
