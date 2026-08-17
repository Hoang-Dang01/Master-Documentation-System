---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: artifact_truth_schema
semantic_owner:
  - ../standards/artifact_truth.md
  - ../standards/lifecycle_rules.md
  - ../standards/versioning_rules.md
  - ../standards/relationship_rules.md
  - ../standards/naming_convention.md
update_strategy: change only through the applicable governed approval process
---

# MDS Artifact Truth Schema

## 1. Purpose

This schema defines the machine-facing structural contract required to represent
Artifact Truth metadata for versioned governed MDS artifacts.

The applicable standards own semantics.

This schema owns:

```text
field shape

field presence rules

field type constraints

state representation

version identity representation

state provenance representation

truth-relevant relationship representation

machine-validatable cross-record constraints

legacy read compatibility
```

MDS must preserve:

```text
Semantic Rule
→ Canonical Standard

Structured Representation
→ This Schema
```

This schema must not redefine the meaning of Artifact Truth.

---

## 2. Semantic Owners

This schema consumes the following canonical standards:

```text
Artifact Validity
Version Lineage
Approved Lineage Head
Current Project Truth
→ ../standards/artifact_truth.md

Lifecycle State
Execution State
→ ../standards/lifecycle_rules.md

Version Number
→ ../standards/versioning_rules.md

Relationship Semantics
→ ../standards/relationship_rules.md

Stable Identity
→ ../standards/naming_convention.md
```

If this schema conflicts with one of those standards for the same semantic
concern, this schema is stale and must be migrated.

---

## 3. Scope

This schema applies to:

```text
versioned governed artifacts
```

It defines the common truth-related metadata needed by MDS to reason about:

```text
identity

version

lifecycle

validity

execution

lineage

supersession

governance provenance

validity evidence

state transition history

Current Project Truth eligibility
```

Artifact-type-specific fields belong to the applicable artifact schema.

---

# Logical Record

## 4. Canonical Logical Shape

A versioned governed artifact should expose the following logical structure:

```yaml
lineage_id: ART-SAMPLE-0001
version: 1.0.0

lifecycle_state: DRAFT
validity_state: CURRENT
execution_state: NOT_APPLICABLE

relationships: []

governance_decision_refs: []

validity_evidence_refs: []

state_history: []
```

This is a logical schema.

It does not require every field to be physically stored in the same file.

An implementation may distribute the logical record across:

```text
Markdown

structured sidecar data

SQLite

other local persistence
```

provided MDS can reconstruct the governed logical record deterministically.

---

## 5. Storage Independence

This schema does not declare any particular storage mechanism to be the source
of semantic authority merely because it stores one of these fields.

MDS must preserve:

```text
Logical Artifact Truth Record
≠
Specific Storage File
```

Therefore this schema does not require:

```text
lineage.json

manifest.json

SQLite

specific table names

specific filesystem paths
```

as part of Artifact Truth semantics.

Persistence architecture may define those mechanisms separately.

---

# Core Identity Fields

## 6. `lineage_id`

Field:

```yaml
lineage_id: ART-SAMPLE-0001
```

Type:

```text
string
```

Required:

```text
YES
```

for versioned governed artifacts.

Meaning is owned by:

```text
../standards/naming_convention.md
```

Canonical new-write format:

```text
ART-<PROJECT_KEY>-<SEQUENCE>
```

Example:

```text
ART-SAMPLE-0001
```

The value identifies one governed artifact lineage.

It remains stable across successor versions.

---

## 7. `lineage_id` Constraints

A canonical `lineage_id` must:

```text
be non-empty

be unique within the applicable workspace namespace

remain stable across the lineage

not encode version

not encode lifecycle

not encode Professional Responsibility

not encode Artifact Type
```

MDS must not derive Artifact Type or Professional Responsibility from the
identifier.

---

## 8. Legacy Identity Compatibility

Legacy artifacts may contain role-coded identifiers such as:

```text
BA-REQ-...

SA-NFR-...

ARCH-ADR-...

BE-API-...

FE-UI-...

QA-TC-...

PM-TSK-...
```

Such identifiers may remain readable during migration.

They must not become the canonical format for new writes.

