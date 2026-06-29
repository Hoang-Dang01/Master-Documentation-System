# MDS Core Terms Glossary

---
term: Artifact
category: core
definition: A uniquely identifiable unit of engineering knowledge.
aliases:
  - Entity
examples:
  - Requirement
  - ADR
  - API Contract
notes: Every artifact must have a unique ID and lifecycle status.
related_terms:
  - Canonical
  - Lifecycle
---

---
term: Canonical
category: core
definition: The officially approved and versioned Single Source of Truth for an engineering component.
aliases:
  - Approved State
examples:
  - APPROVED API Contract
notes: Non-canonical documents are drafts or work-in-progress.
related_terms:
  - Artifact
---

---
term: Drift
category: core
definition: The misalignment or divergence between design specs, code, and standards.
aliases:
  - Out of sync
examples:
  - Code missing a field defined in DB DDL
notes: Drift is automatically detected via drift linter scripts.
related_terms:
  - Linter
---

---
term: TGE
category: core
definition: Template, Guide, and Example design pattern for organizing immutable core knowledge.
aliases:
  - Core Structure
examples:
  - BASE_TEMPLATE, BASE_GUIDE, BASE_EXAMPLE
notes: Ensures AI and humans have structure, usage rules, and gold standards.
related_terms:
  - Template
---