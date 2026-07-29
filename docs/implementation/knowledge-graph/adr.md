---
id: ARCH-ADR-MDS-KG-001
title: Deterministic artifact graph as a derived projection
project: mds
phase: "03"
lifecycle_state: APPROVED
execution_state: NOT_STARTED
blocked_reason: ""
decision_status: ACCEPTED
supersedes: ""
superseded_by: ""
version: 0.1.0
owner: arch_agent
created_by: system
created_at: 2026-07-27
last_updated: 2026-07-27
approved_by: human-project-authority
approved_at: 2026-07-27
tags: [adr, knowledge-graph, derived-index, traceability]
links:
  - type: implements
    target: BA-REQ-MDS-KG-001
---

# Deterministic artifact graph as a derived projection

> Accepted by the human project authority on 2026-07-27 for Slice 1 only.
> Later persistence, Electron, UI, and Graph RAG decisions remain gated.

## Context

MDS already stores governed project artifacts as Markdown with YAML
frontmatter and defines artifact/relationship semantics in `mds-core/`. The
current parsers read mostly scalar frontmatter and cannot reliably extract the
nested relationship forms already present in templates and generated files.
Impact analysis is currently keyword based rather than relationship traversal.

The proposed capability must expose traceability without creating a second
ontology or moving business authority into a graph database or renderer.

## Decision drivers

- Preserve Markdown and structured project artifacts as the source of truth.
- Retain evidence for every relationship.
- Respect package boundaries and the typed Electron preload boundary.
- Rebuild derived state deterministically.
- Keep AI-proposed knowledge distinguishable from human/parsed evidence.
- Deliver one bounded vertical slice before persistence or UI expansion.

## Options

### A — Derived deterministic graph projection (recommended)

Parse and normalize project artifacts into domain graph DTOs. Slice 1 keeps the
projection in memory; a later, separately approved slice may cache it in
SQLite. UI and traversal consume application use cases rather than parser or
renderer internals.

Advantages: preserves current authority, supports evidence and validation,
rebuilds safely, and fits the existing architecture. Costs: requires a robust
parser/normalizer and explicit compatibility rules.

### B — Make a graph database the primary source

Import artifacts into a graph store and treat graph records as authoritative.

Advantages: graph-native queries. Costs: conflicts with current storage policy,
creates synchronization and migration risk, and materially changes approved
architecture. Not recommended for the proposed slice.

### C — Build a UI-only graph from renderer parsing

Let React parse Markdown and feed a graph renderer directly.

Advantages: quick prototype. Costs: violates the Electron security boundary,
duplicates business policy in UI, loses reusable validation, and makes evidence
and deterministic rebuild harder. Not recommended.

## Proposed decision

Adopt Option A subject to architecture approval, with these constraints:

```text
Markdown/YAML source artifacts
        ↓
Infrastructure scanner and YAML parser
        ↓
Application normalization and graph-build use case
        ↓
Domain graph contracts and validation results
        ↓
Derived repository adapter (future gate)
        ↓
Typed Electron API and renderer (future gate)
```

- Canonical edges are stored in their declared outbound direction.
- Inverse labels are presentation only and do not create inverse edge types.
- Parser failures and graph validation issues are distinct result categories.
- Fatal failures are limited to inaccessible project/policy sources and broken
  internal invariants in Slice 1. Per-artifact data defects remain visible as
  non-fatal issues while valid artifacts are retained.
- Orphan and cycle validation are policy-aware, not simple degree/global-cycle
  checks.
- Cytoscape, SQLite adapter selection, incremental refresh, and AI edge states
  require later decisions and are not selected here.

## Placement boundaries

- Domain contracts: `packages/core/domain/` as a logical graph module.
- Use cases and ports: `packages/application/`.
- Markdown/YAML and future persistence implementations: infrastructure
  adapters behind application ports.
- Electron main calls application use cases; preload exposes DTO-only methods.
- React never reads files, opens SQLite, parses Markdown, or owns traversal
  rules.

Package creation is deferred until a real independent dependency/build boundary
is demonstrated.

## Consequences and risks

Positive consequences:

- Traceability defects become testable without a graph UI.
- Deleting derived state cannot delete project knowledge.
- Evidence enables future review and trustworthy retrieval.

Risks and mitigations:

- YAML compatibility drift: cover every supported form with fixtures and record
  unsupported forms explicitly.
- Policy ambiguity for orphan/cycle rules: obtain architect/KC clarification
  before enforcing approval-blocking results.
- Dirty working tree overlap: use the recorded baseline and restrict Slice 1
  file scope.
- Future SQLite runtime compatibility: evaluate only at the next architecture
  gate; Node's current `node:sqlite` API is experimental in the inspected
  runtime.

## Validation plan before the next gate

- Parser fixtures for scalar, list, nested-map, and list-of-object forms.
- Determinism test on identical inputs.
- Duplicate ID, broken target, invalid relationship, and policy-aware cycle
  tests.
- EduMeet seed integration test that reports the known unresolved target
  `BA-REQ-EDU-AI-001` without modifying the seed.
- Fresh repository typecheck and build results.
- Hash or content comparison demonstrating source Markdown was unchanged.

## Approval record

Option A was accepted for Slice 1 by the human project authority on 2026-07-27.
The decision does not select SQLite, an Electron API, a renderer, or Graph RAG.
