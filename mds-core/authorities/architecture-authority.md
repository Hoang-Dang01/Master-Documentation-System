---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
authority_type: architecture-authority
classification: approval_authority
model_ref: ./authority-model.md
registry_ref: ./authority-registry.yaml
update_strategy: change only through the applicable human approval gate
---

# Architecture Authority

## 1. Purpose

`Architecture Authority` is the Human Approval Authority responsible for
governed decisions about system architecture and technical direction.

This authority exists to answer questions such as:

```text
Which technical direction is authoritative?

Which architecture option should the project follow?

Where are the system boundaries?

Which technical trade-off is accepted?

Does a proposed architecture satisfy the approved constraints?

When should an existing architecture decision be replaced?
```

`Architecture Authority` inherits all general authority semantics and
invariants from `authority-model.md`.

This file defines only the decision domain specific to Architecture Authority.

---

# 2. Decision Domain

Architecture Authority owns governed decisions concerning architecture-level
technical direction.

Typical decision domains include:

* system architecture;
* architectural style;
* system boundaries;
* service or module boundaries;
* major component responsibilities;
* dependency direction;
* integration strategy;
* major technology choices;
* data ownership boundaries;
* cross-cutting technical constraints;
* availability strategy;
* scalability direction;
* reliability direction;
* security architecture direction;
* deployment topology at the architectural level;
* technical trade-offs;
* architecture exceptions;
* architecture decision supersession.

Architecture Authority does not automatically own:

* product scope;
* business meaning;
* detailed implementation;
* source-code changes;
* test execution;
* release approval.

---

# 3. Architecture Authority is not Architecture / Tech Lead Responsibility

MDS must distinguish:

```text
Architecture / Tech Lead Responsibility
≠
Architecture Authority
```

The professional responsibility is responsible for activities such as:

* analysing technical requirements;
* identifying architectural constraints;
* evaluating architecture options;
* analysing trade-offs;
* defining system boundaries;
* producing architecture proposals;
* identifying technical risks;
* reviewing downstream design consistency.

Architecture Authority is responsible for:

> Making the governed human decision that establishes which architecture
> direction becomes authoritative.

Conceptual flow:

```text
Approved Product / Business / System Inputs
                ↓
Architecture Analysis
                ↓
Architecture Proposal
                ↓
Architecture Approval Gate
                ↓
Architecture Authority
                ↓
Authoritative Architecture Decision
```

One human may hold both classifications.

The classifications must still remain independent.

---

# 4. Architecture Inputs

Architecture Authority should normally receive structured technical analysis
rather than an unexplained technology preference.

Typical inputs may include:

* approved business requirements;
* system requirements;
* quality attributes;
* technical constraints;
* architecture options;
* trade-off analysis;
* dependency analysis;
* security concerns;
* operational constraints;
* runtime requirements;
* migration constraints;
* compatibility requirements;
* existing architecture decisions;
* implementation evidence;
* technical risk;
* cost or complexity information.

The authority may request clarification or additional analysis when the
decision basis is insufficient.

---

# 5. Architecture Approval Gate

An Architecture Approval Gate is the governed point at which a proposed
technical direction may become authoritative.

Conceptually:

```text
Requirements / Constraints
          ↓
Architecture Analysis
          ↓
Candidate Architecture
          ↓
Trade-off Review
          ↓
────────────────────────────
 ARCHITECTURE APPROVAL GATE
────────────────────────────
          ↓
Architecture Authority
          ↓
Decision
```

The exact gate contract belongs to the applicable governance workflow or
standard.

---

# 6. Architecture Approval

`APPROVE` means:

> The Architecture Authority accepts the proposed architecture decision as the
> authoritative technical direction within the scope of the gate.

Approval may establish decisions such as:

* approved system boundary;
* approved component responsibility;
* approved integration direction;
* approved technology choice;
* approved dependency rule;
* approved architectural constraint;
* accepted technical trade-off.

Architecture approval does not mean:

* implementation is complete;
* implementation matches the architecture;
* tests have passed;
* runtime behaviour has been verified;
* release is approved.

---

# 7. Architecture Decision Record

Significant architecture decisions should be represented as governed,
traceable decisions.

Conceptually:

```text
Context
   ↓
Problem / Constraint
   ↓
Options
   ↓
Trade-offs
   ↓
Decision
   ↓
Consequences
```

An architecture decision should ideally preserve:

* decision context;
* applicable requirements;
* considered options;
* chosen option;
* rationale;
* known trade-offs;
* constraints;
* consequences;
* authority decision;
* provenance;
* version or lineage.

Architecture Authority approves the decision.

