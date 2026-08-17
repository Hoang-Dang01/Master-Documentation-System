---

ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: system_capability
update_strategy: change only through the applicable governed approval process
---

# MDS System Capability Model

## 1. Purpose

This document defines the canonical model for **MDS System Capabilities**.

A System Capability represents a governed function that MDS itself may perform
to organise, validate, correlate, route, transform, or prepare project
knowledge.

System Capabilities support professional work and governed workflows.

They do not replace:

* Professional Responsibilities;
* External Actors;
* Human Approval Authorities;
* the external Implementation Plane;
* Runtime Environments.

The current canonical capability classes are:

```text
Orchestrator

Knowledge Curator

Validator

Context Builder
```

Conceptually:

```text
Project Inputs / Project Truth / Evidence
                ↓
──────────────────────────
  MDS SYSTEM CAPABILITIES
──────────────────────────
                ↓
Organisation
Validation
Routing
Correlation
Context Preparation
                ↓
Professional / Governance Use
```

System Capabilities may assist decision-making.

They do not become decision authorities.

---

## 2. Definition

An **MDS System Capability** is:

> A governed internal capability of MDS that performs a defined system function
> over project knowledge, metadata, evidence, relationships, or workflow
> context without independently creating human authority or implementation
> authority.

A System Capability may be implemented using:

* deterministic logic;
* rules;
* indexes;
* parsers;
* graph processing;
* structured transformations;
* AI-assisted analysis;
* combinations of these mechanisms.

The implementation mechanism does not change the capability's governance
boundary.

---

## 3. System Capability is not Professional Responsibility

MDS must preserve:

```text
System Capability
≠
Professional Responsibility
```

A Professional Responsibility answers:

> Who is professionally responsible for analysing, designing, validating,
> managing, or operating a concern?

A System Capability answers:

> What governed function may MDS perform to support that work?

Conceptually:

```text
Professional Responsibility
        ↓
uses
        ↓
MDS System Capability
```

A capability may support several professional responsibilities.

It must not become a synthetic professional role merely because AI is used
inside it.

Professional Responsibility semantics belong to:

```text
../roles/
```

---

## 4. System Capability is not Human Approval Authority

MDS must preserve:

```text
System Capability
≠
Human Approval Authority
```

A System Capability may:

* validate;
* warn;
* classify;
* correlate;
* recommend;
* prepare evidence;
* prepare context.

It must not:

* approve Product Truth;
* approve Business Truth;
* approve Architecture Truth;
* approve Release;
* assign Human Approval Authority;
* bypass a governed human gate.

Conceptually:

```text
System Capability
      ↓
Analysis / Validation / Context
      ↓
Human Gate
      ↓
Human Approval Authority
      ↓
Governed Decision
```

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 5. System Capability is not an Autonomous Agent Role

The existence of AI inside a capability does not create an autonomous MDS
agent with independent professional or governance authority.

MDS must preserve:

```text
AI-Assisted Capability
≠
Autonomous Professional Role

AI-Assisted Capability
≠
Human Approval Authority
```

For example:

```text
Validator using AI
```

remains a Validator capability.

It does not become:

```text
AI QA Authority
```

Likewise:

```text
Context Builder using AI
```

remains a Context Builder capability.

It does not become an independent project decision maker.

---

## 6. System Capability is not the Implementation Plane

MDS System Capabilities operate inside the MDS knowledge and governance
boundary.

The Implementation Plane operates outside that boundary and performs managed
project implementation changes.

MDS must preserve:

```text
System Capability
≠
Implementation Executor
```

A System Capability must not gain permission to modify managed-project source
code merely because it can analyse implementation evidence.

Conceptually:

```text
MDS System Capability
      ↓
Context / Evidence / Validation
      ↓
Implementation Plane
      ↓
Implementation Activity
```

Implementation Plane semantics belong to:

```text
../implementation-plane/
```

---

## 7. System Capability is not Runtime

MDS System Capabilities may consume Runtime Evidence.

They are not Runtime Environments.

MDS must preserve:

```text
System Capability
≠
Runtime Environment
```

For example:

```text
Runtime
→ produces telemetry

MDS Capability
→ ingests and correlates telemetry
```

Runtime semantics belong to:

```text
../runtime/
```

---

## 8. Canonical Capability Classes

The canonical MDS System Capability classes are:

```text
Orchestrator

Knowledge Curator

Validator

Context Builder
```

These classes define internal system responsibilities.

They do not define:

* job titles;
* AI personas;
* autonomous agents;
* vendor products;
* implementation-plane tools.

