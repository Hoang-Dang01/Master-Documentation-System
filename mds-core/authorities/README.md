---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
canonical_target:

  - ./authority-model.md
  - ./authority-registry.yaml
  - ./product-authority.md
  - ./business-authority.md
  - ./architecture-authority.md
  - ./release-authority.md
update_strategy: change only through the applicable human approval gate

---

# Human Approval Authorities

This directory defines the canonical **Human Approval Authority** boundary of
MDS.

An approval authority represents a governed human decision right.

It answers:

```text
Who is allowed to make this decision?

Within which scope?

At which governed gate?

With what authoritative effect?
```

Approval Authority is separate from professional responsibility, external actor
classification, implementation responsibility, runtime evidence, and MDS
system capabilities.

One human may hold several of these relationships at the same time, but none of
them automatically grants another.

---

## 1. Canonical Ownership

The canonical authority model is divided as follows:

```text
authority-model.md
→ general Human Approval Authority semantics and invariants

authority-registry.yaml
→ canonical Authority Type registry

product-authority.md
→ product-level decision authority

business-authority.md
→ business-level decision authority

architecture-authority.md
→ architecture-level technical decision authority

release-authority.md
→ release readiness and release permission authority
```

This directory owns the detailed semantics of Human Approval Authority.

Global MDS classification may identify `approval_authority` as a responsibility
class, but competing authority definitions must not be created outside this
boundary.

---

## 2. Current Canonical Authority Types

MDS currently recognises four canonical Human Approval Authority Types:

```text
Product Authority

Business Authority

Architecture Authority

Release Authority
```

These types represent distinct governed decision domains.

They do not represent job titles or organisational positions.

A new Authority Type must not be created merely because a corresponding
professional role, department, technology, or team exists.

---

## 3. Authority is a Decision Right

An Authority is not:

```text
a job title
a professional role
an actor type
an AI agent
an ownership label
a workflow
an implementation capability
```

An Authority is:

```text
A GOVERNED HUMAN DECISION RIGHT
```

The general semantics of scope, gates, assignments, delegation, validity,
auditability, self-approval, conflicts, and AI boundaries are defined in:

```text
./authority-model.md
```

---

## 4. Professional Responsibility is not Approval Authority

MDS must preserve:

```text
Professional Responsibility
≠
Approval Authority
```

Professional responsibilities answer:

> Who is responsible for analysing, designing, verifying, operating, or
> producing a professional output?

Approval Authorities answer:

> Who has the governed right to make the applicable authoritative decision?

For example, a human may hold both:

```text
Architecture / Tech Lead Responsibility

and

Architecture Authority
```

but one classification must not be inferred from the other.

Professional responsibility semantics belong to:

```text
../roles/
```

---

## 5. External Actor is not Approval Authority

MDS must also preserve:

```text
External Actor
≠
Approval Authority
```

A Customer / Stakeholder may provide:

* intent;
* needs;
* business knowledge;
* clarification;
* confirmation;
* feedback;
* change requests.

An External Actor may also hold an Approval Authority if governance explicitly
assigns that authority.

However, being a stakeholder does not automatically grant decision rights.

External Actor semantics belong to:

```text
../actors/
```

---

## 6. Authority Type and Authority Assignment

MDS distinguishes:

```text
Authority Type
≠
Authority Assignment
```

### Authority Type

Defines a canonical kind of governed decision right.

Authority Types belong to MDS Core and are registered in:

```text
./authority-registry.yaml
```

### Authority Assignment

Defines which human currently holds an Authority Type in a particular project
or governance context.

Conceptually:

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

Authority Assignments are project or governance data.

They must not be stored as canonical holder assignments inside
`mds-core/authorities/`.

---

## 7. Human Authority Only

The authorities defined by this directory are **Human Approval Authorities**.

Human Approval Authority must not be assigned to:

```text
AI models
AI agents
prompts
validators
workflow engines
system capabilities
Codex
CI/CD systems
runtime environments
```

Automation may provide:

```text
analysis
recommendation
validation
evidence
```

but the authoritative decision remains human.

The inherited principle is:

```text
AI recommends
Human decides
MDS records and enforces
```

---

## 8. Explicit Human Gates

An Authority becomes relevant at an explicit governed gate.

Conceptually:

```text
Proposal
   ↓
Analysis / Review
   ↓
────────────────
  HUMAN GATE
────────────────
   ↓
Applicable Authority
   ↓
Governed Decision
```

A gate determines which Authority Type is applicable and which decisions are
allowed.

An Authority does not create its own gate.

Gate and workflow behaviour belong to the applicable governance standard or
workflow contract.

---

## 9. Authority Scope

Every Authority Assignment must have a defined scope.

Authority must never be interpreted as unlimited project-wide power by
default.

Scope may be constrained by:

* project;
* system;
* product area;
* business domain;
* architecture domain;
* release class;
* environment;
* decision category;
* validity period.

An authority decision outside the holder's assigned scope is not a valid
governed decision.

Detailed scope semantics belong to `authority-model.md`.

---

## 10. Decision Rights

Depending on the applicable gate, an Authority may be allowed to issue
decisions such as:

```text
APPROVE
REJECT
RETURN_FOR_CLARIFICATION
DEFER
SUPERSEDE
```

Not every gate must support every decision type.

Authority defines the governed right to decide.

The gate contract defines which decisions are permitted and what effect they
have.

---

## 11. Approval Does Not Mean Universal Approval

An approval is valid only within its authority domain and gate scope.

For example:

```text
Product Approval
≠
Business Approval

Business Approval
≠
Architecture Approval

Architecture Approval
≠
Release Approval
```

Likewise:

```text
Approval
≠
Implementation complete

Approval
≠
Verification passed

Approval
≠
Deployment executed

Approval
≠
Runtime success
```

Each concern must remain governed by its own canonical boundary.

---

## 12. Authority and Project Truth

Human authority decisions may participate in transitions that establish or
change authoritative project knowledge.

However:

```text
Authority
→ makes the governed decision

Artifact Truth Standard
→ defines how that decision affects artifact truth and lifecycle

MDS
→ records and enforces the governed state
```

Artifact truth semantics remain canonical in:

```text
../standards/artifact_truth.md
```

This directory must not define a competing artifact lifecycle.

---

## 13. Authority Decisions Must Be Auditable

An authority decision must be traceable.

MDS should be able to determine at minimum:

```text
Who decided?

Which Authority Assignment was used?

Which gate was involved?

What object or version was reviewed?

What decision was issued?

When was the decision made?

Which evidence or inputs were considered?

What rationale was recorded when required?
```

An authoritative state must not exist only as an unexplained status flag when
governance requires decision provenance.

Concrete persistence structures belong to:

```text
../schemas/
```

---

## 14. No Automatic Authority from Titles

MDS must not infer authority from professional titles.

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

The relationship must still be explicitly represented through governance.

---

## 15. No Automatic Authority from Roles

The existence of a professional responsibility does not require a corresponding
Authority Type.

For example, MDS must not automatically create:

```text
Frontend Authority
Backend Authority
Database Authority
QA Authority
Security Authority
```

merely because those professional responsibilities exist.

A new Authority Type is justified only when a genuinely distinct governed
decision domain and human approval gate require it.

---

## 16. Multiple Holders and Multiple Authorities

A human may hold multiple Authority Types.

Multiple humans may also hold the same Authority Type with different scopes.

For example:

```text
Human A
├── Product Authority
└── Business Authority
```

or:

```text
Architecture Authority
├── Holder A → System A
└── Holder B → System B
```

This normally requires different Authority Assignments, not new Authority
Types.

Quorum, joint approval, escalation, and precedence belong to the applicable
governance policy.

---

