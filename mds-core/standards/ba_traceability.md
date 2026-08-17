---
ownership: mds
status: transitional
source: internal
safe_to_modify: scoped
classification: specialized_traceability_compatibility
canonical_target:
  - ./relationship_rules.md
  - ./artifact_truth.md
  - ./lifecycle_rules.md
  - ../roles/
update_strategy: retire or relocate after the Business Analysis responsibility and artifact contracts are canonicalized
---

# Business Analysis Traceability Compatibility Profile

> **Transitional document**
>
> This file preserves compatibility with legacy Business Analysis traceability
> conventions.
>
> It is not the canonical owner of global relationship semantics, graph
> integrity, Artifact Truth, approval authority, or Professional Responsibility
> semantics.

---

## 1. Purpose

Earlier MDS versions defined a fixed Business Analysis document hierarchy and a
specialised relationship vocabulary directly in this file.

That model is no longer globally canonical.

This file is retained temporarily to:

- preserve legacy BA traceability references;
- document how legacy BA relationships map to the canonical relationship model;
- prevent historical graph data from being silently discarded;
- identify BA-specific rules that may later belong to a Professional
  Responsibility contract or artifact schema;
- avoid defining Business Analysis semantics before the canonical
  `roles/` model is finalized.

---

## 2. Canonical Owners

This file must defer to the following canonical sources:

```text
Global relationship vocabulary and graph integrity
→ ./relationship_rules.md

Artifact Validity and Current Project Truth
→ ./artifact_truth.md

Lifecycle and Execution State
→ ./lifecycle_rules.md

Stable Identity and Naming
→ ./naming_convention.md

Version Numbering
→ ./versioning_rules.md

Human Approval Authority
→ ../authorities/

Professional Responsibility semantics
→ ../roles/

MDS System Capabilities
→ ../system-capabilities/

Structured artifact and relationship contracts
→ ../schemas/
```

If this file conflicts with one of those canonical owners, the canonical owner
governs that concern.

---

## 3. This File is not a Global Relationship Standard

This file must not independently define global MDS relationship types.

The canonical relationship vocabulary belongs to:

```text
./relationship_rules.md
```

The current canonical v1 vocabulary is:

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

Business Analysis artifacts consume that vocabulary where the semantics apply.

They do not create a second competing relationship glossary.

---

## 4. No Mandatory Global BA DAG

Legacy MDS defined a fixed hierarchy resembling:

```text
Business Document
        ↓
Requirement
Business Rule
Process Flow
Use Case
```

with specific mandatory edges between those artifact classes.

That structure must no longer be interpreted as a universal MDS graph
invariant.

MDS must preserve:

```text
Business Analysis Traceability Pattern
≠
Universal Knowledge Graph Structure
```

A project may require different Business Analysis artifact structures depending
on:

```text
project context

artifact model

governed methodology

available source information

Professional Responsibility contract
```

The entire BA knowledge subgraph is not required by this file to form one fixed
hierarchy.

---

## 5. Business Analysis is a Professional Responsibility

Business Analysis is a Professional Responsibility.

Its canonical semantics belong to:

```text
../roles/
```

This file does not define:

```text
Business Analysis mission

Business Analysis decision rights

Business Analysis approval authority

Business Analysis Definition of Done

Business Analysis handoff contract

Business Analysis AI behaviour
```

Those concerns must be defined through the canonical Professional
Responsibility model.

---

## 6. Professional Responsibility is not Authority

MDS must preserve:

```text
Business Analysis Responsibility
≠
Business Authority
```

Business Analysis may:

```text
analyse

clarify

structure

trace

identify ambiguity

propose governed business meaning

prepare evidence
```

where permitted by its canonical Professional Responsibility contract.

The applicable Human Approval Authority determines governed business decisions.

Authority semantics belong to:

```text
../authorities/
```

---

## 7. Legacy BA Artifact Codes

Earlier MDS material may contain artifact identifiers or classifications such
as:

```text
BA-BRD

BA-REQ

BA-BR

BA-FLOW

BA-UC
```

These tokens may remain present in historical artifacts.

They must not automatically define the new canonical artifact identity model.

MDS must preserve:

```text
Legacy Role-Coded Identifier
≠
Canonical Professional Ownership
```

and:

```text
Legacy Type Code
≠
Current Artifact Classification
```

Canonical identity rules belong to:

```text
./naming_convention.md
```

Existing identifiers must not be silently rewritten.

---

# Legacy Relationship Compatibility

## 8. `produces`

Legacy BA graphs may contain:

```text
produces
```

This relationship remains part of the global canonical relationship vocabulary.

Canonical meaning belongs to:

```text
./relationship_rules.md
```

This file must not redefine it as:

```text
BRD may only produce REQ / BR / FLOW / UC
```

at the global level.

Any BA-specific endpoint restrictions must eventually belong to the applicable
artifact contract or Professional Responsibility contract.

---

## 9. `elaborates`

Legacy BA graphs may contain:

```text
elaborates
```

This relationship remains canonical.

Its global meaning is:

> The source adds governed detail, clarification, decomposition, or precision
> to the target without replacing it.

Canonical semantics belong to:

```text
./relationship_rules.md
```

A Business Analysis artifact may use `elaborates` where that meaning is true.

The artifact's legacy type alone does not automatically require the edge.

---

## 10. `adheres_to`

Legacy BA graphs may contain:

```text
adheres_to
```

This relationship remains canonical.

It represents intended adherence to a governing constraint, rule, decision, or
contract.

MDS must preserve:

```text
adheres_to
≠
verified conformance
```

The relationship does not prove that the source actually conforms.

Canonical semantics belong to:

```text
./relationship_rules.md
```

---

## 11. `verifies`

Legacy BA traceability may contain:

```text
Verification Artifact
→ verifies
→ Business Artifact
```

`verifies` remains the canonical verification relationship.

Canonical direction is:

```text
Verification Source
→ verifies
→ Governed Target
```

The inverse view:

```text
Governed Target
← verified by
← Verification Source
```

is derived.

---

## 12. Legacy `tested_by`

Earlier BA material may contain:

```text
Business Artifact
→ tested_by
→ Verification Artifact
```

`tested_by` is not a canonical authored relationship in the current global
vocabulary.

Where its historical meaning is equivalent to the inverse of `verifies`, it
should migrate conceptually to:

```text
Verification Artifact
→ verifies
→ Business Artifact
```

with the Business Artifact side rendered as a derived inbound view.

Migration must preserve the legacy edge until its meaning and target can be
resolved safely.

MDS must not silently store both:

```text
tested_by
```

and:

```text
verifies
```

as independent canonical facts for the same semantic connection.

---

## 13. `depends_on`

Legacy BA graphs may contain:

```text
depends_on
```

This relationship remains globally canonical.

However, the old restriction that it may only connect artifacts of the same
legacy type is not a global invariant.

Canonical meaning belongs to:

```text
./relationship_rules.md
```

Any endpoint restrictions belong to the applicable artifact contract.

---

## 14. Legacy `includes`

Legacy Business Analysis artifacts may use:

```text
includes
```

to represent a specialised behavioural modeling relationship.

`includes` is not currently part of the global canonical v1 relationship
vocabulary.

Existing values must therefore be treated as:

```text
legacy specialised relationship
```

until the Business Analysis or interaction-model contract determines whether
the semantic needs to remain first class.

MDS must not automatically convert `includes` into another relationship without
understanding the original claim.

---

## 15. Legacy `extends`

Legacy Business Analysis artifacts may use:

```text
extends
```

for specialised behavioural modeling.

`extends` is not currently part of the global canonical v1 relationship
vocabulary.

Existing values must remain traceable as:

```text
legacy specialised relationship
```

until the appropriate canonical artifact model determines their future
treatment.

---

## 16. Specialised Relationships Must not Expand the Global Vocabulary by Default

A relationship used by one modeling technique does not automatically need to
become a global MDS relationship.

MDS should first determine whether the meaning can be represented through:

```text
canonical relationship
+
artifact classification
+
structured metadata
```

Only genuinely distinct cross-project semantics should be candidates for
extension of:

```text
./relationship_rules.md
```

---

# Traceability Expectations

## 17. Traceability is Intentional