MDS must preserve:

```text
Legacy Read Compatibility
≠
Canonical Write Contract
```

Legacy identity migration must follow:

```text
../standards/naming_convention.md
```

---

## 9. `version`

Field:

```yaml
version: 1.0.0
```

Type:

```text
string
```

Required:

```text
YES
```

Meaning is owned by:

```text
../standards/versioning_rules.md
```

Canonical format:

```text
MAJOR.MINOR.PATCH
```

Canonical values must not contain:

```text
v prefix

-draft suffix

-review suffix

-approved suffix

-rc suffix
```

Lifecycle is represented separately.

---

## 10. Version Identity

A specific governed artifact version is logically identified by:

```text
lineage_id + version
```

Human-readable notation:

```text
ART-SAMPLE-0001@1.0.0
```

This notation does not create a second lineage identifier.

MDS must preserve:

```text
lineage_id
→ stable artifact lineage

version
→ semantic revision

lineage_id + version
→ exact artifact version
```

---

## 11. Version Pair Uniqueness

The pair:

```text
(lineage_id, version)
```

must be unique.

Invalid:

```text
ART-SAMPLE-0001@1.0.0
ART-SAMPLE-0001@1.0.0
```

representing two different canonical artifact versions.

The Validator must detect duplicate version identity.

---

# State Fields

## 12. Three Independent State Fields

The canonical schema uses three separate fields:

```yaml
lifecycle_state: DRAFT
validity_state: CURRENT
execution_state: NOT_APPLICABLE
```

MDS must preserve:

```text
lifecycle_state
≠
validity_state
≠
execution_state
```

A generic field such as:

```yaml
status: APPROVED
```

must not replace the three-axis model where doing so loses semantic
information.

---

# Lifecycle State

## 13. `lifecycle_state`

Field:

```yaml
lifecycle_state: DRAFT
```

Type:

```text
enum
```

Required:

```text
YES
```

Canonical values:

```text
DRAFT

REVIEW

APPROVED

DEPRECATED

ARCHIVED
```

Semantics belong to:

```text
../standards/lifecycle_rules.md
```

The schema validates representation.

It does not redefine lifecycle meaning.

---

## 14. Lifecycle Validation

The Validator must reject values outside the canonical vocabulary for new
canonical writes.

Invalid examples:

```text
PENDING

FINAL

DONE

ACTIVE

REJECTED

SUPERSEDED
```

unless a future canonical lifecycle standard explicitly introduces them.

Decision outcomes such as rejection must not automatically become Lifecycle
States.

---

# Validity State

## 15. `validity_state`

Field:

```yaml
validity_state: CURRENT
```

Type:

```text
enum
```

Required:

```text
YES
```

Canonical values:

```text
CURRENT

NEEDS_REVIEW

STALE

CONFLICTED
```

Semantics belong to:

```text
../standards/artifact_truth.md
```

---

## 16. No Silent `CURRENT` Default

If `validity_state` is absent from a legacy artifact, MDS must not silently
interpret the artifact as:

```text
CURRENT
```

The migration process must determine the state through applicable governed
evidence.

Until that determination is made, the artifact must remain distinguishable as
unresolved migration state.

The persistence representation may use:

```text
missing

null

UNKNOWN
```

according to the migration contract.

`UNKNOWN` is not introduced here as a canonical Validity State.

It represents insufficient knowledge during migration or observation.

---

## 17. Non-Current Validity Evidence

The following Validity States require traceable supporting basis:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

Therefore:

```text
validity_evidence_refs
```

must contain at least one applicable reference or the associated state
transition record must contain sufficient evidence references.

MDS must reject a canonical transition that produces:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

without a traceable basis where the Artifact Truth Standard requires one.

---

# Execution State

## 18. `execution_state`

Field:

```yaml
execution_state: NOT_APPLICABLE
```

Type:

```text
enum
```

Required:

```text
YES
```

Canonical values:

```text
NOT_STARTED

IN_PROGRESS

BLOCKED

COMPLETED

NOT_APPLICABLE
```

Semantics belong to:

```text
../standards/lifecycle_rules.md
```

---

