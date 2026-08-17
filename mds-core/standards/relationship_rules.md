---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: relationship_standard
update_strategy: change only through the applicable governed approval process
---

# MDS Relationship and Graph Integrity Standard

## 1. Purpose

This standard defines the canonical semantics for relationships between governed
MDS entities.

Relationships provide the structural basis for:

```text
traceability

dependency analysis

impact analysis

verification traceability

lineage

evidence correlation

knowledge graph navigation
```

A relationship expresses a typed connection.

It does not independently establish:

```text
Project Truth

Human Approval

Lifecycle State

Validity State

Execution State
```

---

## 2. Canonical Ownership

This standard owns:

```text
canonical relationship vocabulary

relationship direction

relationship semantics

relationship integrity

relationship provenance

broken-reference rules

required-relationship rules

derived relationship rules

graph-cycle treatment

legacy relationship migration
```

This standard does not own:

```text
Artifact Truth validity
→ ./artifact_truth.md

Version lineage consequences
→ ./artifact_truth.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Version numbering
→ ./versioning_rules.md

Human Approval Authority
→ ../authorities/

Professional Responsibilities
→ ../roles/

Implementation execution
→ ../implementation-plane/

Runtime semantics
→ ../runtime/

System Capability semantics
→ ../system-capabilities/

Concrete relationship field structure
→ ../schemas/
```

---

## 3. Core Principle

MDS stores canonical relationships in one semantic direction.

Conceptually:

```text
SOURCE
  │
  │ relationship
  ▼
TARGET
```

For example:

```text
Verification Artifact
      │
      │ verifies
      ▼
Requirement
```

The canonical relationship is:

```text
Verification Artifact
→ verifies
→ Requirement
```

The reverse view:

```text
Requirement
→ verified by
→ Verification Artifact
```

is derived.

MDS should not store both directions as independent canonical facts unless an
applicable canonical contract explicitly requires separate semantics.

---

## 4. Outbound Canonical Storage

Canonical authored relationships are represented from the source entity toward
the target entity.

Conceptually:

```text
source
  relationship_type
target
```

Inbound relationships are graph projections.

Therefore:

```text
Outbound Edge
→ canonical relationship fact

Inbound Edge
→ derived graph view
```

This reduces duplicate relationship state and prevents disagreement between two
independently maintained inverse edges.

---

## 5. Relationship is not Authority

MDS must preserve:

```text
Relationship
≠
Human Approval Authority
```

A relationship may show that an artifact:

```text
implements

verifies

depends on

supersedes

references
```

another entity.

That connection does not grant either endpoint authority over the other.

Authority semantics belong to:

```text
../authorities/
```

---

## 6. Relationship is not Truth

MDS must preserve:

```text
Relationship Exists
≠
Endpoint is Authoritative
```

A relationship may point to content that is:

```text
DRAFT

REVIEW

APPROVED

NEEDS_REVIEW

STALE

CONFLICTED

DEPRECATED

ARCHIVED
```

The edge must remain distinguishable from the truth state of its endpoints.

Artifact Truth semantics belong to:

```text
./artifact_truth.md
```

---

# Canonical Relationship Vocabulary

## 7. Canonical Relationship Types

The canonical v1 relationship vocabulary is:

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

Each relationship has one canonical semantic direction.

Specific technologies, tools, vendors, Professional Responsibilities, or
artifact names must not create new global relationship types merely for
convenience.

---

## 8. `depends_on`

```text
SOURCE
→ depends_on
→ TARGET
```

Meaning:

> The source requires the target in order to preserve its intended governed
> meaning, operation, interpretation, or completion.

Examples of legitimate dependency semantics include:

```text
a specification depending on another governed contract

a planned activity depending on a prerequisite

a design depending on an accepted constraint
```

`depends_on` expresses dependency.

It does not automatically imply:

```text
implements

approval

ownership

execution ordering
```

unless the applicable governed contract establishes those additional
consequences.

---

## 9. `implements`

```text
SOURCE
→ implements
→ TARGET
```

Meaning:

> The source describes, represents, or evidences a realization of the governed
> behaviour, contract, requirement, or design expressed by the target.

Conceptually:

```text
Realization
      ↓ implements
Governed Expectation
```

`implements` does not mean that implementation has been verified.

MDS must preserve:

