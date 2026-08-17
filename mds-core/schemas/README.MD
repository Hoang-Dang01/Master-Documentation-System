---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: schemas
update_strategy: change only through the applicable governed approval process
---

# MDS Schemas

This directory contains machine-facing structural contracts used by MDS.

Schemas define how governed concepts are represented and validated.

They do not independently define the meaning of those concepts.

The core rule is:

> **Canonical models and standards own semantics. Schemas encode structure,
> constraints, and machine-validatable representations of those semantics.**

---

## 1. Purpose

`schemas/` exists to define structured contracts for MDS data such as:

```text
artifact metadata

identity fields

state fields

relationships

project configuration

Professional Responsibility references

workflow configuration

evidence references

validation constraints
```

A schema answers:

> How must this governed concept be represented so MDS can store, validate,
> index, exchange, and reconstruct it safely?

A schema does not answer:

> What does this concept fundamentally mean?

Meaning belongs to the applicable canonical model or standard.

---

## 2. Core Principle

MDS preserves:

```text
Semantic Owner
      ↓
Schema Representation
      ↓
Template / Prompt / UI / Index / Consumer
```

not:

```text
Schema
      ↓
Invents Domain Meaning
```

For example:

```text
Artifact Truth semantics
→ ../standards/artifact_truth.md

Artifact Truth structured representation
→ ./artifact_truth_schema.md
```

Likewise:

```text
Relationship semantics
→ ../standards/relationship_rules.md

Relationship field structure
→ schema owned by this directory
```

A schema must not silently redefine its semantic owner.

---

## 3. What Schemas Own

Schemas may canonically own:

```text
field names

field types

required / optional status

allowed enum representation

structural composition

reference structure

identifier representation

validation constraints

conditional field requirements

serialization expectations

migration compatibility fields
```

Schemas may also define machine-validatable cross-record constraints where
those constraints directly implement an existing canonical semantic rule.

---

## 4. What Schemas Do Not Own

Schemas do not independently own:

```text
Artifact Truth meaning

Lifecycle meaning

Validity meaning

Execution meaning

Professional Responsibility meaning

Human Approval Authority

System Capability authority

Implementation authority

Runtime semantics

Relationship semantics

Version bump meaning

project methodology

business meaning

architecture decisions
```

Those concerns belong to their respective canonical owners.

---

## 5. Standards and Schemas

MDS must preserve:

```text
Standard
→ owns governed semantics

Schema
→ represents and validates those semantics
```

The primary standards consumed by this directory are:

```text
Artifact Truth and Lineage
→ ../standards/artifact_truth.md

Lifecycle and Execution
→ ../standards/lifecycle_rules.md

Version Numbering
→ ../standards/versioning_rules.md

Relationships
→ ../standards/relationship_rules.md

Naming and Stable Identity
→ ../standards/naming_convention.md
```

If a schema conflicts with a canonical standard for the same concern, the
schema is stale and must be migrated.

---

## 6. Domain Models and Schemas

Not every semantic concern belongs to a standard.

Some concepts are owned by canonical domain models.

Examples include:

```text
External Actors
→ ../actors/

Human Approval Authorities
→ ../authorities/

Professional Responsibilities
→ ../roles/

Implementation Plane
→ ../implementation-plane/

Runtime
→ ../runtime/

MDS System Capabilities
→ ../system-capabilities/
```

Schemas may reference those concepts.

They must not redefine them.

---

## 7. Schema is not Authority

A field being present in a schema does not grant authority.

For example:

```text
approver
```

or:

```text
authority_ref
```

may represent an approval relationship.

The schema does not decide who is allowed to approve.

That meaning belongs to:

```text
../authorities/
```

MDS must preserve:

```text
Schema Field
≠
Human Approval Authority
```

---

## 8. Schema is not Professional Responsibility

A schema may represent:

```text
responsibility_ref

contributor_ref

assignment_ref
```

where required.

Those fields must not cause the schema to define what a Professional
Responsibility is allowed to do.

