---
ownership: mds
status: transitional
source: internal
safe_to_modify: scoped
classification: compatibility_index
canonical_target:
  - ./artifact_truth.md
  - ./naming_convention.md
  - ./lifecycle_rules.md
  - ./relationship_rules.md
  - ./versioning_rules.md
update_strategy: retire after all legacy references have been migrated
---

# Document Standards Compatibility Index

> **Transitional document**
>
> This file is retained only to preserve compatibility with legacy references.
> It is not a universal MDS governance authority and must not define competing
> canonical rules.

---

## 1. Purpose

Earlier versions of MDS used `document_standards.md` as a broad document
governance source covering several unrelated concerns.

That model is no longer canonical.

Those concerns now belong to focused canonical owners.

This file exists only to:

- preserve legacy references during migration;
- route old references to the correct canonical owner;
- identify deprecated assumptions from the previous governance model;
- prevent historical references from silently becoming broken;
- provide a controlled path toward eventual retirement of this file.

---

## 2. Canonical Replacement Map

Legacy concerns previously associated with this document must now be resolved
through the following canonical sources:

```text
Artifact Truth
→ ./artifact_truth.md

Naming and Identifier Rules
→ ./naming_convention.md

Lifecycle and Execution State
→ ./lifecycle_rules.md

Relationship Vocabulary and Graph Integrity
→ ./relationship_rules.md

Version Numbering
→ ./versioning_rules.md
```

This file does not override any of those sources.

---

## 3. No Meta-Governance Authority

This document must not be interpreted as:

```text
the MDS constitution

the highest MDS governance layer

a universal standard above all schemas

a universal standard above all role contracts

a universal standard above all domain models
```

MDS now follows:

```text
Concern
   ↓
Canonical Owner
   ↓
Consumers
```

not:

```text
document_standards.md
        ↓
Everything Else
```

---

## 4. Canonical Ownership by Concern

### Artifact Truth

Questions concerning:

```text
Current Project Truth

validity

approved lineage head

supersession

historical lineage

impact invalidation

truth projection
```

belong to:

```text
./artifact_truth.md
```

This document must not redefine those semantics.

---

### Naming

Questions concerning:

```text
artifact identifiers

human-readable names

filenames

identifier format

naming consistency
```

belong to:

```text
./naming_convention.md
```

Naming rules must not encode Professional Responsibility ownership unless such
ownership is independently required by a canonical model.

---

### Lifecycle and Execution

Questions concerning:

```text
lifecycle states

lifecycle transitions

execution states

execution transitions

state-transition requirements
```

belong to:

```text
./lifecycle_rules.md
```

Lifecycle state must remain separate from Artifact Truth validity and execution
progress.

---

### Relationships

Questions concerning:

```text
relationship vocabulary

relationship direction

reference integrity

broken references

graph constraints

relationship validity
```

belong to:

```text
./relationship_rules.md
```

Relationships must not silently create Human Approval Authority or Project
Truth.

---

### Version Numbering

Questions concerning:

```text
version syntax

version-number increments

MAJOR / MINOR / PATCH semantics
```

belong to:

```text
./versioning_rules.md
```

Version numbering is not the same concern as Artifact Truth lineage.

---

## 5. Domain Semantics Belong Outside This File

Some concepts referenced by legacy Document Standards now have dedicated
canonical boundaries.

They must not be defined here.

```text
External Actor semantics
→ ../actors/

Human Approval Authority
→ ../authorities/

Professional Responsibilities
→ ../roles/

Implementation execution
→ ../implementation-plane/

Runtime Environment and Evidence
→ ../runtime/

MDS System Capabilities
→ ../system-capabilities/

Structured contracts
→ ../schemas/
```

This document may route to those boundaries.

It must not redefine them.

---

## 6. Deprecated Approval Assumptions

Legacy rules may have associated approval authority directly with role names,
role abbreviations, AI agents, or system capabilities.

Such assumptions are no longer canonical.

MDS must preserve:

```text
Professional Responsibility
≠
Human Approval Authority

System Capability
≠
Human Approval Authority

AI
≠
Human Approval Authority
```

Approval requirements must resolve through:

```text
../authorities/
```