Canonical registration belongs to:

```text
./system-capability-registry.yaml
```

---

## 9. Orchestrator

The **Orchestrator** coordinates governed MDS activities.

It may:

* determine the next applicable governed activity;
* route work to the appropriate professional responsibility;
* identify applicable gates;
* identify required inputs;
* coordinate system capabilities;
* detect blocked progress;
* surface unresolved dependencies;
* preserve workflow context;
* request required human action.

Conceptually:

```text
Current Governed State
      ↓
Orchestrator
      ↓
Applicable Next Activity
      ↓
Role / Authority / Capability / External Boundary
```

The Orchestrator coordinates.

It does not decide authoritative truth.

---

## 10. Orchestrator Does Not Own Decisions

MDS must preserve:

```text
Orchestration
≠
Authority
```

The Orchestrator may determine:

```text
"This item requires Business Authority review."
```

It must not convert that into:

```text
"Business Approved."
```

The Orchestrator may identify:

```text
"Architecture review is required."
```

It must not issue the Architecture Decision itself.

Routing is not decision authority.

---

## 11. Orchestrator Does Not Invent Workflow Authority

The Orchestrator must operate from existing governed rules.

It must not silently invent:

* new approval gates;
* new Authority Types;
* new professional responsibilities;
* new truth transitions;
* new implementation permissions.

If required routing cannot be determined, MDS should preserve the uncertainty
or surface a governance gap.

Prefer:

```text
ROUTING UNRESOLVED
```

over silently inventing a path.

---

## 12. Knowledge Curator

The **Knowledge Curator** organises, normalises, relates, and maintains the
structural quality of project knowledge.

It may:

* classify artifacts;
* normalise metadata;
* maintain indexes;
* maintain graph relationships;
* detect duplicates;
* identify missing references;
* associate provenance;
* maintain lineage links;
* organise source material;
* identify stale or superseded relationships;
* prepare knowledge for retrieval.

Conceptually:

```text
Project Knowledge
      ↓
Knowledge Curator
      ↓
Structured / Related / Indexed Knowledge
```

Knowledge curation improves structure.

It does not create authority.

---

## 13. Knowledge Curator Does Not Rewrite Meaning

MDS must preserve:

```text
Knowledge Curation
≠
Semantic Authority
```

The Knowledge Curator may normalise:

```text
metadata
references
identifiers
relationships
indexing
```

It must not silently change the governed meaning of an artifact.

For example:

```text
Source Statement
      ↓
Knowledge Curator
      ↓
Structured Source Statement
```

must not silently become:

```text
Approved Requirement
```

Structural transformation must not imply semantic approval.

---

## 14. Knowledge Curator and Provenance

Knowledge curation must preserve provenance.

Where applicable, MDS should remain able to identify:

```text
Where did this information come from?

Which source version produced it?

Which transformation occurred?

Which relationship was added?

Was the relationship explicit or derived?

When was the curated state produced?
```

Normalisation must not destroy evidence about the original source.

---

## 15. Validator

The **Validator** evaluates project knowledge, metadata, evidence, or
relationships against defined rules, schemas, invariants, or governed
expectations.

It may validate:

* schema conformance;
* required metadata;
* broken references;
* duplicate identifiers;
* invalid relationships;
* lifecycle constraints;
* authority requirements;
* evidence completeness;
* graph invariants;
* context completeness;
* baseline consistency.

Conceptually:

```text
Artifact / Evidence / Relationship
      ↓
Validator
      ↓
PASS / FAIL / WARNING / UNKNOWN
```

The exact result contract belongs to the applicable schema or standard.

---

## 16. Validation is not Approval

MDS must preserve:

```text
Validation PASS
≠
Human Approval
```

For example:

```text
Schema Valid
≠
Business Approved

No Broken References
≠
Architecture Approved

Evidence Complete
≠
Release Approved
```

Validation may establish that a governed rule is satisfied.

It does not create Human Approval Authority.

---

## 17. Validator Does Not Automatically Repair Truth

A Validator may identify an error.

It must not silently modify authoritative knowledge merely to make validation
pass.

Conceptually:

```text
Invalid Artifact
      ↓
Validator
      ↓
Validation Finding
```

not:

```text
Invalid Artifact
      ↓
Validator
      ↓
Silent Rewrite
      ↓
PASS
```

Automatic repair may only occur where a separate governed transformation rule
explicitly permits it and where the repair does not create new authoritative
meaning.

---

## 18. Validation Outcomes and Uncertainty