Professional Responsibility semantics belong to:

```text
../roles/
```

MDS must preserve:

```text
Role Reference
≠
Role Contract
```

---

## 9. Schema is not an AI Contract

Schemas must not encode assumptions such as:

```text
BE Agent writes code

FE Agent writes code

QA Agent approves testing

DevOps Agent deploys

AI Agent owns an artifact
```

unless those values are being preserved explicitly as legacy data.

AI behaviour belongs to the applicable Professional Responsibility,
System Capability, Prompt, and governance model.

A schema represents data.

It does not create autonomous authority.

---

## 10. Schema and Implementation Plane

MDS schemas may represent implementation evidence.

For example:

```text
repository reference

commit reference

build result

test result

implementation status

evidence provenance
```

This does not make implementation an MDS System Capability.

MDS must preserve:

```text
Implementation Evidence Representation
≠
Implementation Execution
```

Implementation execution belongs to:

```text
../implementation-plane/
```

---

## 11. Schema and Runtime

Schemas may represent runtime evidence such as:

```text
observation

telemetry reference

health evidence

incident evidence

operational event
```

Representation of runtime evidence does not make Project Truth identical to
runtime state.

Runtime semantics belong to:

```text
../runtime/
```

---

# Common Structural Principles

## 12. Concern Separation

Schemas should preserve independent concepts as independent fields.

For governed artifact state:

```text
lifecycle_state

validity_state

execution_state
```

must remain separate.

Schemas must not collapse them into:

```text
status
```

when doing so would destroy canonical semantic distinctions.

---

## 13. Identity Separation

For governed versioned artifacts, schemas should preserve:

```text
lineage_id

version
```

as separate concepts.

MDS must preserve:

```text
Stable Identity
≠
Version
≠
Artifact Type
≠
Professional Responsibility
```

Canonical identity semantics belong to:

```text
../standards/naming_convention.md
```

---

## 14. Role-Neutral Canonical Identity

New canonical schemas must not require role-coded identifiers such as:

```text
BA-REQ-...

SA-NFR-...

ARCH-ADR-...

BE-API-...

FE-UI-...

QA-TC-...

PM-TSK-...
```

Legacy identifiers may remain readable during migration.

New canonical identity must consume:

```text
../standards/naming_convention.md
```

---

## 15. Classification is Metadata

Artifact classification should be represented explicitly.

Conceptually:

```yaml
lineage_id: ART-SAMPLE-0001
artifact_type: requirement
```

Consumers must not derive:

```text
artifact_type
```

from:

```text
lineage_id
```

or Professional Responsibility.

---

## 16. Relationship Representation

Schemas may define how canonical relationships are serialized.

Relationship semantics belong to:

```text
../standards/relationship_rules.md
```

A structural representation should preserve enough information to determine:

```text
source

relationship type

target

target version where required

provenance where required
```

Schemas must not introduce global relationship types that are absent from the
canonical relationship standard.

---

## 17. Canonical Outbound Relationships

Where canonical relationships are stored on an artifact, schemas should prefer
one authored semantic direction.

Inbound views should normally be derived.

MDS must preserve:

```text
Stored Canonical Edge
≠
Derived Inbound View
```

The exact representation may evolve without changing relationship semantics.

---

## 18. Evidence References

Schemas should distinguish evidence from authority.

An evidence reference may support:

```text
validity analysis

verification

implementation conformance

runtime observation

governed decisions
```

but:

```text
Evidence Reference
≠
Approval Record
```

where those concepts are semantically different.

---

## 19. Provenance

Where required, schema structures should preserve sufficient provenance to
answer:

```text
where did this value come from?

who or what produced it?

when was it produced?

which source version was used?

was it authored, derived, imported, or AI-suggested?

which evidence supports it?
```

The required provenance fields depend on the applicable contract.

Schemas must not fabricate missing provenance.

---

## 20. Unknown and Missing Information

A schema must not force consumers to invent a value merely because a field is
required structurally.

