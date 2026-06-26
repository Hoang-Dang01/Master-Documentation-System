---
id: AST-META-001
name: Base Metadata Template

artifact_type: TPL
domain: META

owner: ALL
status: APPROVED
version: 2.1.0

tags:
  - system
  - template
  - metadata
  - base

created_at: 2026-06-26
updated_at: 2026-06-26

last_updated_by: Human-Chief-Architect
change_summary: v2.1 — fixed id to AST-META-001, expanded artifact_type enum, removed AI from owner, added review_required_by field

links:
  depends_on: []
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
  references:
    - AST-META-GUIDE
  supersedes: []
---

# Base Metadata Template

> **Guide**: [BASE_GUIDE.md](../guides/BASE_GUIDE.md) — field definitions, lifecycle rules, links graph semantics.
> **Example**: [BASE-EXAMPLE.md](../examples/BASE-EXAMPLE.md) — gold standard reference.

---

## Blueprint (Copy-Paste Below This Line)

```yaml
---
id: [GLOBAL-UNIQUE-ID]
name: [Artifact Name]

artifact_type: [REQ|ADR|API|DB|TC|BUG|INC|FIN|AST|GUIDE|TPL|EXM|REG|POL|LOG]
domain: [DOMAIN_NAME]

owner: [ALL|PM|BA|SA|ARC|DBA|BE|FE|QA|DEVOPS|SRE|OPS]

status: [DRAFT|REVIEW|APPROVED|IN_PROGRESS|BLOCKED|DEPRECATED|ARCHIVED|NOT_APPLICABLE]

version: 1.0.0

tags:
  - [tag1]
  - [tag2]

created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]

last_updated_by: [Actor]
change_summary: [Short summary of this version]

review_required_by:
  - [ROLE]

links:
  depends_on: []
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
  references: []
  supersedes: []
---

# [Artifact Name]

> See [BASE_GUIDE.md](../guides/BASE_GUIDE.md) for field definitions, lifecycle rules, and links graph semantics.
```