A legacy statement such as:

```text
PM approves this artifact
```

must not be interpreted as canonical merely because it appears in an older
document.

The governed question is instead:

```text
Which Authority Type governs this decision?

Who currently holds that Authority within the applicable scope?
```

---

## 7. Deprecated Agent Authority Assumptions

Legacy MDS documents may refer to autonomous agents as owners, approvers, or
governance authorities.

Those assumptions are not canonical.

MDS must preserve:

```text
AI Analysis
≠
Human Approval

AI Recommendation
≠
Governed Decision

AI Validation
≠
Approval

AI Output
≠
Project Truth
```

AI behaviour belongs to governed capability and prompt boundaries.

AI must not gain authority merely because a legacy document uses words such as:

```text
agent owner

agent approver

agent authority

AI judge
```

---

## 8. Deprecated Knowledge Curator Authority Assumptions

Legacy rules may state that a Knowledge Curator can approve artifacts, block
Human Approval, or directly determine governed truth.

That model is no longer canonical.

Knowledge Curator is an MDS System Capability.

Its semantics belong to:

```text
../system-capabilities/
```

MDS must preserve:

```text
Knowledge Curation
≠
Human Approval Authority
```

A Knowledge Curator may identify structural problems and produce findings.

The applicable governance process determines whether those findings block a
transition or require human action.

---

## 9. Deprecated Implementation Assumptions

Legacy documents may describe MDS roles or AI agents as directly generating or
modifying managed-project implementation artifacts.

Such statements must be resolved against the canonical Implementation Plane
boundary.

Implementation execution belongs to:

```text
../implementation-plane/
```

MDS must preserve:

```text
MDS Project Truth Layer
≠
Managed-Project Implementation Execution
```

MDS may:

```text
prepare bounded context

inspect implementation evidence

correlate implementation evidence

validate traceability

identify drift
```

MDS System Capabilities must not gain managed-project mutation authority merely
because an older document assigned implementation tasks to an internal agent.

---

## 10. Deprecated Truth Assumptions

Legacy documents may equate:

```text
APPROVED
=
Single Source of Truth
```

That assumption is no longer canonical.

MDS must preserve:

```text
APPROVED
≠
CURRENT
```

An artifact may historically have been approved while no longer belonging to
Current Project Truth.

Artifact Truth semantics belong to:

```text
./artifact_truth.md
```

---

## 11. Deprecated Completion Assumptions

Legacy documents may imply that execution completion establishes authoritative
truth.

MDS must preserve:

```text
COMPLETED
≠
AUTHORITATIVE
```

Lifecycle, validity, and execution state are separate concerns.

Their canonical owners are:

```text
Lifecycle / Execution
→ ./lifecycle_rules.md

Validity / Current Project Truth
→ ./artifact_truth.md
```

---

## 12. Deprecated Role-Coded Identity Assumptions

Legacy artifacts may contain identifiers whose semantic meaning is coupled to
role abbreviations.

Examples of the general legacy pattern include:

```text
<ROLE>-<TYPE>-<NUMBER>
```

Such identifiers may remain valid historical identifiers where required for
compatibility.

However, role ownership must not be inferred solely from an identifier prefix.

Identifier syntax belongs to:

```text
./naming_convention.md
```

Professional Responsibility semantics belong to:

```text
../roles/
```

The two concerns must remain separate.

---

## 13. Legacy Relationships

Relationship names or directions appearing in older versions of this document
must not automatically be treated as canonical.

All relationship semantics must resolve through:

```text
./relationship_rules.md
```

If a legacy relationship is not present in the current canonical vocabulary,
it should be treated as:

```text
legacy

unmapped

or requiring migration
```

rather than silently promoted into the canonical relationship model.

---

## 14. Legacy Lifecycle Rules

Lifecycle states or transitions appearing in historical copies of this document
must not override:

```text
./lifecycle_rules.md
```

If an old transition conflicts with the current lifecycle model, the legacy
transition is stale.

Historical records should remain historical records.

They must not be rewritten merely to imitate current rules.

---

## 15. Legacy Version Rules

Version numbering rules appearing in historical copies of this document must
resolve through:

```text
./versioning_rules.md
```