Where canonical semantics allow uncertainty, the schema should support an
appropriate representation such as:

```text
null

UNKNOWN

explicit unresolved reference

conditional absence
```

depending on the field contract.

The exact representation must remain consistent with the semantic owner.

---

## 21. Derived Data

Schemas may represent derived data.

Derived data must remain distinguishable from canonical source data.

Examples include:

```text
graph indexes

search indexes

calculated impact paths

cached Current Project Truth projections

computed validation summaries
```

MDS must preserve:

```text
Derived Data
≠
Independent Canonical Source
```

---

## 22. Storage Independence

A semantic schema should avoid making one storage implementation part of the
domain meaning unless the storage structure itself is the governed concern.

For example:

```text
SQLite

JSON manifest

Markdown file path

database table

cache file
```

are normally implementation representations.

Schema contracts may describe them where necessary for interoperability or
persistence, but must not confuse:

```text
Storage Mechanism
```

with:

```text
Semantic Authority
```

---

# Current Schema Inventory

## 23. `artifact_truth_schema.md`

Target status:

```text
canonical after migration
```

Intended ownership:

```text
structured artifact truth metadata

state field representation

lineage reference representation

validity evidence representation

machine-validatable Artifact Truth constraints
```

Semantic dependencies:

```text
../standards/artifact_truth.md

../standards/lifecycle_rules.md

../standards/versioning_rules.md

../standards/relationship_rules.md

../standards/naming_convention.md
```

Known migration concerns include:

```text
legacy role-coded identifiers

storage-specific lineage manifest semantics

approval-record representation

validity evidence structure

authoritative-context representation
```

---

## 24. `entity_schema.md`

Current status:

```text
transitional
```

The current file mixes:

```text
artifact taxonomy

artifact semantics

role-coded identity

Professional Responsibility

Implementation Plane concepts

Runtime concepts

relationship vocabulary
```

Those concerns must be separated.

The future schema may represent entity classification and common entity
structure.

It must not independently own the meaning of every entity type.

---

## 25. `project_schema.md`

Current status:

```text
transitional
```

The current file mixes:

```text
project context structure

fixed project documents

project methodology

phase gates

Professional Responsibility

AI ownership

Human Approval Authority

artifact metadata
```

The future project schema should represent project-level configuration and
context structure without turning one delivery methodology into a universal
MDS law.

---

## 26. `role_schema.md`

Current status:

```text
transitional
```

Professional Responsibility semantics belong to:

```text
../roles/
```

The future role schema should only represent structured references or
configuration required by the canonical Professional Responsibility model.

It must not independently define:

```text
role taxonomy

role mission

implementation authority

approval authority

AI executor identity
```

---

## 27. `workflow_schema.md`

Current status:

```text
transitional
```

The current file mixes:

```text
project methodology

fixed phases

Professional Responsibility

RACI

Human Approval Authority

Implementation execution

deployment

runtime

artifact metadata

entity schemas
```

A future workflow schema may represent configurable governed workflow
structures.

It must not make one fixed ten-phase lifecycle universally mandatory unless a
separate canonical workflow contract explicitly establishes that requirement.

---

# Workflow Schema Boundary

## 28. Artifact Lifecycle is not Project Methodology

MDS must preserve:

```text
Artifact Lifecycle
≠
Project Delivery Methodology
```

Artifact lifecycle semantics belong to:

```text
../standards/lifecycle_rules.md
```

A project workflow may contain:

```text
activities

gates

dependencies

iterations

parallel work

reviews
```

without changing the canonical artifact Lifecycle State vocabulary.

---

## 29. Workflow Configuration is not Truth

A workflow configuration may determine:

```text
when an activity may start

which gate applies

which evidence is required

which Authority Type is required
```

It does not itself establish that an artifact is:

```text
CURRENT

APPROVED

authoritative
```

Those facts resolve through their canonical owners.

---

## 30. Workflow Gate is not Approver Identity