```text
implements
≠
verifies
```

Implementation Plane semantics belong to:

```text
../implementation-plane/
```

---

## 10. `adheres_to`

```text
SOURCE
→ adheres_to
→ TARGET
```

Meaning:

> The source is intended to conform to a governing constraint, rule, decision,
> or contract represented by the target.

Conceptually:

```text
Governed Artifact
      ↓ adheres_to
Constraint / Decision / Standard
```

The existence of `adheres_to` records a governed conformance relationship.

It does not independently prove actual conformance.

MDS must preserve:

```text
Declared Adherence
≠
Verified Conformance
```

---

## 11. `verifies`

```text
SOURCE
→ verifies
→ TARGET
```

Meaning:

> The source provides a defined verification activity, result, or specification
> intended to determine whether the target satisfies an applicable expectation.

Conceptually:

```text
Verification Artifact / Result
      ↓ verifies
Governed Expectation
```

`verifies` is the canonical verification relationship.

MDS does not require separate global relationships for every verification
specialisation.

For example, verification of a non-functional expectation still uses:

```text
verifies
```

rather than introducing a separate canonical relationship solely because the
target belongs to a specific requirement subtype.

---

## 12. `evidences`

```text
SOURCE
→ evidences
→ TARGET
```

Meaning:

> The source provides evidence relevant to a claim, governed artifact, decision,
> verification result, implementation state, or operational observation
> represented by the target.

Examples may include:

```text
implementation evidence

verification evidence

runtime evidence

decision evidence
```

MDS must preserve:

```text
Evidence
≠
Approval
```

and:

```text
Evidence
≠
Automatic Truth
```

---

## 13. `mitigates`

```text
SOURCE
→ mitigates
→ TARGET
```

Meaning:

> The source reduces, controls, or addresses a risk represented by the target.

Conceptually:

```text
Control / Decision / Action
      ↓ mitigates
Risk
```

`mitigates` does not mean:

```text
risk eliminated
```

unless separate evidence establishes that outcome.

---

## 14. `resolves`

```text
SOURCE
→ resolves
→ TARGET
```

Meaning:

> The source represents or evidences a resolution of the issue, defect,
> incident, conflict, or governed problem represented by the target.

Conceptually:

```text
Resolution
      ↓ resolves
Issue
```

The relationship alone does not prove that the resolution is correct.

Verification or runtime evidence may still be required.

---

## 15. `produces`

```text
SOURCE
→ produces
→ TARGET
```

Meaning:

> The target is a governed output resulting from the source.

Conceptually:

```text
Source Artifact / Governed Activity
      ↓ produces
Derived or Downstream Artifact
```

`produces` records provenance or generation relationship.

It does not imply that the produced target is:

```text
approved

current

valid

complete
```

---

## 16. `elaborates`

```text
SOURCE
→ elaborates
→ TARGET
```

Meaning:

> The source adds governed detail, clarification, decomposition, or precision
> to the target without replacing it.

Conceptually:

```text
Detailed Artifact
      ↓ elaborates
Higher-Level Artifact
```

`elaborates` does not imply:

```text
supersedes
```

The target remains a distinct governed entity.

---

## 17. `synthesizes`

```text
SOURCE
→ synthesizes
→ TARGET
```

Meaning:

> The source incorporates or consolidates relevant governed meaning from the
> target as part of a broader synthesis.

A source may synthesize multiple targets.

Conceptually:

```text
Target A ──┐
Target B ──┼──► Synthesis Artifact
Target C ──┘
```

Canonical outbound storage is still expressed from the synthesis artifact:

```text
Synthesis Artifact
→ synthesizes
→ Target A

Synthesis Artifact
→ synthesizes
→ Target B

Synthesis Artifact
→ synthesizes
→ Target C
```

Synthesis does not grant the source authority to silently rewrite the meaning
of its targets.

---

## 18. `references`

```text
SOURCE
→ references
→ TARGET
```

Meaning:

> The source cites or refers to the target for context, information, provenance,
> explanation, or external knowledge without asserting a stronger canonical
> semantic relationship.

`references` is intentionally weak.

MDS must preserve:

```text
references
≠
depends_on

references
≠
implements

references
≠
verifies

references
≠
adheres_to
```

Use a stronger canonical relationship when the stronger semantic claim is
actually intended.