A Business Analysis artifact should have sufficient governed traceability for
its intended purpose.

However, MDS must not derive a universal rule such as:

```text
Every BA artifact must have one parent.
```

Traceability requirements depend on the applicable artifact contract.

Possible traceability concerns may include:

```text
source provenance

business intent

governed business rules

requirements

process knowledge

constraints

verification

downstream realization
```

The exact required relationships belong to schemas and Professional
Responsibility contracts.

---

## 18. Source Traceability

Business Analysis should preserve where governed business knowledge came from.

Possible source material may include:

```text
External Actor statements

source documents

clarifications

observations

existing governed decisions

accepted constraints
```

Source information must remain distinguishable from interpreted or approved
business meaning.

MDS must preserve:

```text
Source Statement
≠
Business Truth
```

External Actor semantics belong to:

```text
../actors/
```

---

## 19. Interpretation Traceability

Where raw source information is transformed into structured business analysis,
MDS should preserve sufficient provenance to determine:

```text
which source informed the analysis

what interpretation was made

what assumptions were introduced

what ambiguity remained

which governed artifact resulted
```

Knowledge transformation must not destroy the original source evidence.

---

## 20. Requirement Traceability

A governed requirement should be traceable to sufficient basis for its meaning.

That basis may involve:

```text
source intent

business rule

constraint

higher-level requirement

governed decision

related analysis
```

This does not require one universal parent relationship.

The applicable artifact schema determines the minimum valid structure.

---

## 21. Business Rule Traceability

A governed Business Rule should remain traceable to its applicable source and
governance basis.

MDS must preserve:

```text
Business Rule Draft
≠
Approved Business Truth
```

The fact that a rule is documented does not establish Human Approval.

Business Authority semantics belong to:

```text
../authorities/
```

---

## 22. Process Traceability

Process or workflow analysis may elaborate governed requirements or business
meaning.

Such relationships should use the applicable canonical relationship semantics.

MDS must not assume:

```text
Process Artifact Exists
→
Requirement Automatically Exists
```

or:

```text
Process Artifact
→
Automatically Authoritative
```

Lifecycle and Artifact Truth remain separate concerns.

---

## 23. Verification Traceability

Where verification is required, canonical traceability should use:

```text
Verification Artifact / Result
→ verifies
→ Governed Business Target
```

Verification coverage may be derived from these canonical edges.

MDS must preserve:

```text
Verification Exists
≠
Verification PASS

Verification PASS
≠
Human Approval
```

---

# Graph Integrity

## 24. Global Graph Integrity Comes from the Relationship Standard

Business Analysis traceability must obey:

```text
./relationship_rules.md
```

including rules concerning:

```text
resolvable targets

duplicate edges

self-relationships

relationship provenance

exact version traceability

broken references

invalid relationships

cycle treatment
```

This file must not create a competing graph-integrity model.

---

## 25. Entire BA Graph is not Universally Required to be a DAG

MDS must not assume:

```text
Entire Business Analysis Graph
=
DAG
```

as a universal invariant.

Some relationship types may legitimately participate in cyclic graph
structures.

Acyclicity must be determined by the semantics of the specific relationship.

For example:

```text
supersedes
```

must remain acyclic.

A:

```text
depends_on
```

cycle should be detected and evaluated according to the applicable contract.

---

## 26. Dependency Cycles

A Business Analysis dependency cycle may indicate:

```text
circular prerequisite

incorrect decomposition

mutual dependency

modeling error
```

The Validator should detect it.

The applicable artifact or workflow contract determines whether the cycle is:

```text
warning

blocking

or valid in context
```

MDS must not silently break the cycle.

---

## 27. Orphan Classification

A Business Analysis artifact is not automatically an Orphan merely because it
has no incoming edge.

An Orphan condition exists only when the applicable artifact contract requires
one or more anchoring relationships and those relationships are absent or
invalid.

MDS must preserve:

```text
No Incoming Edge
≠
Automatically Orphan
```

---

## 28. Broken Reference

A declared relationship whose internal target cannot be resolved creates:

```text
BROKEN REFERENCE
```

The condition must remain visible.

A broken relationship must not silently disappear from the graph merely to make
validation pass.

---

