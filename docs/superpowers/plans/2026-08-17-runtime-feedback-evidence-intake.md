# Runtime Feedback Evidence Intake Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import one bounded external Implementation Plane evidence bundle immutably, reject unsafe or tampered input, and prove MDS never writes the managed project.

**Architecture:** Pure evidence identity and manifest invariants live in `@mds/domain`; `@mds/requirements` owns intake orchestration because it already owns truth/context/feedback semantics; filesystem persistence is a focused adapter behind an application interface. Canonical bytes live below the selected runtime project at `evidence/bundles/`; SQLite remains a rebuildable index and is not part of this slice.

**Tech Stack:** TypeScript 7, Node.js filesystem/crypto APIs, existing npm workspaces, CommonJS integration tests.

## Global Constraints

- Implement only `PM-TSK-MDS-FEEDBACK-003` and `PM-TSK-MDS-FEEDBACK-004` after backlog approval.
- Follow `BA-REQ-MDS-FEEDBACK-001@0.1.0` and accepted `ARCH-ADR-MDS-FEEDBACK-001@0.1.0` Option A.
- Runtime writes stay inside `MDS_DATA_DIR/projects/active/<project-id>/evidence/`.
- Never write managed-project source/test files, execute managed-project commands, or perform Git/PR/deployment writes.
- Bounds are exact: 100 files, 25 MiB per file, 100 MiB total, 1 MiB manifest.
- All generated findings/output remain `DRAFT`; intake does not modify Current Project Truth.
- Use `apply_patch` for repository edits; preserve unrelated dirty-worktree changes.

---

## File map

- Create `packages/core/domain/src/evidence.ts`: manifest, result and invariant types; path/size/hash validation.
- Modify `packages/core/domain/src/index.ts`: export evidence contracts.
- Create `packages/application/requirements/src/evidence.ts`: intake port and deterministic orchestration.
- Modify `packages/application/requirements/src/index.ts`: export evidence use cases.
- Create `packages/infrastructure/persistence/src/evidence-filesystem.ts`: staged immutable filesystem repository.
- Modify `packages/infrastructure/persistence/src/index.ts`: export repository adapter.
- Create `tests/integration/evidence-intake.cjs`: valid intake, idempotency and managed-source hash proof.
- Create `tests/integration/evidence-security.cjs`: traversal, tamper, limits, collision and identity rejection.
- Modify `package.json`: add `test:evidence-intake` and `test:evidence-security`.
- Create `docs/runtime-feedback/feedback-003-004-evidence.md`: fresh completion evidence and residual risk.

### Task 1: Evidence domain contract

**Files:**

- Create: `packages/core/domain/src/evidence.ts`
- Modify: `packages/core/domain/src/index.ts`
- Test: `tests/integration/evidence-security.cjs`

**Interfaces:**

- Produces: `EvidenceBundleManifest`, `EvidenceFileDeclaration`, `EvidenceResultDeclaration`, `EvidenceLimits`, `DEFAULT_EVIDENCE_LIMITS`, `validateEvidenceManifest(manifest, expectedProjectId)`.
- `validateEvidenceManifest` returns a normalized immutable value or throws before filesystem mutation.

- [ ] **Step 1: Write the failing contract/security assertions**

Create `tests/integration/evidence-security.cjs` with assertions that import the domain exports and reject: `../escape`, absolute Windows/Unix paths, duplicate normalized paths, invalid SHA-256, 101 files, file size above 25 MiB, total above 100 MiB, unknown result enum, project mismatch and an invalid bundle ID.

- [ ] **Step 2: Run the test and confirm the missing export failure**

Run: `npm.cmd run build --silent; node tests/integration/evidence-security.cjs`

Expected: fail because `validateEvidenceManifest` is not exported.

- [ ] **Step 3: Implement exact domain types and fail-closed validation**

Use these identities:

```ts
export const DEFAULT_EVIDENCE_LIMITS = {
  maxFiles: 100,
  maxFileBytes: 25 * 1024 * 1024,
  maxTotalBytes: 100 * 1024 * 1024,
  maxManifestBytes: 1024 * 1024,
} as const;

export type EvidenceResultStatus = "PASSED" | "FAILED" | "NOT_RUN" | "INCOMPLETE";
export type EvidenceResultKind = "test" | "build" | "diff" | "static-analysis" | "other";
```

Normalize separators to `/`; reject empty segments, `.`, `..`, drive prefixes,
UNC/absolute paths, NUL, trailing dots/spaces and Windows reserved basenames.
Require lowercase 64-hex hashes and unique declared paths.

- [ ] **Step 4: Build and run focused security assertions**

Run: `npm.cmd run build --silent; node tests/integration/evidence-security.cjs`

Expected: domain validation assertions pass; repository-dependent cases remain explicitly skipped until Task 3, not silently treated as pass.

### Task 2: Application intake orchestration

**Files:**

- Create: `packages/application/requirements/src/evidence.ts`
- Modify: `packages/application/requirements/src/index.ts`
- Test: `tests/integration/evidence-intake.cjs`

**Interfaces:**

- Consumes: validated manifest from Task 1.
- Produces:

```ts
export type EvidenceSubmission = {
  manifestPath: string;
  filesRoot: string;
};

export interface EvidenceBundleRepository {
  importBundle(input: ValidatedEvidenceImport): Promise<EvidenceImportResult>;
}

export async function importEvidenceBundle(input: {
  projectPath: string;
  activeProjectsRoot: string;
  submission: EvidenceSubmission;
  repository: EvidenceBundleRepository;
}): Promise<EvidenceImportResult>;
```

