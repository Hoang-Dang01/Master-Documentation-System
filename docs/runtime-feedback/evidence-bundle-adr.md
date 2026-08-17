---
id: ARCH-ADR-MDS-FEEDBACK-001
title: Immutable external evidence bundle and verification finding storage
project: mds
phase: "03"
lifecycle_state: APPROVED
execution_state: NOT_APPLICABLE
decision_status: ACCEPTED
version: 0.1.0
owner: arch_agent
created_by: codex
created_at: 2026-08-17
last_updated: 2026-08-17
approved_at: 2026-08-17
approved_by: human-architect
approval_reason: User authorized continuing with the recommended Option A architecture.
tags: [adr, evidence, feedback, security, local-first]
source_refs:
  - BA-REQ-MDS-FEEDBACK-001@0.1.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - ARCH-ADR-MDS-FOUND-009@1.0.0
links:
  - type: implements
    target: BA-REQ-MDS-FEEDBACK-001
  - type: depends_on
    target: ARCH-ADR-MDS-FOUND-001
---

# ADR: Immutable external evidence bundle and verification finding storage

## Decision summary

Accepted choice: **Option A — signed-envelope-shaped JSON manifest plus
content-addressed immutable files under the MDS runtime project**.

The first version does not require public-key signatures. It reserves signature
metadata, verifies SHA-256 for every declared file, preserves the submitted
manifest bytes, and binds the bundle to a project, producer, context package,
artifact versions and commit/build identity. Findings are separate immutable
`DRAFT` records derived from accepted evidence.

## Context

Foundation v1 ends at a bounded context package. MDS now needs a safe way to
receive proof from an external Implementation Plane without opening filesystem,
Git, test-execution or deployment authority. A plain status message is
insufficient; evidence must remain inspectable, replayable and correlated to
the exact approved truth used for implementation.

## Constraints and decision drivers

1. Runtime data stays below `MDS_DATA_DIR/projects/active/<project-id>/`.
2. Managed-project source/test paths are read-only and are never import targets.
3. Every conclusion retains source identity, content hashes and version links.
4. Tamper, traversal, oversize, stale context and identity mismatch fail closed.
5. Import replay must be idempotent.
6. Files remain authoritative evidence; SQLite may index but never replace them.
7. AI output and verification findings start `DRAFT`.

## Options

### Option A — immutable filesystem envelope and content-addressed files

Layout:

```text
projects/active/<project-id>/
  evidence/
    bundles/<bundle-id>/
      submitted-manifest.json
      manifest.json
      files/<sha256>
      audit.jsonl
    findings/<finding-id>/
      finding.json
```

Benefits: inspectable, backup-friendly, consistent with approved lineage,
recoverable without SQLite, deterministic hash verification. Costs: atomic
multi-file import and cleanup require staging/lock/recovery behavior.

### Option B — SQLite manifest/blob metadata with optional filesystem payloads

Benefits: transactional queries and compact indexing. Costs: harder manual
inspection, database becomes too close to evidence authority, binary backup and
recovery are less transparent, and this conflicts with the rebuildable-cache
policy unless filesystem copies remain canonical.

### Option C — reference external paths without importing bytes

Benefits: minimal storage. Costs: evidence can disappear or change, paths can
escape the managed boundary, replay is unreliable, and conclusions cannot prove
which bytes were reviewed. Rejected for trusted findings.

## Decision matrix

| Driver | Weight | Option A | Option B | Option C |
|---|---:|---:|---:|---:|
| Tamper/replay safety | 30% | 9 | 8 | 3 |
| Human inspectability/recovery | 25% | 9 | 5 | 4 |
| Alignment with canonical storage policy | 20% | 9 | 6 | 3 |
| Query/runtime simplicity | 15% | 6 | 9 | 8 |
| Future signature/provider compatibility | 10% | 8 | 8 | 5 |
| Weighted result | 100% | **8.35** | 6.85 | 4.15 |