It does not erase the alternatives that were considered when those alternatives
are relevant evidence.

---

# 8. Technical Preference is not Architecture Truth

A technical preference such as:

```text
"I prefer Technology X."
```

does not automatically become an architecture decision.

The expected flow is:

```text
Technical Suggestion
        ↓
Architecture Analysis
        ↓
Option / Trade-off Evaluation
        ↓
Architecture Gate
        ↓
Architecture Authority
        ↓
Architecture Decision
```

Preference, familiarity, popularity, or AI recommendation alone must not be
treated as sufficient authority.

---

# 9. Architecture Authority and Business Authority

Business Authority determines authoritative business meaning.

Architecture Authority determines authoritative technical direction.

```text
Business Authority
→ what the business requires

Architecture Authority
→ how the system should be structured to satisfy those requirements
```

Architecture Authority must not silently alter an approved business rule to
make implementation easier.

If an approved business requirement creates unacceptable technical cost,
risk, or infeasibility, the issue must be returned through governed analysis.

Conceptually:

```text
Approved Business Requirement
          ↓
Architecture Analysis
          ↓
Technical Conflict Found
          ↓
Impact / Constraint Evidence
          ↓
Business Re-evaluation
```

---

# 10. Architecture Authority and Product Authority

Product Authority owns product-level direction and scope.

Architecture Authority owns architecture-level technical direction.

```text
Product Authority
→ What should the product pursue?

Architecture Authority
→ What technical structure should support it?
```

Architecture Authority may provide technical evidence that causes product
scope to be reconsidered.

It must not silently redefine product priority or product boundary.

---

# 11. Architecture Authority and System Analysis

System Analysis defines and clarifies expected system behaviour.

Architecture defines the structure and technical direction used to realise
that behaviour.

Conceptually:

```text
Business Truth
      ↓
System Analysis
      ↓
Expected System Behaviour
      ↓
Architecture Analysis
      ↓
Technical Structure
```

Architecture Authority should not replace missing system behaviour with
technical assumptions.

If required behaviour is unclear, clarification must occur upstream.

---

# 12. Architecture Authority and Detailed Design

Not every technical decision is an architecture decision.

Architecture Authority should focus on decisions with meaningful structural,
cross-cutting, long-lived, risky, or expensive-to-reverse consequences.

Examples of likely architecture-level concerns:

```text
System Boundary
Major Integration Direction
Data Ownership
Major Dependency Direction
Deployment Topology
Cross-cutting Security Model
Major Technology Platform
```

Examples that may remain implementation-level decisions:

```text
local function structure
variable naming
minor helper abstraction
small refactoring choice
routine library usage
```

The exact boundary depends on project governance.

Principle:

> Do not turn every technical decision into an Architecture Approval Gate.

---

# 13. Reversibility and Decision Weight

Architecture decisions vary in cost of reversal.

A useful conceptual distinction is:

```text
Easily reversible decision
→ lightweight governance

Expensive-to-reverse decision
→ stronger architecture review
```

Architecture Authority should be used most deliberately where a decision has
significant consequences such as:

* high migration cost;
* broad dependency impact;
* long-term lock-in;
* security consequences;
* operational consequences;
* large data migration implications;
* difficult rollback.

MDS should avoid unnecessary approval overhead for low-impact decisions.

---

# 14. Architecture Constraints

Architecture Authority may establish technical constraints that downstream
responsibilities must respect.

Examples include:

* allowed dependency direction;
* system boundary;
* integration contract;
* data ownership rule;
* supported deployment model;
* technical compatibility requirement.

An architectural constraint must remain traceable to the decision that created
it.

Downstream implementation must not silently violate an approved architecture
constraint.

---

# 15. Architecture Exception

Sometimes implementation or operational reality may require deviation from an
approved architecture rule.

Such deviation should not silently become the new architecture.

Conceptual flow:

```text
Approved Architecture
        ↓
Exception Needed
        ↓
Exception Analysis
        ↓
Architecture Review
        ↓
Architecture Authority
        ↓
APPROVE EXCEPTION
or
REJECT
```

An approved exception should define, when applicable:

* affected scope;
* rationale;
* risk;
* temporary or permanent nature;
* expiry or revisit condition;
* mitigation;
* relationship to the original decision.

---

# 16. Architecture Change

Architecture is not immutable.

When new evidence, requirements, risk, or constraints justify change:

```text
Current Architecture Truth
          ↓
New Evidence / Change
          ↓
Architecture Impact Analysis
          ↓
New Architecture Proposal
          ↓
Architecture Approval Gate
          ↓
Architecture Authority
          ↓
New Authoritative Decision
```

