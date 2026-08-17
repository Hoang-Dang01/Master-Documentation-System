---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: standards
update_strategy: change only through the applicable governed approval process
---

# MDS Standards

This directory contains canonical cross-cutting governance standards used by
MDS.

A standard defines a governed rule that applies across one or more MDS
domains.

Standards must not become competing owners of semantics already owned by
another canonical MDS Core boundary.

---

## 1. Purpose

`standards/` exists to define stable cross-cutting governance rules for
concerns such as:

```text
artifact truth

lifecycle governance

versioning

naming

relationships

traceability

provenance

evidence handling
```

A standard answers:

> What governed rule must MDS preserve across applicable artifacts,
> workflows, capabilities, and project knowledge?

It does not answer every domain-specific question.

Detailed domain semantics remain owned by their canonical boundaries.

---

## 2. Core Principle

MDS follows:

> **One concern must have one canonical owner.**

Therefore:

```text
Artifact Truth
→ artifact_truth.md

Naming
→ naming_convention.md

Lifecycle and Execution State
→ lifecycle_rules.md

Relationship Vocabulary and Graph Integrity
→ relationship_rules.md

Version Numbering
→ versioning_rules.md
```

A standard may reference another standard.

It must not silently redefine the other standard's concern.

---

## 3. Canonical Ownership Map

The current intended ownership model is:

```text
artifact_truth.md
→ artifact validity
→ Current Project Truth
→ version lineage
→ approved lineage head
→ supersession lineage and truth consequences
→ impact invalidation
→ context-package authority

naming_convention.md
→ human-readable title rules
→ stable identifier rules
→ filename rules
→ naming-related metadata rules

lifecycle_rules.md
→ lifecycle state semantics
→ lifecycle transitions
→ execution state semantics
→ execution-state transitions

relationship_rules.md
→ canonical relationship vocabulary
→ relationship direction
→ graph integrity constraints
→ broken-reference handling
→ relationship validity rules

versioning_rules.md
→ version-number format
→ version bump semantics
→ version-number compatibility rules
```

This ownership map is canonical at the `standards/` directory level.

---

## 4. Artifact Truth and Versioning Boundary

MDS must preserve the distinction between:

```text
Version Lineage
≠
Version Number
```

`artifact_truth.md` owns:

```text
lineage_id

approved lineage head

supersession lineage and truth consequences

historical lineage

Current Project Truth
```

`versioning_rules.md` owns:

```text
version-number syntax

MAJOR / MINOR / PATCH meaning

version bump rules
```

`versioning_rules.md` must not redefine which artifact version is Current
Project Truth.

`artifact_truth.md` must not become the owner of version-number formatting.

---

## 5. Lifecycle and Truth Boundary

MDS must preserve:

```text
Lifecycle State
≠
Validity State
≠
Execution State
```

Conceptually:

```text
Lifecycle
→ maturity and governed approval state

Validity
→ trustworthiness against current governed knowledge

Execution
→ operational progress
```

Lifecycle and execution semantics belong to:

```text
./lifecycle_rules.md
```

Validity and Current Project Truth semantics belong to:

```text
./artifact_truth.md
```

No state axis may silently imply another.

In particular:

```text
APPROVED
≠
CURRENT

COMPLETED
≠
AUTHORITATIVE
```

---

## 6. Relationship and Truth Boundary

`relationship_rules.md` owns relationship vocabulary and graph integrity.

`artifact_truth.md` owns the truth consequences of governed change and
invalidation.

Conceptually:

```text
Relationship
→ expresses a governed connection

Artifact Truth
→ determines how governed change affects current validity
```

A relationship existing in the graph does not automatically make either
endpoint authoritative.

Likewise, graph validity does not constitute Human Approval.

---

## 7. Standards and Schemas

MDS must preserve:

```text
Standard
→ owns governed semantics

Schema
→ represents and validates structured data
```

A schema may encode:

- required fields;
- allowed values;
- structural constraints;
- references;
- machine-validatable rules.

A schema must not silently redefine the semantics owned by a standard.

If a schema conflicts with its canonical standard, the schema must be updated.

Structured contracts belong to:

```text
../schemas/
```

---

## 8. Standards and Professional Responsibilities

Standards define rules.

Professional Responsibilities perform professional work under those rules.

MDS must preserve:

```text
Standard
≠
Professional Responsibility
```

A standard must not grant a Professional Responsibility Human Approval
Authority merely because that responsibility participates in a governed
process.

Professional Responsibility semantics belong to:

```text
../roles/
```

---

## 9. Standards and Human Approval Authorities

Standards may define that a governed transition requires an applicable Human
Approval Authority.

They must not assign authority by job title, role abbreviation, AI identity, or
system capability.

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

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 10. Standards and System Capabilities

MDS System Capabilities may enforce or evaluate standards.

For example:

```text
Validator
→ evaluates a rule

Knowledge Curator
→ maintains governed structure

Orchestrator
→ routes required governed activity

Context Builder
→ consumes governed state
```

However:

```text
Validation
≠
Approval

Routing
≠
Authority

Knowledge Curation
≠
Authority
```

System Capability semantics belong to:

```text
../system-capabilities/
```

---

## 11. Standards and the Implementation Plane

