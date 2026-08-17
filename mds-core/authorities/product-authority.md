---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
authority_type: product-authority
classification: approval_authority
model_ref: ./authority-model.md
registry_ref: ./authority-registry.yaml
update_strategy: change only through the applicable human approval gate
-----------------------------------------------------------------------

# Product Authority

## 1. Purpose

`Product Authority` is the Human Approval Authority responsible for governed
decisions at the **product level**.

This authority exists to answer questions such as:

```text
Which problems should the product address?

Does a proposal belong within the product scope?

Is the proposal worth further investment and analysis?

Should it be pursued now, deferred, or rejected?

What is the current product boundary?
```

`Product Authority` inherits all general authority semantics and invariants
from `authority-model.md`.

This file defines only the decision domain specific to Product Authority.

---

# 2. Decision Domain

Product Authority owns governed decisions concerning **product-level direction
and product-level scope**.

Typical decision domains include:

* Product Vision;
* Product Goal;
* Product Boundary;
* product-level problem selection;
* product-level scope;
* feature or capability inclusion;
* feature or capability exclusion;
* prioritisation;
* deferment;
* roadmap direction;
* MVP boundary;
* product-level success expectations;
* acceptance of a proposal for deeper analysis.

Product Authority does not own business or technical detail merely because that
detail belongs to the same feature or capability.

---

# 3. Product Authority is not Product Management

MDS must distinguish:

```text
Product Management
≠
Product Authority
```

`product-management/` is responsible for:

* analysing problems;
* assessing value;
* evaluating product fit;
* proposing priority;
* proposing scope;
* maintaining roadmap direction;
* producing recommendations.

`Product Authority` is responsible for:

> Accepting or rejecting governed product-level decisions at the applicable
> gate.

Conceptual flow:

```text
Product Management
        ↓
Product Analysis
        ↓
Product Proposal
        ↓
Product Gate
        ↓
Product Authority
        ↓
Governed Product Decision
```

One human may simultaneously hold Product Management responsibility and Product
Authority.

The two classifications must still be modelled independently.

---

# 4. Product Authority Inputs

A Product Gate may receive inputs such as:

* problem statement;
* product proposal;
* product goal;
* scope proposal;
* roadmap proposal;
* priority recommendation;
* MVP proposal;
* product hypothesis;
* product-level change request;
* dependency information;
* value assessment;
* cost or effort information;
* risk information;
* downstream technical feedback.

Product Authority is not required to produce these inputs.

Its responsibility is to evaluate them within its assigned decision scope.

---

# 5. Product Authority Decisions

Depending on the applicable gate, Product Authority may issue decisions such as:

```text
APPROVE
REJECT
RETURN_FOR_CLARIFICATION
DEFER
SUPERSEDE
```

Only decision types allowed by the gate contract may be used.

---

# 6. Product-Level Approval

`APPROVE` means:

> The proposal is accepted as an authoritative product decision within the
> scope of the applicable gate.

Possible effects may include:

* accepting a problem for the product to address;
* including a capability within Product Scope;
* updating the Product Boundary;
* confirming priority;
* allowing a proposal to proceed to Business Analysis;
* confirming roadmap direction.

Product Approval does **not** mean:

* business requirements are complete;
* architecture has been approved;
* implementation may automatically begin;
* release has been approved.

---

# 7. Product Intake Gate

One important product-level gate may be the **Product Intake Gate**.

This gate answers:

> Is this problem, idea, or change request worth investing additional analysis
> effort in?

Conceptual flow:

```text
Problem / Idea / Change Request
              ↓
      Product Management
              ↓
      Product Assessment
              ↓
       PRODUCT INTAKE GATE
              ↓
       Product Authority
        ┌─────┼─────┐
        ↓     ↓     ↓
     ACCEPT  DEFER  REJECT
```

`ACCEPT` at this gate means only:

```text
READY FOR BUSINESS ANALYSIS
```

It does not mean:

```text
READY FOR IMPLEMENTATION
```

---

# 8. Product Scope Gate

Product Authority may participate in a gate that determines:

* which capabilities are within Product Scope;
* which capabilities are outside Product Scope;
* which capabilities belong to the current phase;
* which capabilities are deferred;
* which capabilities remain future considerations.

Conceptual classifications may include:

```text
IN_SCOPE
OUT_OF_SCOPE
DEFERRED
FUTURE
```

The exact states belong to the applicable product or workflow standard.

---

# 9. Product Boundary

Product Authority may establish or confirm Product Boundary through a governed
workflow.

Product Boundary answers:

```text
What kinds of problems does the product exist to solve?

Where does product responsibility end?

What is intentionally outside the product scope?
```

A new request must not automatically enter Product Scope merely because it
appears useful.

Expected flow:

```text
New Request
    ↓
Product Fit Analysis
    ↓
Product Authority
    ↓
IN / OUT / DEFER
```

---

# 10. Priority

Product Authority may confirm the priority of product work.

Priority may consider factors such as:

* expected value;
* urgency;
* strategic fit;
* risk;
* dependency;
* cost;
* effort;
* affected users;
* legal constraints;
* operational constraints.

AI or Product Management may recommend priority.

Product Authority establishes the governed priority decision where the
applicable workflow requires authority approval.

Priority must not be inferred solely because:

```text
A stakeholder says "this is urgent."
```

---

# 11. MVP and Scope Reduction

Product Authority may deliberately reduce scope in order to deliver useful
value sooner.

Conceptually:

```text
Full Capability
      ↓
Product Analysis
      ↓
Minimum Valuable Scope
      ↓
Product Authority
      ↓
Approved MVP Boundary
```

MDS should treat:

```text
DO LESS
```

as a valid product decision when it preserves the intended value.

Scope reduction is not inherently a failure.

---

# 12. Deferment

Product Authority may choose:

```text
DEFER
```

when a proposal:

* has value but is not timely;
* depends on another capability;
* requires more evidence;
* cannot currently be resourced;
* is not yet sufficiently understood;
* does not fit the current roadmap.

Where appropriate, deferment should retain:

* rationale;
* revisit condition;
* dependency;
* target milestone;
* missing information.

Deferred does not mean Rejected.

---

# 13. Rejection

Product Authority may `REJECT` a proposal when, for example:

* it does not fit the Product Boundary;
* it does not solve a sufficiently valuable problem;
* it duplicates an existing capability;
* expected cost or risk exceeds expected value;
* it represents an unnecessary proposed solution;
* it conflicts with current product direction.

Rejection must preserve rationale when required by governance policy.

MDS must not delete a rejected proposal.

---

# 14. Product Authority and Business Authority

These authority types must remain distinct.

```text
Product Authority
→ Should the product address this problem?

Business Authority
→ If it does, what is the authoritative business meaning?
```

Conceptual flow:

```text
Product Decision:
Capability X is IN SCOPE.
        ↓
Business Analysis
        ↓
Business Rules
        ↓
Business Authority
        ↓
Approved Business Truth
```

Product Authority must not independently decide detailed business rules when
those decisions belong to Business Authority.

---

# 15. Product Authority and Architecture Authority

Product Authority may establish:

```text
Capability X must achieve outcome Y.
```

Architecture Authority determines:

```text
Which technical direction should be used to achieve outcome Y?
```

Product Authority does not automatically have authority to:

* select a framework;
* select a database;
* choose an architecture style;
* define module boundaries;
* decide technical trade-offs.

If technical constraints materially affect product scope, the authorities may
interact through governed escalation or product re-evaluation.

---

# 16. Product Authority and Release Authority

Product Authority determines:

```text
What is worth building?
```

Release Authority determines:

```text
Does the current release have sufficient evidence to proceed?
```

A feature approved by Product Authority is not automatically approved for
release.

---

# 17. Product Authority and External Actors

Customer / Stakeholder actors may provide:

* problems;
* intent;
* needs;
* requests;
* feedback;
* change requests.

However:

```text
Stakeholder Request
≠
Product Decision
```

Expected flow:

```text
External Actor
      ↓
Product Input
      ↓
Product Management Analysis
      ↓
Product Authority
      ↓
Product Decision
```

An External Actor may also hold Product Authority if governance explicitly
assigns that authority.

Actor classification and authority assignment remain independent.

---

# 18. Product Authority and Product Value

Product Authority decisions should be traceable to the expected value behind
the proposal.

A product proposal should not contain only:

```text
Build Feature X
```

It should ideally be traceable through:

```text
Problem
      ↓
Target User / Beneficiary
      ↓
Expected Value
      ↓
Product Proposal
```

For significant decisions, the rationale should explain:

> Why is this proposal worth pursuing, deferring, or rejecting?

---

# 19. Product Hypothesis

Some Product Decisions may be based on a hypothesis rather than an already
validated fact.

Conceptually:

```text
Hypothesis
"If we provide X, outcome Y will improve."
```

Product Authority may approve:

```text
EXPLORE / EXPERIMENT
```

when the applicable workflow supports such a decision.

Approval of a hypothesis does not validate the hypothesis.

MDS must preserve:

```text
Hypothesis
≠
Validated Outcome
```

---

# 20. Success Criteria

Product Authority may confirm product-level success criteria.

Success criteria answer:

> How will the project know whether investment in this capability produced the
> intended outcome?

Criteria may relate to:

* adoption;
* efficiency;
* error reduction;
* user outcome;
* operational outcome;
* financial outcome;
* risk reduction.

Product success criteria do not replace Business Acceptance Criteria or QA
Verification Criteria.