## 29. Deprecated and Archived Targets

Legacy BA rules prohibited relationships to Deprecated artifacts.

That prohibition is no longer globally canonical.

Historical relationships to:

```text
DEPRECATED

ARCHIVED
```

artifacts may remain necessary for:

```text
lineage

audit

historical reconstruction

decision history

impact analysis
```

Artifact Truth determines whether such targets may be used as active
authoritative context.

---

## 30. Current Authoritative Use

A relationship target being resolvable does not mean it is eligible for current
authoritative use.

MDS must distinguish:

```text
Relationship Integrity
```

from:

```text
Artifact Truth Eligibility
```

For example:

```text
historical relationship valid
+
target DEPRECATED
```

may be correct historical graph state while remaining unsuitable as current
authoritative instruction.

Artifact Truth semantics belong to:

```text
./artifact_truth.md
```

---

# Approval and Validation

## 31. Graph Validation is not Approval

Legacy rules may state that a Graph Engine can block transition to:

```text
APPROVED
```

This must now be interpreted through the canonical governance model.

The Validator may produce a finding such as:

```text
broken reference

required relationship missing

dependency cycle detected

invalid endpoint combination
```

An applicable governance rule may define that finding as a gate blocker.

The Validator itself does not hold Human Approval Authority.

MDS must preserve:

```text
Graph Validation
≠
Human Approval
```

---

## 32. System Capability Boundary

Graph analysis may be performed by MDS System Capabilities such as:

```text
Knowledge Curator

Validator

Orchestrator

Context Builder
```

Their semantics belong to:

```text
../system-capabilities/
```

MDS must preserve:

```text
Knowledge Curator
≠
Human Approval Authority

Validator
≠
Human Approval Authority

Graph Engine
≠
Human Approval Authority
```

---

## 33. Blocking Conditions

A canonical contract may define:

```text
Validation Finding
+
Governance Rule
→
Blocking Condition
```

For example, an applicable review gate may require:

```text
zero broken required references
```

The gate rule creates the blocking condition.

The validating capability does not create the approval authority.

---

## 34. Human Approval

Where Business Analysis output requires a governed business decision, the
applicable Human Approval Authority must resolve through:

```text
../authorities/
```

This file must not hard-code approval to:

```text
BA

PM

SA

Architect

QA

AI Agent

Graph Engine
```

merely because those participants interact with the artifact.

---

# AI Boundary

## 35. AI-Assisted Traceability

AI may assist by:

```text
discovering candidate relationships

detecting missing traceability

identifying ambiguity

suggesting source links

detecting possible duplicate requirements

explaining graph paths
```

MDS must preserve:

```text
AI Suggested Relationship
≠
Canonical Relationship
```

Candidate relationships require the applicable validation and governance
treatment before becoming governed traceability.

---

## 36. AI Must not Invent Business Meaning

AI may identify that a relationship appears missing.

It must not fabricate:

```text
business intent

business rule

requirement

stakeholder confirmation

Human Approval
```

merely to complete the graph.

Prefer:

```text
MISSING TRACEABILITY

NEEDS CLARIFICATION

UNKNOWN
```

over invented knowledge.

---

# Legacy Migration

## 37. Legacy BA Hierarchy

Legacy BA material may assume:

```text
BRD
├── REQ
├── BR
├── FLOW
└── UC
```

as a mandatory hierarchy.

During migration, this hierarchy should be treated as:

```text
legacy modeling convention
```

not as an automatic canonical invariant.

Existing relationships must remain preserved until mapped to their intended
semantics.

---

## 38. Legacy Relationship Mapping

The current migration guidance is:

```text
produces
→ canonical where semantic meaning matches

elaborates
→ canonical where semantic meaning matches

adheres_to
→ canonical where semantic meaning matches

verifies
→ canonical

tested_by
→ normally migrate to derived inbound view of verifies

depends_on
→ canonical where semantic meaning matches

includes
→ legacy specialised relation pending artifact-model decision

extends
→ legacy specialised relation pending artifact-model decision
```

Migration must operate on meaning rather than relationship spelling alone.

---

## 39. Legacy IDs

Role-coded BA identifiers must remain resolvable during migration.

