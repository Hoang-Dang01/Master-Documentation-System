---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
classification: approval_authority
update_strategy: change only through the applicable human approval gate
---

## 1. Purpose

This document defines the canonical model for **Human Approval Authority**
within MDS.

A Human Approval Authority represents a governance-recognised human decision
right that allows a decision to take authoritative effect at an applicable
governed gate.

The model exists to answer:

```text
Who is allowed to decide?

What kind of decision may they make?

Within which scope?

At which governed gate?

What authoritative effect does that decision have?
```

This document defines the general semantics and invariants of approval
authority.

It does not define:

* professional responsibilities;
* External Actors;
* AI roles or agents;
* implementation authority;
* artifact-specific lifecycle rules;
* concrete workflow execution;
* project-specific authority holders;
* persistence schemas.

Those concerns belong to their respective canonical MDS boundaries.

---

## 2. Definition

A **Human Approval Authority** is:

> A governed decision right assigned to a traceable human that allows the
> holder to make an authoritative decision within a defined scope and at an
> applicable governed gate.

Authority is not:

```text
a job title
a professional responsibility
an actor type
an ownership label
an AI capability
a workflow
an implementation permission
```

Authority is:

```text
A GOVERNED HUMAN DECISION RIGHT
```

---

## 3. Professional Responsibility and Approval Authority

MDS must preserve:

```text
Professional Responsibility
≠
Approval Authority
```

Professional Responsibility answers:

> Who is responsible for analysing, designing, verifying, operating, or
> producing a professional output?

Approval Authority answers:

> Who is allowed to make the applicable governed decision authoritative?

Conceptually:

```text
Professional Responsibility
        ↓
Analysis / Professional Work
        ↓
Proposal / Professional Output
        ↓
Governed Gate
        ↓
Human Approval Authority
        ↓
Authoritative Decision
```

One human may hold both a Professional Responsibility and an Approval
Authority.

Neither classification automatically grants the other.

---

## 4. External Actor and Approval Authority

MDS must also preserve:

```text
External Actor
≠
Approval Authority
```

An External Actor may provide:

* intent;
* domain knowledge;
* clarification;
* confirmation;
* feedback;
* change requests.

An External Actor may also hold an Approval Authority when governance
explicitly assigns that authority.

However:

```text
Being a Stakeholder
≠
Having Approval Authority
```

External Actor semantics belong to:

```text
../actors/
```

Approval Authority semantics belong to this directory.

---

## 5. Authority Type and Authority Assignment

MDS distinguishes two separate concepts:

```text
Authority Type
≠
Authority Assignment
```

### 5.1. Authority Type

An Authority Type defines a canonical category of governed decision right.

Examples include:

```text
Product Authority
Business Authority
Architecture Authority
Release Authority
```

Canonical Authority Types are registered in:

```text
./authority-registry.yaml
```

Authority Types belong to MDS Core.

---

### 5.2. Authority Assignment

An Authority Assignment connects an Authority Type to a specific human holder
within a project or governance context.

Conceptually:

```text
Authority Type
      ↓
Authority Assignment
      │
      ├── Human Holder
      ├── Scope
      ├── Project / Context
      ├── Validity
      └── Provenance
```

Authority Assignments are project or governance data.

They must not be stored as canonical holder assignments inside
`mds-core/authorities/`.

Principle:

```text
MDS Core
→ defines kinds of authority

Project Governance
→ determines who currently holds them
```

---

## 6. Human Authority Holder

A Human Approval Authority must be assigned to a traceable human identity.

Human Approval Authority must not be assigned to:

* an AI model;
* an AI agent;
* a prompt;
* a validator;
* a workflow engine;
* an MDS system capability;
* Codex;
* CI/CD;
* a runtime environment.

Automation may provide:

```text
analysis
recommendation
validation
evidence
```

but it may not become the Human Approval Authority.

Conceptually:

```text
AI / Automation
      ↓
Analysis / Evidence / Recommendation
      ↓
HUMAN GATE
      ↓
Human Authority Holder
      ↓
Governed Decision
```

---

## 7. Authority Scope

Every Authority Assignment must have a defined scope.

Scope answers:

> Within which decision domain is this authority valid?

Authority must never be interpreted as unlimited project-wide power by
default.

Scope may be constrained by:

* project;
* product area;
* business domain;
* system;
* subsystem;
* architecture domain;
* release class;
* environment;
* decision category;
* validity period.

Conceptually:

```text
Authority Holder A

Scope:
System A architecture decisions
```

does not imply authority over:

```text
Product decisions
Business decisions
System B architecture
Release decisions
```

A decision made outside the holder's assigned scope is not a valid governed
decision.

---

## 8. Governed Gate

Authority becomes effective only through an applicable **governed gate**.

