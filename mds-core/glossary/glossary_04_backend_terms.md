<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/04_backend_terms.yaml -->
---
id: AST-GLOSSARY-BE-FILE
name: Backend Terms Glossary
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

# Backend Terms Glossary

## idempotency

*   **Artifact ID**: `AST-GLOSSARY-BE-001`
*   **Canonical Name**: `API Idempotency`
*   **Category**: `backend`
*   **Namespace**: `backend`
*   **Domain**: `platform`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application.
*   **Examples**:
    * Idempotent API requests using transaction keys.
*   **Notes**:
    * Crucial for network retry strategies.
*   **Related Terms**: [eventual_consistency](#eventual_consistency)

---

## eventual_consistency

*   **Artifact ID**: `AST-GLOSSARY-BE-002`
*   **Canonical Name**: `Eventual Consistency Model`
*   **Category**: `backend`
*   **Namespace**: `backend`
*   **Domain**: `platform`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: A consistency model used in distributed computing to achieve high availability.
*   **Examples**:
    * Replica read delays in distributed DBs.
*   **Notes**:
    * System becomes consistent over time.
*   **Related Terms**: [idempotency](#idempotency)

---

## retry

*   **Artifact ID**: `AST-GLOSSARY-BE-003`
*   **Canonical Name**: `Automatic Retry`
*   **Category**: `backend`
*   **Namespace**: `backend`
*   **Domain**: `platform`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: A mechanism to automatically re-execute a failed operation (such as an API call or DB query) to handle transient errors.
*   **Examples**:
    * Exponential backoff retry on HTTP 503.
*   **Notes**:
    * Should be paired with idempotency to avoid side effects.
*   **Related Terms**: [idempotency](#idempotency), [circuit_breaker](#circuit_breaker)

---

## circuit_breaker

*   **Artifact ID**: `AST-GLOSSARY-BE-004`
*   **Canonical Name**: `Circuit Breaker Pattern`
*   **Category**: `backend`
*   **Namespace**: `backend`
*   **Domain**: `platform`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: A design pattern used to detect failures and encapsulate the logic of preventing a failure from constantly recurring.
*   **Examples**:
    * Tripping the breaker when a downstream service fails.
*   **Notes**:
    * Prevents cascading failures in microservices.
*   **Related Terms**: [retry](#retry)

---
