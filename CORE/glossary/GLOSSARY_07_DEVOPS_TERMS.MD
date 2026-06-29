<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/07_devops_terms.yaml -->
---
id: AST-GLOSSARY-DEVOPS-FILE
name: Devops Terms Glossary
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

# Devops Terms Glossary

## error_budget

*   **Artifact ID**: `AST-GLOSSARY-DEVOPS-001`
*   **Canonical Name**: `Error Budget`
*   **Category**: `devops`
*   **Namespace**: `devops`
*   **Domain**: `platform`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The allowable threshold of service unreliability (typically derived as 100% - SLO) that can be consumed without violating user expectations or triggering alerts.
*   **Examples**:
    * 99.9% SLO allows 43.8 minutes of downtime per month.
*   **Notes**:
    * Derived from SLO, not SLA.
    * Used to balance release velocity and stability.
*   **Related Terms**: [SLO](#slo), [availability](#availability)

---

## availability

*   **Artifact ID**: `AST-GLOSSARY-DEVOPS-002`
*   **Canonical Name**: `Service Availability`
*   **Category**: `devops`
*   **Namespace**: `devops`
*   **Domain**: `platform`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The percentage of time that a service is operational and capable of delivering its required function under normal conditions.
*   **Examples**:
    * A service maintaining 99.95% uptime.
*   **Notes**:
    * Serve as the foundation for SLIs and SLOs.
*   **Related Terms**: [error_budget](#error_budget), [SLO](#slo)

---
