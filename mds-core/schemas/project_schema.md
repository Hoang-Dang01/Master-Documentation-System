---
ownership: mds
status: transitional
source: internal
safe_to_modify: scoped
classification: project_schema
semantic_owner:
  - ../standards/naming_convention.md
  - ../standards/artifact_truth.md
schema_dependencies:
  - ./artifact_truth_schema.md
  - ./entity_schema.md
canonical_boundary_owners:
  - ../actors/
  - ../authorities/
  - ../roles/
update_strategy: change only through the applicable governed approval process
---

# MDS Project Structural Schema

## 1. Purpose

This schema defines the common structural contract for MDS project identity,
context, configuration, and references.

A Project record answers:

```text
What project is this?

What stable project identity and display information apply?

Which sources and governed context references belong to it?

Which authority assignment or workflow configuration references apply?

Which project-level metadata does MDS need to store or resolve?
```

This schema owns:

```text
project record shape

project identity field representation

project-level reference structure

project configuration extension boundary

structural validation constraints

legacy read compatibility boundary
```

It does not define a delivery methodology, role contract, approval model,
workflow engine, or implementation stack.

---

## 2. Semantic Ownership

MDS preserves:

```text
Canonical model or standard
-> owns semantics

This schema
-> represents project-level structure and validates that representation
```

Relevant semantic owners are:

```text
Project key and governed artifact identity
-> ../standards/naming_convention.md

Artifact truth, validity, lineage, and Current Project Truth
-> ../standards/artifact_truth.md

Workflow semantics
-> applicable canonical workflow model or governed workflow contract

Workflow structural representation
-> ./workflow_schema.md

External actor semantics
-> ../actors/

Human Approval Authority semantics
-> ../authorities/

Professional Responsibility semantics
-> ../roles/
```

This schema must not redefine those concerns.

---

## 3. Project Definition

A Project is the project-level namespace and context record through which MDS
resolves governed artifacts, sources, references, and applicable configuration.

MDS must preserve:

```text
Project structure
!=
Project delivery methodology

Project context
!=
Project Truth

Project reference
!=
Human Approval Authority
```

Raw or imported source material remains source material until the applicable
governed process establishes its status. A reference from the Project record
does not automatically make its target authoritative Project Truth.

---

## 4. Project Identity

Every Project must have a stable identity represented by:

```yaml
project_id: project-sample
project_key: SAMPLE
title: Sample Application
```

| Field | Required | Structural rule |
| --- | --- | --- |
| `project_id` | Yes | Opaque stable identity of the Project record within the applicable MDS data root. |
| `project_key` | Yes | Stable human-manageable namespace token used by governed artifact naming where applicable. |
| `title` | Yes | Human-readable project title. |
| `description` | No | Plain-language project summary. |

`project_key` must use the format and stability rules owned by:

```text
../standards/naming_convention.md
```

`project_id` identifies the Project object. `project_key` provides the stable
project namespace used in governed identities such as `ART-SAMPLE-0001`. They
are separate concepts and must not be treated as aliases.

`project_id` and `project_key` must not encode:

```text
Professional Responsibility
Human Approval Authority
AI agent identity
Lifecycle State
Workflow mode
Artifact Type
Implementation technology
```

The example `project-sample` is illustrative only. This schema does not create
a universal syntax for `project_id` beyond stable, unique representation.

---

## 5. Common Project Shape

The logical project record is:

```yaml
project_id: project-sample
project_key: SAMPLE
title: Sample Application
description: Optional project summary

context_refs: []
source_refs: []
actor_refs: []
authority_assignment_refs: []
responsibility_assignment_refs: []
workflow_ref: null

configuration: {}
metadata: {}
```

| Field | Required | Structural rule |
| --- | --- | --- |
| `context_refs` | No | References to project context artifacts or records; logical default is `[]`. |
| `source_refs` | No | References to preserved source material or source records; logical default is `[]`. |
| `actor_refs` | No | References to External Actors where applicable. |
| `authority_assignment_refs` | No | References to applicable authority assignments; no approval rule is defined here. |
| `responsibility_assignment_refs` | No | References to applicable responsibility assignments; no role contract or RACI is defined here. |
| `workflow_ref` | No | Reference to a workflow configuration or governed workflow contract. |
| `configuration` | No | Extensible project configuration object; logical default is `{}`. |
| `metadata` | No | Extension object owned by an applicable specific schema or project contract. |

Fields may be stored across project metadata, structured sidecars, local
persistence, or other implementation representations, provided MDS can
reconstruct the logical record without inventing information.

---

## 6. Project Context and Source References

Project context is represented through references rather than a fixed document
set. No specific filename is universally required.

For example:

```yaml
context_refs:
  - lineage_id: ART-SAMPLE-0001

source_refs:
  - ref: source/sample-intake
```

A governed context reference normally identifies a stable lineage. MDS resolves
an unpinned lineage reference through Artifact Truth; it must not mean “use the
latest version”.

An exact version may be supplied only when the Project intentionally pins it:

```yaml
context_refs:
  - lineage_id: ART-SAMPLE-0001
    version: 1.0.0
```

Where supplied, `version` must use the governed version-reference structure
required by `artifact_truth_schema.md`.

This schema does not require a project to contain any fixed combination of:

```text
intake_brief.md
feasibility.md
project_brief.md
business_context.md
constraints.md
```

