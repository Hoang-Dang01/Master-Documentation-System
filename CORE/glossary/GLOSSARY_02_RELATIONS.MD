<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/02_relations.yaml -->
---
id: AST-GLOSSARY-REL-FILE
name: Relations Glossary
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

# Relations Glossary

## depends_on

*   **Artifact ID**: `AST-GLOSSARY-REL-001`
*   **Canonical Name**: `Outbound Dependency Edge`
*   **Category**: `relation`
*   **Namespace**: `mds`
*   **Domain**: `graph`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: An outbound edge representing that artifact A requires artifact B to function or be understood.
*   **Aliases**: `Requires`
*   **Examples**:
    * FE spec depends_on API spec
*   **Notes**:
    * Used for dependency graph resolution.
*   **Inverse Relation**: `required_by`
*   **Edge Direction**: `OUTBOUND`
*   **Related Terms**: [implements](#implements)

---

## implements

*   **Artifact ID**: `AST-GLOSSARY-REL-002`
*   **Canonical Name**: `Outbound Implementation Edge`
*   **Category**: `relation`
*   **Namespace**: `mds`
*   **Domain**: `graph`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: An outbound edge showing that a component, code, or technical spec implements a business requirement.
*   **Aliases**: `Realizes`
*   **Examples**:
    * API-AUTH-001 implements REQ-AUTH-001
*   **Notes**:
    * Key for verifying requirement coverage.
*   **Inverse Relation**: `implemented_by`
*   **Edge Direction**: `OUTBOUND`
*   **Related Terms**: [depends_on](#depends_on)

---

## tested_by

*   **Artifact ID**: `AST-GLOSSARY-REL-003`
*   **Canonical Name**: `Inbound Test Verification Edge`
*   **Category**: `relation`
*   **Namespace**: `mds`
*   **Domain**: `graph`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: An inbound edge indicating that a test case validates the correct operation of an artifact.
*   **Aliases**: `Verified by`
*   **Examples**:
    * REQ-AUTH-001 tested_by TC-AUTH-001
*   **Notes**:
    * Used by QA Agents to check testing coverage.
*   **Inverse Relation**: `tests`
*   **Edge Direction**: `INBOUND`
*   **Related Terms**: [implements](#implements)

---
