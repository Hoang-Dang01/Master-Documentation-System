---
ownership: mds
status: transitional
source: internal
safe_to_modify: scoped
classification: workflow_structure_schema
semantic_owner:
  - ../standards/artifact_truth.md
  - ../standards/lifecycle_rules.md
  - ../standards/relationship_rules.md
  - ../authorities/
  - ../roles/
  - ../implementation-plane/
  - ../runtime/
  - ../system-capabilities/
schema_dependencies:
  - ./artifact_truth_schema.md
  - ./entity_schema.md
update_strategy: change only through the applicable governed approval process
---

# MDS Workflow Structure Schema

## 1. Purpose

This schema defines the structural representation of a configurable governed
workflow in MDS. It supports storage, validation, exchange, and execution
routing without defining one universal project delivery methodology.

```text
Workflow
├── identity
├── activities[]
├── transitions[]
├── gates[]
├── configuration
└── metadata
```

Examples in this document are illustrative only. They do not establish a
universal identifier grammar, methodology, or artifact taxonomy.

## 2. Ownership Boundary

This schema owns only workflow representation and its machine-validatable
constraints. It may represent:

```text
workflow identity
activities and their references
transitions and dependencies
gates and their requirement references
entry and terminal markers
configuration and metadata
```

It does not independently define:

```text
project delivery methodology
artifact lifecycle semantics
Human Approval Authority
Professional Responsibility semantics
System Capability semantics
implementation execution
runtime semantics
Artifact Truth
relationship vocabulary
project-specific evidence thresholds
```

Canonical semantics remain with their applicable owners:

```text
Artifact Truth and lineage       → ../standards/artifact_truth.md
Lifecycle and execution state    → ../standards/lifecycle_rules.md
Relationship vocabulary          → ../standards/relationship_rules.md
Human Approval Authorities       → ../authorities/
Professional Responsibilities    → ../roles/
Implementation execution         → ../implementation-plane/
Runtime evidence and observation → ../runtime/
MDS System Capabilities          → ../system-capabilities/
```

## 3. Workflow Definition

A workflow is a named, configurable graph of governed coordination activities,
transitions, and optional gates. It may be sequential, parallel, branching,
iterative, or project-specific. It does not need to use the term `phase`.

```yaml
workflow_id: sample-workflow
title: Sample workflow
description: Optional bounded description
activities: []
transitions: []
gates: []
configuration: {}
metadata: {}
```

`workflow_id` is a stable opaque workflow record identity. Its format is
defined by the applicable project or workflow contract; this schema does not
invent a universal syntax. A project may reference it through `workflow_ref`
as defined by `project_schema.md`.

## 4. Activities

An activity is a unit of governed work or coordination represented in a
workflow.

```yaml
activities:
  - activity_id: analyse-change
    title: Analyse requested change
    description: Optional activity description
    responsibility_refs: []
    input_refs: []
    output_refs: []
    gate_refs: []
    entry: false
    terminal: false
    metadata: {}
```

| Field | Structural purpose |
| --- | --- |
| `activity_id` | Unique identity within this workflow. |
| `title` | Human-readable activity label. |
| `description` | Optional bounded explanation. |
| `responsibility_refs` | Optional Professional Responsibility references. |
| `input_refs` / `output_refs` | Optional input and output references. |
| `gate_refs` | Optional relevant gate references. |
| `entry` / `terminal` | Optional structural markers. |
| `metadata` | Extensible non-semantic representation data. |

`activity_id` is not a Professional Responsibility. An activity may reference
one or more responsibilities, but their semantics remain owned by
`../roles/`.

An activity is not an Artifact Lifecycle State. It may observe or require an
artifact condition through an applicable reference or gate contract, but it
must not redefine `DRAFT`, `REVIEW`, `APPROVED`, or other lifecycle states.

An activity does not create authority merely because it is associated with a
person, responsibility, external actor, or System Capability.

## 5. Transitions and Dependencies

A transition represents permitted movement from one activity to another.

```yaml
transitions:
  - from: analyse-change
    to: review-impact
    condition_ref: null
    metadata: {}
```

`from` and `to` must resolve to activity identifiers in the same workflow.
`condition_ref`, when used, is interpreted by an applicable governed
contract; this schema defines no universal condition semantics.

Rework, rollback, branching, and loops are represented as explicit
transitions. The schema does not require `allowed_next`, `rollback_to`, or a
fixed phase sequence.

Workflow graphs are not universally required to be directed acyclic graphs.
Cycles may be valid when a workflow intentionally supports iteration.

Dependencies may be represented where an applicable workflow contract needs
them. They do not establish a delivery methodology by themselves.

## 6. Gates

A gate is a structural control point that may constrain an activity or
transition until applicable requirements are satisfied.

```yaml
gates:
  - gate_id: impact-review-ready
    title: Impact review readiness
    controlled_activity_refs:
      - review-impact
    evidence_requirement_refs: []
    validation_requirement_refs: []
    authority_requirement_ref: null
    decision_requirement_ref: null
    metadata: {}
```

The schema may represent evidence, validation, authority, and decision
requirement references. Their semantics remain owned by applicable contracts.