## 17. Delegation

Authority delegation is not assumed by default.

If governance supports delegation, it must be explicit, scoped, time-aware,
traceable, and auditable.

An informal instruction such as:

```text
"Approve this for me."
```

must not automatically create valid delegated authority.

Detailed delegation semantics belong to:

```text
./authority-model.md
```

---

## 18. Self-Approval and Separation of Duties

MDS does not globally require or globally permit self-approval.

A project may allow:

```text
Professional Output Author
=
Authority Holder
```

while another governance model may require:

```text
Professional Output Author
≠
Authority Holder
```

The applicable gate or policy determines whether separation of duties is
required.

This allows the authority model to support both lightweight and strict
governance without changing the canonical semantics.

---

## 19. Routing Boundary

This directory owns Human Approval Authority semantics only.

Related concerns must be routed as follows:

```text
Professional responsibilities
→ ../roles/

External actors
→ ../actors/

Implementation responsibility
→ ../implementation-plane/

Runtime and production evidence
→ ../runtime/

MDS internal automation and system capabilities
→ ../system-capabilities/

Artifact truth and governance standards
→ ../standards/

Structured data contracts
→ ../schemas/

AI behaviour and assistance instructions
→ ../prompts/

Usage guidance
→ ../guides/

Examples
→ ../examples/
```

This routing prevents authority rules from being duplicated across unrelated
boundaries.

---

## 20. Implementation Boundary

Human Approval Authority does not grant implementation authority.

MDS must preserve:

```text
Approval Authority
≠
Implementation Responsibility
```

A Product, Business, Architecture, or Release decision may authorize a
governance transition.

It does not give MDS itself permission to modify managed-project source code.

Implementation belongs to:

```text
../implementation-plane/
```

---

## 21. Runtime Boundary

Runtime environments may provide evidence used by an Authority.

Examples include:

* telemetry;
* incidents;
* health status;
* performance observations;
* deployment results.

Runtime evidence is input to a governed decision.

Runtime itself is not an Authority.

```text
Runtime Evidence
      ↓
Analysis
      ↓
Human Authority
      ↓
Decision
```

Runtime semantics belong to:

```text
../runtime/
```

---

## 22. System Capability Boundary

MDS system capabilities may:

* identify applicable gates;
* retrieve relevant evidence;
* validate authority assignments;
* detect missing approvals;
* detect scope violations;
* detect conflicting decisions;
* build decision context;
* preserve provenance.

They must not become Human Approval Authorities.

System capability semantics belong to:

```text
../system-capabilities/
```

---

## 23. Current Authority Routing

The current canonical authority domains are:

```text
Product-level direction and scope
→ ./product-authority.md

Business meaning and business truth
→ ./business-authority.md

Architecture-level technical direction
→ ./architecture-authority.md

Release readiness and release permission
→ ./release-authority.md
```

If a decision does not belong clearly to one of these domains, MDS should not
silently assign authority.

The decision should remain unresolved until the applicable governance boundary
is identified.

---

## 24. Extension Policy

The authority taxonomy must remain intentionally small.

Before adding a new Authority Type, determine whether the requirement can be
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
2. an explicit human decision gate exists;
3. the decision right cannot be represented cleanly by an existing Authority
   Type and scope;
4. the distinction has meaningful governance consequences;
5. the change passes the applicable governed approval process.

Principle:

> **Model real decision rights, not organisational charts.**

---

## 25. Source of Truth

Canonical ownership within this boundary is:

```text
General Authority semantics and invariants
→ ./authority-model.md

Canonical Authority Type registry
→ ./authority-registry.yaml

Product Authority semantics
→ ./product-authority.md

Business Authority semantics
→ ./business-authority.md

Architecture Authority semantics
→ ./architecture-authority.md

Release Authority semantics
→ ./release-authority.md
```

Related canonical rules remain owned by their respective MDS Core boundaries.

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed authority semantics.