Those files may remain historical source material or be referenced by a
specific workflow, template, or migration contract. They are not a universal
canonical Project Schema requirement.

### 6.1 Project-Level Constraints

Project-level constraints should normally be represented as governed context
or constraint references. This schema must not establish universal hard-coded
fields for technology stacks, budget, uptime targets, or compliance rules.

```text
Project configuration reference
!=
Universal project constraint semantics
```

---

## 7. Actor, Authority, and Responsibility References

Projects may reference actors, authority assignments, and responsibility
assignments when an applicable contract requires them.

The schema represents the reference only. It does not assign the referenced
entity's semantic role, responsibility, or authority.

```text
External Actor semantics
-> ../actors/

Human Approval Authority semantics
-> ../authorities/

Professional Responsibility semantics
-> ../roles/
```

MDS must preserve:

```text
Professional Responsibility
!=
Human Approval Authority

AI agent identity
!=
Project ownership or Human Approval Authority
```

This schema must not define fields or rules equivalent to:

```text
PM Agent owns the project

BA Agent owns requirements

Architecture Agent approves constraints

RACI by human or AI identity
```

---

## 8. Workflow and Configuration Boundary

`workflow_ref` may identify an applicable project workflow configuration.

Example:

```yaml
workflow_ref: workflow/sample
```

The Project Schema does not define workflow phases, gates, sequencing, or a
closed methodology enum.

In particular, it does not establish:

```text
Phase 00 / Phase 01 / Phase 02

strict_waterfall

hybrid_agile

fast_iteration
```

as universal MDS Project semantics.

`configuration` may contain values required by an applicable project or
integration contract. It must not silently introduce:

```text
Human Approval Authority semantics

Professional Responsibility semantics

relationship vocabulary

fixed SDLC methodology

implementation authority
```

Specific configuration keys must have an applicable semantic owner outside
this common structural schema.

---

## 9. Validation Rules

The Validator may evaluate this schema as a structural contract. Validation
does not grant approval, establish Current Project Truth, or select a delivery
methodology.

For every canonical Project write, the Validator must check:

```text
project_id is present and unique within the applicable MDS data root

project_key is present and conforms to the Naming Standard

title is present

all required references resolve or remain explicitly unresolved where allowed

governed context references include a resolvable lineage_id

an explicitly supplied governed context version resolves

an unpinned governed context reference resolves its lineage through Artifact
Truth and does not select the latest version

authority, responsibility, actor, and workflow references resolve when present

configuration and metadata do not replace required common fields
```

Validation results do not imply:

```text
Project approved

Scope approved

Architecture approved

Release approved
```

---

## 10. Legacy Compatibility

Historical project data may contain:

```text
fixed Project Profile documents

Phase 00 / Phase 01 / Phase 02

role-coded artifact identifiers

PM, BA, Architecture, or other AI-agent ownership fields

human or AI RACI configuration

strict_waterfall, hybrid_agile, or fast_iteration workflow modes

fixed intake, feasibility, or constraint approval rules
```

MDS may read, preserve, and explicitly map that data during migration. It is
not a canonical new-write requirement.

MDS must preserve:

```text
Legacy Read Compatibility
!=
Canonical Write Contract
```

Ambiguous legacy semantics must not be silently migrated. A migration record
must retain source provenance and mapping basis where a mapping occurs.

---

## 11. Invariants

### PROJECT-INV-001

Every Project has a stable project identity.

### PROJECT-INV-002

Project identity does not encode Professional Responsibility or methodology.

### PROJECT-INV-003

Project Context is not a mandatory fixed set of five documents.

### PROJECT-INV-004

Project Schema does not define a universal SDLC phase sequence.

### PROJECT-INV-005

Professional Responsibility does not imply Human Approval Authority.

### PROJECT-INV-006

AI agent identity does not grant ownership or approval authority.

### PROJECT-INV-007

Governed project artifacts consume Artifact Truth Schema.

### PROJECT-INV-008

Workflow configuration is separate from Project identity and Project Truth.

### PROJECT-INV-009

Project-level constraints are referenced governed knowledge, not universal
hard-coded Project fields.

### PROJECT-INV-010

Legacy Project Profile and workflow assumptions remain migration data rather
than canonical new-write requirements.

---

## 12. Transitional Status

This file remains transitional while focused project configuration, workflow,
and integration contracts are still being migrated to their canonical owners.

Its project identity, reference structure, and separation rules may be used
now. It must not become a universal project methodology or approval model.

---

## 13. Source of Truth

This schema owns only:

```text
project structural shape

project identity field representation

project-level reference representation

project configuration extension boundary

project structural validation constraints

legacy read-compatibility boundary
```

Detailed semantics route to their canonical owners:

```text
Project key and governed artifact identity
-> ../standards/naming_convention.md

Artifact Truth
-> ../standards/artifact_truth.md

Schema dependencies
-> ./artifact_truth_schema.md
-> ./entity_schema.md

Actors, authorities, and Professional Responsibilities
-> their respective MDS Core boundary directories

Workflow semantics
-> applicable canonical workflow model or governed workflow contract

Workflow structural representation
-> ./workflow_schema.md
```

Principle:

> **Project is the identity, context, and configuration layer for MDS—not a
> universal SDLC methodology, role contract, or approval model.**