---

## 19. `supersedes`

```text
SOURCE
→ supersedes
→ TARGET
```

Meaning:

> The source is the governed successor of the target within an applicable
> artifact lineage.

Conceptually:

```text
Newer Version
      ↓ supersedes
Immediate Prior Version
```

The relationship name is owned by this relationship vocabulary.

The lineage consequences of `supersedes` are owned by:

```text
./artifact_truth.md
```

MDS must preserve:

```text
supersedes
≠
deprecated
```

because one is a relationship and the other is a Lifecycle State.

---

# Derived Inbound Views

## 20. Inverse Relationships are Derived

MDS may expose human-readable inbound views such as:

```text
depended on by

implemented by

adhered to by

verified by

evidenced by

mitigated by

resolved by

produced by

elaborated by

synthesized by

referenced by

superseded by
```

These are derived views.

They are not additional canonical relationship types.

For example:

```text
Verification
→ verifies
→ Requirement
```

may be rendered from the Requirement side as:

```text
Requirement
← verified by
← Verification
```

Only the first edge is canonical storage.

---

## 21. `tested_by` is a Derived View

Legacy MDS material may contain:

```text
tested_by
```

as an authored relationship.

Canonical v1 does not require `tested_by` as a stored relationship type.

Instead:

```text
Verification Artifact
→ verifies
→ Governed Target
```

produces the derived inbound view:

```text
Governed Target
← verified by
← Verification Artifact
```

Legacy `tested_by` values should be migrated where their semantic meaning is
equivalent.

---

# Relationship Integrity

## 22. Resolvable Targets

A canonical internal relationship must resolve to a known target according to
the applicable identity schema.

MDS must detect:

```text
missing target

malformed identifier

unknown version

unresolvable reference
```

An unresolved internal target creates a:

```text
BROKEN REFERENCE
```

condition.

The relationship must not silently disappear.

---

## 23. External References

A `references` relationship may point to an external source where the
applicable schema permits external references.

External references must remain distinguishable from canonical internal entity
references.

Conceptually:

```text
Internal Entity Reference
≠
External Reference
```

An external source must not silently be treated as an internal canonical
artifact.

---

## 24. Endpoint Type Compatibility

Relationship type and endpoint types must be compatible with the applicable
schema or artifact contract.

For example, a relationship may be structurally valid as:

```text
source → relationship → existing target
```

while still being semantically invalid because that relationship is not allowed
between those endpoint classes.

MDS should distinguish:

```text
BROKEN_REFERENCE

INVALID_RELATIONSHIP
```

rather than collapsing both into one error.

---

## 25. Self-Relationships

A relationship from an entity to itself is invalid unless a specific canonical
contract explicitly defines meaningful self-reference.

Canonical MDS relationships should normally reject:

```text
A
→ depends_on
→ A
```

and:

```text
A
→ supersedes
→ A
```

Self-reference must not be accepted merely because the target identifier
resolves.

---

## 26. Duplicate Relationships

Duplicate canonical edges must not create multiple independent facts when all
of the following are equivalent:

```text
source

relationship type

target
```

MDS should normalize or flag exact duplicate edges.

Multiple evidence records may support the same relationship without requiring
duplicate relationship facts.

---

## 27. Relationship Provenance

A governed relationship should preserve sufficient provenance to determine,
where applicable:

```text
source entity

target entity

relationship type

source version

target version

origin

creation time

authoring mechanism

supporting evidence

derivation rule

confidence where advisory
```

The concrete persistence structure belongs to:

```text
../schemas/
```

---

## 28. Exact Version Traceability

Where an entity is versioned and relationship meaning depends on a specific
version, the relationship should resolve to the applicable version rather than
silently floating to whichever version is currently newest.

MDS must preserve:

```text
Relationship to Version A
≠
Automatic Relationship to Version B
```

A newer target version may require relationship review.

Artifact Truth determines the resulting validity consequences.

---

## 29. Floating Lineage References

If MDS later supports relationships intentionally targeting a lineage rather
than an exact artifact version, that behaviour must be explicit in the
applicable schema.

MDS must not silently interpret an ambiguous identifier as:

```text
always use latest version
```

because:

```text
Latest Version
≠
Current Project Truth
```

---

# Graph Structure

