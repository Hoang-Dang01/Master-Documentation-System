---
id: ARCH-ADR-MDS-FOUND-001
title: Separate MDS control plane from managed-project implementation
project: mds
phase: "03"
lifecycle_state: APPROVED
execution_state: NOT_APPLICABLE
decision_status: ACCEPTED
version: 1.0.0
owner: arch_agent
created_by: codex
created_at: 2026-08-14
last_updated: 2026-08-14
approved_by: human-project-authority
approved_at: 2026-08-14
approval_reason: User explicitly accepted MDS operating by this method.
source_refs:
  - BA-REQ-MDS-FOUND-001
  - BA-REQ-MDS-TRUTH-001
  - docs/ARCHITECTURE.md
  - docs/CANONICAL_SOURCES.md
tags: [foundation, adr, control-plane, implementation-plane]
links:
  - type: implements
    target: BA-REQ-MDS-FOUND-001
  - type: implements
    target: BA-REQ-MDS-TRUTH-001
---

# Separate MDS control plane from managed-project implementation

## Context

MDS already contains local-first ingestion, governed artifacts, approval/audit
use cases, workflow state, a derived Knowledge Graph, and a desktop UI. Its
canonical and transitional content is inconsistent about the product boundary:
some sources describe MDS as a specification/control system, while BE/FE and
orchestrator prompts assign source-code implementation to MDS agents.

Continuing feature work before resolving this conflict risks turning MDS into a
general coding orchestrator and weakening its authority, history, and approval
model.

## Decision drivers

- Keep one clear product purpose.
- Prevent inferred or draft content from becoming implementation authority.
- Preserve MDS's ability to verify specification/implementation drift.
- Keep managed-project source control and implementation responsibility in the
  tools designed for them.
- Make feature routing and future consolidation decisions testable.
- Migrate approved/transitional content without destructive bulk edits.

## Options

### A — Control plane with an external Implementation Plane (recommended)

MDS owns Capture, Structure, Analyze, Approve, Trace, and Present. It produces
bounded context packages and consumes read-only implementation evidence.
Developers, IDEs, Codex, Claude Code, and CI/CD implement and execute changes.

### B — Integrated implementation orchestrator

MDS agents may modify managed-project code and operate Git/PR/deployment flows.
This reduces handoff friction but expands product authority, security surface,
failure modes, and overlap with existing coding systems.

### C — Documentation repository only

MDS stores documents but does not analyze repository evidence, drift, impact,
or implementation verification. This is simpler but discards the technical
brain and feedback-loop value.

## Proposed decision

Select Option A.

Feature routing uses this test:

> Does the capability materially improve Capture, Structure, Analyze, Approve,
> Trace, or Present of governed Project Truth?

If its primary outcome is writing or executing managed-project implementation,
it belongs to the external Implementation Plane. If it reads implementation
evidence to improve traceability, drift detection, verification, or context, it
may belong to MDS behind a read-only adapter and explicit user scope.

## Logical architecture

```text
Sources + implementation evidence
                ↓
Capture / adapter boundary
                ↓
Structured artifacts + provenance
                ↓
Analysis proposals + deterministic validation
                ↓
Human approval and immutable evidence
                ↓
Project State + Current Project Truth projection
                ↓
Knowledge Graph / impact / drift / rollback knowledge
                ↓
Views + bounded context package
                ↓
External Implementation Plane
```

Markdown/structured project artifacts remain authoritative inputs. SQLite and
graph projections remain rebuildable derived state. Renderer code remains a
consumer of application use cases rather than an owner of artifact policy.

## Consequences

Positive:

- The product has a durable boundary and feature-routing rule.
- MDS can integrate with many coding agents without becoming one.
- Approval, versioning, truth projection, and drift become primary capabilities.
- Read-only repository evidence keeps the feedback loop intact.

Costs:

- Existing BE/FE/orchestrator prompts and lifecycle language require gradual
  migration.
- Context-package and evidence contracts must be explicit.
- Users cross a visible handoff boundary for implementation.

Risks and mitigations:

- Boundary erosion through a future adapter: enforce capability permissions and
  reject write methods at application/adapter contracts.
- Documentation drift during migration: use canonical-source routing and record
  every transitional source in `MIGRATION_MAP.md`.
- Overloading validity transitions: begin with `NEEDS_REVIEW` and approve
  deterministic stale/conflict rules separately.
- Existing dirty worktree: preserve the Foundation baseline and isolate edits to
  new review artifacts plus migration registry entries.

## Migration sequence after approval

1. Approve/version the product boundary and truth model.
2. Add canonical validity/lineage policy and schemas.
3. Update Customer Change Analysis definition and evidence contracts.
4. Migrate the minimum BA/BE/QA role contracts needed by that workflow.
5. Change prompts to reference canonical roles and remove managed-project code
   mutation from those migrated paths.
6. Implement version creation, approval head transition, graph impact traversal,
   validity updates, Current Truth projection, and context-package generation.
7. Verify the vertical slice before migrating remaining roles/prompts.

## Explicitly not decided

- The storage schema for version snapshots and lineage identity.
- Provider/model selection for AI analysis.
- Repository provider implementation.
- Automated `STALE`/`CONFLICTED` transition policy beyond approved deterministic
  rules.
- Release packaging or cloud synchronization.

## Approval record

The human project authority accepted Option A on 2026-08-14 by explicitly
approving MDS to operate according to this method.

The decision permits versioned canonical migration planning. It does not
approve the draft delivery board, a release, or replacement of another approved
artifact without its applicable gate.
