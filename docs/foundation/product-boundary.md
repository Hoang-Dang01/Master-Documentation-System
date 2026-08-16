---
id: BA-REQ-MDS-FOUND-001
title: MDS product boundary and value chain
project: mds
phase: "02"
lifecycle_state: APPROVED
execution_state: NOT_APPLICABLE
version: 1.0.0
owner: ba_agent
created_by: codex
created_at: 2026-08-14
last_updated: 2026-08-14
approved_by: human-project-authority
approved_at: 2026-08-14
approval_reason: User explicitly accepted MDS operating by this method.
source_refs:
  - user-foundation-review-2026-08-14
  - README.md
  - docs/SYSTEM_OVERVIEW.md
  - docs/ARCHITECTURE.md
tags: [foundation, product-boundary, project-truth, control-plane]
links: []
---

# MDS product boundary and value chain

## Proposed definition

MDS is a local-first desktop application that acts as the technical brain and
engineering control plane of a project. It captures ideas, requirements,
changes, decisions, specifications, and implementation evidence across the
project lifecycle; structures them as governed, versioned, traceable
artifacts; and presents an evidence-backed Project Truth to humans and AI.

MDS governs the intent-to-implementation feedback loop. It does not act as the
implementation engine for a managed project.

## User outcome

For any material project change, an authorized reviewer can determine:

- what was requested and from which source;
- what is approved and currently authoritative;
- what changed and why;
- which specifications and verification artifacts may be affected;
- which conflicts, stale artifacts, and open reviews remain;
- what bounded context may be handed to a coding agent or developer; and
- which repository/test evidence confirms or contradicts the specification.

## MDS value chain

| Core | Responsibility | Typical outputs |
|---|---|---|
| Capture | Preserve human input, documents, meetings, change requests, repository metadata, diffs, and test evidence with provenance. | SourceDocument, source span, checksum, evidence record |
| Structure | Apply canonical standards, templates, schemas, and deterministic validation. | REQ, BR, ADR, API, DB, UI, TC, DEC and other structured artifacts |
| Analyze | Detect ambiguity, conflict, dependency, risk, drift, impact, and missing information. | Draft proposal, issue, impact result, clarification question |
| Approve | Route authoritative decisions through explicit human gates and retain the decision record. | Approval, rejection, rationale, audit event |
| Trace | Maintain lineage, relationships, history, impact propagation, and rollback knowledge. | Knowledge Graph, supersession chain, affected-artifact set |
| Present | Render the same governed state for owners, managers, analysts, developers, QA, and AI. | Current Truth view, review queue, context package, status view |

## Normative product constraints

MDS SHALL:

1. preserve original source material and evidence references;
2. use canonical standards, templates, and schemas to structure artifacts;
3. distinguish deterministic facts, human statements, AI proposals, and human
   approvals;
4. treat generated or inferred content as `DRAFT` until a human gate approves
   it;
5. retain artifact history and immutable approval evidence;
6. maintain traceability and version lineage between related artifacts;
7. derive Current Project Truth by explicit, testable rules;
8. identify potentially affected downstream artifacts when governed upstream
   knowledge changes;
9. generate bounded implementation context packages with authority and warning
   labels; and
10. accept read-only implementation evidence for drift and verification
    analysis.

MDS SHALL NOT:

1. modify managed-project application source code;
2. execute implementation tasks on behalf of a developer or coding agent;
3. create commits, merge pull requests, or deploy managed-project code;
4. replace an IDE, Git, source-control platform, CI/CD system, or coding agent;
5. automatically approve requirements, architecture, breaking changes,
   releases, or replacement of approved artifacts;
6. treat AI inference, unreviewed repository evidence, or a `DRAFT` artifact as
   authoritative Project Truth; or
7. silently resolve conflicts between approved specifications and observed
   implementation.

These constraints apply to managed projects. They do not prevent developers
from changing the MDS product's own source repository through the normal
software-delivery workflow.

## Implementation Plane boundary

```text
Customer / Documents / Repository / Tests
                    │
                    ▼
┌──────────────────────────────────────────┐
│ MDS                                      │
│ Capture → Structure → Analyze → Approve  │
│                 → Trace → Present        │
│                                          │
│ Project Truth + Context Package          │
└────────────────────┬─────────────────────┘
                     │ handoff
                     ▼
┌──────────────────────────────────────────┐
│ Implementation Plane                     │
│ Developer / Codex / Claude Code / IDE    │
└────────────────────┬─────────────────────┘
                     │ read-only evidence
                     └────────────────────► MDS
```

MDS may read repository paths, commits, diffs, build results, test results,
coverage, and other explicitly authorized evidence. These inputs may produce a
drift finding or verification record, but never an autonomous code mutation.

## One Truth, multiple views

All views consume the same governed artifact set and relationship model:

- Owner view: decisions, technical detail, open questions, and approval gates.
- Manager view: scope, progress, dependencies, risks, and readiness.
- Developer view: authoritative requirements, contracts, constraints, warnings,
  and source references.
- QA view: acceptance criteria, affected tests, stale verification, and expected
  behavior.
- AI view: a bounded context package that labels authority and excludes unsafe
  content from authoritative instructions.

A view may specialize presentation. It must not redefine artifact policy or
create a competing truth.

## First proving workflow

The first vertical workflow remains Customer Change Analysis:

```text
Source change
→ traceable Requirement DRAFT
→ human edit/review/approval
→ new lineage version
→ graph-based impact traversal
→ downstream validity updates
→ Current Project Truth projection
→ implementation context package
```

## Explicit deferrals

- Autonomous code changes or implementation orchestration.
- Additional AI agent families before the first workflow is proven.
- Git write operations, PR management, and deployment execution.
- Rollback UI before version lineage and truth projection exist.
- Treating the graph cache or its visualization as the source of truth.

## Acceptance criteria for approval

1. The human project authority accepts the Technical Project Brain and
   Engineering Control Plane definition.
2. The human project authority accepts the managed-project source-code
   mutation prohibition.
3. Read-only repository and verification evidence are explicitly allowed.
4. The six-core value chain is accepted as the feature-routing test.
5. Customer Change Analysis is accepted as the first proving workflow.
6. Conflicting canonical prompts, roles, lifecycle guidance, and roadmap items
   are migrated by versioned vertical slices rather than bulk replacement.

## Approval record

The human project authority approved this product boundary on 2026-08-14 by
explicitly accepting that MDS operate according to this method.

This approval establishes product scope and authorizes versioned migration
planning. It does not approve a release, production deployment, unreviewed
breaking change, or replacement of another approved artifact without its
applicable gate.
