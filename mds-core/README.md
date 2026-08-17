---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: mds_core
update_strategy: change only through the applicable governed approval process
---

# MDS Core

`mds-core/` contains the canonical domain models, governance rules, structured
contracts, professional responsibility definitions, templates, prompts, and
supporting reference material used by MDS.

MDS Core defines how MDS understands and governs **Project Truth**.

It does not define managed-project implementation code.

---

## 1. Purpose

MDS exists to transform project inputs, analysis, decisions, specifications,
evidence, and change history into structured and governable Project Truth.

Conceptually:

```text
Sources / Intent / Evidence
            ↓
Analysis and Professional Work
            ↓
Governed Decisions
            ↓
Project Truth
            ↓
Traceability / Impact / Context
            ↓
External Implementation
            ↓
Implementation Evidence
            ↓
Runtime Evidence
            ↓
Verification / Feedback / Change
```

MDS is the knowledge and engineering-control layer.

It is not the managed project's implementation environment.

---

## 2. Core Classification Model

MDS Core separates five foundational boundary types from Professional
Responsibilities.

```text
External Actors
→ actors/

Human Approval Authorities
→ authorities/

Professional Responsibilities
→ roles/

External Implementation Execution
→ implementation-plane/

Runtime Environment and Evidence
→ runtime/

Internal MDS Functions
→ system-capabilities/
```

These classifications must remain distinct.

MDS must preserve:

```text
Actor
≠
Professional Responsibility
≠
Human Approval Authority
≠
System Capability
≠
Implementation Participant
≠
Runtime Environment
```

One real human may participate in several classifications where explicitly
assigned, but the semantic boundaries must not be collapsed.

---

## 3. Directory Map

```text
mds-core/
├── actors/
│   └── External actors that provide intent, knowledge, feedback, or other
│       project inputs.
│
├── authorities/
│   └── Governed human decision rights and approval authority.
│
├── examples/
│   └── Non-authoritative examples and reference patterns.
│
├── glossary/
│   └── Shared terminology and references to canonical definitions.
│
├── guides/
│   └── Human-facing guidance for applying MDS.
│
├── implementation-plane/
│   └── External participants and environments that perform implementation
│       work on managed projects.
│
├── prompts/
│   └── AI instructions that consume canonical MDS rules.
│
├── roles/
│   └── Canonical Professional Responsibilities.
│
├── runtime/
│   └── Runtime Environment and operational evidence semantics.
│
├── schemas/
│   └── Structured contracts and validation shapes.
│
├── standards/
│   └── Canonical governance rules and cross-cutting standards.
│
├── system-capabilities/
│   └── Internal MDS functions such as orchestration, knowledge curation,
│       validation, and context construction.
│
├── templates/
│   └── Reusable authoring structures based on canonical models and standards.
│
└── README.md
    └── Core-level boundary map and routing rules.
```

---

## 4. Foundational Boundaries

### Actors

`actors/` defines external participants that provide project information,
intent, clarification, confirmation, feedback, or change requests.

Actors are not automatically Professional Responsibilities or Human Approval
Authorities.

Canonical semantics belong to:

```text
./actors/
```

---

### Authorities

`authorities/` defines governed human decision rights.

Authority determines who may make a particular governed decision within an
applicable scope.

Authority is separate from:

```text
job title
professional responsibility
system capability
AI capability
runtime evidence
implementation execution
```

Canonical semantics belong to:

```text
./authorities/
```

---

### Professional Responsibilities

`roles/` defines professional responsibilities required across the software
system lifecycle.

A Professional Responsibility describes the professional mission, boundaries,
inputs, outputs, checks, handoffs, and quality expectations associated with a
discipline.

Professional Responsibility does not automatically grant Human Approval
Authority.

Canonical semantics belong to:

```text
./roles/
```

---

### Implementation Plane

`implementation-plane/` defines the external execution boundary where managed
project implementation work occurs.

This may include human implementers, coding agents, development environments,
and delivery automation.

MDS must preserve:

```text
Project Truth
≠
Implementation State
```

MDS may provide bounded context and consume implementation evidence.

MDS Core does not directly own managed-project implementation execution.

Canonical semantics belong to:

```text
./implementation-plane/
```

---

### Runtime

`runtime/` defines the operational environment and runtime evidence boundary.

Runtime describes what is observed while deployed implementation is operating.

MDS must preserve:

```text
Runtime State
≠
Project Truth

Runtime Evidence
≠
Human Approval
```

Canonical semantics belong to:

```text
./runtime/
```

---

