---
ownership: mds
status: transitional
source: internal-proposal
safe_to_modify: approval-gated
---

# Knowledge Graph Slice 1 — draft approval pack

This directory contains review material only. It is not canonical runtime
project data and it does not authorize implementation.

| Artifact | Purpose | State |
|---|---|---|
| `requirement.md` | Approved Slice 1 capability boundary and acceptance criteria | `APPROVED` |
| `adr.md` | Accepted Slice 1 architecture and deferred decisions | `APPROVED / ACCEPTED` |
| `repository-baseline.md` | Working-tree baseline that Slice 1 must preserve | Recorded evidence |
| `delivery-board.json` | Approved executable task graph | Backlog approved; execution evidence controls task state |

The canonical governance sources remain `mds-core/standards/`,
`mds-core/schemas/`, and `docs/CANONICAL_SOURCES.md`. If this proposal is
approved, runtime project artifacts must be created under
`MDS_DATA_DIR/projects/active/<project-id>/`; this review pack must not be
treated as a substitute for that runtime record.

## Approval boundary

Implementation is authorized only for Slice 1. SQLite adapters, Electron graph
IPC, graph UI, Graph RAG, and AI-generated relationships remain excluded.