## 19. Execution Does not Establish Truth

The schema must not infer:

```text
execution_state: COMPLETED
```

as:

```text
lifecycle_state: APPROVED
```

or:

```text
validity_state: CURRENT
```

MDS must preserve:

```text
COMPLETED
≠
APPROVED

COMPLETED
≠
CURRENT
```

---

# Relationship Structure

## 20. `relationships`

Canonical field:

```yaml
relationships: []
```

Type:

```text
array
```

Required:

```text
NO
```

Default logical value:

```text
[]
```

Relationship semantics belong to:

```text
../standards/relationship_rules.md
```

This schema defines only the minimum structure needed by Artifact Truth
processing.

---

## 21. Canonical Relationship Entry

Canonical structure:

```yaml
relationships:
  - type: depends_on
    target:
      lineage_id: ART-SAMPLE-0002
      version: 1.0.0
```

Required fields:

```text
type

target.lineage_id
```

`target.version` is conditional.

---

## 22. `relationship.type`

Field:

```yaml
type: depends_on
```

Type:

```text
enum
```

The allowed canonical vocabulary comes from:

```text
../standards/relationship_rules.md
```

This schema must not independently introduce relationship semantics.

The current v1 canonical vocabulary consumed by this schema is:

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

If the canonical relationship standard changes, this schema must be updated.

---

## 23. Relationship Target

Minimum internal target structure:

```yaml
target:
  lineage_id: ART-SAMPLE-0002
```

Where relationship meaning depends on an exact governed version:

```yaml
target:
  lineage_id: ART-SAMPLE-0002
  version: 1.0.0
```

MDS must not silently interpret an ambiguous target as:

```text
latest version
```

because:

```text
Latest Version
≠
Current Project Truth
```

---

## 24. Exact-Version Requirement

The following relationship must use an exact target version:

```text
supersedes
```

Canonical example:

```yaml
relationships:
  - type: supersedes
    target:
      lineage_id: ART-SAMPLE-0001
      version: 1.0.0
```

A `supersedes` target without a version is structurally invalid.

Other relationship types may require an exact version according to the
applicable artifact or relationship contract.

---

# Supersession and Lineage

## 25. Initial Version

The initial artifact version in a lineage must not contain a `supersedes`
relationship to itself.

Conceptually:

```text
ART-SAMPLE-0001@1.0.0
```

may have:

```yaml
relationships: []
```

with respect to lineage.

---

## 26. Successor Version

A successor version must contain exactly one canonical:

```text
supersedes
```

relationship to its immediate predecessor.

Example:

```yaml
lineage_id: ART-SAMPLE-0001
version: 1.1.0

relationships:
  - type: supersedes
    target:
      lineage_id: ART-SAMPLE-0001
      version: 1.0.0
```

---

## 27. Supersession Constraints

For:

```text
SOURCE
→ supersedes
→ TARGET
```

the Validator must ensure:

```text
SOURCE.lineage_id == TARGET.lineage_id

SOURCE.version > TARGET.version

TARGET exists

TARGET is the immediate predecessor

SOURCE != TARGET

lineage remains acyclic
```

Supersession truth consequences belong to:

```text
../standards/artifact_truth.md
```

---

## 28. No Cross-Lineage Supersession

Invalid:

```text
ART-SAMPLE-0001@2.0.0
→ supersedes
→ ART-SAMPLE-0002@1.0.0
```

`supersedes` is a lineage relationship.

Cross-lineage historical or semantic connections must use another applicable
relationship type.

---

# Governance Decision References

## 29. `governance_decision_refs`

Canonical field:

```yaml
governance_decision_refs: []
```

Type:

```text
array of governed references
```

Required:

```text
conditional
```

The field references governed human authority decisions relevant to the
artifact version.

This schema does not define:

```text
who may approve

which person holds the authority

which Authority Type applies
```

Those semantics belong to:

```text
../authorities/
```

---

## 30. Approval Requirement

A canonical transition into:

```text
APPROVED
```

must be traceable to a governed approval decision made through the applicable
Human Approval Authority.

Therefore a version whose effective Lifecycle State is:

```text
APPROVED
```

