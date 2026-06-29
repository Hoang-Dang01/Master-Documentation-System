# MDS Artifact Types Glossary

---
term: REQ
category: artifact_type
definition: Requirement specification describing business or system goals.
aliases:
  - Requirement
examples:
  - REQ-AUTH-001
notes: Drafted by BA, approved by Chief Architect.
related_terms:
  - Business Rule
---

---
term: ADR
category: artifact_type
definition: Architecture Decision Record documenting significant technical decisions.
aliases:
  - Design Decision
examples:
  - ADR-DB-001
notes: Must include context, decision, and consequences.
related_terms:
  - Solution Architecture
---

---
term: API
category: artifact_type
definition: API Contract defining endpoints, inputs, outputs, and status codes.
aliases:
  - API Spec
examples:
  - API-AUTH-001
notes: Strictly versioned and implemented by BE/FE.
related_terms:
  - Database Schema
---

---
term: DB
category: artifact_type
definition: Database Schema specification containing DDL statements.
aliases:
  - DB Schema
examples:
  - DB-AUTH-001
notes: Contains table structures, relationships, and index definitions.
related_terms:
  - API Contract
---