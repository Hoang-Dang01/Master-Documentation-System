---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
canonical_target:
  - ./system-capability-model.md
  - ./system-capability-registry.yaml
update_strategy: change only through the applicable governed approval process
---

# MDS System Capabilities

This directory defines the canonical **MDS System Capability** boundary.

System Capabilities are internal MDS functions that organise, validate,
correlate, route, transform, and prepare project knowledge in support of
professional work and governed decision-making.

The current canonical capability classes are:

```text
Orchestrator

Knowledge Curator

Validator

Context Builder
```

System Capabilities are not Professional Responsibilities, External Actors,
Human Approval Authorities, implementation executors, or Runtime Environments.

---

## 1. Canonical Ownership

Canonical ownership within this directory is divided as follows:

```text
system-capability-model.md
→ general System Capability semantics, boundaries, and invariants

system-capability-registry.yaml
→ canonical System Capability class registry
```

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed System Capability semantics.

---

## 2. Core Boundary

MDS must preserve:

```text
Professional Responsibility
≠
System Capability

Human Approval Authority
≠
System Capability

Implementation Plane
≠
System Capability

Runtime Environment
≠
System Capability
```

Conceptually:

```text
Project Truth / Sources / Evidence
              ↓
────────────────────────
 MDS SYSTEM CAPABILITIES
────────────────────────
              ↓
Organisation
Validation
Correlation
Routing
Context Preparation
              ↓
Professional / Governance Use
```

System Capabilities support governed work.

They do not replace the humans or external boundaries responsible for that work.

---

## 3. Current Canonical Capability Classes

MDS currently recognises four canonical System Capability classes:

```text
Orchestrator

Knowledge Curator

Validator

Context Builder
```

These classes are registered in:

```text
./system-capability-registry.yaml
```

They represent stable internal MDS functions.

They do not represent:

- job titles;
- AI personas;
- autonomous agents;
- vendors;
- technologies;
- UI screens;
- implementation modules.

---

## 4. Orchestrator

The **Orchestrator** coordinates governed MDS activities.

It may:

- determine the applicable next activity;
- route work to the appropriate Professional Responsibility;
- identify applicable Human Approval gates;
- invoke or coordinate System Capabilities;
- detect blocked progress;
- identify unresolved dependencies;
- preserve workflow context;
- request required human action.

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

The Orchestrator coordinates work.

It does not make authoritative decisions.

---

## 5. Orchestration is not Authority

MDS must preserve:

```text
Orchestration
≠
Human Approval Authority
```

The Orchestrator may determine:

```text
Business Authority review is required.
```

It must not convert that routing result into:

```text
Business Approved.
```

Likewise, identifying an Architecture gate does not give the Orchestrator
Architecture Authority.

Routing and decision authority must remain separate.

---

## 6. Knowledge Curator

The **Knowledge Curator** organises and maintains the structural quality of
project knowledge.

It may:

- classify artifacts;
- normalise metadata;
- maintain indexes;
- maintain relationships;
- maintain graph structure;
- associate provenance;
- maintain lineage;
- detect duplicate identifiers;
- identify missing references;
- identify stale relationships;
- prepare knowledge for retrieval.

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

## 7. Knowledge Curation is not Semantic Authority

MDS must preserve:

```text
Knowledge Curation
≠
Authority to Change Meaning
```

The Knowledge Curator may restructure metadata or relationships where the
applicable canonical rules permit it.

It must not silently transform:

```text
Source Statement
```

into:

```text
Approved Requirement
```

or transform:

```text
Candidate Relationship
```

into:

```text
Authoritative Relationship
```

without the applicable governance basis.

Structural maintenance must not silently change governed meaning.

---

## 8. Validator

The **Validator** evaluates project knowledge, metadata, evidence,
relationships, and governed states against defined rules.

It may validate:

- schema conformance;
- required metadata;
- identifiers;
- references;
- graph relationships;
- lifecycle constraints;
- authority requirements;
- evidence completeness;
- context completeness;
- implementation baselines;
- canonical invariants.

Conceptually:

```text
Artifact / Evidence / Relationship
      ↓
Validator
      ↓
PASS / FAIL / WARNING / UNKNOWN
```

The exact validation result contract belongs to the applicable schema or
standard.

---

## 9. Validation is not Approval

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

Validation establishes whether applicable validation rules are satisfied.

It does not grant Human Approval Authority.

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 10. Validation Does not Silently Repair Truth

A Validator may identify invalid or inconsistent knowledge.

It must not silently rewrite authoritative Project Truth merely to make a
validation result pass.

Expected behaviour:

```text
Invalid Artifact
      ↓
Validator
      ↓
Validation Finding
```

Not:

```text
Invalid Artifact
      ↓
Silent Rewrite
      ↓
PASS
```

Any automatic repair must be explicitly permitted by an applicable governed
transformation rule and must not create new authoritative meaning.

---

## 11. Context Builder

The **Context Builder** creates bounded context for a defined consumer and
purpose.

Possible consumers may include:

- Professional Responsibilities;
- Human Approval Authorities;
- Implementation Plane participants;
- verification activities;
- other MDS System Capabilities.

A Context Builder may gather:

- current Project Truth;
- relevant source information;
- constraints;
- relationships;
- impact information;
- evidence;
- unresolved questions;
- applicable decisions;
- verification expectations.

Conceptually:

```text
Project Truth
+
Relevant Evidence
+
Relationships
+
Purpose
      ↓
Context Builder
      ↓
Bounded Context Package
```

---

## 12. Context Must Be Purpose-Bounded

A Context Builder should not provide:

```text
Everything MDS knows
```

when only a bounded subset is required.

A context package should make clear, where applicable:

```text
Who or what is the consumer?

What activity is being performed?

Which Project Truth versions apply?

Which constraints apply?

Which evidence is relevant?

What remains unresolved?
```

Purpose-bounded context reduces ambiguity and uncontrolled scope expansion.

---

## 13. Context Construction is not Truth Creation

MDS must preserve:

```text
Context Construction
≠
Project Truth Creation
```

The Context Builder may:

- select;
- organise;
- summarise;
- correlate;
- package.

It must not invent missing authoritative information merely to make a context
package appear complete.

If information is missing, the gap must remain visible.

Prefer:

```text
MISSING REQUIRED CONTEXT
```

over fabricated content.

---

## 14. Context Provenance and Freshness

Context packages should remain traceable to their source knowledge and
evidence.

MDS should be able to determine:

```text
Which artifact versions were included?

Which decisions were current?

Which evidence was included?

Which relationships were used?

When was the context generated?

For which consumer and purpose?
```

A context may become stale when relevant Project Truth changes.

MDS must not silently represent stale context as current.

Detailed context semantics belong to:

```text
./system-capability-model.md
```

---

## 15. AI-Assisted Capabilities

System Capabilities may use AI-assisted execution where appropriate.

For example:

```text
Knowledge Curator
→ semantic classification assistance

Validator
→ ambiguity or inconsistency detection

Context Builder
→ summarisation or context compression

Orchestrator
→ routing recommendation
```

The use of AI does not change the governance classification of the capability.

MDS must preserve:

```text
AI-Assisted Capability
≠
Autonomous Professional Role

AI-Assisted Capability
≠
Human Approval Authority
```

---

## 16. AI Output is not Project Truth

MDS must preserve:

```text
AI Output
≠
Project Truth
```

AI-generated output may represent:

- analysis;
- recommendation;
- summary;
- candidate classification;
- candidate relationship;
- warning;
- clarification question;
- proposed context.

Where AI output affects authoritative meaning, the applicable professional and
governance process determines whether that output becomes Project Truth.

---

## 17. Deterministic and AI-Assisted Execution

A System Capability may use:

```text
Deterministic Execution

AI-Assisted Execution

Hybrid Execution
```

Deterministic execution may be preferable for concerns such as:

- schema validation;
- identifier validation;
- reference validation;
- graph invariants;
- lifecycle constraints.

AI assistance may be useful for:

- semantic analysis;
- ambiguity detection;
- summarisation;
- candidate relationship discovery;
- context compression;
- explanation.

The execution mechanism does not grant governance authority.

---

## 18. Derived Knowledge

System Capabilities may create derived knowledge.

Examples may include:

```text
Calculated Impact

Candidate Relationship

Validation Finding

Staleness Indicator

Evidence Correlation

Detected Dependency
```

Derived knowledge must remain distinguishable from authoritative source
knowledge where that distinction affects governance.

MDS should preserve how a derived result was produced.

---

## 19. Capability Inputs

System Capabilities may consume:

- Project Truth;
- Source Information;
- Professional Outputs;
- Human Authority Decisions;
- Implementation Evidence;
- Runtime Evidence;
- Standards;
- Schemas;
- Metadata;
- Knowledge Graph relationships.

MDS must preserve:

```text
Can Consume
≠
Can Authoritatively Rewrite
```

Access to information does not automatically grant authority to change its
meaning.

---

## 20. Capability Outputs

System Capability outputs may include:

- routing results;
- validation findings;
- indexes;
- relationships;
- derived metadata;
- context packages;
- correlation results;
- warnings;
- impact results;
- staleness indicators;
- evidence summaries.

Where governance depends on the distinction, outputs should remain identifiable
as:

```text
authoritative

derived

advisory

evidence

validation result

contextual
```

A capability output must not silently inherit a stronger authority
classification than its source and governing process permit.

---

## 21. Capability Failure and Uncertainty

System Capabilities may fail or lack sufficient information.

Examples include:

- parsing failure;
- invalid schema;
- unavailable source;
- missing evidence;
- unresolved reference;
- conflicting inputs;
- insufficient context;
- AI analysis failure.

A capability must not silently fabricate success.

Where applicable, explicit outcomes may include:

```text
FAILED

INCOMPLETE

UNKNOWN

BLOCKED
```

Unknown or incomplete information must remain visible.

---

## 22. Capability Auditability

Capability execution should be auditable where its output materially affects:

- governance;
- traceability;
- verification;
- impact analysis;
- Project Truth interpretation.

Relevant audit information may include:

```text
Capability

Input References

Input Versions

Execution Time

Execution Mechanism

Rules / Schema Version

Model / Prompt Version where relevant

Output

Warnings

Errors

Provenance
```

Concrete persistence structures belong to:

```text
../schemas/
```

---

## 23. Capability Versioning

System Capability behaviour may evolve.

Where a capability output materially affects traceability or governance, MDS
should be able to identify the relevant:

```text
Capability Version

Rule Version

Schema Version

Model Version where relevant

Prompt Version where relevant
```

Historical capability output must not be silently reinterpreted as though it
was produced using current rules.

---

## 24. Capability Composition

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

Composition does not change the governance classification of the participating
capabilities.

Each capability must preserve its own semantic boundary.

---

## 25. Orchestrator and Capability Coordination

The Orchestrator may coordinate other System Capabilities.

Conceptually:

```text
Orchestrator
    │
    ├── Knowledge Curator
    ├── Validator
    └── Context Builder
```

This does not make the Orchestrator the semantic owner of every capability.

The Orchestrator coordinates execution.

Each capability retains its own canonical responsibility.

---

## 26. Human-in-the-Loop

A System Capability may determine that human input is required.

Examples include:

- unresolved ambiguity;
- conflicting information;
- missing metadata;
- missing governance rule;
- required approval;
- interpretation requiring professional judgment.

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

A capability must not invent human intent merely to avoid becoming blocked.

---

## 27. System-Maintained Data and Authoritative Truth

System Capabilities may maintain MDS-controlled:

- metadata;
- indexes;
- derived relationships;
- validation findings;
- context records;
- correlation records.

MDS must preserve:

```text
System-Maintained Derived Data
≠
Human-Governed Authoritative Truth
```

System maintenance does not imply unrestricted authority to change governed
meaning.

---

## 28. Managed-Project Mutation Boundary

MDS System Capabilities must not directly modify managed-project implementation
artifacts as part of their canonical responsibility.