must have a resolvable governed approval decision in its provenance.

The decision may be referenced through:

```text
governance_decision_refs
```

or an applicable lifecycle transition record.

The schema must not accept:

```text
APPROVED
```

merely because an AI, Professional Responsibility, Validator, or System
Capability produced the value.

---

## 31. Historical Approval Provenance

When an artifact later becomes:

```text
DEPRECATED
```

or:

```text
ARCHIVED
```

its historical approval provenance must remain reconstructable.

The fact that the effective Lifecycle State changed must not delete the earlier
approval decision reference.

---

# Validity Evidence

## 32. `validity_evidence_refs`

Canonical field:

```yaml
validity_evidence_refs: []
```

Type:

```text
array of evidence references
```

Required:

```text
conditional
```

These references support the current Validity State or a Validity transition.

Possible evidence classes are owned by their respective domains.

This schema treats the reference as evidence linkage.

It does not redefine evidence semantics.

---

## 33. Evidence is not Approval

MDS must preserve:

```text
validity_evidence_refs
≠
governance_decision_refs
```

Evidence may support a decision.

Evidence does not become the decision.

Likewise:

```text
Evidence Exists
≠
Artifact Approved
```

---

## 34. Evidence Reference Shape

The minimum canonical evidence reference may be represented as:

```yaml
validity_evidence_refs:
  - ref: evidence/example-record
```

Where exact artifact-version provenance is required, an evidence reference may
also preserve:

```yaml
validity_evidence_refs:
  - ref: evidence/example-record
    source:
      lineage_id: ART-SAMPLE-0002
      version: 2.0.0
```

Additional evidence metadata may be defined by an applicable evidence schema.

---

# State History

## 35. `state_history`

Canonical logical field:

```yaml
state_history: []
```

Type:

```text
array
```

Required:

```text
required where governed transition history is persisted on or referenced by the
artifact record
```

MDS must be able to reconstruct governed state transitions even if the history
is physically stored outside the Markdown artifact.

This schema defines the logical transition shape.

---

## 36. State Transition Entry

Canonical logical shape:

```yaml
state_history:
  - axis: lifecycle
    from: DRAFT
    to: REVIEW
    occurred_at: 2026-01-15T09:30:00Z
    reason_ref: review/example-submission
    evidence_refs: []
    decision_ref: null
    rule_ref: null
```

A transition record represents one state-axis transition.

---

## 37. `axis`

Allowed values:

```text
lifecycle

validity

execution
```

The selected axis determines the allowed values of:

```text
from

to
```

---

## 38. `from`

Type:

```text
state value or null
```

`null` may be used for an explicitly recorded initial state.

Example:

```yaml
from: null
to: DRAFT
```

For later transitions, `from` must match the prior effective state for the same
axis.

---

## 39. `to`

Type:

```text
state value
```

Required:

```text
YES
```

Allowed values depend on `axis`.

For:

```text
axis: lifecycle
```

the value must come from:

```text
DRAFT
REVIEW
APPROVED
DEPRECATED
ARCHIVED
```

For:

```text
axis: validity
```

the value must come from:

```text
CURRENT
NEEDS_REVIEW
STALE
CONFLICTED
```

For:

```text
axis: execution
```

the value must come from:

```text
NOT_STARTED
IN_PROGRESS
BLOCKED
COMPLETED
NOT_APPLICABLE
```

---

## 40. `occurred_at`

Field:

```yaml
occurred_at: 2026-01-15T09:30:00Z
```

Type:

```text
RFC 3339 timestamp
```

Required:

```text
YES
```

The timestamp records when the governed transition took effect according to the
applicable persistence contract.

---

## 41. `reason_ref`

Field:

```yaml
reason_ref: review/example-submission
```

Type:

```text
reference or null
```

Required:

```text
conditional
```

A transition requiring explicit justification should retain a reference to the
governed reason, change, review, or triggering record.

Free text may supplement the reference where useful.

Free text must not replace required governed provenance.

---

## 42. `evidence_refs`

Field:

```yaml
evidence_refs: []
```

Type:

```text
array
```

Required:

```text
conditional
```

Validity transitions to:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