- [ ] **Step 1: Write a failing application test with an in-memory repository**

Assert project-root enforcement, manifest byte-size enforcement, selected
project identity validation, declared file existence/regular-file checks,
actual size/hash equality, and the exact validated bytes passed to the port.

- [ ] **Step 2: Run and observe missing use-case failure**

Run: `npm.cmd run build --silent; node tests/integration/evidence-intake.cjs`

Expected: fail because `importEvidenceBundle` is missing.

- [ ] **Step 3: Implement minimal application logic**

Read only the submission paths explicitly supplied by the external plane.
Reject symlinks/reparse points using `lstat`; never recurse. Require declared
files to resolve under `filesRoot`. Compute hashes from bytes and pass immutable
buffers plus normalized metadata to the repository port.

- [ ] **Step 4: Run focused application test**

Run: `npm.cmd run build --silent; node tests/integration/evidence-intake.cjs`

Expected: in-memory intake and rejection assertions pass.

### Task 3: Immutable filesystem repository and replay

**Files:**

- Create: `packages/infrastructure/persistence/src/evidence-filesystem.ts`
- Modify: `packages/infrastructure/persistence/src/index.ts`
- Test: `tests/integration/evidence-intake.cjs`
- Test: `tests/integration/evidence-security.cjs`

**Interfaces:**

- Consumes: `EvidenceBundleRepository` and `ValidatedEvidenceImport` from Task 2.
- Produces: `FilesystemEvidenceBundleRepository`.

- [ ] **Step 1: Extend tests with filesystem acceptance and collision cases**

Assert exact submitted-manifest preservation, normalized manifest, content-
addressed `files/<sha256>`, accepted audit event, identical replay returning
`replay: true`, same bundle ID/different manifest rejection, and no authoritative
bundle directory after a failed hash/import.

- [ ] **Step 2: Run and confirm adapter failure**

Run: `npm.cmd run build --silent; node tests/integration/evidence-intake.cjs; node tests/integration/evidence-security.cjs`

Expected: fail because filesystem adapter is missing.

- [ ] **Step 3: Implement staging and atomic commit**

Resolve project path beneath the active root. Write into
`evidence/staging/<bundle-id>.<nonce>`, use exclusive creation for the staging
directory, write manifest/files/audit, then rename once to
`evidence/bundles/<bundle-id>`. If destination exists, compare stored submitted
manifest hash for replay or reject collision. Cleanup only the verified staging
path; never recursively delete a computed path outside `evidence/staging`.

- [ ] **Step 4: Run intake and security suites**

Run: `npm.cmd run test:evidence-intake; npm.cmd run test:evidence-security`

Expected: both exit `0`, including source hash unchanged and collision cases.

### Task 4: Package scripts, regression and evidence

**Files:**

- Modify: `package.json`
- Create: `docs/runtime-feedback/feedback-003-004-evidence.md`
- Modify: `docs/runtime-feedback/delivery-board.json`
- Modify: `docs/MIGRATION_MAP.md`

**Interfaces:**

- Consumes all Task 1–3 behavior.
- Produces fresh task evidence; does not approve release or later tasks.

- [ ] **Step 1: Add dedicated scripts**

```json
"test:evidence-intake": "npm run build --silent && node tests/integration/evidence-intake.cjs",
"test:evidence-security": "npm run build --silent && node tests/integration/evidence-security.cjs"
```

- [ ] **Step 2: Run the full bounded verification suite**

Run:

```powershell
npm.cmd run typecheck
npm.cmd run test:evidence-intake
npm.cmd run test:evidence-security
npm.cmd run test:lineage
npm.cmd run test:truth
npm.cmd run test:foundation-dod
npm.cmd run validate:docs
npm.cmd run validate:structure
npm.cmd run validate:skills
git diff --check
```

Expected: every command exits `0`; warnings about CRLF conversion are recorded
as environment notices, not test failures.

- [ ] **Step 3: Record evidence and update delivery state only from output**

Record manifest/bundle hashes, platform, Node version, accepted layout,
rejection matrix, managed-source before/after hash, unverified crash points and
the absence of producer authentication. Mark FEEDBACK-003/004 `COMPLETED` only
if every acceptance criterion has current evidence.

- [ ] **Step 4: Regenerate and validate structure/board**

Run:

```powershell
npm.cmd run docs:structure
node skills/mds/mds-project-management/scripts/validate-task-links.mjs docs/runtime-feedback/delivery-board.json
node skills/mds/mds-project-management/scripts/detect-blocked-chain.mjs docs/runtime-feedback/delivery-board.json
node skills/mds/mds-project-management/scripts/calculate-progress.mjs docs/runtime-feedback/delivery-board.json
```

Expected: zero link warnings, zero cycles, and FEEDBACK-005 becomes ready only
after both intake/security tasks have evidence-backed completion.

## Self-review

- Spec coverage: manifest identity, bounds, checksums, path safety, immutable
  storage, replay, collision, audit and managed-source immutability are mapped.
- Deferred by board design: context correlation, finding projection and desktop
  UI belong to FEEDBACK-005 through FEEDBACK-007.
- No placeholder implementation step remains.
- Type names are consistent across the domain, application and adapter tasks.