This includes:

- source code;
- test code;
- implementation configuration;
- migrations;
- deployment scripts;
- infrastructure definitions.

Such execution belongs to:

```text
../implementation-plane/
```

MDS must preserve:

```text
System Capability
≠
Implementation Executor
```

---

## 29. Runtime Boundary

System Capabilities may consume Runtime Evidence.

For example:

```text
Runtime
→ produces evidence

System Capability
→ ingests, validates, correlates, or packages evidence
```

A System Capability is not a Runtime Environment.

Runtime semantics belong to:

```text
../runtime/
```

---

## 30. Professional Responsibility Boundary

System Capabilities support professional work.

They do not replace Professional Responsibilities.

For example:

```text
Validator
≠
Quality Assurance Responsibility

Context Builder
≠
Business Analysis Responsibility

Orchestrator
≠
Project Management Responsibility

Knowledge Curator
≠
Architecture Responsibility
```

A capability may support one or more responsibilities.

Professional Responsibility semantics belong to:

```text
../roles/
```

---

## 31. Human Approval Authority Boundary

No System Capability automatically holds Human Approval Authority.

MDS must preserve:

```text
Orchestrator
≠
Human Approval Authority

Knowledge Curator
≠
Human Approval Authority

Validator
≠
Human Approval Authority

Context Builder
≠
Human Approval Authority
```

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 32. Tool and Vendor Independence

The canonical System Capability model must remain independent of specific:

- AI vendors;
- models;
- graph engines;
- databases;
- workflow engines;
- external services;
- implementation technologies.

A System Capability defines **what MDS does**.

It does not define the technology used to implement that function.

Principle:

> **Model the governed system function, not the technology used to implement
> it.**

---

## 33. Routing Boundary

This directory owns MDS System Capability semantics only.

Related concerns must be routed as follows:

```text
Professional Responsibilities
→ ../roles/

External Actors
→ ../actors/

Human Approval Authorities
→ ../authorities/

Implementation Execution
→ ../implementation-plane/

Runtime Evidence
→ ../runtime/

Project Truth and Governance
→ ../standards/

Structured Contracts
→ ../schemas/

AI Instructions
→ ../prompts/

Usage Guidance
→ ../guides/

Examples
→ ../examples/
```

This routing prevents capability semantics from becoming duplicated across
unrelated MDS Core boundaries.

---

## 34. What This Boundary Owns

`system-capabilities/` owns:

- MDS System Capability semantics;
- capability-class semantics;
- capability composition semantics;
- capability input/output boundaries;
- deterministic-versus-AI-assisted capability semantics;
- capability governance boundaries.

It does not own:

- Professional Responsibility definitions;
- External Actor semantics;
- Human Approval Authority;
- implementation execution;
- Runtime semantics;
- Project Truth lifecycle;
- concrete schemas;
- vendor-specific technology definitions.

---

## 35. Extension Policy

The System Capability taxonomy must remain intentionally small.

Before introducing a new capability class, determine whether the proposed
function can be represented through:

```text
Existing Capability
+
Configuration
+
Applicable Rules
```

A new canonical capability should only be introduced when:

1. it represents a genuinely distinct internal MDS function;
2. its governance boundary differs meaningfully from existing capabilities;
3. representing it as configuration of an existing capability would obscure
   important semantics;
4. the distinction has meaningful architectural or governance consequences;
5. the change passes the applicable governed approval process.

Do not create a new canonical System Capability merely because:

```text
a new AI model exists

a new vendor is integrated

a new prompt is added

a new UI screen exists

a new internal module is created
```

Principle:

> **Model stable MDS responsibilities, not implementation details.**

---

## 36. Source of Truth

Canonical ownership within this boundary is:

```text
General System Capability semantics and invariants
→ ./system-capability-model.md

Canonical System Capability class registry
→ ./system-capability-registry.yaml
```

Specific technologies, vendors, models, prompts, integrations, and internal
implementation modules do not become canonical capability classes merely
because MDS uses them.

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed System Capability semantics.