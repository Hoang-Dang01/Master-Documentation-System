# FEEDBACK-005/006 — Evidence correlation and finding evidence

Evidence date: 2026-08-17 (Asia/Bangkok)

## Delivered behavior

- Accepted evidence is correlated to an exact project, context package,
  repository/commit identity and artifact version set.
- Only instruction-eligible context versions are trusted matches. Warning
  versions are retained as non-authoritative; missing versions, unknown context,
  project mismatch and stale commit identity fail closed.
- Correlation retains producer, commit/build identity, artifact version IDs and
  source references.
- Deterministic findings classify validated results as `PASS_EVIDENCE`,
  `FAILED_CHECK`, `MISSING_EVIDENCE`, `STALE_IDENTITY` or `MISMATCH`.
- Every finding starts `DRAFT`. A pass is evidence only and does not mutate
  Current Project Truth, approve release or authorize deployment.

## Fresh verification

```text
npm.cmd run typecheck                  PASS
npm.cmd run test:evidence-correlation  PASS
npm.cmd run test:verification-findings PASS
npm.cmd run test:truth                 PASS
npm.cmd run test:foundation-dod        PASS
```

Observed focused results:

```text
[EVIDENCE-CORRELATION] exact context/commit/version trusted; stale, missing and
warning authority fail closed.
[VERIFICATION-FINDINGS] deterministic DRAFT pass/fail/missing/stale/mismatch
findings passed.
```

## Residual risks

- Finding persistence and human decision transitions are not yet implemented;
  this slice produces deterministic DTOs.
- Expected repository/commit authority is caller-supplied. Durable handoff
  identity storage remains future hardening.
- Desktop inspection/review belongs to FEEDBACK-007.
