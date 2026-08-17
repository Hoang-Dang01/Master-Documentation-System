---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
canonical_target:
  - ../roles/role-model.md
  - ../roles/role-registry.yaml
  - ../../docs/foundation/product-boundary.md
update_strategy: extend only through an approved governed workflow
---

# External Implementation Plane

Developer, Codex or another coding agent, IDE, and CI/CD belong to the
external Implementation Plane. They implement managed-project changes outside
MDS and may return read-only evidence to MDS.

This boundary does not make those tools MDS roles or grant MDS authority to
modify managed-project source or test code, operate Git, deploy, release, or
approve a human gate.
