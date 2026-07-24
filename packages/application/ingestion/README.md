---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Document ingestion

The first implemented application package in MDS.

Responsibilities:

- parse DOCX through Mammoth and read Markdown/TXT;
- preserve the original source;
- calculate SHA-256 provenance;
- write normalized project content;
- produce a deterministic requirement `DRAFT` with a source-artifact link;
- list project artifacts using human-readable metadata.

Human review remains mandatory. This package does not approve requirements or
perform impact analysis.