must preserve sufficient evidence or triggering provenance.

---

## 43. `decision_ref`

Field:

```yaml
decision_ref: null
```

Type:

```text
governed decision reference or null
```

Required:

```text
conditional
```

A transition to:

```text
lifecycle_state: APPROVED
```

requires a resolvable applicable approval decision.

A Human Authority decision may also be relevant to other transitions according
to the applicable governance contract.

---

## 44. `rule_ref`

Field:

```yaml
rule_ref: null
```

Type:

```text
canonical rule reference or null
```

This field may identify a deterministic rule that caused or permitted a
transition.

For example, a governed safety rule may cause:

```text
CURRENT
→ NEEDS_REVIEW
```

without creating Human Approval.

The rule reference must not be interpreted as an authority decision.

---

# Current Effective State

## 45. Effective State

The effective artifact state is represented by:

```yaml
lifecycle_state: ...
validity_state: ...
execution_state: ...
```

The corresponding `state_history`, where maintained, must be consistent with
those effective values.

Conceptually:

```text
latest applicable lifecycle transition
→ lifecycle_state

latest applicable validity transition
→ validity_state

latest applicable execution transition
→ execution_state
```

---

## 46. History and Effective State Consistency

If state history exists, the Validator must detect a mismatch such as:

```yaml
lifecycle_state: APPROVED

state_history:
  - axis: lifecycle
    from: DRAFT
    to: REVIEW
```

with no later transition establishing:

```text
APPROVED
```

The persistence layer must not expose two contradictory effective states as
though both were canonical.

---

# Approved Version Immutability

## 47. Material Content

A version that has reached:

```text
APPROVED
```

must not have its governed material meaning rewritten in place.

A semantic content change requires a successor version.

This constraint follows:

```text
../standards/artifact_truth.md
```

and:

```text
../standards/versioning_rules.md
```

---

## 48. Governance Metadata Changes

Material-content immutability does not require MDS to pretend that governance
state never changes.

For example:

```text
APPROVED
→ DEPRECATED
```

is a legitimate governed Lifecycle transition.

An implementation may update governance metadata separately from material
content or record the transition through another persistence mechanism.

The implementation must preserve:

```text
material content identity

historical approval

state transition provenance

version identity
```

---

## 49. Content Integrity Metadata

Implementations may maintain metadata such as:

```text
content_hash

content_ref

content_revision

storage locator
```

for integrity and persistence.

Such fields are implementation or persistence concerns unless a separate
canonical contract promotes them.

This schema does not make any specific content-hash algorithm or manifest format
part of Artifact Truth semantics.

---

# Approved Lineage Head

## 50. Active Approved Head Constraint

For one lineage:

```text
at most one non-deprecated APPROVED head
```

may be active at a time.

The Validator must detect any state in which two versions of the same lineage
are simultaneously treated as active Approved heads.

---

## 51. Historical Approved Versions

The active-head constraint does not mean:

```text
only one artifact version may ever have been approved
```

Historical versions may retain approval provenance after becoming:

```text
DEPRECATED
```

or:

```text
ARCHIVED
```

---

## 52. New Draft Does not Replace Head

Given:

```text
ART-SAMPLE-0001@1.0.0
APPROVED

ART-SAMPLE-0001@2.0.0
DRAFT
```

the existence of `2.0.0` must not cause MDS to infer that it is the new Approved
head.

Likewise:

```text
REVIEW
```

does not establish the new head.

---

## 53. Successor Approval

A transition that establishes a successor as the new Approved head must preserve
the Artifact Truth invariant that the former active head no longer remains an
active non-deprecated Approved head.

The operation must be reconstructable as one governed lineage transition.

The physical transaction strategy belongs to implementation.

---

# Current Project Truth Projection

## 54. Current Project Truth is Derived

This schema must not use a manually authored field such as:

```yaml
is_current_project_truth: true
```

as the independent source of Project Truth.

Current Project Truth eligibility is derived from governed source fields.

Conceptually:

```text
lineage

+

lifecycle_state

+

validity_state

+

governed decisions

↓

Artifact Truth projection
```

---

## 55. Authoritative Eligibility