Version-number changes do not independently establish:

```text
Current Project Truth

Human Approval

lineage head

supersession
```

Those concerns belong to their respective canonical owners.

---

## 16. Schemas

Schemas may encode standards for machine validation.

However:

```text
Schema
≠
Independent Semantic Authority
```

Schemas belong to:

```text
../schemas/
```

If a legacy schema was derived from an obsolete rule in this document, that
schema must be migrated to the current canonical owner.

The obsolete rule must not be preserved merely because a schema still encodes
it.

---

## 17. Templates

Templates may historically reference Document Standards.

Those references should eventually be migrated toward the specific canonical
sources that govern the fields or semantics used by the template.

Templates belong to:

```text
../templates/
```

MDS must preserve:

```text
Template
≠
Canonical Governance Rule
```

---

## 18. Prompts

Legacy prompts may reference this document as a highest-order instruction
source.

That interpretation is deprecated.

Prompts belong to:

```text
../prompts/
```

Prompts consume canonical MDS rules.

They do not define them.

MDS must preserve:

```text
Canonical Rule
      ↓
Prompt
      ↓
AI Behaviour
```

not:

```text
Prompt
      ↓
Canonical Rule
```

---

## 19. Guides

Legacy guides may cite this file as the source of mandatory workflow behaviour.

Such references should be migrated to the specific canonical standard or
governed workflow contract that owns the requirement.

Guides belong to:

```text
../guides/
```

MDS must preserve:

```text
Guide
≠
Governance Authority
```

---

## 20. Glossary

Glossary definitions must not use this compatibility document as a substitute
for the actual canonical semantic owner.

Glossary content belongs to:

```text
../glossary/
```

Glossary entries should reference the current canonical source whenever the
term has governed semantics.

---

## 21. Examples

Examples may reference legacy Document Standards for historical context.

They must not treat this file as a recommendation source.

Examples belong to:

```text
../examples/
```

MDS must preserve:

```text
Example
≠
Project Truth

Example
≠
Canonical Standard

Pattern
≠
Governed Decision
```

---

## 22. Conflict Handling

If a legacy rule from an older version of `document_standards.md` conflicts
with a focused canonical source:

```text
1. Preserve the legacy source as historical evidence where required.

2. Identify the concern being governed.

3. Route the concern to its current canonical owner.

4. Use the current canonical owner for present interpretation.

5. Mark the legacy rule as stale, superseded, or pending migration where
   applicable.

6. Do not silently merge incompatible rules.
```

The existence of an older rule does not give it equal canonical authority.

---

## 23. Migration Guidance

References to this file should be migrated gradually.

A legacy reference such as:

```text
See document_standards.md for lifecycle rules.
```

should become:

```text
See lifecycle_rules.md for lifecycle and execution-state rules.
```

A legacy reference such as:

```text
See document_standards.md for relationship rules.
```

should become:

```text
See relationship_rules.md for canonical relationship semantics.
```

The same routing principle applies to every migrated concern.

---

## 24. Historical Compatibility

Keeping this file during migration does not make its former rules canonical.

Its continued presence provides:

```text
reference compatibility

migration traceability

legacy-path stability

historical discoverability
```

It does not provide:

```text
meta-governance authority

approval authority

semantic precedence

implementation authority
```

---

## 25. Retirement Condition

This file may be retired when:

```text
all canonical rules have focused owners

all active references have been migrated

no active schema depends on legacy semantics from this file

no active template depends on legacy semantics from this file

no active prompt treats this file as higher-order authority

no active guide treats this file as higher-order authority

repository validation confirms that removing the file creates no unresolved
canonical dependency
```

Retirement must follow the applicable governed migration process.

---

## 26. Source of Truth

This file owns no independent detailed governance domain.

It is only a migration and compatibility index.

Current canonical ownership is:

```text
Artifact Truth
→ ./artifact_truth.md

Naming
→ ./naming_convention.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Relationships
→ ./relationship_rules.md

Version Numbering
→ ./versioning_rules.md

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

Structured Contracts
→ ../schemas/
```

If this compatibility document conflicts with a current canonical owner, the
current canonical owner governs that concern.

This document must then be updated or treated as stale.