```text
Workflow Gate
≠
Human Approval Authority

Validation PASS
≠
Human Approval
```

`authority_requirement_ref` may identify a required authority type or
authority contract. It must not encode a universal approver or infer authority
from a Professional Responsibility label.

Specific evidence thresholds, release criteria, test-pass percentages, uptime
targets, and other policy values belong to project-specific governed contracts,
not to this common schema.

## 7. References

Workflow references must remain typed or resolvable under their applicable
contract. Common categories include:

```text
Professional Responsibility reference
Authority requirement reference
Artifact or evidence reference
Validation requirement reference
Decision requirement reference
System Capability reference
Runtime evidence reference
Implementation evidence reference
```

When a reference targets a governed artifact version, it must consume the
applicable Artifact Truth representation in `artifact_truth_schema.md`.

```text
Responsibility reference ≠ Professional Responsibility contract
Authority reference      ≠ Approval decision
Evidence reference       ≠ Evidence is sufficient
```

## 8. Artifact Truth and Lifecycle Boundary

Workflow execution does not establish Artifact Truth. The following inferences
are invalid unless a separate canonical governance process establishes them:

```text
workflow step completed → artifact is CURRENT
workflow gate passed    → artifact is APPROVED
activity completed      → artifact is authoritative
```

Artifact lifecycle, validity, lineage, approved-head, and Current Project Truth
semantics belong to the applicable standards. A workflow may coordinate work
around those concepts without redefining them.

## 9. Implementation and Runtime Boundary

This schema may represent coordination handoffs and references to external
execution evidence. It must not declare MDS or its capabilities to be an
implementation executor.

It does not define that an agent generates source code, changes test code,
deploys a release, or operates production infrastructure.

```text
Workflow Coordination  ≠ Implementation Execution
Deployment Completion  ≠ Runtime Health
```

Implementation execution belongs to `../implementation-plane/`. Runtime
observations and health evidence belong to `../runtime/`. System Capabilities
may be referenced where applicable, but are not Professional Responsibilities
or Human Approval Authorities.

## 10. Configuration and Metadata

`configuration` may carry a small extensible object for an applicable workflow
definition. `metadata` may carry descriptive, provenance, or interoperability
information.

Neither field may silently redefine:

```text
Human Approval Authority
Professional Responsibility semantics
Artifact Truth
relationship vocabulary
implementation authority
runtime semantics
a mandatory methodology
```

Every non-trivial configuration key must have an applicable semantic owner or
workflow-definition contract.

## 11. Structural Validation

The Validator may check structural properties including:

```text
workflow_id is present
activity identifiers are unique
gate identifiers are unique
transition endpoints resolve
gate references resolve
responsibility references resolve when present
authority requirement references resolve when present
evidence and validation requirement references resolve when present
duplicate transitions are detected
dangling transitions are invalid
unreachable activities are reported where applicable
```

An applicable contract may define whether a self-transition is valid. The
common schema does not prohibit all loops or require one linear path. Schema
validation is not a Human Approval decision.

## 12. Legacy Compatibility

Historical workflow data may contain a fixed ten-phase lifecycle, phase
numbers, named Gate 00 through Gate 09, `allowed_next`, `rollback_to`,
`workflow_mode`, phase RACI entries, role-coded ownership, agent execution,
fixed artifact lists, quality thresholds, or runtime/SLA rules.

```text
strict_waterfall
hybrid_agile
fast_iteration
```

These legacy values are readable migration data only. They are not canonical
new-write requirements and must not be silently translated where their meaning
is ambiguous.

```text
Legacy Read Compatibility
≠
Canonical Write Contract
```

## 13. Invariants

```text
WORKFLOW-INV-001
Workflow Structure does not define one universal project delivery methodology.

WORKFLOW-INV-002
Workflow Activity is separate from Artifact Lifecycle State.

WORKFLOW-INV-003
Workflow Gate does not itself grant Human Approval Authority.

WORKFLOW-INV-004
Professional Responsibility does not imply Human Approval Authority.

WORKFLOW-INV-005
System Capability does not imply Professional Responsibility or Human Approval
Authority.

WORKFLOW-INV-006
Workflow coordination does not make MDS an implementation executor.

WORKFLOW-INV-007
Workflow completion does not establish Current Project Truth.

WORKFLOW-INV-008
Runtime evidence does not automatically establish workflow or Project Truth
success.

WORKFLOW-INV-009
Workflow graphs may support iteration and are not universally required to be
directed acyclic graphs.

WORKFLOW-INV-010
Legacy ten-phase workflows and workflow modes remain migration data rather
than canonical new-write requirements.
```

## 14. Transitional Status and Source of Truth

This schema remains `transitional` because MDS does not yet have a separate,
fully canonical Workflow Semantic Model.

It owns only the structural workflow representation described here. It consumes
rather than redefines semantics held by standards and canonical domain
boundaries.

Workflow instances and automations belong in versioned definitions under:

```text
../../workflows/definitions/
```

Those definitions must conform to this structural boundary and must not use a
common schema to bypass applicable approval, truth, implementation, or runtime
boundaries.
