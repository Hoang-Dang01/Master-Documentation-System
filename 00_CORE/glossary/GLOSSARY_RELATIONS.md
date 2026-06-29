# MDS Relations Glossary

---
term: depends_on
category: relation
definition: An outbound edge representing that artifact A requires artifact B to function or be understood.
aliases:
  - Requires
examples:
  - FE spec depends_on API spec
notes: Used for dependency graph resolution.
related_terms:
  - Traceability
---

---
term: implements
category: relation
definition: An outbound edge showing that a component, code, or technical spec implements a business requirement.
aliases:
  - Realizes
examples:
  - API-AUTH-001 implements REQ-AUTH-001
notes: Key for verifying requirement coverage.
related_terms:
  - depends_on
---

---
term: tested_by
category: relation
definition: An inbound edge indicating that a test case validates the correct operation of an artifact.
aliases:
  - Verified by
examples:
  - REQ-AUTH-001 tested_by TC-AUTH-001
notes: Used by QA Agents to check testing coverage.
related_terms:
  - implements
---