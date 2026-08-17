---
ownership: mds
status: transitional
source: internal
safe_to_modify: scoped
classification: entity_schema
semantic_owner:
  - ../standards/artifact_truth.md
  - ../standards/lifecycle_rules.md
  - ../standards/versioning_rules.md
  - ../standards/relationship_rules.md
  - ../standards/naming_convention.md
canonical_boundary_owners:
  - ../actors/
  - ../authorities/
  - ../roles/
  - ../implementation-plane/
  - ../runtime/
  - ../system-capabilities/
update_strategy: change only through the applicable governed approval process
---

# MDS Entity Structural Schema

## 1. Purpose

This schema defines the common structural contract for entities that MDS needs
to reference, index, relate, trace, or reason about.

An Entity is:

> A uniquely addressable governed or evidence-bearing object that MDS needs to
> reference, index, relate, trace, or reason about.

This schema owns:

```text
common entity shape

entity classification structure

identity-reference structure

relationship representation boundary

structural validation constraints

legacy read compatibility boundary
```

It does not define the complete business meaning of every entity type. It must
not become a master ontology for MDS.

---

## 2. Semantic Ownership

MDS preserves:

```text
Canonical model or standard
-> owns semantics

This schema
-> represents common entity structure and validates that representation
```

The following sources own the semantics consumed by this schema:

```text
Artifact Truth and lineage
-> ../standards/artifact_truth.md

Lifecycle and execution state
-> ../standards/lifecycle_rules.md

Version numbering
-> ../standards/versioning_rules.md

Relationship vocabulary and graph integrity
-> ../standards/relationship_rules.md

Naming and governed artifact identity
-> ../standards/naming_convention.md
```

This schema must not redefine those concerns.

---

## 3. Scope

This schema applies when MDS needs a common, addressable record for an entity
in a graph, index, traceability view, context package, validation result, or
other MDS projection.

It supports entities that are not governed artifacts. Therefore:

```text
Entity
!=
Governed Artifact
```

Conceptually:

```text
Entity
  |
  +-- Governed Artifact
  |     +-- consumes Artifact Truth Schema
  |
  +-- Evidence
  |     +-- may represent Implementation or Runtime evidence
  |
  +-- Boundary Entity
        +-- routes to an actor, authority, responsibility, system, or other
            canonical boundary owner
```

---

## 4. Entity Class and Entity Type

`entity_class` and `entity_type` are separate fields.

```text
entity_class
-> broad structural and boundary classification

entity_type
-> concrete type within that class
```

`entity_class` is required and must use one of these routing classes:

```text
governed_artifact
external_actor
authority
professional_responsibility
system_capability
implementation_entity
runtime_entity
system_record
```

These values are routing classifications. They do not redefine the semantics
of their referenced domain.

`entity_type` is required only where the applicable Entity Class exposes a
canonical type or classification. Its value is supplied by the applicable
canonical model or boundary contract.

This schema does not define a closed, universal taxonomy of `entity_type`
values and must not require a boundary to invent a parallel taxonomy.

For example:

```yaml
entity_class: governed_artifact
entity_type: requirement
```

does not imply:

```text
requirement -> Business Analysis responsibility
```

---

## 5. Common Entity Shape

Every Entity must have one stable, addressable identity appropriate to its
class. A logical common record is:

```yaml
entity_id: sample-record-0001
entity_class: system_record
entity_type: imported_source
title: Sample imported source
source_ref: source/sample-input
relationships: []
metadata: {}
```

The logical fields are:

| Field | Required | Structural rule |
| --- | --- | --- |
| `entity_id` | Conditional | Required for non-governed entities unless their applicable boundary defines an equivalent stable reference. |
| `entity_class` | Yes | One routing classification from Section 4. |
| `entity_type` | Conditional | Required only when its Entity Class exposes a canonical type or classification; its value comes from that boundary owner. |
| `title` | Conditional | Human display label when applicable. |
| `source_ref` | Conditional | Traceable source or provenance reference when applicable. |
| `relationships` | No | Canonical outbound relationship entries; logical default is `[]`. |
| `metadata` | No | Extension object owned by an applicable specific schema or boundary contract. |

Implementations may store these fields across Markdown frontmatter, structured
sidecars, SQLite, or another local persistence representation, provided the
logical record can be reconstructed without inventing values.

`sample-record-0001` is illustrative only. The identifier format for a
non-governed Entity is owned by its applicable Entity Class boundary. Governed
artifact identity follows `../standards/naming_convention.md`.

### 5.1 Identity Rules

`entity_id` must:

```text
be non-empty
be unique within its applicable entity namespace
remain stable for the represented entity
not be inferred from a display title
```

