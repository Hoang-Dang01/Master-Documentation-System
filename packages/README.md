---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Packages

The application is split by responsibility, not by screen.

| Package | Responsibility |
| --- | --- |
| `core/domain` | Entities, value objects, policies, lifecycle rules and domain errors |
| `core/validation` | Schema, link, artifact and workflow validation |
| `core/approval` | Human approval requests, policies and history |
| `core/audit` | Immutable workflow and decision events |
| `application/ingestion` | DOCX, PDF, Markdown and text normalization use cases |
| `application/requirements` | Structured requirement extraction and ambiguity detection |
| `application/impact` | Artifact matching, conflict detection, risk and impact scoring |
| `application/design` | Architecture, API, database, event, sequence and test proposals |
| `application/knowledge-base` | Artifact indexing, traceability and local search |
| `infrastructure/persistence` | SQLite and repository adapters |
| `infrastructure/ai` | Provider-neutral language-model adapters |
| `infrastructure/filesystem` | Local filesystem adapter |
| `infrastructure/integrations` | Git, GitHub, Codex and Claude adapters |
| `workflow-engine` | Dependency resolution, execution, retry and automation registry |
| `shared` | Small cross-cutting primitives with no product policy |

Dependency direction:

```text
desktop → application → core/domain
                 ↑
       adapters and providers
```

`core` must not import Electron, React, SQLite, OpenAI, Anthropic or file-parser libraries.

These directories are logical boundaries, not a commitment that every nested
directory becomes an independently built npm package.
