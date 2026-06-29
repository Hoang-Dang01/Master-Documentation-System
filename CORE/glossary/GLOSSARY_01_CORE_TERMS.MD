<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/01_core_terms.yaml -->
---
id: AST-GLOSSARY-CORE-FILE
name: Core Terms Glossary
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

# Core Terms Glossary

## Artifact

*   **Artifact ID**: `AST-GLOSSARY-CORE-001`
*   **Canonical Name**: `Engineering Artifact`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: A uniquely identifiable unit of engineering knowledge.
*   **Aliases**: `Entity`
*   **Examples**:
    * Requirement spec
    * ADR
    * API Contract
*   **Notes**:
    * Every artifact must have a unique ID and lifecycle status.
*   **Related Terms**: [Canonical](#canonical), [Lifecycle](#lifecycle), [Relation](#relation), [View](#view)

---

## Canonical

*   **Artifact ID**: `AST-GLOSSARY-CORE-002`
*   **Canonical Name**: `Canonical Source of Truth`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The officially approved and versioned Single Source of Truth for an engineering component.
*   **Aliases**: `Approved State`
*   **Examples**:
    * APPROVED API Contract
*   **Notes**:
    * Non-canonical documents are drafts or work-in-progress.
*   **Related Terms**: [Artifact](#artifact)

---

## Drift

*   **Artifact ID**: `AST-GLOSSARY-CORE-003`
*   **Canonical Name**: `Knowledge Drift`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The misalignment or divergence between design specs, code, and standards.
*   **Aliases**: `Out of sync`
*   **Examples**:
    * Code missing a field defined in DB DDL
*   **Notes**:
    * Drift is automatically detected via drift linter scripts.
*   **Related Terms**: [Linter](#linter)

---

## TGE

*   **Artifact ID**: `AST-GLOSSARY-CORE-004`
*   **Canonical Name**: `Template Guide Example Pattern`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: Template, Guide, and Example design pattern for organizing immutable core knowledge.
*   **Aliases**: `Core Structure`
*   **Examples**:
    * BASE_TEMPLATE, BASE_GUIDE, BASE_EXAMPLE
*   **Notes**:
    * Ensures AI and humans have structure, usage rules, and gold standards.
*   **Related Terms**: [Template](#template)

---

## Lifecycle

*   **Artifact ID**: `AST-GLOSSARY-CORE-005`
*   **Canonical Name**: `Artifact Document Lifecycle`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The lifecycle states of an artifact (DRAFT, REVIEW, APPROVED, etc.) and transition rules.
*   **Examples**:
    * REVIEW state transitioning to APPROVED
*   **Notes**:
    * Enforced by the linter via Rule 3.
*   **Related Terms**: [Artifact](#artifact)

---

## Linter

*   **Artifact ID**: `AST-GLOSSARY-CORE-006`
*   **Canonical Name**: `MDS Validation Engine`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: Automation script that validates document formatting, naming conventions, and constraints.
*   **Aliases**: `Drift Detector`
*   **Examples**:
    * detect_drift.js
*   **Notes**:
    * Prevents out-of-sync documents from being committed.
*   **Related Terms**: [Drift](#drift)

---

## Template

*   **Artifact ID**: `AST-GLOSSARY-CORE-007`
*   **Canonical Name**: `Document Blueprint Template`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: Structured markdown blueprint with standardized empty headers ready for project specifications, following the TGE pattern.
*   **Examples**:
    * ROADMAP_TEMPLATE.md
*   **Notes**:
    * Located in CORE/templates/.
*   **Related Terms**: [TGE](#tge)

---

## Relation

*   **Artifact ID**: `AST-GLOSSARY-CORE-008`
*   **Canonical Name**: `Graph Relation Link`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: An edge definition in the MDS Engineering Knowledge Graph (EKG) representing semantic links between artifacts.
*   **Aliases**: `Graph Link`
*   **Examples**:
    * depends_on
    * implements
*   **Notes**:
    * Defines the semantic relationships between system nodes.
*   **Related Terms**: [Artifact](#artifact)

---

## View

*   **Artifact ID**: `AST-GLOSSARY-CORE-009`
*   **Canonical Name**: `Virtual Directory Projection`
*   **Category**: `core`
*   **Namespace**: `mds`
*   **Domain**: `core`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: A virtual projection of the MDS directory tree filtered by role, workflow, or project context.
*   **Aliases**: `Virtual View`
*   **Examples**:
    * SOLO_VIEW.md
*   **Notes**:
    * Reduces cognitive load for both humans and AI.
*   **Related Terms**: [Artifact](#artifact)

---
