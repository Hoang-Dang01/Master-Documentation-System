---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Core packages

Domain rules, validation, approval policy, and audit contracts. This layer must
not depend on Electron, React, databases, or AI providers.

The first runtime domain contract lives in `domain/`. It defines Project,
SourceDocument, Artifact, Requirement, Approval, AuditEvent and WorkflowRun,
plus lifecycle and approval transition invariants.