## Proposed contract

### Submitted manifest

Required fields:

```yaml
schema_version: 1.0.0
bundle_id: IMP-EVD-<PROJECT>-<ULID>
project_id: <project-id>
producer:
  type: codex | developer | ci | other
  id: <non-secret stable identifier>
produced_at: <RFC3339 UTC>
source_identity:
  repository: <logical repository id>
  commit: <full immutable commit/build identity>
context_package_id: <MDS context package id>
artifact_version_ids: [<lineage-id>@<semver>]
results:
  - kind: test | build | diff | static-analysis | other
    status: PASSED | FAILED | NOT_RUN | INCOMPLETE
    command_label: <descriptive label, not executable authority>
    evidence_file: <relative path inside submitted bundle>
files:
  - path: <normalized relative path>
    sha256: <64 lowercase hex>
    size: <bytes>
signature:
  algorithm: none | ed25519
  key_id: <optional>
  value: <optional>
```

Unknown required enums, duplicate normalized paths, absolute paths, `..`, links,
devices, archives, excessive count/size, hash mismatch and undeclared bytes are
rejected. Initial bounds are versioned constants: 100 files, 25 MiB per file,
100 MiB total, and 1 MiB manifest.

### Identity and freshness

- `bundle_id` is the idempotency key; the same ID and manifest hash replays the
  prior accepted result, while the same ID with different bytes is rejected.
- `project_id` must equal the selected runtime project.
- `context_package_id` must resolve to a known bounded package.
- every artifact version must exist in that package or its explicitly allowed
  warning set;
- producer time cannot by itself establish freshness. The supplied commit/build
  identity is compared with the expected identity recorded for the handoff;
- absence or mismatch yields an untrusted/review finding, never a pass.

### Atomic import and recovery

1. Validate request paths and size before copying.
2. Copy submitted bytes to a project-local staging directory.
3. Hash and compare every byte; reject symlinks/reparse points.
4. Write normalized manifest and audit preparation record.
5. Atomically rename staging to `bundles/<bundle-id>`.
6. On replay/recovery, compare manifest hash and return the existing record.
7. Failed staging remains non-authoritative and is safely recoverable/cleanable.

### Findings

A deterministic projector emits separate `DRAFT` findings:

```yaml
finding_id: QA-FND-<PROJECT>-<ULID>
bundle_id: <bundle-id>
classification: PASS_EVIDENCE | FAILED_CHECK | MISSING_EVIDENCE | STALE_IDENTITY | MISMATCH
severity: INFO | WARNING | BLOCKER
lifecycle_state: DRAFT
artifact_version_ids: []
source_refs: []
reason_code: <stable enum>
```

`PASS_EVIDENCE` means only that the declared evidence validated. It does not
approve a requirement, restore `CURRENT`, accept a release or authorize deploy.
A human decision produces a separate audit transition; the original finding is
not overwritten.

## Consequences

Positive:

- bytes and conclusions remain replayable and independently inspectable;
- SQLite can be rebuilt from canonical files;
- provider-specific exporters can target one generic contract;
- the control-plane boundary remains explicit.

Negative:

- local disk usage increases;
- staging, locks and recovery require platform tests;
- unsigned v1 bundles prove integrity after import, not producer authenticity;
- a real Codex/developer/CI sample may require a versioned schema successor.

## Security and validation plan

- traversal, absolute path, reserved Windows name and reparse-point fixtures;
- per-file/total/count/manifest limit fixtures;
- hash, undeclared-file, bundle-ID collision and replay fixtures;
- unknown project/context/version and stale commit fixtures;
- crash before/after rename and recovery fixtures;
- managed-project source SHA-256 before/after the full proving slice;
- desktop smoke verifies read-only authority labels and typed operations.

## Approval gate

The human architect accepted Option A on 2026-08-17. This approval does not
approve the executable delivery board, deployment, or any managed-project
mutation.
