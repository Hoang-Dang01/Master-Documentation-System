---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
exceptions:
  - ../skills/vendor
---

# MDS Core

Canonical knowledge and governance layer for schemas, standards, templates,
role/lifecycle guides, glossary data, prompts, and examples.

Its responsibility model is physically separated as follows:

```text
roles/                 13 professional responsibilities only
actors/                Customer / Stakeholder
implementation-plane/  Developer / Codex / IDE / CI-CD
authorities/           Human approval authorities
runtime/               Production as an evidence environment
system-capabilities/   Orchestrator / Knowledge Curator / Validator / Context Builder
```

The five non-role folders are routing boundaries. They do not create new
runtime features, autonomous agents, or approval authority. The canonical
classification remains `roles/role-model.md` and `roles/role-registry.yaml`.

`../skills/vendor/` is vendor material and is not safe for normal modification.
Resolve source-of-truth questions through `docs/CANONICAL_SOURCES.md` and track
consolidation work in `docs/MIGRATION_MAP.md`.