### System Capabilities

`system-capabilities/` defines internal functions performed by MDS itself.

System Capabilities may organise, validate, correlate, route, derive, or package
project knowledge.

MDS must preserve:

```text
System Capability
≠
Professional Responsibility

System Capability
≠
Human Approval Authority

System Capability
≠
Implementation Executor
```

Canonical semantics belong to:

```text
./system-capabilities/
```

---

## 5. Project Truth Governance

Project Truth represents governed project knowledge that MDS can use as an
authoritative basis for reasoning, traceability, impact analysis, context
construction, and verification.

Project Truth must preserve:

```text
source provenance

approval history

version history

lineage

relationships

current validity

supersession

conflict

evidence
```

MDS must not reduce Project Truth to a simple:

```text
approved = true
```

relationship.

In particular:

```text
APPROVED
≠
CURRENT

COMPLETED
≠
AUTHORITATIVE

OBSERVED
≠
CORRECT

EVIDENCE
≠
APPROVAL
```

Detailed Project Truth governance belongs to the applicable canonical standard
and schema.

---

## 6. Canonical Ownership Rule

MDS Core follows the principle:

> **One concern must have one canonical owner.**

A document may reference another canonical source.

It must not duplicate and redefine rules owned by another boundary.

For example:

```text
Authority semantics
→ authorities/

Runtime semantics
→ runtime/

Implementation execution semantics
→ implementation-plane/

System Capability semantics
→ system-capabilities/

Professional Responsibility semantics
→ roles/

Structured field contracts
→ schemas/

Cross-cutting governance rules
→ standards/
```

When a concern belongs to another canonical owner, link or route to that owner
instead of redefining the concern locally.

---

## 7. Canonical Source Resolution

MDS does not use one universal precedence ordering between unrelated canonical
domains.

The first rule is:

> **Route the concern to the canonical owner of that concern.**

For example, a schema cannot redefine Authority semantics merely because the
schema is canonical.

Likewise, a role contract cannot redefine Runtime semantics merely because the
role contract is canonical.

When multiple documents appear to define the same concern, the canonical owner
for that concern wins.

---

## 8. Supporting Material Precedence

Supporting material must never silently override canonical models, standards,
schemas, registries, or Professional Responsibility contracts.

Conceptually:

```text
Canonical Model / Standard / Schema / Registry / Role Contract
                          ↓
                    authoritative
                          ↓
─────────────────────────────────────────────────────────────
                          ↓
Template / Prompt / Guide / Glossary / Example
                          ↓
                       consumer
```

Therefore:

```text
Prompt
≠
Governance Authority

Template
≠
Canonical Rule

Guide
≠
Governed Requirement

Example
≠
Recommendation

Example
≠
Project Truth

Glossary Entry
≠
Competing Semantic Definition
```

If supporting material conflicts with its canonical source, the canonical
source wins.

The supporting material should then be treated as stale or incorrect.

---

## 9. Standards

`standards/` owns canonical cross-cutting governance rules.

A standard may define concerns such as:

```text
artifact truth

lifecycle governance

relationship governance

versioning

provenance

evidence requirements
```

A standard must not redefine detailed semantics owned by another canonical
boundary.

Where another boundary owns a concept, the standard should reference that
boundary.

---

## 10. Schemas

`schemas/` owns structured representations and validation contracts.

Schemas define:

```text
field structure

required fields

allowed values

references

machine-validatable constraints
```

Schemas do not independently create domain semantics.

MDS must preserve:

```text
Schema
→ represents canonical semantics

Schema
≠
source of competing semantics
```

If a schema and its canonical semantic owner disagree, the schema must be
updated.

---

## 11. Templates

`templates/` provides reusable structures for authoring MDS artifacts.

Templates must derive from canonical:

```text
models

standards

schemas

Professional Responsibility contracts
```

A template may make canonical rules easier to apply.

It must not invent new governance rules.

---

## 12. Prompts

`prompts/` contains AI-facing instructions.

Prompts are consumers of MDS Core.

They are not the constitution of MDS.

MDS must preserve:

```text
Canonical Rule
      ↓
Prompt Instruction
      ↓
AI Execution
```

not:

```text
Prompt
      ↓
Canonical Rule
```

An AI prompt may instruct a model to:

```text
analyse

classify

summarise

validate

recommend

ask questions

prepare context
```

but the prompt itself does not grant Human Approval Authority or managed-project
implementation authority.

---

## 13. Guides

`guides/` explains how humans and tools may apply MDS.

Guides may describe:

```text
recommended workflows

usage patterns

operating procedures

examples of applying canonical rules
```

Guidance is not automatically governance.

Where a workflow step is mandatory, the requirement must originate from the
applicable canonical standard, contract, or governed workflow definition.

---

## 14. Glossary

`glossary/` provides concise shared terminology.

Glossary entries should:

```text
define the term briefly

reference its canonical semantic owner

avoid duplicating full semantic models
```

If a glossary definition conflicts with a canonical model or standard, the
canonical source wins.

---

## 15. Examples

`examples/` contains non-authoritative reference material.

MDS must preserve:

```text
Example
≠
Project Truth

Pattern
≠
Recommendation

Pattern
≠
Architecture Decision

Example
≠
Mandatory Workflow
```

Examples may help explain or illustrate a concept.

They must not become canonical simply because they are stored inside
`mds-core/`.

---

## 16. Truth, Evidence, Decision, and Execution

MDS must keep four concepts separate:

```text
Truth
→ governed knowledge about what should be considered authoritative

Evidence
→ information supporting analysis, verification, or a decision

Decision
→ governed human determination where authority is required

Execution
→ action that changes implementation or runtime state
```

Conceptually:

```text
Evidence
    ↓
Analysis
    ↓
Human Decision where required
    ↓
Project Truth
    ↓
Bounded Context
    ↓
External Execution
    ↓
New Evidence
```

No step should silently collapse into another.

---

## 17. AI Boundary

AI may assist throughout MDS.

AI may:

```text
analyse

summarise

detect ambiguity

detect conflict

identify impact

propose relationships

prepare context

perform validation assistance

recommend next actions
```

AI assistance does not automatically create:

```text
Project Truth

Human Approval Authority

Professional Responsibility ownership

Implementation Authority

Runtime Operational Authority
```

The applicable canonical governance rules determine how AI output may be used.

---

## 18. Managed-Project Mutation Boundary

MDS Core defines the engineering-control and Project Truth layer.

It does not grant MDS System Capabilities permission to modify managed-project
implementation artifacts.

MDS must preserve:

```text
MDS
→ Project Truth / Governance / Context / Evidence

Implementation Plane
→ managed-project implementation execution
```

Implementation artifacts may include:

```text
source code

test code

migrations

implementation configuration

deployment scripts

infrastructure definitions
```

MDS may inspect such artifacts where permitted for evidence, traceability, or
verification.

Inspection does not imply mutation authority.

---

## 19. Unknown and Conflict Preservation

MDS must not fabricate certainty.

Where information cannot safely be determined, MDS should preserve explicit
uncertainty.

Conceptually:

```text
UNKNOWN

UNRESOLVED

CONFLICTED

INCOMPLETE

STALE

NEEDS_REVIEW
```

are legitimate governed states where applicable.

MDS should surface uncertainty rather than silently selecting an unsupported
answer.

---

## 20. Extension Principle

MDS Core should remain conceptually small and stable.

Before adding a new canonical concept, determine whether it is merely:

```text
a vendor

a technology

a tool

an implementation module

a UI screen

a prompt

a project-specific type

a configuration variant

an example
```

of an existing canonical concept.

Prefer:

```text
Stable Canonical Concept
+
Project / Integration / Runtime Configuration
```

over expanding the canonical taxonomy unnecessarily.

---

## 21. Core Invariants

MDS Core must preserve the following principles:

```text
Actor
≠
Professional Responsibility

Professional Responsibility
≠
Human Approval Authority

System Capability
≠
Professional Responsibility

System Capability
≠
Human Approval Authority

System Capability
≠
Implementation Executor

Implementation State
≠
Project Truth

Runtime State
≠
Project Truth

Evidence
≠
Approval

Validation
≠
Approval

AI Output
≠
Project Truth

Prompt
≠
Canonical Governance

Example
≠
Canonical Truth
```

These distinctions are foundational to MDS.

---

## 22. Source of Truth

This README owns only:

```text
MDS Core directory classification

top-level routing

canonical ownership principles

cross-boundary source-resolution rules
```

It does not own detailed semantics for the individual domains.

Detailed canonical semantics belong to their respective owners:

```text
actors/
authorities/
implementation-plane/
roles/
runtime/
schemas/
standards/
system-capabilities/
```

Supporting directories:

```text
templates/
prompts/
guides/
glossary/
examples/
```

must consume and remain consistent with those canonical sources.

When this README and a domain-specific canonical source appear to disagree on a
detail owned by that domain, the domain-specific canonical source is the
authority for that detail.