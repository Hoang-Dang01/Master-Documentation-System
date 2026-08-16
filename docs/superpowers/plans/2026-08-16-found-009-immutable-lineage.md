# FOUND-009 Immutable Lineage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace in-place requirement approval with immutable version files and one recoverable authoritative approved-head manifest.

**Architecture:** Pure lineage invariants live in `@mds/domain`; requirement use cases own orchestration; a focused filesystem lineage repository persists sealed Markdown versions, manifest transitions, and recovery evidence below the active runtime project. SQLite remains derived and the desktop remains a typed consumer.

**Tech Stack:** TypeScript 7, Node.js filesystem/crypto APIs, CommonJS integration tests, npm workspaces.

## Global Constraints

- Runtime project data stays below `MDS_DATA_DIR/projects/active/<project-id>/`.
- Approved version bytes are immutable and hash-verified.
- `lineage.json` is the single approved-head commit point; SQLite is rebuildable.
- Human actor, reason, timestamp, decision, candidate hash, and version remain queryable.
- No managed-project source/test mutation, Git write, PR, or deployment capability is introduced.
- Preserve legacy artifacts and reject ambiguous migration; never auto-approve.

---

### Task 1: Domain lineage invariants

**Files:**
- Create: `packages/core/domain/src/lineage.ts`
- Modify: `packages/core/domain/src/index.ts`
- Test: `tests/integration/lineage-runtime.cjs`

**Interfaces:**
- Produces: `ArtifactLineageManifest`, `ArtifactVersionRecord`, `LineageTransition`, `assertLineageManifest()`, `buildLineageDecision()`.

- [ ] Write tests for initial approval, successor approval, rejection, stale revision, duplicate transition, and cross-lineage predecessor.
- [ ] Run `npm.cmd run test:lineage` and confirm the missing contract fails.
- [ ] Add pure types and invariant functions without Node filesystem dependencies.
- [ ] Re-run the domain/lineage tests.

### Task 2: Filesystem lineage repository

**Files:**
- Create: `packages/application/requirements/src/lineage.ts`
- Modify: `packages/application/requirements/src/index.ts`
- Test: `tests/integration/lineage-runtime.cjs`

**Interfaces:**
- Consumes: domain lineage contracts from Task 1.
- Produces: `registerRequirementCandidate()`, `decideRequirementVersion()`, `loadRequirementLineage()`, `recoverRequirementLineage()`.

- [ ] Add failing filesystem tests for immutable version paths, approved-head transition, rejection, idempotent retry, mismatched retry, tamper detection, and path escape.
- [ ] Implement active-root validation and `artifacts/lineages/<lineage-id>/` layout.
- [ ] Implement same-directory temporary writes, exclusive lock, staging record, manifest atomic replacement, audit reconciliation, and recovery.
- [ ] Re-run lineage tests until the full matrix passes.

### Task 3: Requirement workflow compatibility

**Files:**
- Modify: `packages/application/ingestion/src/index.ts`
- Modify: `packages/application/requirements/src/index.ts`
- Modify: `tests/integration/requirements-review.cjs`

**Interfaces:**
- Consumes: lineage repository use cases from Task 2.
- Produces: imported candidate lineage metadata and compatibility `reviewRequirement()` behavior.

- [ ] Extend the current integration scenario to assert lineage identity, immutable approved bytes, approval evidence, successor head transition, and impact analysis through the approved head.
- [ ] Register new imported requirements as version candidates.
- [ ] Route approval through the lineage decision use case; keep the original draft file as a non-authoritative compatibility source.
- [ ] Resolve impact analysis input through the approved head and re-run requirements tests.

### Task 4: Verification and evidence

**Files:**
- Modify: `package.json`
- Modify: `mds-core/schemas/artifact_truth_schema.md`
- Create: `docs/foundation/found-009-evidence.md`
- Modify: `docs/foundation/delivery-board.json`
- Modify: `docs/MIGRATION_MAP.md`

**Interfaces:**
- Consumes: all runtime behavior from Tasks 1–3.
- Produces: dedicated `test:lineage`, fresh evidence, and board completion state.

- [ ] Add the dedicated lineage command and clarify effective lifecycle authority in the schema.
- [ ] Run typecheck, build, lineage, requirements, workflow, graph, graph-sqlite, smoke, docs, structure, board, and diff validation.
- [ ] Record exact fresh evidence and residual risks.
- [ ] Mark FOUND-009 complete only when every acceptance criterion is evidenced.

## Self-review

- Spec coverage: identity, immutable bytes, one active head, transition evidence, rejection, recovery, idempotency, tamper detection, cache independence, path safety, compatibility, and boundary checks are mapped above.
- Placeholder scan: no deferred implementation placeholders are used.
- Type consistency: the repository functions consume and return the domain manifest/transition types named in Task 1.
