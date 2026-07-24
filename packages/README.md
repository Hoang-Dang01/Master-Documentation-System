# Packages

The application is split by responsibility, not by screen.

| Package | Responsibility |
| --- | --- |
| `domain` | Entities, value objects, policies, lifecycle rules and domain errors |
| `application` | Use cases coordinating domain services and ports |
| `document-ingestion` | DOCX, PDF, Markdown and text parsing, chunking and normalization |
| `requirement-analysis` | Structured requirement extraction and ambiguity detection |
| `impact-analysis` | Artifact matching, conflict detection, risk and impact scoring |
| `system-design` | Architecture, API, database, event, sequence and test proposals |
| `knowledge-base` | Artifact indexing, traceability and local search |
| `persistence` | SQLite and file-system adapters |
| `ai-providers` | Provider-neutral language-model contracts and adapters |
| `validation` | Schema, link, artifact and workflow validation |
| `workflow-engine` | Dependency resolution, step execution, retry and persisted state |
| `automation-registry` | Registered deterministic, file, AI, validation and export actions |
| `approval` | Human approval requests, policies and history |
| `audit` | Immutable workflow and decision events |
| `integrations` | Git, GitHub, Codex and Claude adapters |
| `shared` | Small cross-cutting primitives with no product policy |

Dependency direction:

```text
desktop → application → domain
                 ↑
       adapters and providers
```

`domain` must not import Electron, React, SQLite, OpenAI, Anthropic or file-parser libraries.