Standards may define:

- required implementation evidence;
- traceability expectations;
- context-package requirements;
- conformance expectations.

They do not perform managed-project implementation.

MDS must preserve:

```text
Governance Rule
≠
Implementation Execution
```

Implementation execution belongs to:

```text
../implementation-plane/
```

---

## 12. Standards and Runtime

Runtime Evidence may be evaluated against standards.

Runtime itself does not define the standards.

MDS must preserve:

```text
Observed Runtime Behaviour
≠
Automatically Correct Behaviour
```

Runtime semantics belong to:

```text
../runtime/
```

---

## 13. Supporting Material

The following directories consume standards:

```text
../templates/

../prompts/

../guides/

../glossary/

../examples/
```

They must not override canonical standards.

Conceptually:

```text
Canonical Standard
      ↓
Schema / Model / Contract
      ↓
Template / Prompt / Guide / Glossary / Example
```

A prompt, guide, template, glossary entry, or example that conflicts with a
canonical standard is stale or incorrect.

---

## 14. Transitional Files

Some files in this directory originate from an earlier MDS governance model and
must not be treated as independent higher-order authority merely because they
remain present.

### `document_standards.md`

`document_standards.md` is being retained for compatibility and migration.

It must not remain a universal meta-governance document.

Its rules are being redistributed to focused canonical owners:

```text
Naming
→ naming_convention.md

Lifecycle / Execution State
→ lifecycle_rules.md

Relationships
→ relationship_rules.md

Artifact Truth / Lineage
→ artifact_truth.md

Version Numbering
→ versioning_rules.md
```

After migration, `document_standards.md` should function only as a compatibility
index or be removed through the applicable governed migration process.

---

### `base_template_guide.md`

`base_template_guide.md` contains legacy template and authoring guidance.

It must not act as a constitutional or higher-authority standard.

Template structure belongs primarily to:

```text
../templates/
```

Human-facing authoring guidance belongs primarily to:

```text
../guides/
```

Any still-valid cross-cutting rule must be moved to its proper canonical owner
before this legacy file is retired or relocated.

---

### `ba_traceability.md`

`ba_traceability.md` contains specialised traceability rules associated with a
particular Professional Responsibility domain.

It must not redefine global relationship semantics.

Global relationship vocabulary and graph integrity belong to:

```text
./relationship_rules.md
```

Role-specific traceability requirements may extend the global model only where
they remain consistent with the canonical relationship standard and the
applicable Professional Responsibility contract.

---

## 15. No Meta-Governance Super Document

No file inside `standards/` may declare itself the universal highest authority
over unrelated canonical domains.

MDS does not use:

```text
One Document
      ↓
Owns Every Semantic Concern
```

Instead:

```text
Concern
      ↓
Canonical Owner
      ↓
Consumers
```

For example:

```text
Human Approval Authority
→ ../authorities/

Runtime Semantics
→ ../runtime/

Implementation Plane Semantics
→ ../implementation-plane/

System Capability Semantics
→ ../system-capabilities/

Professional Responsibility Semantics
→ ../roles/
```

A standard may reference those domains.

It must not redefine them.

---

## 16. Conflict Resolution

When two documents appear to define the same concern:

```text
1. Identify the concern.

2. Identify its canonical owner.

3. Preserve both sources as evidence of the conflict.

4. Do not silently choose based on filename, age, or document location.

5. Update the non-owning or legacy source through the applicable governed
   process.
```

If the canonical owner cannot be determined, the conflict remains unresolved.

Prefer:

```text
CONFLICTED
```

or:

```text
NEEDS_REVIEW
```

where applicable, rather than inventing a rule.

---

## 17. Standard Design Rules

A canonical standard should:

- have a clearly bounded concern;
- identify what it owns;
- identify what it does not own;
- define stable semantics and invariants;
- reference other canonical owners instead of duplicating them;
- remain independent of specific vendors and implementation technologies;
- distinguish evidence from authority;
- distinguish validation from approval;
- preserve uncertainty where appropriate;
- be representable through schemas where machine validation is required.

A standard should not:

- create AI authority;
- assign approval authority through role names;
- perform implementation work;
- redefine another domain's model;
- encode vendor-specific technology as canonical semantics;
- rely on examples as authoritative rules.

---

## 18. Current Migration Order

The standards migration should proceed in this order:

```text
1. standards/README.md
   → establish canonical ownership

2. document_standards.md
   → remove meta-governance authority

3. lifecycle_rules.md
   → align lifecycle / execution semantics

4. versioning_rules.md
   → separate version numbering from lineage

5. relationship_rules.md
   → align graph semantics and capability boundaries

6. naming_convention.md
   → remove role-coupled identity assumptions

7. artifact_truth.md
   → final cross-check against migrated standards

8. ba_traceability.md
   → align specialised traceability

9. base_template_guide.md
   → migrate remaining rules to correct owners
```

Migration order does not establish semantic precedence.

It only controls the cleanup sequence.

---

## 19. Source of Truth

This README owns only:

```text
standards directory purpose

standards-level ownership map

routing between focused standards

migration classification of legacy standards files
```

Detailed semantics belong to the applicable focused standard:

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
```

This README must not become a competing source for the detailed rules defined
by those files.
