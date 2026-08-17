# FEEDBACK-003/004 — Evidence intake and security evidence

Evidence date: 2026-08-17 (Asia/Bangkok)

## Delivered behavior

- Valid JSON evidence manifests are schema/identity/path/hash/size checked before
  any authoritative write.
- Declared evidence files are read without directory recursion; non-regular
  files and symlinks are rejected.
- Accepted bytes are stored below the selected runtime project at
  `evidence/bundles/<bundle-id>/` with the submitted manifest, normalized
  manifest, content-addressed files and an audit record.
- The same bundle ID and submitted-manifest hash replay idempotently. Reusing an
  ID with different manifest bytes fails closed.
- Traversal, absolute paths, Windows reserved names, invalid hashes, excessive
  file count/size, project mismatch, tampered bytes and bundle collisions are
  rejected.
- Integration evidence records the managed-project source hash before and after
  intake and reports it unchanged.

## Fresh verification

```text
npm.cmd run typecheck              PASS
npm.cmd run test:evidence-intake   PASS
npm.cmd run test:evidence-security PASS
npm.cmd run test:lineage           PASS
npm.cmd run test:truth             PASS
npm.cmd run test:foundation-dod    PASS
npm.cmd run validate:docs          PASS
npm.cmd run validate:skills        PASS
```

Observed focused results:

```text
[EVIDENCE-INTAKE] immutable bundle=IMP-EVD-PROOF-01J5EVIDENCE01,
replay=true, managed-source-unchanged=true

[EVIDENCE-SECURITY] traversal, bounds, tamper, project identity and bundle
collision fail closed.
```

`validate:structure` reported generated-tree drift because this task added new
files. The structure is regenerated as the final documentation step and checked
again before completion.

## Residual risks

- Producer authentication is not provided by `signature.algorithm: none`; v1
  proves integrity after intake, not the producer's cryptographic identity.
- Crash/fault injection around the final directory rename and stale staging
  reclamation remains future hardening.
- Context-package and artifact-version correlation belongs to FEEDBACK-005 and
  is not claimed by this intake slice.
- No Electron UI/IPC intake operation is introduced yet.
