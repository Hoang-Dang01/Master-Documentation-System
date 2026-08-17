---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
authority_type: business-authority
classification: approval_authority
model_ref: ./authority-model.md
registry_ref: ./authority-registry.yaml
update_strategy: change only through the applicable human approval gate
---

# Business Authority

## 1. Purpose

`Business Authority` is the Human Approval Authority responsible for governed
decisions about business meaning, business rules, business requirements, and
business interpretation.

This authority exists to answer questions such as:

```text
What is the actual business rule?

Which interpretation is authoritative?

Is this requirement an accurate representation of the business need?

How should unresolved business ambiguity be decided?

Which business rule supersedes the previous one?
```

`Business Authority` inherits all authority semantics and invariants from
`authority-model.md`.

This file defines only the decision domain specific to Business Authority.

---

# 2. Decision Domain

Business Authority owns governed decisions concerning business truth.

Typical decision domains include:

* business rules;
* business requirements;
* business process meaning;
* actor responsibilities at the business level;
* business conditions;
* business exceptions;
* business constraints;
* authoritative business interpretation;
* resolution of business ambiguity;
* resolution of conflicting business statements;
* confirmation of business requirement changes;
* supersession of previous business decisions.

Business Authority does not automatically own:

* product priority;
* product roadmap;
* system architecture;
* API design;
* database design;
* implementation;
* verification execution;
* release decisions.

---

# 3. Business Authority is not Business Analysis

MDS must distinguish:

```text
Business Analysis
≠
Business Authority
```

`business-analysis/` is responsible for:

* analysing source information;
* understanding business problems;
* identifying actors;
* modelling business processes;
* extracting business rules;
* detecting ambiguity;
* detecting conflicts;
* managing assumptions;
* drafting requirements;
* defining acceptance criteria;
* requesting clarification.

Business Authority is responsible for:

> Making the governed human decision that determines which business
> interpretation becomes authoritative.

Conceptual flow:

```text
Business Sources
      ↓
Business Analysis
      ↓
Business Proposal
      ↓
Business Approval Gate
      ↓
Business Authority
      ↓
Authoritative Business Decision
```

A single human may hold both the Business Analysis responsibility and Business
Authority.

The two classifications must still remain independent.

---

# 4. Business Authority receives analysed input

Business Authority should normally decide on structured business information,
not raw unanalysed input.

Typical inputs include:

* business context;
* stakeholder statements;
* process analysis;
* business rule proposals;
* requirement drafts;
* acceptance criteria;
* ambiguity records;
* conflict records;
* assumptions;
* clarification results;
* change analysis;
* source provenance;
* impact information when available.

The authority may inspect the original source whenever necessary.

Professional analysis must never hide or replace source provenance.

---

# 5. Business Approval Gate

A Business Approval Gate is the governed point where a proposed business
interpretation may become authoritative.

Conceptually:

```text
Source Information
      ↓
Business Analysis
      ↓
Business Proposal
      ↓
Completeness Review
      ↓
────────────────────────
 BUSINESS APPROVAL GATE
────────────────────────
      ↓
Business Authority
      ↓
Decision
```

A gate may apply to:

* an individual business rule;
* a requirement;
* a business process;
* a set of related requirements;
* a business change;
* resolution of a conflict.

The workflow defines the exact gate contract.

---

# 6. Approval at the business level

`APPROVE` means:

> The Business Authority accepts the proposed business interpretation as
> authoritative within the scope of the gate.

Approval may allow:

```text
DRAFT BUSINESS KNOWLEDGE
        ↓
APPROVED BUSINESS TRUTH
```

The resulting business truth may then be consumed by downstream professional
responsibilities.

Business approval does not mean:

* system behaviour has already been designed;
* architecture is approved;
* implementation is correct;
* tests have passed;
* release is approved.

---

# 7. Business Rule Approval

A proposed Business Rule should only become authoritative after the applicable
governance conditions are satisfied.

Conceptually:

```text
Source Statements
      ↓
Business Analysis
      ↓
Rule Proposal
      ↓
Business Authority
      ↓
Approved Business Rule
```

Example form:

```text
Condition
    ↓
Business Rule
    ↓
Expected Business Outcome
```

Business Authority approves the meaning of the rule.

Technical enforcement belongs to downstream responsibilities.

---

# 8. Requirement Approval

Business Authority may approve a business requirement when the requirement
accurately captures the governed business need.

A requirement ready for business approval should normally make clear:

* the business problem or need;
* relevant actors;
* expected behaviour;
* applicable business rules;
* important conditions;
* known exceptions;
* scope;
* acceptance criteria;
* unresolved questions, if any;
* source provenance.

The exact completeness criteria belong to the relevant role and workflow
standards.

Business Authority does not write implementation details into a requirement
merely to make it approvable.

---

# 9. Ambiguity Resolution

Business Analysis may identify ambiguity such as:

```text
"normally"
"when necessary"
"manager"
"important data"
"some cases"
```

Business Authority may be asked to decide the authoritative meaning.

Conceptual flow:

```text
Ambiguous Statement
      ↓
Business Analysis
      ↓
Clarification Options
      ↓
Business Authority
      ↓
Authoritative Interpretation
```

AI may propose interpretations.

AI may not choose one and silently convert it into Business Truth.

---

# 10. Conflict Resolution

Multiple sources may provide incompatible business statements.

For example:

```text
Source A → Rule X
Source B → Rule Y

X conflicts with Y
```

Business Analysis records and explains the conflict.

Business Authority may resolve the conflict if the holder has the applicable
scope.

The resulting decision must preserve:

* conflicting source statements;
* provenance;
* resolution rationale when required;
* authority holder;
* decision;
* timestamp;
* superseded interpretation where applicable.

Resolving a conflict must not erase the historical disagreement.

---

# 11. Unknown is preferable to invented truth

If Business Authority cannot determine the correct business rule because
information is insufficient, the authority should use a non-approval decision
such as:

```text
RETURN_FOR_CLARIFICATION
```

or:

```text
DEFER
```

when permitted by the gate.

MDS must prefer:

```text
UNKNOWN
```

over:

```text
UNVERIFIED ASSUMPTION TREATED AS TRUTH
```

---

# 12. Business Authority and assumptions

An assumption is not Business Truth.

Conceptually:

```text
FACT
→ supported by source/evidence

ASSUMPTION
→ inferred but not confirmed

DECISION
→ governed authoritative choice
```

Business Authority may:

* confirm an assumption;
* reject an assumption;
* request clarification;
* replace an assumption with an explicit decision.

Until then, the assumption must remain visibly non-authoritative.

---

# 13. Business Authority and External Actors

Customer / Stakeholder may provide:

* business knowledge;
* business statements;
* process information;
* confirmation;
* feedback;
* change requests.

But:

```text
Stakeholder Statement
≠
Business Decision
```

A Customer / Stakeholder Actor Instance may also hold Business Authority when
governance explicitly assigns that authority.

Conceptually:

```text
External Actor
      ↓
Business Source
      ↓
Business Analysis
      ↓
Business Authority
      ↓
Business Truth
```

Actor identity and authority assignment remain independent.

---

# 14. Business Authority and Product Authority

The two authority types solve different questions.

```text
Product Authority
→ Should the product address this problem?

Business Authority
→ If it does, what is the authoritative business meaning?
```

Conceptual flow:

```text
Product Decision
"This capability is in scope."
        ↓
Business Analysis
        ↓
Business Rules / Requirements
        ↓
Business Authority
        ↓
Approved Business Truth
```

Product Authority must not silently invent business rules.

Business Authority must not silently change product scope or priority.

---

# 15. Business Authority and System Analysis

Business Authority determines the authoritative business meaning.

System Analysis translates that meaning into system behaviour.

```text
Approved Business Truth
        ↓
System Analysis
        ↓
System Behaviour Proposal
```

Business Authority should not directly decide:

* internal system states;
* service boundaries;
* API structure;
* persistence strategy;
* technical events;

unless the concern is actually a business requirement rather than a technical
design choice.

---

# 16. Business Authority and Architecture Authority

Business Authority may define a constraint such as:

```text
The business operation must remain available under condition X.
```

Architecture Authority may later decide:

```text
What technical architecture satisfies that constraint?
```

The boundary is:

```text
Business Authority
→ authoritative business requirement

Architecture Authority
→ authoritative technical direction
```

If a technical limitation makes an approved business requirement infeasible,
the requirement must be returned through governed analysis.

Architecture must not silently rewrite business truth.

---

# 17. Business Authority and Acceptance Criteria

Business Authority may approve acceptance criteria insofar as they express
business-acceptable outcomes.

For example:

```text
Given a valid business condition,
when action X occurs,
the business result must be Y.
```

Business Authority does not own:

* test implementation;
* test automation;
* test framework;
* technical verification strategy.

Those belong to Quality Assurance and related technical responsibilities.

---

# 18. Business Change

When new source information conflicts with current Business Truth, the existing
truth must not be overwritten immediately.

Conceptual flow:

```text
CURRENT BUSINESS TRUTH
        ↓
New Business Source
        ↓
Business Change Analysis
        ↓
Proposed New Version
        ↓
Business Approval Gate
        ↓
Business Authority
        ↓
APPROVE / REJECT / CLARIFY / DEFER
```

Only an approved governed decision may establish the new authoritative
business version.

---

# 19. Supersession

When Business Authority approves a new business decision that replaces an
existing authoritative decision, lineage must be preserved.

```text
Business Rule v1
APPROVED
CURRENT
      ↓
New Change
      ↓
Business Rule v2
APPROVED
CURRENT
      ↓
v1 becomes historical/superseded
```

The exact lifecycle terminology is owned by the Artifact Truth Standard.

Business Authority only supplies the governed decision that authorises the
transition.

---

# 20. Business Authority and impact

A business decision may affect downstream knowledge.

Examples may include:

* system behaviour;
* architecture assumptions;
* UI behaviour;
* backend specification;
* data requirements;
* test coverage;
* existing implementation.

Business Authority does not itself determine every downstream technical
impact.

MDS and the relevant professional responsibilities perform impact analysis.

Conceptually:

```text
Approved Business Change
        ↓
Knowledge Graph / Impact Analysis
        ↓
Affected Downstream Artifacts
        ↓
NEEDS_REVIEW / relevant governed state
```

---

# 21. Business Authority does not directly authorize implementation

Business approval may make information suitable for downstream technical
analysis.

It does not mean:

```text
Business Approved
      ↓
Codex may immediately modify anything
```

The project may still require:

* System Analysis;
* Architecture;
* technical specification;
* verification planning;
* implementation context preparation.

Implementation remains within the external Implementation Plane.

---

# 22. Business Authority and evidence

A Business Authority Decision should be traceable to relevant evidence such as:

* original source information;
* stakeholder statements;
* clarification responses;
* process documentation;
* business analysis;
* conflict records;
* previous business versions;
* impact information.

Authority must be able to understand:

```text
What is being approved?

Why?

Based on which sources?

What changed?

What remains unresolved?
```

---

# 23. Business Authority Decision Record

A governed business decision should be auditable.

At minimum, MDS should be able to determine:

```text
Authority Holder

Authority Assignment

Gate

Business Object / Artifact

Version

Decision

Timestamp

Relevant Sources

Relevant Analysis

Rationale when required
```

The concrete persistence schema belongs to `schemas/`.

---

# 24. Human confirmation versus Business Approval

MDS must distinguish:

```text
Confirmation
≠
Approval
```

A stakeholder may confirm:

> "Yes, this description matches how I currently understand the process."

That does not necessarily mean:

> "I have the authority to make this the official business rule."

Confirmation is source evidence.

Approval is a governed authority decision.

---

# 25. Business Decision Scope

Business Authority must act only within assigned scope.

Scope may conceptually be limited by:

* project;
* product area;
* business domain;
* business process;
* requirement category;
* organisational context;
* time period.

A Business Authority holder for one domain must not automatically approve
business rules in unrelated domains.

---

# 26. Multiple Business Authorities

A project may contain multiple Business Authority holders.

For example conceptually:

```text
Business Domain A
→ Authority Holder A

Business Domain B
→ Authority Holder B
```

This does not require separate Authority Types.

They may all use:

```text
business-authority
```

with different Authority Assignments and scopes.

This avoids modelling organisational structure as canonical authority types.

---

# 27. Cross-domain decisions

A business decision may affect multiple authority scopes.

In such cases the applicable governance policy may require:

* multiple approvals;
* joint review;
* escalation;
* higher-scope authority.

Business Authority Model does not assume that one holder can approve the whole
decision merely because part of it lies within their scope.

---

# 28. Self-Approval

Business Authority inherits self-approval semantics from `authority-model.md`.

MDS does not globally assume that:

```text
Business Analyst
≠
Business Approver
```

or that:

```text
Business Analyst
=
Business Approver
```

The gate policy determines whether separation of duties is required.

This permits both:

* personal/small-project governance;
* stricter organisational governance.

---

# 29. Role of AI

AI may assist Business Authority by:

* summarising business analysis;
* extracting relevant source evidence;
* comparing source statements;
* detecting ambiguity;
* detecting conflicts;
* highlighting assumptions;
* comparing versions;
* showing impact;
* identifying missing information;
* proposing clarification questions;
* presenting candidate interpretations.

AI must not:

* create Business Authority;
* impersonate Business Authority;
* silently approve a requirement;
* turn assumptions into business truth;
* choose between conflicting stakeholder statements without governed decision;
* modify authoritative business truth without approval;
* use model confidence as a substitute for authority.

Inherited principle:

```text
AI analyses
Human Authority decides
MDS records and enforces
```

---

# 30. Type-specific invariants

Business Authority inherits all invariants from `authority-model.md`.

The following additional invariants apply.

### BUSINESS-AUTH-INV-001

A stakeholder statement does not automatically become Business Truth.

### BUSINESS-AUTH-INV-002

A Business Analysis proposal does not become authoritative until the applicable
Business Approval Gate is satisfied.

### BUSINESS-AUTH-INV-003

Business Authority may only decide within its assigned business scope.

### BUSINESS-AUTH-INV-004

Business Approval does not automatically create Product, Architecture, Release,
or Implementation approval.

### BUSINESS-AUTH-INV-005

Unresolved ambiguity must not be silently converted into an authoritative rule.

### BUSINESS-AUTH-INV-006

Unresolved conflict must not be resolved by AI assumption.

### BUSINESS-AUTH-INV-007

Business assumptions must remain distinguishable from governed business
decisions.

### BUSINESS-AUTH-INV-008

Business change must preserve previous authoritative lineage.

### BUSINESS-AUTH-INV-009

Human confirmation and Business Approval are distinct concepts.

### BUSINESS-AUTH-INV-010

Technical implementation detail must not be introduced as Business Truth unless
it represents an actual governed business constraint.

---

# 31. Ownership Boundary

This file owns the type-specific semantics of:

```text
business-authority
```

It inherits general authority semantics from:

```text
authority-model.md
```

It does not own:

```text
Business Analysis responsibility
→ ../roles/business-analysis/

External Actor semantics
→ ../actors/

Product Authority
→ ./product-authority.md

Architecture Authority
→ ./architecture-authority.md

Release Authority
→ ./release-authority.md

Artifact lifecycle
→ ../standards/artifact_truth.md

Business artifact schemas
→ ../schemas/

Workflow execution
→ workflows/

Implementation
→ ../implementation-plane/

AI prompts
→ ../prompts/
```

Principle:

> Business Authority owns the right to decide authoritative business meaning,
> not the entire process used to discover, analyse, design, implement, or verify
> that meaning.

---

# 32. Extension Principle

Do not create a new Authority Type for every business department, stakeholder
group, or business process.

Prefer:

```text
Business Authority
+
scoped Authority Assignment
```

over:

```text
Finance Authority
Operations Authority
Sales Authority
Department-X Authority
...
```

unless a genuinely different governance semantic requires a distinct Authority
Type.

Principle:

> **Business Authority models the right to establish authoritative business
> meaning, not the organisation chart behind that meaning.**