This schema does not impose one identifier format on every Entity Class.
Governed artifact identity has its own canonical owner.

### 5.2 Metadata Rules

`metadata` may contain class- or type-specific structural fields where an
applicable schema defines them.

It must not be used to silently introduce:

```text
a new entity class
a new relationship vocabulary
a Human Approval Authority grant
a Professional Responsibility contract
a replacement Artifact Truth model
```

---

## 6. Governed Artifact Entity

`governed_artifact` is a special Entity Class.

Every governed artifact must consume:

```text
./artifact_truth_schema.md
```

and the standards listed in Section 2.

This schema does not duplicate Artifact Truth fields or their semantics.
For governed artifacts, the common entity projection must preserve a
resolvable governed version reference:

```yaml
entity_class: governed_artifact
entity_type: requirement
artifact_ref:
  lineage_id: ART-SAMPLE-0001
  version: 1.0.0
title: Sample requirement
relationships: []
metadata: {}
```

`artifact_ref.lineage_id` and `artifact_ref.version` are governed identity
fields. Their format, lineage, lifecycle, validity, execution, approval, and
truth consequences remain owned by the Artifact Truth Schema and applicable
standards.

MDS must preserve:

```text
Governed artifact projection
!=
Replacement Artifact Truth record
```

### 6.1 Artifact Type Boundary

For a governed artifact:

```text
entity_type
-> artifact classification metadata
```

It must not encode or infer:

```text
Professional Responsibility
AI agent
artifact owner
Human Approval Authority
lifecycle state
version
```

The full Artifact Type taxonomy has no canonical owner in this schema. Until
an applicable canonical Artifact Model exists, `entity_type` remains
extensible and the legacy type taxonomy remains transitional migration data.

---

## 7. Boundary Entity Routing

Entities outside `governed_artifact` are classified structurally and routed to
their canonical boundary. This schema does not define their detailed meaning.

| Entity Class | Canonical semantic owner | Structural purpose in MDS |
| --- | --- | --- |
| `external_actor` | `../actors/` | Addressable external participant or source. |
| `authority` | `../authorities/` | Reference to a Human Approval Authority or applicable authority record. |
| `professional_responsibility` | `../roles/` | Reference to a professional responsibility. |
| `system_capability` | `../system-capabilities/` | Reference to an MDS System Capability. |
| `implementation_entity` | `../implementation-plane/` | Addressable Implementation Plane participant, environment, automation, or evidence. |
| `runtime_entity` | `../runtime/` | Addressable runtime observation, evidence, incident, or operational event. |
| `system_record` | Applicable system boundary | Addressable MDS-maintained, imported, derived, or system-level record not represented by another class. |

Illustrative boundary-owned types may include:

```text
implementation_entity
-> human_implementer
-> coding_agent
-> development_tool_environment
-> delivery_automation
-> implementation_evidence

runtime_entity
-> runtime_observation
-> telemetry_evidence
-> health_evidence
-> incident_evidence
-> operational_event
```

These are examples of classification supplied by the applicable boundary. They
do not define or expand that boundary's semantics.

Classification does not grant authority. In particular:

```text
Professional Responsibility != Human Approval Authority
System Capability != Human Approval Authority
AI != Human Approval Authority
```

References such as `responsibility_ref`, `assignment_ref`, or `authority_ref`
may be represented by an applicable specific schema. Their presence does not
create a responsibility contract or an approval grant.

---

## 8. Relationship Representation

Relationship semantics and graph integrity are owned by:

```text
../standards/relationship_rules.md
```

Until a focused relationship schema exists, this schema defines only the
following provisional common projection:

```yaml
relationships:
  - type: references
    target_ref:
      entity_id: sample-record-0002
    provenance_ref: source/sample-link
```

This provisional shape is not a permanent relationship serialization contract.
It must yield to a focused relationship schema when one is established.

Each provisional canonical outbound relationship entry must contain:

| Field | Required | Structural rule |
| --- | --- | --- |
| `type` | Yes | One canonical relationship token. |
| `target_ref` | Yes | A resolvable stable target identity appropriate to the target class. |
| `provenance_ref` | Conditional | Required where the applicable contract requires relationship provenance. |
| `metadata` | No | Extension fields defined by an applicable schema; no new relationship semantics. |

For a relationship targeting an exact governed artifact version, the target
reference must use the structure required by `artifact_truth_schema.md`.
That schema currently uses `target`, not `target_ref`:

```yaml
target:
  lineage_id: ART-SAMPLE-0002
  version: 1.0.0
```

The canonical v1 relationship tokens consumed by this schema are:

```text
depends_on
implements
adheres_to
verifies
evidences
mitigates
resolves
produces
elaborates
synthesizes
references
supersedes
```

