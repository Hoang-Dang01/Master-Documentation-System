---
id: BASE-TEMPLATE
name: Base Metadata Template

artifact_type: AST
domain: META

owner: ALL
status: APPROVED
version: 2.0.0

tags:
  - system
  - template
  - metadata
  - base

created_at: 2026-06-26
updated_at: 2026-06-26

last_updated_by: Human-Chief-Architect
change_summary: v2 — added artifact_type, domain, tags, audit trail, references, supersedes; fixed SemVer; stripped guide content (moved to BASE_GUIDE.md)

links:
  depends_on: []
  implements: []
  tested_by: []
  broken_by: []
  impacts_cost: []
  references:
    - BASE_GUIDE
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

artifact_type: [REQ|ADR|API|DB|TC|BUG|INC|FIN|AST]
domain: [DOMAIN_NAME]

owner: [ALL|PM|BA|SA|ARC|DBA|BE|FE|QA|DEVOPS|SEC|SRE|OPS|AI]

status: [DRAFT|REVIEW|APPROVED|IN_PROGRESS|BLOCKED|DEPRECATED|ARCHIVED|NOT_APPLICABLE]

version: 1.0.0

tags:
  - [tag1]
  - [tag2]

created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]

last_updated_by: [Actor]
change_summary: [Short summary of this version]

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