Validation must support uncertainty when the available information is
insufficient.

Possible conceptual outcomes may include:

```text
PASS

FAIL

WARNING

UNKNOWN
```

MDS should not force:

```text
UNKNOWN
```

into:

```text
PASS
```

or:

```text
FAIL
```

without sufficient basis.

Unknown is a valid validation state where applicable.

---

## 19. Context Builder

The **Context Builder** creates bounded context packages for a defined
consumer or activity.

Possible consumers may include:

* a Professional Responsibility;
* Human Approval Authority;
* an Implementation Plane participant;
* a verification process;
* another MDS System Capability.

The Context Builder may gather:

* current authoritative artifacts;
* relevant source information;
* constraints;
* relationships;
* impact information;
* evidence;
* unresolved questions;
* applicable decisions;
* verification expectations.

Conceptually:

```text
Project Truth
+
Relevant Evidence
+
Relationships
+
Requested Purpose
      ↓
Context Builder
      ↓
Bounded Context Package
```

---

## 20. Context Must Be Purpose-Bounded

A Context Builder must build context for a defined purpose.

It should not simply provide:

```text
Everything MDS knows
```

when only a bounded subset is required.

A bounded context should make clear:

```text
Who or what is the consumer?

What activity is being performed?

Which truth versions apply?

Which constraints apply?

Which evidence is relevant?

What remains unresolved?
```

Purpose-bounded context reduces ambiguity and accidental scope expansion.

---

## 21. Context Builder Does Not Create New Truth

MDS must preserve:

```text
Context Construction
≠
Truth Creation
```

The Context Builder may:

* select;
* organise;
* summarise;
* correlate;
* package.

It must not silently create a new authoritative requirement, decision, or
constraint merely to complete a context package.

If required information is missing, the context should expose the gap.

Prefer:

```text
MISSING REQUIRED CONTEXT
```

over invented content.

---

## 22. Context Provenance

A context package should remain traceable to its sources.

Where applicable, MDS should be able to determine:

```text
Which artifact versions were included?

Which evidence was included?

Which relationships were used?

Which Project Truth state was current?

When was the context built?

For which consumer and purpose?
```

This allows later verification that implementation or decision-making used the
correct context.

---

## 23. Context Freshness

A context package may become stale when relevant Project Truth changes.

Conceptually:

```text
Context Package
      ↓
Relevant Truth Changes
      ↓
Context may become stale
```

MDS should be able to identify stale or potentially stale context where
possible.

A stale context must not be silently represented as current.

---

## 24. Canonical Source Precedence

System Capabilities must respect canonical source ownership.

A capability must not use lower-authority material to silently override a
higher-authority canonical source.

Conceptually:

```text
Canonical Standard / Schema / Model
        ↓
takes precedence over
        ↓
Template / Prompt / Guide / Example
```

The exact precedence policy belongs to the applicable canonical governance
rules.

System Capabilities consume the precedence model.

They do not invent a competing one.

---

## 25. Deterministic and AI-Assisted Execution

A System Capability may use deterministic or AI-assisted execution.

MDS should distinguish these mechanisms where the distinction affects trust,
repeatability, or auditability.

Conceptually:

```text
System Capability
├── Deterministic Execution
├── AI-Assisted Execution
└── Hybrid Execution
```

Deterministic execution may be preferred for:

* schema validation;
* identifier checks;
* reference validation;
* lifecycle constraints;
* graph invariants.

AI-assisted execution may be useful for:

* summarisation;
* semantic classification;
* ambiguity detection;
* candidate relationship discovery;
* context compression;
* explanation.

The mechanism must not change governance authority.

---

## 26. AI Output is not Automatically Truth

MDS must preserve:

```text
AI Output
≠
Project Truth
```

AI-generated results may be:

* analysis;
* recommendation;
* candidate classification;
* candidate relationship;
* summary;
* warning;
* proposed context.

Where a result affects authoritative meaning, the applicable professional and
governance process must determine whether it becomes Project Truth.

---

## 27. Derived Knowledge

Some System Capabilities may produce derived knowledge.

Examples may include:

```text
Detected Dependency

Calculated Impact

Candidate Relationship

Validation Finding

Evidence Correlation

Staleness Indicator
```

Derived knowledge must remain distinguishable from authoritative source
knowledge where that distinction matters.

MDS should preserve how the derived result was produced.

---

## 28. System Capability Inputs

System Capabilities may consume inputs from:

```text
Project Truth

Source Information

Professional Outputs

Authority Decisions

Implementation Evidence

Runtime Evidence

Schemas

Standards

Metadata

Knowledge Graph Relationships
```

Input availability does not grant permission to modify the source.

MDS must preserve:

```text
Can Consume
≠
Can Authoritatively Rewrite
```

---

## 29. System Capability Outputs

Capability outputs may include:

* routing decisions;
* validation findings;
* indexes;
* relationships;
* derived metadata;
* context packages;
* correlation results;
* warnings;
* impact results;
* staleness indicators;
* evidence summaries.

The output classification should reflect whether the result is:

```text
authoritative

derived

advisory

evidence

validation result

contextual
```

where the distinction affects governance.

---

## 30. Capability Failure

A System Capability may fail.

Examples include:

* parsing failure;
* missing source;
* invalid schema;
* unresolved reference;
* AI analysis failure;
* insufficient context;
* unavailable evidence;
* conflicting inputs.

Capability failure must not silently produce fabricated success.

Prefer explicit states such as:

```text
FAILED

INCOMPLETE

UNKNOWN

BLOCKED
```

where appropriate.

---

## 31. Capability Degradation

A capability may produce a partial result.

For example:

```text
Context Builder
→ 8 required sources found
→ 2 unavailable
```

MDS should not represent the output as complete unless the applicable contract
permits it.

Partial results should preserve the missing or uncertain portions.

---

## 32. Capability Auditability

System Capability activity should be auditable where the result affects
governance, traceability, verification, or Project Truth interpretation.

Relevant audit information may include:

```text
Capability

Input references

Input versions

Execution time

Execution mechanism

Rules / model version where relevant

Output

Warnings

Errors

Provenance
```

The concrete persistence contract belongs to the applicable schema.

---

## 33. Capability Idempotence

Where a capability is expected to be deterministic, repeated execution against
the same effective inputs should produce equivalent results.

Conceptually:

```text
Same Inputs
+
Same Rules
      ↓
Equivalent Result
```

This expectation is especially relevant for:

* schema validation;
* graph validation;
* identifier checks;
* deterministic indexing.

AI-assisted capabilities may not guarantee byte-for-byte identical output.

Where repeatability matters, the applicable capability contract should define
the expected behaviour.

---

## 34. Capability Versioning

Capability behaviour may change over time.

Where a capability output materially affects traceability or governance, MDS
should be able to identify the applicable:

```text
Capability Version

Rule Version

Schema Version

Model / Prompt Version where relevant
```

Historical outputs must not be silently reinterpreted as though they were
produced by the current capability version.

---

## 35. Orchestrator and the Other Capabilities

The Orchestrator may coordinate other MDS System Capabilities.

Conceptually:

```text
Orchestrator
    │
    ├── Knowledge Curator
    ├── Validator
    └── Context Builder
```

This coordination relationship does not make the Orchestrator an authority
over Project Truth.

The Orchestrator coordinates capability execution.

It does not own all capability semantics.

---

## 36. Capability Composition

System Capabilities may be composed.

For example:

```text
Knowledge Curator
      ↓
Validator
      ↓
Context Builder
```

or:

```text
Runtime Evidence
      ↓
Knowledge Curator
      ↓
Validator
      ↓
Context Builder
      ↓
Professional Review
```

Composition does not change the governance classification of the resulting
outputs.

Each capability must preserve its own boundary.

---

## 37. Human-in-the-Loop

System Capabilities may require human input.

Examples include:

* ambiguity resolution;
* missing metadata;
* unresolved conflict;
* approval;
* interpretation requiring professional judgment.

Conceptually:

```text
System Capability
      ↓
Cannot Resolve Safely
      ↓
Human Input Required
      ↓
Resume Governed Processing
```

A capability must not invent human intent merely to avoid being blocked.

---

## 38. System Capability and Project Truth Mutation

Some MDS capabilities may write MDS-managed metadata, indexes, derived
relationships, validation findings, or context records.

This does not imply unrestricted permission to mutate authoritative Project
Truth.

MDS must distinguish:

```text
System-Maintained Derived Data
≠
Human-Governed Authoritative Truth
```

Changes to authoritative meaning must follow the applicable governance model.

---

## 39. System Capability and Managed-Project Mutation

MDS System Capabilities must not directly modify managed-project implementation
artifacts as part of their canonical responsibility.

This includes:

* source code;
* test code;
* managed-project implementation configuration;
* migrations;
* deployment scripts.

Such mutation belongs to:

```text
../implementation-plane/
```

---