A workflow schema may reference:

```text
required_authority_type
```

where applicable.

It must not hard-code approval by Professional Responsibility labels such as:

```text
BA approves

SA approves

ARCH approves

QA approves

PM approves
```

Human Approval Authority belongs to:

```text
../authorities/
```

---

# Artifact-Type Boundary

## 31. Entity Type is not Role Ownership

A schema may classify an artifact as:

```text
requirement

architecture_decision

api_contract

verification_case

risk

incident
```

if those artifact types are established by the applicable canonical artifact
model.

It must not infer:

```text
requirement → BA owns

api_contract → BE owns

test_case → QA owns
```

as a universal schema rule.

MDS must preserve:

```text
Artifact Type
≠
Professional Responsibility
```

---

## 32. Artifact Type is not Authority

Likewise:

```text
Artifact Type
≠
Required Human Approver
```

The applicable governance gate determines the required Authority Type.

The schema may encode that reference.

It must not infer it from a filename prefix or role-coded ID.

---

## 33. Artifact Model Dependency

The current schema inventory does not yet provide a clean canonical owner for
the full governed Artifact Type taxonomy.

Until that model is established:

```text
entity_schema.md
```

must remain transitional.

Schemas must not freeze the legacy 23-type taxonomy as permanent MDS semantics
merely because it already exists.

---

# Validation

## 34. Validator Relationship

Schemas provide machine-readable constraints that may be consumed by the MDS
Validator.

The Validator may determine:

```text
valid

invalid

warning

unknown
```

according to the applicable validation contract.

MDS must preserve:

```text
Schema Validation
≠
Human Approval
```

Validator semantics belong to:

```text
../system-capabilities/
```

---

## 35. Validation Failure

A schema validation failure means:

> The represented data does not satisfy the applicable structural contract.

It does not automatically mean:

```text
Human rejection

business rejection

architecture rejection

release rejection
```

An applicable governance rule may use validation results as gate evidence.

The schema itself does not make the governed decision.

---

# Compatibility and Migration

## 36. Legacy Data

Legacy data may contain:

```text
role-coded IDs

agent ownership fields

legacy relationship types

phase numbers

fixed workflow modes

legacy approval fields

storage-specific metadata
```

Schemas may support reading those values during migration.

Legacy compatibility must not make them canonical for new writes.

---

## 37. Read Compatibility vs Canonical Write

MDS should distinguish:

```text
Legacy Read Compatibility
```

from:

```text
Canonical Write Contract
```

A field may be accepted when importing historical content while being
disallowed for new canonical artifacts.

Migration should preserve source provenance.

---

## 38. No Silent Migration

Schemas and validators must not silently transform governed meaning.

For example:

```text
legacy role-coded ID
```

must not be replaced with a new identity without an explicit identity migration.

Likewise:

```text
legacy relationship type
```

must not be mapped to a canonical relationship unless the original semantic
meaning is sufficiently established.

---

## 39. Migration Order

The schema migration should proceed in this order:

```text
1. schemas/README.md
   → establish ownership and migration boundaries

2. artifact_truth_schema.md
   → align the common governed artifact state contract

3. entity_schema.md
   → separate entity structure from artifact semantics

4. project_schema.md
   → separate project configuration from methodology and authority

5. workflow_schema.md
   → reduce fixed SDLC assumptions and external execution authority

6. role_schema.md
   → finalize only after canonical roles are reviewed
```

`role_schema.md` is intentionally last because the structured contract should
consume the final Professional Responsibility model rather than drive it.

Migration order does not establish semantic precedence.

---

## 40. Source of Truth

This README owns only:

```text
schemas directory purpose

schema ownership boundary

schema-to-semantic-owner routing

current schema migration classification

schema migration order
```

Detailed structural contracts belong to the applicable schema file.

Semantic meaning belongs to the applicable canonical standard or domain model.

Principle:

> **Models and standards define what governed knowledge means. Schemas define
> how that knowledge is represented without changing its meaning.**