---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Application packages

Use cases for ingestion, requirements, impact analysis, design, and knowledge
access. They orchestrate core contracts through ports.

Current implemented use cases:

- `ingestion/`: DOCX/Markdown/TXT preservation, normalization, checksum,
  duplicate detection and deterministic Requirement DRAFT extraction.
- `requirements/`: human approval/rejection, file-based audit events and
  deterministic impact report generation.

The remaining AI-assisted design and knowledge use cases are still pending.
