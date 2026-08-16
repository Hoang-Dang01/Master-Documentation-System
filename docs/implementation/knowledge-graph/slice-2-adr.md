---
id: ARCH-ADR-MDS-KGRAPH-002
title: SQLite cache for the deterministic graph projection
project: mds
phase: "03"
lifecycle_state: APPROVED
execution_state: COMPLETED
decision_status: ACCEPTED
version: 0.1.0
owner: arch_agent
created_by: system
created_at: 2026-07-29
last_updated: 2026-07-29
approved_by: human-project-authority
approved_at: 2026-07-29
tags: [adr, sqlite, knowledge-graph, slice-2]
links:
  - type: implements
    target: BA-REQ-MDS-KG-001
  - type: depends_on
    target: ARCH-ADR-MDS-KG-001
---

# SQLite cache for the deterministic graph projection

The human project authority approved Slice 2 on 2026-07-29 after selecting
`better-sqlite3`. Markdown remains the source of truth; SQLite is replaceable
derived data under `MDS_DATA_DIR/mds.sqlite`.

Approved work covers schema/migrations, transactional full rebuild,
equivalence tests, Electron runtime compatibility, and a bounded benchmark.
Incremental indexing, Electron graph IPC, Knowledge Graph UI, and Graph RAG are
excluded.

The application owns a `GraphIndexRepository` port. The `better-sqlite3`
implementation is an infrastructure adapter and must not leak database objects
through application or renderer boundaries. Foreign keys are enabled and a
full project replacement is atomic.

Verification confirmed that the installed native module loads under Electron
43.2.0 (module ABI 148) with SQLite 3.53.4.