## 30. The Entire Knowledge Graph is not Required to be a DAG

MDS must not impose:

```text
Entire Knowledge Graph
=
DAG
```

as a universal invariant.

Different legitimate relationships may create graph structures that contain
cycles.

For example:

```text
cross-references

mutual contextual references

operational feedback

derived graph views
```

may create cycles without representing an invalid artifact lineage.

Graph validity must be evaluated according to relationship semantics.

---

## 31. Lineage Must Remain Acyclic

The `supersedes` relationship must never form a cycle.

Invalid:

```text
A@1.0.0
→ supersedes
→ A@2.0.0
→ supersedes
→ A@1.0.0
```

Artifact version lineage must preserve the invariants defined by:

```text
./artifact_truth.md
```

A lineage cycle is a blocking graph-integrity defect.

---

## 32. Dependency Cycles

A `depends_on` cycle is not universally declared impossible by this global
standard.

However, it may indicate:

```text
invalid planning dependency

architectural coupling

circular prerequisite

incorrect relationship modeling
```

The Validator should detect dependency cycles.

Whether a detected cycle is:

```text
allowed

warning

blocking
```

depends on the applicable artifact or workflow contract.

MDS must not silently break the cycle.

---

## 33. Relationship-Specific Cycle Rules

Acyclicity may be required for a specific relationship type or endpoint class by
an applicable canonical contract.

Therefore:

```text
Graph Cycle Detected
      ↓
Determine relationship semantics
      ↓
Apply applicable rule
```

not:

```text
Any Cycle
→ Invalid Entire Graph
```

---

# Orphan and Broken Relationship Rules

## 34. Orphan Entity

An entity is an **Orphan Entity** only when the applicable canonical contract
requires one or more anchoring relationships and those required relationships
are absent or invalid.

Conceptually:

```text
Artifact Contract
      ↓
requires governed relationship
      ↓
relationship missing or unusable
      ↓
ORPHAN
```

MDS must not classify every entity with no incoming edge as an orphan.

Likewise, MDS must not classify every root-level artifact as an orphan merely
because it has no upstream dependency.

---

## 35. Missing Required Relationship

A:

```text
MISSING REQUIRED RELATIONSHIP
```

exists when:

```text
the applicable artifact contract requires a relationship
```

and:

```text
that relationship is not present
```

This is distinct from a Broken Reference.

Example structure:

```text
required relation absent
→ MISSING REQUIRED RELATIONSHIP

relation present but target cannot resolve
→ BROKEN REFERENCE
```

---

## 36. Broken Reference

A:

```text
BROKEN REFERENCE
```

exists when a declared relationship target cannot be resolved.

Possible causes include:

```text
target does not exist

identifier typo

version does not exist

target was removed without governed migration

imported reference cannot be resolved
```

Broken references must remain visible until corrected or explicitly migrated.

---

## 37. Invalid Relationship

An:

```text
INVALID RELATIONSHIP
```

exists when:

```text
source exists

target exists

relationship type exists
```

but the combination violates an applicable endpoint or semantic rule.

MDS should not treat an Invalid Relationship as equivalent to a Broken
Reference.

---

## 38. Historical Target

A relationship to:

```text
DEPRECATED

ARCHIVED
```

content is not automatically invalid.

Historical relationships must remain queryable for:

```text
lineage

audit

rollback analysis

historical reconstruction

decision analysis
```

However, historical content may not be usable as active authoritative context.

That distinction belongs to:

```text
./artifact_truth.md
```

---

## 39. Stale or Conflicted Targets

A relationship to a target whose validity is:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

must not be silently deleted.

The relationship remains historical or structural evidence.

MDS should surface the target's validity condition when the relationship is
used for:

```text
impact analysis

context construction

verification

governed decisions
```

---

# Validation and Governance

## 40. Validator Responsibility

The Validator may detect:

```text
broken references

missing required relationships

invalid relationship types

invalid endpoint combinations

duplicate edges

self-relationships

lineage cycles

dependency cycles

stale relationship targets

conflicting relationship claims
```

Validator semantics belong to:

```text
../system-capabilities/
```

---

## 41. Validation Does not Equal Approval

MDS must preserve:

```text
Relationship Validation PASS
≠
Human Approval
```

Likewise:

