# Architecture

MDS is a local-first Personal Engineering Operating System. It turns unstructured inputs into reviewed requirements, evidence-backed impact analysis, draft designs, implementation plans and bounded context packages for coding agents.

## Three product layers

```text
Knowledge  → ingest, normalize, version and link evidence
Decision   → analyze impact, compare options and request approval
Execution  → prepare work, hand off, verify and synchronize knowledge
```

The current knowledge assets live in `mds-core/`. New application behavior belongs in `packages/`.

## Runtime architecture

```text
Desktop UI
    ↓
Application use cases
    ↓
Domain core
    ↑
Document · AI · persistence · integration adapters
    ↓
SQLite metadata + local project files
```

The renderer can only call the typed preload API. It never reads local files or invokes Node APIs directly.

## Automation policy

Automation is classified into three levels:

1. Deterministic actions may run automatically.
2. AI proposes drafts that require human review.
3. Scope, architecture, breaking database, risk, release and approved-artifact decisions require explicit human approval.

AI is one executor type, not the center of the architecture.

## Storage policy

SQLite stores metadata, indexes, relationships, job state and version metadata. The file system stores original documents, structured extractions, Markdown artifacts, diagrams, attachments and exports.

## First vertical slice

```text
Customer document or idea
→ structured requirements
→ human review
→ impact analysis
→ design draft
→ implementation plan
→ agent context package
```

This slice proves useful end-to-end behavior before agent execution, OCR, vector databases, cloud sync or multi-agent autonomy are added.