A governed gate is a control point where a proposal, artifact, decision
candidate, or release state requires an authorised human decision before it may
continue to the next authoritative state.

Conceptually:

```text
Proposal
   ↓
Analysis / Review
   ↓
────────────────
 GOVERNED GATE
────────────────
   ↓
Applicable Authority
   ↓
Decision
```

A gate should identify at minimum:

* the decision concern;
* the object being reviewed;
* required inputs or evidence;
* applicable Authority Type;
* allowed decision types;
* decision effect;
* required provenance.

Detailed gate behaviour belongs to the applicable governance standard or
workflow contract.

---

## 9. Decision Rights

Approval Authority is not limited to a binary approve/reject operation.

Depending on the applicable gate, an Authority may issue decisions such as:

```text
APPROVE
REJECT
RETURN_FOR_CLARIFICATION
DEFER
SUPERSEDE
```

Not every gate must support every decision type.

The gate contract determines:

* which decisions are permitted;
* which evidence is required;
* what effect each decision creates.

Authority must not invent a decision type outside the applicable gate
contract.

---

## 10. Approval

`APPROVE` means:

> The Human Authority accepts that the reviewed object satisfies the applicable
> governance conditions and permits the corresponding authoritative transition.

Approval is always scoped.

Approval does not mean:

* the artifact will remain correct forever;
* implementation is complete;
* downstream specifications are correct;
* verification has passed;
* release is automatically authorised;
* runtime success is guaranteed.

Approval only establishes the authoritative effect defined by the applicable
gate.

---

## 11. Rejection

`REJECT` means:

> The reviewed object is not permitted to proceed through the applicable gate.

A rejection must preserve the rejected object and its provenance.

Where required by policy, MDS should retain:

```text
Decision
Authority Holder
Authority Assignment
Gate
Object / Version
Timestamp
Rationale
```

Rejection must not erase the proposal or its history.

---

## 12. Return for Clarification

`RETURN_FOR_CLARIFICATION` means:

> An authoritative decision cannot yet be made because the available input is
> incomplete, ambiguous, inconsistent, or insufficiently supported.

This is distinct from rejection.

Conceptually:

```text
Proposal
   ↓
Governed Gate
   ↓
RETURN_FOR_CLARIFICATION
   ↓
Further Analysis / Clarification
   ↓
Revised Proposal
   ↓
Governed Gate again
```

MDS should preserve lineage between review cycles.

---

## 13. Defer

`DEFER` means:

> The decision is intentionally postponed without approving or rejecting the
> current proposal.

A deferment may preserve:

* rationale;
* dependency;
* missing information;
* revisit condition;
* target milestone;
* external event.

Deferred objects must not be represented as Approved or Rejected.

---

## 14. Supersede

Where the applicable gate permits it, an Authority may approve a new decision
that replaces an earlier authoritative decision.

Conceptually:

```text
Previous Decision
      ↓
Historical Lineage
      ↓
New Governed Decision
```

Supersession must not overwrite historical truth.

The exact artifact lifecycle semantics belong to:

```text
../standards/artifact_truth.md
```

---

## 15. Authority and Project Truth

Authority participates in establishing or changing authoritative project
knowledge.

However:

```text
Authority
→ makes the governed human decision

Artifact Truth Standard
→ defines how that decision affects artifact truth and lifecycle

MDS
→ records, validates, and enforces the governed state
```

Authority does not independently define Project Truth semantics.

This directory must not create an artifact lifecycle that competes with the
Artifact Truth Standard.

---

## 16. Authority and Evidence

Every governed authority decision must be auditable.

MDS should be able to determine:

```text
Who made the decision?

Which Authority Type was used?

Which Authority Assignment was used?

What was the assigned scope?

Which gate was involved?

What object or version was reviewed?

What decision was issued?

When was it issued?

Which inputs or evidence were considered?

What rationale was recorded when required?
```

Authority decisions are governance evidence.

An authoritative state should not exist only as:

```text
status: APPROVED
```

without decision provenance when governance requires traceability.

Concrete persistence structures belong to:

```text
../schemas/
```

---

## 17. Authority Must Not Be Inferred from Job Titles

MDS must not use logic such as:

```text
Job Title
   ↓
Automatic Authority
```

For example:

```text
Product Manager
≠
Product Authority

Business Analyst
≠
Business Authority

Architect
≠
Architecture Authority

DevOps / SRE
≠
Release Authority
```

A human may hold both classifications.

The authority relationship must still be explicitly represented through
governance.

Principle:

> Responsibility assignment and Authority assignment are separate governance
> decisions.

---

## 18. One Human May Hold Multiple Authorities

A Human Holder may hold multiple Authority Types when governance allows it.

Conceptually:

```text
Human A
├── Product Authority
└── Business Authority
```

Each governed decision must still identify which Authority Assignment is being
used.

One Authority Type must not be treated as a substitute for another.

---

## 19. Multiple Humans May Hold the Same Authority Type

A canonical Authority Type may be assigned to multiple human holders.

Conceptually:

```text
Business Authority
├── Human A → Domain A
└── Human B → Domain B
```

This does not automatically define:

* whether one approval is sufficient;
* whether unanimous approval is required;
* whether majority approval is required;
* whether approvals must be sequential.

Quorum, joint approval, precedence, and multi-approval rules belong to the
applicable governance policy.

---

## 20. Delegation

Authority delegation must not be assumed by default.

If governance allows delegation, the delegation must be explicit and
traceable.

Conceptually:

```text
Original Authority Holder
        ↓
Delegation Record
        ↓
Delegate
```

A valid delegation should identify at minimum:

* Authority Type;
* delegated scope;
* delegator;
* delegate;
* project or context;
* validity period;
* status;
* provenance.

An informal statement such as:

```text
"Approve this for me."
```

must not automatically create valid delegated authority.

Delegation is effective only when the applicable governance policy permits it.

---

## 21. Authority Validity, Expiration, and Revocation

Authority Assignments may have lifecycle states such as:

```text
ACTIVE
EXPIRED
REVOKED
SUSPENDED
```

depending on the applicable governance model.

A decision is valid only if the required Authority Assignment was effective at
the time the decision was made.

Historical authority does not imply current authority.

Revocation or expiration must not erase historical decisions made while the
assignment was valid.

---

## 22. Self-Approval

MDS does not globally prohibit or globally permit self-approval.

Conceptually:

```text
Professional Output Author
=
Authority Holder
```

may be valid in a lightweight governance model and invalid in a stricter one.

Therefore:

> Self-approval must be governed by the applicable gate or policy rather than
> assumed globally.

If a gate prohibits self-approval, MDS should enforce the required separation
of duties.

---

## 23. Separation of Duties

A gate may require the person who produces an output to be different from the
person who approves it.

Conceptually:

```text
Author
  ↓
Proposal
  ↓
Independent Authority
```

Separation of duties may be required for:

* high-risk decisions;
* security-sensitive changes;
* regulated processes;
* significant architecture decisions;
* production releases.

The Authority Model supports this governance pattern but does not require it
for every gate.

---

## 24. Authority Conflicts

Multiple authority holders may issue incompatible decisions.

Conceptually:

```text
Authority A
→ APPROVE

Authority B
→ REJECT
```

MDS must not silently select one decision.

Authority conflict must be resolved through an applicable governance policy,
which may define:

* precedence;
* escalation;
* joint approval;
* higher-scope authority;
* re-review;
* quorum.

If no applicable rule resolves the conflict, MDS should preserve:

```text
AUTHORITY CONFLICT
status: unresolved
```

AI must not resolve authority conflicts by assumption or model preference.

---

## 25. Authority and AI

AI may assist Human Authorities by:

* summarising proposals;
* retrieving relevant evidence;
* checking completeness;
* checking policy requirements;
* detecting conflicts;
* comparing versions;
* showing downstream impact;
* identifying missing approvals;
* identifying scope violations;
* highlighting risks;
* proposing candidate decisions;
* generating clarification questions.

AI must not:

* assign Human Approval Authority to itself;
* impersonate a Human Authority;
* bypass a required human gate;
* autonomously approve a proposal;
* create authority delegation;
* modify Authority Assignments without governed human action;
* resolve authority conflicts autonomously;
* convert confidence scores into authority;
* hide conflicting or missing evidence.

Canonical principle:

```text
AI recommends
Human decides
MDS records and enforces
```

---

## 26. Authority and the Implementation Plane

Approval Authority does not automatically grant implementation responsibility
or implementation permission.

MDS must preserve:

```text
Approval Authority
≠
Implementation Responsibility
```

A human may approve a technical decision without becoming responsible for
implementing it.

Likewise, an approved decision does not give MDS itself permission to modify
managed-project source code.

Implementation belongs to:

```text
../implementation-plane/
```

---

## 27. Authority and Runtime

Runtime environments may provide evidence used by governed decision-making.

Examples include:

* telemetry;
* health status;
* incidents;
* performance observations;
* deployment results;
* operational failures.

Runtime is an evidence environment.

Runtime is not an authority.

Conceptually:

```text
Runtime Evidence
      ↓
Analysis
      ↓
Human Authority
      ↓
Governed Decision
```

Runtime semantics belong to:

```text
../runtime/
```

---

## 28. Authority Type is not Gate Type

MDS must preserve:

```text
Authority Type
≠
Governed Gate
```

Authority Type answers:

> What kind of governed decision right exists?

A Gate answers:

> At which control point is that decision right being exercised?

One Authority Type may participate in multiple gates when governance permits.

One gate may also require multiple Authority Types when policy requires it.

---

## 29. Authority Assignment is not Identity

MDS should not model identity using a permanent label such as:

```text
Human A = APPROVER
```

Instead:

```text
Human Identity
      ↓
Authority Assignment
      │
      ├── Authority Type
      ├── Scope
      ├── Project / Context
      ├── Validity
      └── Provenance
```

This allows authority to change without changing identity.

---

## 30. General Invariants

### AUTHORITY-INV-001

Approval Authority and Professional Responsibility are independent
classifications.

### AUTHORITY-INV-002

Approval Authority and External Actor classification are independent.

### AUTHORITY-INV-003

Human Approval Authority may only be assigned to a traceable human holder.

### AUTHORITY-INV-004

AI, agents, workflow engines, runtime environments, and MDS system capabilities
must not hold Human Approval Authority.

### AUTHORITY-INV-005

Every Authority Assignment must have a defined scope.

### AUTHORITY-INV-006

Every governed authority decision must occur through an applicable governed
gate.

### AUTHORITY-INV-007

A decision outside the holder's assigned authority scope is not a valid
governed decision.

### AUTHORITY-INV-008

Professional titles or responsibilities must not automatically grant Approval
Authority.

### AUTHORITY-INV-009

Authority Types belong to MDS Core; Authority Assignments belong to project or
governance data.

### AUTHORITY-INV-010

Every authority decision must preserve sufficient provenance for audit.

### AUTHORITY-INV-011

Approval does not automatically confirm implementation, verification, release,
or runtime outcome outside the applicable gate scope.

### AUTHORITY-INV-012

Delegation is valid only when governance permits it and the delegation is
explicitly recorded.

### AUTHORITY-INV-013

Expired, revoked, or suspended Authority Assignments must not be used to issue
new governed decisions.

### AUTHORITY-INV-014

Authority conflicts must not be resolved autonomously by AI.

### AUTHORITY-INV-015

Self-approval and separation of duties must be determined by the applicable
gate or governance policy rather than assumed globally.

### AUTHORITY-INV-016

Authority decisions must not erase or overwrite historical decision lineage.

### AUTHORITY-INV-017

Evidence may support a human decision but must not be treated as Human Approval
Authority.

### AUTHORITY-INV-018

An Authority Type must not be created solely because a corresponding
professional responsibility, department, team, or technology exists.

---

## 31. Relationship to Other MDS Core Boundaries

```text
authorities/
    │
    ├── professional responsibilities
    │   → ../roles/
    │
    ├── external actors
    │   → ../actors/
    │
    ├── artifact truth and lifecycle
    │   → ../standards/
    │
    ├── structured authority data
    │   → ../schemas/
    │
    ├── implementation responsibility
    │   → ../implementation-plane/
    │
    ├── runtime evidence
    │   → ../runtime/
    │
    ├── MDS system capabilities
    │   → ../system-capabilities/
    │
    ├── AI behaviour
    │   → ../prompts/
    │
    └── gate behaviour
        → applicable governance standard or workflow contract
```

This boundary owns:

* Human Approval Authority semantics;
* Authority Type semantics;
* Authority Assignment semantics;
* authority scope semantics;
* governed human decision-right semantics;
* delegation semantics;
* authority validity semantics;
* authority conflict semantics.

It must not duplicate canonical rules owned by other boundaries.

---

## 32. Canonical Authority Types

This document defines the general authority model.

It does not itself register concrete Authority Types.

The canonical Authority Type list is owned by:

```text
./authority-registry.yaml
```

The current canonical types are defined in:

```text
./product-authority.md
./business-authority.md
./architecture-authority.md
./release-authority.md
```

The appearance of an authority name in an:

* example;
* guide;
* prompt;
* proposal;
* source document;
* implementation artifact;

does not make that authority canonical.

Only the Authority Registry establishes canonical Authority Types.

---

## 33. Extension Principle

The Authority taxonomy should remain intentionally small.

A new Authority Type must not be introduced merely because a corresponding
professional role, department, technical layer, team, or organisational title
exists.

Before creating a new Authority Type, determine whether the need can be
represented through:

```text
Existing Authority Type
+
Scoped Authority Assignment
+
Applicable Gate Policy
```

A new canonical Authority Type should only be introduced when:

1. a genuinely distinct decision domain exists;
2. an explicit governed human decision gate exists;
3. the decision right cannot be represented cleanly by an existing Authority
   Type and scope;
4. the distinction has meaningful governance consequences;
5. the change passes the applicable governed approval process.

Principle:

> **Model real governed decision rights, not organisational charts.**