For a versioned governed artifact to be eligible for authoritative Current
Project Truth, the Artifact Truth Standard requires the applicable conditions,
including that the version is:

```text
active Approved lineage head

AND

validity_state == CURRENT

AND

not DEPRECATED

AND

not ARCHIVED
```

The schema may support a derived projection of that result.

The derived value must not become an independent authority source.

---

## 56. Derived Eligibility Cache

An implementation may cache something conceptually equivalent to:

```yaml
current_project_truth_eligible: true
```

for indexing or UI performance.

If persisted, the field must be classified as:

```text
derived
```

and must be reproducible from canonical source records.

MDS must preserve:

```text
Derived Eligibility Cache
≠
Canonical Truth Source
```

---

## 57. Excluded Authoritative States

The Validator must reject authoritative Current Project Truth output containing
an artifact whose effective Lifecycle State is:

```text
DRAFT

REVIEW

DEPRECATED

ARCHIVED
```

or whose Validity State is:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

Such artifacts may still appear as explicitly labeled non-authoritative
context where applicable.

---

# Cross-Record Validation

## 58. Required Cross-Record Checks

The Validator should support the following checks for Artifact Truth records:

```text
duplicate lineage/version pair

invalid canonical lineage_id

invalid version syntax

invalid Lifecycle State

invalid Validity State

invalid Execution State

invalid relationship type

unresolvable relationship target

supersedes self-reference

cross-lineage supersedes

missing immediate predecessor

lineage cycle

multiple active Approved heads

APPROVED without governed approval provenance

non-current validity without sufficient evidence

state-history/effective-state mismatch

authoritative output containing excluded state

derived cache that cannot be reconstructed
```

---

## 59. Validation Does not Grant Approval

The Validator may produce:

```text
PASS

FAIL

WARNING

UNKNOWN
```

according to the applicable validation contract.

MDS must preserve:

```text
Validation PASS
≠
Human Approval
```

The Validator verifies structural and governed rule compliance.

It does not become a Human Approval Authority.

---

## 60. Validation Failure Does not Rewrite Data

If validation detects:

```text
duplicate ID

broken predecessor

invalid state

missing decision provenance

conflicting effective state
```

MDS must surface the condition.

It must not silently rewrite canonical governed data merely to make validation
pass.

---

# Conflict Handling

## 61. Contradictory Canonical Records

If available canonical records disagree about:

```text
effective state

approved head

predecessor

version identity

approval provenance
```

MDS must not silently choose one based only on:

```text
filesystem timestamp

database row order

cache order

AI confidence

UI state
```

The conflict must remain visible.

Where the contradiction affects Artifact Truth eligibility, the applicable
record must not be treated as authoritative until the governed conflict is
resolved.

---

## 62. Missing Storage Record

A missing persistence record does not by itself define a new semantic state.

For example:

```text
missing cache
```

does not mean:

```text
STALE
```

unless the applicable Artifact Truth rules and evidence establish that result.

Storage failures and semantic validity are separate concerns.

---

# Legacy Compatibility

## 63. Legacy `id`

Legacy artifacts may use:

```yaml
id: BA-REQ-SAMPLE-001
```

instead of:

```yaml
lineage_id: ART-SAMPLE-0001
```

Such data may remain readable during migration.

The old identifier must not be silently replaced.

Migration requires explicit identity mapping.

---

## 64. Legacy `links`

Legacy artifacts may use:

```yaml
links:
  - type: supersedes
    target: BA-REQ-SAMPLE-001
    target_version: 1.0.0
```

Canonical new writes should use:

```yaml
relationships:
  - type: supersedes
    target:
      lineage_id: ART-SAMPLE-0001
      version: 1.0.0
```

Legacy conversion must preserve the original semantic meaning and provenance.

---

## 65. Legacy Relationship Types

Legacy data may contain relationship types that are no longer part of the
canonical global vocabulary.

Examples may include:

```text
tested_by

validates_nfr

linked_tsk

broken_by

impacts_cost

includes

extends
```

These values may remain readable for migration.

They must not be emitted as canonical new relationship types unless a current
canonical contract defines them.

Migration must follow:

```text
../standards/relationship_rules.md
```

