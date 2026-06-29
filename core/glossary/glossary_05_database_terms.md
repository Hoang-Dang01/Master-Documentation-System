<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/05_database_terms.yaml -->
---
id: AST-GLOSSARY-DB-FILE
name: Database Terms Glossary
artifact_type: REG
domain: META
owner: MDS_CORE
status: APPROVED
version: 1.1.0
tags:
  - glossary
  - core
created_at: 2026-06-29
updated_at: 2026-06-29
last_updated_by: build_glossary.js
change_summary: Auto-compiled glossary markdown
links:
  depends_on: []
---

# Database Terms Glossary

## sharding

*   **Artifact ID**: `AST-GLOSSARY-DB-001`
*   **Canonical Name**: `Database Sharding`
*   **Category**: `database`
*   **Namespace**: `database`
*   **Domain**: `architecture`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: A horizontal scaling strategy where a logical dataset is partitioned across multiple physical database nodes (shards).
*   **Aliases**: `database_sharding`, `horizontal_partitioning`
*   **Examples**:
    * Partitioning customer records by tenant ID hash.
*   **Notes**:
    * Increases write throughput and dataset capacity.
    * Adds complexity for cross-shard joins and distributed transactions.
*   **Related Terms**: [DB](#db)

---