---

# 21. Change Requests

When a change request appears, Product Authority may need to reassess:

```text
Product Fit
Value
Priority
Scope
Roadmap Impact
```

A change request must not automatically move directly to implementation.

Conceptual flow:

```text
Change Request
      ↓
Product Re-evaluation
      ↓
Product Authority
      ↓
ACCEPT / DEFER / REJECT
```

---

# 22. Downstream Feedback

Downstream professional responsibilities may provide feedback that causes a
Product Decision to be reconsidered.

Examples include:

```text
Business Analysis
→ the required scope is significantly larger than expected

Architecture
→ technical cost is substantially higher than expected

Security
→ significant risk has been identified

Quality Assurance
→ the expected outcome cannot be meaningfully verified

Operations
→ the capability provides insufficient operational value
```

Based on new evidence, Product Authority may choose through a governed workflow
to:

```text
KEEP
REDUCE
DEFER
REJECT
SUPERSEDE
```

a previous Product Decision.

---

# 23. Self-Approval

Product Authority inherits self-approval semantics from
`authority-model.md`.

MDS does not globally assume that:

```text
A Product Manager
cannot approve their own product proposal
```

or that:

```text
A Product Manager
may always approve their own product proposal
```

The applicable gate policy determines whether separation of duties is required.

This allows MDS to support:

* personal projects;
* small teams;
* organisations with strict separation-of-duties requirements.

---

# 24. AI Assistance

AI may assist Product Authority by:

* summarising product proposals;
* linking proposals to problems;
* checking Product Boundary alignment;
* comparing proposals with roadmap direction;
* detecting duplicate capabilities;
* analysing dependencies;
* summarising value, cost, and risk;
* proposing MVP boundaries;
* detecting scope creep;
* recommending priority;
* showing downstream impact;
* detecting missing success criteria.

AI must not:

* approve Product Decisions;
* modify Product Boundary autonomously;
* increase priority autonomously;
* place a capability into an authoritative roadmap;
* impersonate Product Authority;
* use model confidence as a substitute for human authority.

Inherited principle:

```text
AI recommends
Human decides
MDS records and enforces
```

---

# 25. Evidence and Audit

A Product Authority Decision must be traceable at minimum to:

```text
Authority Holder

Authority Assignment

Gate

Proposal / Object

Version

Decision

Timestamp

Relevant Product Inputs

Rationale when required by policy
```

For significant decisions, it should also be possible to trace:

```text
Problem
Expected Value
Product Boundary
Dependencies
Risk
```

---

# 26. Type-Specific Invariants

Product Authority inherits all general invariants from
`authority-model.md`.

The following additional invariants apply.

### PRODUCT-AUTH-INV-001

A Stakeholder Request does not automatically become a Product Decision.

### PRODUCT-AUTH-INV-002

Product Approval does not automatically create Business Approval.

### PRODUCT-AUTH-INV-003

Product Approval does not automatically create Architecture Approval.

### PRODUCT-AUTH-INV-004

Product Approval does not automatically authorise implementation or release.

### PRODUCT-AUTH-INV-005

Product Authority must not be used to decide matters outside the product-level
decision domain.

### PRODUCT-AUTH-INV-006

Product priority must be a governed decision where the applicable workflow
requires authority approval.

### PRODUCT-AUTH-INV-007

Changes to Product Boundary must preserve rationale and decision provenance.

### PRODUCT-AUTH-INV-008

A Deferred Product Proposal must not be represented as Approved or Rejected.

### PRODUCT-AUTH-INV-009

Approval of a Product Hypothesis does not make the hypothesis a validated fact.

### PRODUCT-AUTH-INV-010

A new Product Decision that replaces an earlier decision must preserve
historical lineage.

---

# 27. Ownership Boundary

This file owns the type-specific semantics of:

```text
product-authority
```

It inherits general authority semantics from:

```text
authority-model.md
```

It does not own:

```text
Product professional responsibility
→ ../roles/product-management/

External Actor semantics
→ ../actors/

Business Authority
→ ./business-authority.md

Architecture Authority
→ ./architecture-authority.md

Release Authority
→ ./release-authority.md

Artifact lifecycle
→ ../standards/artifact_truth.md

Schemas
→ ../schemas/

Workflow behaviour
→ applicable workflow boundary

AI prompts
→ ../prompts/
```

Principle:

> Product Authority owns the right to make governed product-level decisions.
> It does not own the entire process used to produce a Product Proposal.

---

# 28. Extension Principle

Do not expand Product Authority merely because a decision is indirectly related
to the product.

If the decision domain actually belongs to:

* business;
* architecture;
* release;
* or another governed authority;

it must be routed to the appropriate authority.

Principle:

> **Product Authority decides what the product should pursue. It does not
> decide everything required to build, verify, operate, or release it.**