They must not be silently transformed simply to satisfy the new naming
standard.

Migration should preserve, where applicable:

```text
legacy identity

canonical identity

relationship mapping

source provenance

migration reason
```

Naming migration belongs to:

```text
./naming_convention.md
```

---

## 40. Historical Graph Preservation

Migration must not destroy the ability to reconstruct the earlier graph.

Where a legacy edge is changed or replaced, MDS should preserve:

```text
legacy relationship type

legacy source

legacy target

replacement type if any

migration rationale

migration provenance
```

where traceability requires it.

---

# Future Ownership

## 41. Business Analysis-Specific Traceability

Once the canonical Business Analysis Professional Responsibility is finalized,
any genuinely responsibility-specific traceability requirements should belong
to the appropriate canonical role contract or related artifact contract.

Examples of potential responsibility-specific concerns include:

```text
minimum source coverage

required ambiguity tracking

required business-rule linkage

handoff expectations

professional review checks
```

Those concerns must not be prematurely frozen here.

---

## 42. Artifact-Type Constraints

If a specific artifact type requires relationships such as:

```text
Requirement must reference at least one governed source

Process model must elaborate a requirement

Business Rule must retain source provenance
```

those constraints should be expressed through the applicable canonical artifact
schema or contract.

They should not be generalized into all Business Analysis artifacts without
semantic justification.

---

## 43. Retirement Target

This file should eventually be:

```text
retired
```

or:

```text
relocated as non-global Business Analysis guidance
```

after:

```text
Business Analysis Professional Responsibility is canonical

artifact contracts are canonical

legacy BA relations are migrated

active references no longer rely on this file as a global standard
```

Its current presence is for controlled migration.

---

# General Invariants

## 44. Compatibility Invariants

### BA-TRACE-INV-001

This file does not own global relationship semantics.

### BA-TRACE-INV-002

Business Analysis Professional Responsibility does not imply Business Approval
Authority.

### BA-TRACE-INV-003

Legacy BA artifact codes do not define canonical artifact identity.

### BA-TRACE-INV-004

The entire Business Analysis graph is not universally required to be a DAG.

### BA-TRACE-INV-005

`tested_by` is not a second canonical verification fact when equivalent
`verifies` traceability exists.

### BA-TRACE-INV-006

Legacy `includes` and `extends` remain specialised legacy semantics until an
applicable canonical artifact model determines their future treatment.

### BA-TRACE-INV-007

Graph validation does not constitute Human Approval.

### BA-TRACE-INV-008

Knowledge Curator, Validator, Graph Engine, or AI do not gain Human Approval
Authority from traceability work.

### BA-TRACE-INV-009

An artifact without an incoming edge is not automatically an Orphan.

### BA-TRACE-INV-010

Historical relationships to Deprecated or Archived artifacts may remain valid
historical traceability.

### BA-TRACE-INV-011

Relationship integrity does not independently establish Artifact Truth
eligibility.

### BA-TRACE-INV-012

AI-suggested relationships remain candidate knowledge until accepted through
the applicable governed process.

### BA-TRACE-INV-013

Legacy traceability must not be silently discarded during migration.

### BA-TRACE-INV-014

Future BA-specific traceability requirements must be owned by the applicable
Professional Responsibility or artifact contract rather than this transitional
global standard.

---

## 45. Source of Truth

This file owns only:

```text
legacy BA traceability compatibility

legacy BA relationship migration guidance

routing toward current canonical owners
```

It does not own:

```text
global relationship vocabulary

graph integrity semantics

Artifact Truth

Lifecycle

Human Approval Authority

Business Analysis Professional Responsibility

artifact schemas
```

Current canonical ownership is:

```text
Global Relationships
→ ./relationship_rules.md

Artifact Truth
→ ./artifact_truth.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Naming and Identity
→ ./naming_convention.md

Version Numbering
→ ./versioning_rules.md

Human Approval Authorities
→ ../authorities/

Professional Responsibilities
→ ../roles/

System Capabilities
→ ../system-capabilities/

Structured Contracts
→ ../schemas/
```

Principle:

> **Preserve legacy traceability without allowing legacy modeling conventions
> to define the future MDS architecture.**