## 40. Tool and Vendor Independence

The canonical System Capability taxonomy must remain independent of specific:

* AI vendors;
* models;
* databases;
* graph engines;
* workflow engines;
* external tools.

A capability class describes what MDS does.

It does not identify which vendor performs the internal implementation.

Principle:

> **Model the governed system function, not the technology used to implement it.**

---

## 41. General Invariants

### SYSTEM-CAP-INV-001

System Capabilities are internal MDS functions, not Professional
Responsibilities.

### SYSTEM-CAP-INV-002

System Capabilities do not hold Human Approval Authority.

### SYSTEM-CAP-INV-003

Use of AI inside a capability does not create an autonomous professional or
governance role.

### SYSTEM-CAP-INV-004

System Capabilities must not directly modify managed-project source or test
code as part of their canonical responsibility.

### SYSTEM-CAP-INV-005

System Capability output does not automatically become Project Truth.

### SYSTEM-CAP-INV-006

The Orchestrator may route governed work but must not create authoritative
decisions.

### SYSTEM-CAP-INV-007

The Knowledge Curator may structure and relate knowledge but must not silently
rewrite authoritative meaning.

### SYSTEM-CAP-INV-008

Validation PASS does not constitute Human Approval.

### SYSTEM-CAP-INV-009

The Validator must not silently repair authoritative truth merely to satisfy a
validation rule.

### SYSTEM-CAP-INV-010

The Context Builder must not invent missing authoritative information.

### SYSTEM-CAP-INV-011

Context packages should remain traceable to their source Project Truth and
evidence.

### SYSTEM-CAP-INV-012

Stale context must not be silently represented as current.

### SYSTEM-CAP-INV-013

Derived knowledge must remain distinguishable from authoritative source
knowledge where the distinction affects governance.

### SYSTEM-CAP-INV-014

Capability failure or uncertainty must not be silently converted into success.

### SYSTEM-CAP-INV-015

System Capabilities must preserve provenance where required for audit,
traceability, or verification.

### SYSTEM-CAP-INV-016

Capability participation in a workflow does not grant implementation or
approval authority.

### SYSTEM-CAP-INV-017

Vendor-specific technology must not define the canonical System Capability
taxonomy.

### SYSTEM-CAP-INV-018

A capability must not create a new canonical governance rule merely because an
existing rule is missing or ambiguous.

---

## 42. Relationship to Other MDS Core Boundaries

```text
system-capabilities/
    │
    ├── Professional Responsibilities
    │   → ../roles/
    │
    ├── External Actors
    │   → ../actors/
    │
    ├── Human Approval Authorities
    │   → ../authorities/
    │
    ├── Implementation Execution
    │   → ../implementation-plane/
    │
    ├── Runtime Evidence
    │   → ../runtime/
    │
    ├── Project Truth and Governance
    │   → ../standards/
    │
    ├── Structured Contracts
    │   → ../schemas/
    │
    └── AI Instructions
        → ../prompts/
```

This boundary owns:

* MDS System Capability semantics;
* capability-class semantics;
* capability composition semantics;
* capability input/output boundaries;
* capability governance boundaries;
* deterministic-versus-AI-assisted execution semantics.

It must not duplicate canonical rules owned by other MDS Core boundaries.

---

## 43. Canonical Capability Registry

This document defines general System Capability semantics.

It does not itself register concrete canonical capability classes.

The canonical capability list is owned by:

```text
./system-capability-registry.yaml
```

The current canonical capability classes are:

```text
Orchestrator

Knowledge Curator

Validator

Context Builder
```

A capability name appearing in a:

* prompt;
* guide;
* example;
* source artifact;
* implementation module;

does not automatically make that capability canonical.

Only the canonical registry establishes MDS System Capability classes.

---

## 44. Extension Principle

The System Capability taxonomy should remain intentionally small.

Before introducing a new capability class, determine whether the proposed
function can be represented through:

```text
Existing Capability
+
Configuration
+
Applicable Rules
```

A new canonical System Capability should only be introduced when:

1. it represents a genuinely distinct internal MDS function;
2. its governance boundary differs meaningfully from existing capabilities;
3. representing it as configuration of an existing capability would obscure
   important semantics;
4. the distinction has meaningful architectural or governance consequences;
5. the change passes the applicable governed approval process.

Do not create a new System Capability merely because:

```text
a new AI model exists

a new vendor is integrated

a new prompt is added

a new UI screen exists

a new internal module is created
```

Principle:

> **Model stable MDS responsibilities, not implementation details.**