This list represents allowed structural values only. The Relationship Standard
owns their meanings, direction, cardinality, and integrity constraints.

### 8.1 Derived Relationship Views

Canonical authored relationships are outbound. Inbound graph views may be
derived by MDS and must remain distinguishable from authored records.

```text
Stored canonical edge
!=
Derived inbound view
```

---

## 9. Source and Provenance References

Where an entity is imported, derived, observed, or evidence-bearing,
`source_ref` or another applicable provenance reference must identify its
traceable basis.

This schema permits a reference shape. It does not redefine provenance,
evidence, implementation, or runtime semantics.

Examples of structural sources include:

```text
imported source record
governed artifact version
implementation evidence record
runtime observation record
derived system result
```

Missing provenance must remain missing or explicitly unresolved. MDS must not
fabricate a source reference to satisfy a structural projection.

---

## 10. Validation Rules

The Validator may evaluate this schema as a structural contract. Validation
does not grant approval, change Project Truth, or make MDS an implementation
executor.

### 10.1 Common Validation

For every canonical Entity write, the Validator must check:

```text
entity_class is present and allowed
entity_type is present only where its boundary requires a canonical type
entity_type value comes from its applicable boundary owner
an identity appropriate to the Entity Class is present
the identity is unique within its applicable namespace
relationship entries conform to the applicable relationship structure
relationship types come from the Relationship Standard
extension metadata does not replace required common fields
```

### 10.2 Governed Artifact Validation

For `entity_class: governed_artifact`, the Validator must additionally check:

```text
artifact_ref is present
artifact_ref resolves to lineage_id plus version
the governed artifact consumes artifact_truth_schema.md
lifecycle, validity, execution, lineage, and truth fields are not redefined
by this entity projection
```

### 10.3 Boundary Validation

For other classes, the Validator must check that an entity reference does not
claim a semantic contract or authority owned by another boundary.

Examples of invalid structural claims include:

```text
an artifact type assigned directly to a Professional Responsibility
a Professional Responsibility treated as a Human Approval Authority
an implementation evidence record treated as implementation execution by MDS
a runtime observation treated automatically as Current Project Truth
```

---

## 11. Legacy Compatibility

Historical entity data may contain:

```text
role-coded entity IDs
role-coded artifact types
agent ownership assumptions
implementation task semantics
runtime concepts mixed into artifact taxonomy
legacy relationship values
```

MDS may read, preserve, and explicitly map those values during migration.
They are not canonical new-write values.

MDS must preserve:

```text
Legacy Read Compatibility
!=
Canonical Write Contract
```

Legacy values must not be silently transformed when their original meaning is
uncertain. A migration record must retain source provenance and the mapping
basis where mapping occurs.

---

## 12. Invariants

### ENTITY-INV-001

Every Entity has a stable addressable identity appropriate to its Entity Class.

### ENTITY-INV-002

Entity Class and Entity Type are separate concepts.

### ENTITY-INV-003

Artifact Type does not imply Professional Responsibility.

### ENTITY-INV-004

Professional Responsibility does not imply Human Approval Authority.

### ENTITY-INV-005

Governed Artifacts consume Artifact Truth Schema rather than redefining it.

### ENTITY-INV-006

Relationship semantics come from `relationship_rules.md`.

### ENTITY-INV-007

Implementation Plane entities do not make MDS an implementation executor.

### ENTITY-INV-008

Runtime evidence does not automatically become Project Truth.

### ENTITY-INV-009

Legacy role-coded entity types remain migration data, not canonical new-write
taxonomy.

### ENTITY-INV-010

Schemas represent semantic models; they do not become semantic authorities.

---

## 13. Transitional Status

This file is transitional because the full canonical Artifact Type model has
not yet been established outside this schema.

Its common entity structure, separation rules, and validation boundary may be
used now. It must not freeze legacy entity types into a permanent taxonomy or
take semantic ownership from the applicable canonical standards and boundary
models.

---

## 14. Source of Truth

This schema owns only:

```text
common entity structural shape
entity classification representation
common entity validation constraints
generic relationship reference structure
legacy read-compatibility boundary
```

Detailed semantics route to their canonical owners:

```text
Artifact Truth
-> ../standards/artifact_truth.md

Naming and stable governed identity
-> ../standards/naming_convention.md

Lifecycle and execution
-> ../standards/lifecycle_rules.md

Version numbering
-> ../standards/versioning_rules.md

Relationships
-> ../standards/relationship_rules.md

Actors, authorities, roles, Implementation Plane, runtime, and capabilities
-> their respective MDS Core boundary directories
```

Principle:

> **Entity is the reference, index, and graph layer for MDS—not a universal
> ontology that owns the meaning of everything MDS can reference.**
