---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
canonical_target:
  - role-model.md
  - role-registry.yaml
update_strategy: migrate one governed role workflow at a time
---

# MDS role contracts

This directory defines professional responsibilities around the MDS control
plane. A role contract describes what its owner may analyse, specify, review,
or hand off. It does not grant an MDS agent authority to implement managed
project code, mutate tests, operate Git, deploy, or approve a human gate.

## Canonical routing

- [role-model.md](role-model.md) defines the responsibility model, boundaries,
  and collaboration flow.
- [role-registry.yaml](role-registry.yaml) is the structured registry of role
  identities, contract paths, and migration state.
- `<role>/` contains the operative responsibility, input, output, and workflow
  contract for that specific role.

## Directory order

Read the long-form directories in this operational order. The registry field
`sequence` is authoritative because the filesystem itself is alphabetical:

```text
product-management/
business-analysis/
system-analysis/
architecture-tech-lead/
ui-ux/
frontend/
backend/
database/
quality-assurance/
devops-sre/
support-operations/
project-management/      # cross-cutting
security/                # cross-cutting
```

The ordered long-form directory is the single future home for each
responsibility. Until its detailed contract is designed and approved, its
directory contains only a routing README. Short codes such as `BA`, `BE`, or
`PM` belong only in the registry's `aliases` metadata. They must not retain a
second folder or policy after migration.

## Contract shape

Each active role has four files:

```text
<role>/
├── responsibilities.md
├── required_inputs.md
├── expected_outputs.md
└── workflow.md
```

Every generated artifact begins as `DRAFT`. Human approval remains mandatory
for scope, requirements, architecture, breaking changes, approved-artifact
replacement, and releases.