```text
Relationship Validation FAIL
≠
Automatic Human Rejection
```

A validation result is evidence used by the applicable governed process.

---

## 42. Validator Does not Own the Approval Gate

A Validator may determine:

```text
required relationship missing
```

or:

```text
broken reference detected
```

The applicable canonical gate may define such findings as blocking conditions.

The Validator itself does not gain Human Approval Authority.

Conceptually:

```text
Validator
      ↓
Finding
      ↓
Applicable Governance Rule
      ↓
Gate Condition
      ↓
Human Authority where required
```

MDS must not implement:

```text
Validator says FAIL
      ↓
Validator becomes approver
```

---

## 43. Knowledge Curator Responsibility

The Knowledge Curator may:

```text
normalize relationships

maintain relationship indexes

maintain graph projections

detect candidate duplicates

preserve provenance

identify missing references

prepare relationship data for validation
```

Knowledge Curator semantics belong to:

```text
../system-capabilities/
```

---

## 44. Knowledge Curator Does not Hold Approval Authority

MDS must preserve:

```text
Knowledge Curator
≠
Human Approval Authority
```

The Knowledge Curator must not directly perform:

```text
APPROVE

REJECT

RELEASE
```

because of a relationship finding.

It may surface a blocking condition defined by an applicable governance rule.

The rule creates the gate condition.

The capability does not create authority.

---

# Authored and Derived Relationships

## 45. Explicit Relationship

An Explicit Relationship is intentionally declared as part of governed project
knowledge.

Conceptually:

```text
Artifact
      ↓ explicit declaration
Relationship
```

Explicit does not automatically mean correct.

It remains subject to validation and governance.

---

## 46. Deterministically Derived Relationship

MDS may derive a relationship through an approved deterministic rule.

For example, an inbound graph edge may be deterministically derived from its
canonical outbound edge.

Derived relationships must preserve:

```text
derivation source

derivation rule

source relationship

derivation time where relevant
```

A deterministic derived view must not be mistaken for a separately authored
canonical fact.

---

## 47. AI-Suggested Relationship

AI may propose a candidate relationship.

MDS must preserve:

```text
AI Suggested Relationship
≠
Canonical Relationship
```

Conceptually:

```text
AI Analysis
      ↓
Candidate Relationship
      ↓
Validation / Professional Review / Applicable Governance
      ↓
Canonical Relationship if accepted
```

AI confidence must not silently promote the candidate.

---

## 48. Relationship Conflict

A relationship conflict may exist when available governed sources disagree
about whether a relationship exists or what its type should be.

MDS must preserve the conflict.

It must not silently choose based on:

```text
AI confidence

newer file timestamp

graph traversal order

database ordering

UI state
```

Where the conflict affects authoritative interpretation, the applicable
professional and governance process must resolve it.

---

# Impact Analysis

## 49. Relationship is a Traceability Path

Canonical relationships provide candidate paths for impact analysis.

Conceptually:

```text
Changed Artifact
      ↓
Governed Relationships
      ↓
Potentially Affected Artifacts
```

However:

```text
Path Exists
≠
Impact Proven
```

The relationship provides evidence for analysis.

Artifact Truth rules determine validity consequences.

---

## 50. Impact Propagation is not Uniform

Different relationship types may carry different impact meaning.

For example:

```text
depends_on
```

may generally indicate stronger potential impact than:

```text
references
```

But this standard does not assign one universal automatic invalidation rule to
every relationship.

The applicable impact and Artifact Truth rules determine the consequence.

---

## 51. `references` Does not Automatically Propagate Strong Impact

Because `references` is intentionally weak, its existence alone should not
automatically cause downstream validity invalidation.

It may still be relevant to impact analysis.

MDS should distinguish:

```text
possible contextual relevance
```

from:

```text
governed semantic dependency
```

---

## 52. Evidence-Backed Traversal

Change propagation should operate through governed relationships with
sufficient provenance.

MDS must not treat arbitrary text similarity as equivalent to a canonical graph
edge.

AI may discover:

```text
candidate dependency

candidate impact path

candidate relationship
```

but candidate relationships remain distinguishable from canonical
relationships.

Artifact Truth propagation semantics belong to:

```text
./artifact_truth.md
```

---

# Relationship and Other State

## 53. Relationship Does not Change Lifecycle Automatically