---

## 66. Legacy `validity_evidence`

Legacy structure may resemble:

```yaml
validity_evidence:
  - artifact_id: BA-REQ-SAMPLE-001
    artifact_version: 2.0.0
    relationship_type: implements
    evidence_ref: analysis/example.md
```

This structure may be read during migration.

Canonical truth metadata should instead preserve evidence through:

```text
validity_evidence_refs
```

plus canonical relationship records where a relationship is actually being
asserted.

MDS must not collapse:

```text
evidence

relationship

artifact identity
```

into one overloaded legacy structure for new writes.

---

## 67. Legacy Manifest Authority

Historical implementations may use fields or structures such as:

```text
lineage.json

approved_head_version_id

sealed content hash

manifest authority
```

Those structures may remain implementation-compatible.

This schema no longer declares a specific manifest file to be the universal
semantic authority for all MDS deployments.

The implementation may retain such structures if they correctly implement the
canonical Artifact Truth model.

---

## 68. Legacy Missing Validity

Historical artifacts may lack:

```text
validity_state
```

Migration must not automatically set:

```text
CURRENT
```

merely because the artifact is:

```text
APPROVED
```

MDS must preserve:

```text
APPROVED
≠
CURRENT
```

The migration process must establish validity through the applicable governed
basis.

---

# Canonical Write Contract

## 69. Minimum New Artifact Record

A new versioned governed artifact should be representable at minimum as:

```yaml
lineage_id: ART-SAMPLE-0001
version: 1.0.0

lifecycle_state: DRAFT
validity_state: CURRENT
execution_state: NOT_APPLICABLE

relationships: []

governance_decision_refs: []

validity_evidence_refs: []

state_history:
  - axis: lifecycle
    from: null
    to: DRAFT
    occurred_at: 2026-01-15T09:00:00Z
    reason_ref: null
    evidence_refs: []
    decision_ref: null
    rule_ref: null

  - axis: validity
    from: null
    to: CURRENT
    occurred_at: 2026-01-15T09:00:00Z
    reason_ref: null
    evidence_refs: []
    decision_ref: null
    rule_ref: null

  - axis: execution
    from: null
    to: NOT_APPLICABLE
    occurred_at: 2026-01-15T09:00:00Z
    reason_ref: null
    evidence_refs: []
    decision_ref: null
    rule_ref: null
```

The example demonstrates the logical contract.

The applicable artifact schema may add additional fields.

---

## 70. Successor Artifact Example

Conceptually:

```yaml
lineage_id: ART-SAMPLE-0001
version: 2.0.0

lifecycle_state: DRAFT
validity_state: CURRENT
execution_state: NOT_APPLICABLE

relationships:
  - type: supersedes
    target:
      lineage_id: ART-SAMPLE-0001
      version: 1.0.0

governance_decision_refs: []

validity_evidence_refs: []

state_history:
  - axis: lifecycle
    from: null
    to: DRAFT
    occurred_at: 2026-02-01T10:00:00Z
    reason_ref: change/example-request
    evidence_refs: []
    decision_ref: null
    rule_ref: null

  - axis: validity
    from: null
    to: CURRENT
    occurred_at: 2026-02-01T10:00:00Z
    reason_ref: change/example-request
    evidence_refs: []
    decision_ref: null
    rule_ref: null
```

The newer version does not become Current Project Truth merely because its
version number is higher.

---

## 71. Approved Artifact Example

Conceptually:

```yaml
lineage_id: ART-SAMPLE-0001
version: 2.0.0

lifecycle_state: APPROVED
validity_state: CURRENT
execution_state: NOT_APPLICABLE

relationships:
  - type: supersedes
    target:
      lineage_id: ART-SAMPLE-0001
      version: 1.0.0

governance_decision_refs:
  - governance/example-approval

validity_evidence_refs: []

state_history:
  - axis: lifecycle
    from: DRAFT
    to: REVIEW
    occurred_at: 2026-02-02T09:00:00Z
    reason_ref: review/example-submission
    evidence_refs: []
    decision_ref: null
    rule_ref: null

  - axis: lifecycle
    from: REVIEW
    to: APPROVED
    occurred_at: 2026-02-03T09:00:00Z
    reason_ref: review/example-decision
    evidence_refs:
      - validation/example-result
    decision_ref: governance/example-approval
    rule_ref: null
```

