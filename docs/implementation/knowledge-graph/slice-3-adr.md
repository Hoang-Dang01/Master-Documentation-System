---
id: ARCH-ADR-MDS-KGRAPH-003
title: Typed Electron API for the local graph index
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
tags: [adr, electron, ipc, knowledge-graph, slice-3]
links:
  - type: depends_on
    target: ARCH-ADR-MDS-KGRAPH-002
---

# Typed Electron API for the local graph index

The human project authority approved Slice 3 on 2026-07-29. Electron main owns
`MDS_DATA_DIR/mds.sqlite`, calls application graph use cases, and exposes only
DTO-based business operations through preload. Renderer code receives no
filesystem path primitive or database handle.

Approved operations are build, bounded query, node lookup, and validation
issue lookup. Index refresh is explicit; no watcher is introduced. Knowledge
Graph UI, Cytoscape, impact traversal, and Graph RAG remain excluded.