The previous architecture decision must remain in historical lineage.

---

# 17. Supersession

When a new architecture decision replaces an existing one, MDS must preserve
the relationship.

Conceptually:

```text
Architecture Decision v1
APPROVED
CURRENT
        ↓
New Decision
        ↓
Architecture Decision v2
APPROVED
CURRENT

v1
→ SUPERSEDED / historical according to Artifact Truth rules
```

The exact lifecycle semantics belong to `../standards/artifact_truth.md`.

Architecture Authority supplies the governed decision that permits the
transition.

---

# 18. Architecture Authority and Implementation Plane

Architecture Authority establishes technical direction.

It does not itself implement that direction.

```text
Architecture Decision
        ↓
Technical Specification / Context
        ↓
Implementation Plane
        ↓
Implementation Evidence
```

Therefore:

```text
Architecture Authority
≠
Source Code Authority
```

Approval does not grant MDS, AI, or the authority holder automatic permission
to modify managed-project source code through the MDS governance layer.

Implementation belongs to:

```text
../implementation-plane/
```

---

# 19. Architecture Conformance

After implementation, evidence may indicate whether the implementation
conforms to approved architecture.

Possible evidence may include:

* repository structure;
* dependency graph;
* API contracts;
* database structure;
* configuration;
* build results;
* tests;
* runtime evidence;
* manual review.

MDS may correlate this evidence with architecture decisions.

Architecture Authority approval alone does not prove conformance.

Conceptually:

```text
Approved Architecture
        ↓
Implementation
        ↓
Evidence
        ↓
Conformance Analysis
```

---

# 20. Architecture Drift

Architecture drift occurs when actual implementation no longer matches
authoritative architecture knowledge.

Conceptually:

```text
Architecture Truth
       ≠
Observed Implementation
```

MDS should be able to surface this mismatch.

The response should not be automatic mutation of either side.

Possible governed outcomes include:

```text
Implementation must change

or

Architecture Truth must be reconsidered
```

The appropriate professional and authority process determines which outcome is
correct.

---

# 21. Architecture Authority and Runtime Evidence

Runtime evidence can reveal incorrect assumptions about architecture.

Examples include:

* reliability issues;
* performance limitations;
* scaling behaviour;
* dependency failures;
* operational complexity;
* security incidents.

Runtime evidence is input.

It is not Architecture Authority.

```text
Runtime Evidence
       ↓
Architecture Analysis
       ↓
Architecture Authority
       ↓
Decision
```

Production/runtime belongs to:

```text
../runtime/
```

---

# 22. Architecture Authority and Quality Attributes

Architecture decisions may be driven by quality attributes such as:

* performance;
* availability;
* reliability;
* scalability;
* security;
* maintainability;
* interoperability;
* recoverability;
* observability.

Architecture Authority may approve the technical strategy used to satisfy such
requirements.

It does not automatically own the business importance or product priority of
those requirements.

---

# 23. Trade-offs

Architecture Authority frequently decides between options where no solution is
universally best.

Conceptually:

```text
Option A
+ benefit
- cost

Option B
+ benefit
- risk

Option C
+ simplicity
- limitation
```

A valid architecture decision should make relevant trade-offs visible.

MDS should avoid representing architecture decisions as unexplained statements
such as:

```text
"Use X."
```

when the decision has meaningful consequences.

---

# 24. Architecture Risk

Architecture Authority may accept technical risk when governance permits.

Risk acceptance should be distinguishable from risk absence.

```text
Known Risk
   ↓
Analysis
   ↓
Architecture Authority
   ↓
ACCEPT / MITIGATE / REJECT / DEFER
```

An accepted risk should remain traceable.

Approval must not cause MDS to hide the risk.

---

# 25. Security-related Architecture Decisions

Some architecture decisions may affect security.

Architecture Authority may approve architecture-level technical direction, but
this does not automatically replace independent Security responsibility or any
required security gate.

If governance requires an additional security approval:

```text
Architecture Approval
+
Security Review / Approval
```

must remain distinct.

The existence of Security professional responsibility does not automatically
require a canonical Security Authority Type.

---

# 26. Architecture Authority Scope

Architecture Authority must operate within assigned scope.

Scope may be limited by:

* project;
* system;
* subsystem;
* platform;
* architecture domain;
* decision category;
* environment;
* time period.

Conceptually:

```text
Architecture Authority Holder A
→ System A

Architecture Authority Holder B
→ Platform B
```

Both may use the same canonical Authority Type with different assignments.

---

# 27. Multiple Architecture Authorities

