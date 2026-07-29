---
id: BA-REQ-MDS-KG-001
title: Deterministic artifact graph index
project: mds
phase: "02"
lifecycle_state: APPROVED
execution_state: NOT_STARTED
blocked_reason: ""
document_priority: HIGH
moscow_priority: MUST
version: 0.1.0
owner: ba_agent
created_by: system
created_at: 2026-07-27
last_updated: 2026-07-27
approved_by: human-project-authority
approved_at: 2026-07-27
tags: [knowledge-graph, traceability, validation, slice-1]
links: []
---

# Deterministic artifact graph index

> Approved by the human project authority on 2026-07-27 for Slice 1 only.
> SQLite, Electron graph API, Knowledge Graph UI, and Graph RAG remain excluded.

## Goal

Allow MDS to build a deterministic, evidence-backed graph projection from the
Markdown artifacts of one selected runtime project so traceability defects can
be detected before a graph UI or Graph RAG is introduced.

## User outcome

Given an MDS project containing Markdown artifacts with valid YAML
frontmatter, when a graph index is built, the reviewer can inspect normalized
artifact nodes, canonical outbound relationships, their source evidence, and
validation issues without modifying source artifacts.

## Slice 1 scope

- Parse scalar metadata and the relationship forms already used by MDS
  templates and generated artifacts.
- Normalize relationships to the canonical outbound types defined by
  `mds-core/standards/document_standards.md`.
- Build an in-memory deterministic graph projection.
- Preserve source path, YAML field path, raw value, and available line
  information as edge evidence.
- Report parse errors separately from graph validation issues.
- Detect duplicate artifact IDs, broken references, relationships outside the
  canonical policy, and cycles only for relationship types governed as DAGs.
- Run an integration fixture against the EduMeet development seed without
  changing it.

## Explicit exclusions

- SQLite persistence or incremental indexing.
- Electron graph IPC or React/Cytoscape UI.
- Vector search, Graph RAG, LLM chat, or AI-proposed relationships.
- Graph editing or treating the graph as a source of truth.
- Jira/GitHub synchronization or source-code-wide AI analysis.

## Functional acceptance criteria

1. Every readable artifact with a valid unique ID becomes exactly one graph
   node.
2. Every valid declared relationship becomes a canonical outbound edge without
   creating an inverse duplicate type.
3. Every edge retains evidence identifying its source artifact and YAML field.
4. Scalar, list, and supported nested relationship forms normalize to one
   relationship representation.
5. Malformed YAML is reported as a parse issue and does not silently create
   partial relationships.
6. Duplicate IDs, missing targets, and non-canonical relationship types are
   reported with source evidence.
7. Cycle detection is applied only to relationship types covered by the MDS
   DAG policy; permissive reference relationships are not rejected globally.
8. A non-fatal artifact issue does not discard valid nodes and edges from other
   readable artifacts.
9. Running the same input twice produces an equivalent projection and issue
   set.
10. Source Markdown content and timestamps remain unchanged by indexing.

## Quality and governance criteria

- Artifact type and relationship semantics are consumed from canonical MDS
  policy; Slice 1 must not introduce a competing ontology.
- Markdown and structured project files remain the source of truth.
- AI output, if introduced in a later slice, starts as a draft and cannot
  confirm an edge automatically.
- Project paths remain constrained to the resolved
  `MDS_DATA_DIR/projects/active/` boundary.
- Existing uncommitted work recorded in `repository-baseline.md` is preserved.

## Open review questions

- Which artifact types are legitimate graph roots and therefore exempt from
  upstream-link orphan rules?
- Which canonical relationship types require cycle checks beyond `depends_on`
  and `supersedes`?
- Should one malformed artifact be excluded with an issue, or should a strict
  project mode fail the complete run?
- Who is the named scope/requirement approver for the MDS project?

## Approval record

The human project authority approved this requirement on 2026-07-27 with the
explicit exclusions listed above. Any expansion requires a new scope gate.