Creating or removing a relationship must not automatically change:

```text
DRAFT

REVIEW

APPROVED

DEPRECATED

ARCHIVED
```

unless an applicable governed transition rule explicitly requires that outcome.

Relationship structure and Lifecycle State are distinct concerns.

---

## 54. Relationship Does not Change Validity Automatically

A changed relationship may provide evidence that validity should change.

However:

```text
Relationship Changed
≠
Automatic Validity Decision
```

Validity treatment belongs to:

```text
./artifact_truth.md
```

---

## 55. Relationship Does not Change Execution Automatically

MDS must preserve:

```text
Relationship State
≠
Execution State
```

A dependency relationship may contribute to an execution blocker.

The resulting Execution State remains governed by:

```text
./lifecycle_rules.md
```

---

# Version and Lineage Relationships

## 56. `supersedes` Must Target the Immediate Predecessor

Within version lineage:

```text
2.0.0
→ supersedes
→ 1.0.0
```

means `1.0.0` is the immediate predecessor of `2.0.0`.

If the actual lineage is:

```text
1.0.0
→ 1.1.0
→ 2.0.0
```

then the canonical relationships are:

```text
1.1.0
→ supersedes
→ 1.0.0

2.0.0
→ supersedes
→ 1.1.0
```

not:

```text
2.0.0
→ supersedes
→ 1.0.0
```

unless a separate non-lineage historical reference is intended.

---

## 57. Supersession History is Immutable

Once a governed version transition is established, historical supersession
relationships must remain queryable.

MDS must not rewrite the lineage simply because a later version exists.

Conceptually:

```text
1.0.0
← superseded by
1.1.0
← superseded by
2.0.0
```

remains reconstructable.

---

# Legacy Relationship Migration

## 58. Legacy `validates_nfr`

Legacy relationship:

```text
validates_nfr
```

should normally migrate to:

```text
verifies
```

when its intended meaning is verification of a non-functional expectation.

The target type provides the NFR distinction.

The relationship type does not need to duplicate the target classification.

---

## 59. Legacy `tested_by`

Legacy relationship:

```text
tested_by
```

should normally become a derived inbound view of:

```text
verifies
```

rather than an independently authored canonical edge.

---

## 60. Legacy `linked_tsk`

Legacy relationship:

```text
linked_tsk
```

is not part of the canonical global v1 vocabulary.

Migration must inspect its intended meaning.

Depending on the source and target, it may map to:

```text
implements

depends_on

references
```

or another applicable canonical relationship.

MDS must not mass-convert it without determining meaning.

---

## 61. Legacy `broken_by`

Legacy relationship:

```text
broken_by
```

is not part of the canonical global v1 vocabulary.

A defect, incident, runtime observation, or verification result should be
represented using the applicable entity/evidence model and canonical
relationship semantics.

Possible applicable relationships may include:

```text
evidences

references
```

depending on the actual claim.

Migration must preserve the original relation until its meaning is resolved.

---

## 62. Legacy `impacts_cost`

Legacy relationship:

```text
impacts_cost
```

is not part of the canonical global v1 vocabulary.

Cost impact is a specialised impact claim.

It should be modeled using the applicable impact or project-domain contract
rather than creating a global relationship type for every impact dimension.

Legacy instances must not be silently discarded.

---

## 63. Legacy `includes` and `extends`

Legacy relationships:

```text
includes

extends
```

may represent domain-specific behavioural modeling semantics.

They are not part of the canonical global v1 relationship vocabulary.

If MDS requires these semantics as governed first-class relationships later,
they should be introduced through the applicable canonical extension process.

Existing legacy occurrences should remain identifiable until migrated.

---

## 64. Legacy Relationship Preservation

Migration must preserve:

```text
original relationship type

original source

original target

migration decision

replacement relationship if any

migration rationale
```

where required for traceability.

Legacy relationships must not be silently reinterpreted.

---

# Extension Governance

## 65. Relationship Taxonomy Must Remain Small

Before adding a new canonical relationship type, determine whether the intended
meaning can already be represented by:

```text
existing relationship type
+
endpoint classification
+
metadata
```

For example:

```text
verifies + NFR target
```

is generally preferable to introducing:

```text
validates_nfr
```

as a second global verification relation.

---

## 66. New Relationship Type Criteria