The referenced decision must resolve through the applicable Authority model.

---

# Schema Invariants

## 72. Artifact Truth Schema Invariants

### ARTIFACT-SCHEMA-INV-001

Every canonical versioned governed artifact has one stable `lineage_id`.

### ARTIFACT-SCHEMA-INV-002

Every canonical versioned governed artifact has one semantic `version`.

### ARTIFACT-SCHEMA-INV-003

The pair `(lineage_id, version)` is unique.

### ARTIFACT-SCHEMA-INV-004

Canonical new identifiers are role-neutral and type-neutral.

### ARTIFACT-SCHEMA-INV-005

Lifecycle, Validity, and Execution are represented as separate fields.

### ARTIFACT-SCHEMA-INV-006

Missing legacy Validity must not be silently interpreted as `CURRENT`.

### ARTIFACT-SCHEMA-INV-007

A successor has exactly one `supersedes` relationship to its immediate
predecessor.

### ARTIFACT-SCHEMA-INV-008

`supersedes` must remain within the same lineage.

### ARTIFACT-SCHEMA-INV-009

Version lineage must remain acyclic.

### ARTIFACT-SCHEMA-INV-010

At most one non-deprecated Approved head may be active in a lineage.

### ARTIFACT-SCHEMA-INV-011

A transition into `APPROVED` requires traceable governed approval provenance.

### ARTIFACT-SCHEMA-INV-012

Approval provenance must remain reconstructable after deprecation or archival.

### ARTIFACT-SCHEMA-INV-013

`NEEDS_REVIEW`, `STALE`, and `CONFLICTED` require traceable validity basis.

### ARTIFACT-SCHEMA-INV-014

Execution completion must not establish approval or current validity.

### ARTIFACT-SCHEMA-INV-015

Current Project Truth eligibility is derived rather than independently authored.

### ARTIFACT-SCHEMA-INV-016

Derived truth caches must be reconstructable from canonical source records.

### ARTIFACT-SCHEMA-INV-017

Material content of an Approved artifact version must not be semantically
rewritten in place.

### ARTIFACT-SCHEMA-INV-018

Governance state transitions must preserve historical provenance.

### ARTIFACT-SCHEMA-INV-019

Schema validation does not constitute Human Approval.

### ARTIFACT-SCHEMA-INV-020

Legacy read compatibility must not redefine the canonical write contract.

---

## 73. Relationship to Other Schemas

This schema is intended to provide the common Artifact Truth state structure
consumed by future artifact schemas.

Conceptually:

```text
Artifact-Type Schema
        ↓
Common Artifact Truth Metadata
        ↓
artifact_truth_schema.md
```

It does not define:

```text
full Artifact Type taxonomy

project configuration

Professional Responsibility contracts

project workflow methodology

Implementation Plane evidence schema

Runtime evidence schema
```

Those concerns belong elsewhere.

---

## 74. Future Decomposition

As the schema layer matures, some structures currently represented here may be
extracted into focused schemas.

Possible future examples include:

```text
relationship schema

governance decision reference schema

evidence reference schema

state transition schema
```

Such extraction must preserve the logical contract defined here.

File decomposition must not alter semantic ownership.

---

## 75. Source of Truth

This document is the canonical machine-facing structural contract for common
Artifact Truth metadata.

It owns:

```text
truth-related field shape

state field representation

lineage identity representation

supersession target structure

governance decision references

validity evidence references

state transition record shape

Artifact Truth machine-validation constraints

legacy Artifact Truth schema compatibility
```

It does not own:

```text
Artifact Truth semantics

Lifecycle semantics

Execution semantics

Version meaning

Relationship meaning

Stable Identity meaning

Human Approval Authority

Professional Responsibility

storage architecture
```

Those concerns must resolve through their canonical owners.

Principle:

> **Artifact Truth semantics come from governed standards. This schema makes
> those semantics representable and verifiable without turning persistence
> details into authority.**