A project may have multiple Architecture Authority holders.

This does not automatically require separate authority types.

Use:

```text
architecture-authority
+
scoped Authority Assignments
```

before creating classifications such as:

```text
Backend Architecture Authority
Frontend Architecture Authority
Database Architecture Authority
Cloud Architecture Authority
```

A new Authority Type is justified only when governance semantics are genuinely
different.

---

# 28. Cross-scope Architecture Decisions

Some decisions may span multiple architecture scopes.

For example conceptually:

```text
System A
↕
Shared Platform
↕
System B
```

The applicable governance may require:

* joint review;
* multiple approvals;
* escalation;
* broader architecture authority.

MDS must not assume that one scoped authority can approve the entire decision.

---

# 29. Self-Approval

Architecture Authority inherits self-approval semantics from
`authority-model.md`.

MDS must not globally assume:

```text
Architect
cannot approve their own proposal
```

or:

```text
Architect
always may approve their own proposal
```

Gate policy determines the required separation of duties.

---

# 30. AI Assistance

AI may support Architecture Authority by:

* summarising architecture proposals;
* identifying relevant requirements;
* comparing architecture options;
* surfacing trade-offs;
* detecting dependency impact;
* identifying conflicting decisions;
* finding architecture drift;
* analysing repository evidence;
* identifying missing rationale;
* highlighting technical risk;
* comparing current and proposed architecture;
* generating clarification questions.

AI must not:

* appoint itself Architecture Authority;
* silently approve architecture;
* select a technical option and mark it authoritative;
* invent missing technical constraints;
* change an approved architecture decision without a human gate;
* resolve authority conflicts by model preference;
* treat implementation reality as automatically superseding architecture truth.

Inherited principle:

```text
AI analyses and recommends
Human Authority decides
MDS records and enforces
```

---

# 31. Evidence and Audit

An Architecture Authority Decision should be traceable to:

```text
Authority Holder

Authority Assignment

Architecture Gate

Decision Object / Artifact

Version

Decision

Timestamp

Relevant Requirements

Architecture Analysis

Options / Trade-offs

Relevant Evidence

Rationale when required
```

For significant decisions, auditability should make it possible to answer:

```text
Why was this architecture chosen?

What alternatives existed?

Which constraints influenced the choice?

Who approved it?

What consequences were known?
```

---

# 32. Type-specific Invariants

Architecture Authority inherits all invariants from `authority-model.md`.

The following additional invariants apply.

### ARCH-AUTH-INV-001

Architecture responsibility does not automatically grant Architecture
Authority.

### ARCH-AUTH-INV-002

A technical suggestion, preference, or AI recommendation does not automatically
become Architecture Truth.

### ARCH-AUTH-INV-003

Architecture Authority may only decide within its assigned architecture scope.

### ARCH-AUTH-INV-004

Architecture Approval does not automatically create Product, Business,
Implementation, Verification, or Release approval.

### ARCH-AUTH-INV-005

Architecture Authority must not silently alter approved business meaning.

### ARCH-AUTH-INV-006

Significant architecture change must preserve historical decision lineage.

### ARCH-AUTH-INV-007

Implementation divergence does not automatically supersede authoritative
architecture.

### ARCH-AUTH-INV-008

Architecture exceptions must be explicit and governed when required by policy.

### ARCH-AUTH-INV-009

Known trade-offs and accepted risks must not be hidden by the approval state.

### ARCH-AUTH-INV-010

Not every implementation-level technical choice requires Architecture
Authority approval.

---

# 33. Ownership Boundary

This file owns the type-specific semantics of:

```text
architecture-authority
```

It inherits general authority semantics from:

```text
authority-model.md
```

It does not own:

```text
Architecture / Tech Lead professional responsibility
→ ../roles/architecture-tech-lead/

Product Authority
→ ./product-authority.md

Business Authority
→ ./business-authority.md

Release Authority
→ ./release-authority.md

Artifact lifecycle
→ ../standards/artifact_truth.md

Implementation
→ ../implementation-plane/

Runtime evidence
→ ../runtime/

Schemas
→ ../schemas/

AI prompts
→ ../prompts/
```

Principle:

> Architecture Authority owns the right to establish authoritative technical
> direction, not the entire process of analysis, implementation, verification,
> or operation.

---

# 34. Extension Principle

Do not create a new Architecture Authority Type for each technology, technical
team, layer, or component.

Prefer:

```text
Architecture Authority
+
scoped Authority Assignment
```

unless there is a genuine difference in governance semantics.

Principle:

> **Architecture Authority models the right to decide significant technical
> direction, not the technical organisation chart.**
