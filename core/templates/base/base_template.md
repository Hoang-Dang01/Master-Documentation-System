---
id: [GLOBAL-UNIQUE-ID]
name: [Artifact Name]

artifact_type: [REQ|ADR|API|DB|TC|BUG|INC|FIN|AST<GUIDEMTPL|EXM|REG|POL|LOG]
domain: [DOMAIN_NAME]

owner: [PM\BA\SA|ARCH|BE|FE|QA|DEVOPS]
status: [DRAFT|REVIEW|APPROVEDtIN_PROGRESS|BLOCKED|DEPRECATED|ARCHIVED|NOT_APPLICABLE]
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

> See [BASE_GUIDE.md](BASE_GUIDE.md) for field definitions, lifecycle rules, and links graph semantics.
