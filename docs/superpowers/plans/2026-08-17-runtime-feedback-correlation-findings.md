# Runtime Feedback Correlation and Findings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bind accepted evidence to the exact implementation context and artifact versions, then emit deterministic human-reviewable DRAFT findings without changing Current Project Truth.

**Architecture:** Correlation and finding projection are pure application behavior in `@mds/requirements`. They consume the immutable accepted manifest plus a caller-supplied expected context/commit authority snapshot; they return structured DTOs and never persist truth transitions or perform external commands.

**Tech Stack:** TypeScript 7, existing MDS truth/context contracts, Node/CommonJS integration tests.

## Global Constraints

- Implement only FEEDBACK-005 and FEEDBACK-006.
- Missing/non-authoritative versions and commit/context mismatch are untrusted.
- Findings always begin `DRAFT`; `PASS_EVIDENCE` is not release approval.
- No managed-project, Git, PR, build, test or deployment mutation.

### Task 1: Correlation contract

**Files:** Create `packages/application/requirements/src/evidence-correlation.ts`; modify `index.ts`; create `tests/integration/evidence-correlation.cjs`.

- [ ] Add failing tests for exact context/package/project/commit/version correlation.
- [ ] Implement `correlateEvidence(manifest, authority)` returning identity, producer, matched versions, missing versions, non-authoritative versions, source references and trust status.
- [ ] Verify exact match is `TRUSTED`; unknown context/version and stale commit are `UNTRUSTED` with stable reason codes.

### Task 2: Finding projection

**Files:** Create `packages/application/requirements/src/verification-findings.ts`; modify `index.ts`; create `tests/integration/verification-findings.cjs`.

- [ ] Add failing matrix tests for pass, failed, missing, stale and mismatch results.
- [ ] Implement deterministic `projectVerificationFindings(correlation)`.
- [ ] Assert all findings are `DRAFT`, retain bundle/context/artifact/source identities, and never mutate input truth/context.

### Task 3: Verification and evidence

**Files:** Modify `package.json`; create `docs/runtime-feedback/feedback-005-006-evidence.md`; update board and migration map.

- [ ] Add `test:evidence-correlation` and `test:verification-findings`.
- [ ] Run typecheck, focused tests, truth/Foundation regressions and validators.
- [ ] Update task state only from fresh command output.