A new canonical relationship type should only be introduced when:

```text
1. it expresses a genuinely distinct semantic connection;

2. the meaning cannot be represented safely using an existing relation plus
   endpoint classification or metadata;

3. direction can be defined unambiguously;

4. integrity rules can be defined;

5. impact and governance consequences can be reasoned about;

6. the addition passes the applicable governed approval process.
```

A new UI feature or implementation module is not sufficient justification.

---

## 67. Vendor and Technology Independence

The canonical relationship vocabulary must remain independent of:

```text
AI vendor

graph database

programming language

IDE

repository host

CI/CD provider

monitoring platform
```

Relationships describe governed project semantics.

They do not describe the technology used to store or visualize the graph.

---

# General Invariants

## 68. Relationship Invariants

### RELATIONSHIP-INV-001

Canonical relationships have a defined source, type, and target.

### RELATIONSHIP-INV-002

Canonical authored relationships use one semantic outbound direction.

### RELATIONSHIP-INV-003

Inbound relationship views are derived unless explicitly defined otherwise by a
canonical contract.

### RELATIONSHIP-INV-004

A relationship does not independently establish Human Approval Authority.

### RELATIONSHIP-INV-005

A relationship does not independently establish Project Truth.

### RELATIONSHIP-INV-006

A relationship does not automatically determine Lifecycle, Validity, or
Execution State.

### RELATIONSHIP-INV-007

Internal canonical relationship targets must be resolvable.

### RELATIONSHIP-INV-008

Broken Reference, Missing Required Relationship, and Invalid Relationship are
distinct conditions.

### RELATIONSHIP-INV-009

The entire Knowledge Graph is not required to be acyclic.

### RELATIONSHIP-INV-010

`supersedes` lineage must remain acyclic.

### RELATIONSHIP-INV-011

Dependency cycles must be detected where relevant and evaluated against the
applicable contract rather than silently removed.

### RELATIONSHIP-INV-012

Historical relationships must remain queryable.

### RELATIONSHIP-INV-013

A Deprecated or Archived endpoint does not automatically invalidate the
historical relationship.

### RELATIONSHIP-INV-014

Validation findings do not grant the Validator Human Approval Authority.

### RELATIONSHIP-INV-015

Knowledge Curator graph maintenance does not grant Human Approval Authority.

### RELATIONSHIP-INV-016

AI-suggested relationships remain candidate knowledge until accepted through
the applicable governed process.

### RELATIONSHIP-INV-017

Relationship provenance must be preserved where required for traceability,
impact analysis, or audit.

### RELATIONSHIP-INV-018

Exact duplicate canonical relationship facts must not be independently stored
as though they were different semantic edges.

### RELATIONSHIP-INV-019

The existence of a graph path does not by itself prove downstream impact.

### RELATIONSHIP-INV-020

Vendor-specific or artifact-subtype-specific convenience terms must not expand
the canonical relationship taxonomy without distinct semantic justification.

---

## 69. Relationship to Other Canonical Sources

```text
Relationship Vocabulary and Graph Integrity
→ ./relationship_rules.md

Artifact Truth and Validity
→ ./artifact_truth.md

Version Lineage Consequences
→ ./artifact_truth.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Version Numbering
→ ./versioning_rules.md

Naming and Identity
→ ./naming_convention.md

Human Approval Authorities
→ ../authorities/

Professional Responsibilities
→ ../roles/

MDS System Capabilities
→ ../system-capabilities/

Implementation Plane
→ ../implementation-plane/

Runtime Environment and Evidence
→ ../runtime/

Structured Contracts
→ ../schemas/
```

Each concern must remain owned by its canonical source.

---

## 70. Source of Truth

This document is the canonical owner of:

```text
relationship vocabulary

relationship direction

relationship semantics

relationship integrity

relationship provenance requirements

broken-reference classification

required-relationship semantics

graph cycle treatment

relationship migration rules
```

It is not the canonical owner of:

```text
Artifact Truth validity

Lifecycle State

Execution State

Human Approval Authority

Professional Responsibility

Implementation execution

Runtime state

concrete relationship persistence structure
```

Those concerns must resolve through their respective canonical owners.

Principle:

> **Model the meaning of the connection once, store it in one canonical
> direction, and derive views from that governed fact.**