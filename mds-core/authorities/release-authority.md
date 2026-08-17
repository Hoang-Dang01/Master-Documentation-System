---

ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
authority_type: release-authority
classification: approval_authority
model_ref: ./authority-model.md
registry_ref: ./authority-registry.yaml
update_strategy: change only through the applicable human approval gate
---

# Release Authority

## 1. Purpose

`Release Authority` is the Human Approval Authority responsible for governed
decisions about whether a defined release is permitted to proceed to its
target release state or environment.

This authority exists to answer questions such as:

```text
Is this release ready to proceed?

Is the available evidence sufficient?

Are known risks acceptable for this release?

Are required upstream approvals satisfied?

Are verification and operational readiness conditions met?

Should the release proceed, be deferred, rejected, or returned for more work?
```

`Release Authority` inherits all general authority semantics and invariants
from `authority-model.md`.

This file defines only the decision domain specific to Release Authority.

---

# 2. Decision Domain

Release Authority owns governed decisions concerning **release readiness and
release permission**.

Typical decision concerns include:

* release readiness;
* release scope;
* release candidate acceptance;
* required evidence completeness;
* unresolved defect visibility;
* known release risk;
* verification readiness;
* operational readiness;
* rollback or recovery readiness;
* required upstream approval status;
* release constraint compliance;
* release deferment;
* release rejection;
* release supersession where applicable.

Release Authority does not automatically own:

* product direction;
* business meaning;
* architecture direction;
* implementation;
* test execution;
* deployment execution;
* runtime operation.

---

# 3. Release Authority is not DevOps / SRE Responsibility

MDS must distinguish:

```text
DevOps / SRE Responsibility
≠
Release Authority
```

DevOps / SRE may be responsible for:

* delivery pipeline design;
* deployment preparation;
* environment readiness;
* observability preparation;
* rollback mechanisms;
* operational procedures;
* infrastructure evidence;
* deployment execution.

Release Authority is responsible for:

> Making the governed human decision that determines whether a release may
> proceed through the applicable release gate.

Conceptual flow:

```text
Implementation
      ↓
Verification
      ↓
Operational Preparation
      ↓
Release Evidence
      ↓
Release Approval Gate
      ↓
Release Authority
      ↓
Governed Release Decision
```

One human may hold both DevOps / SRE responsibility and Release Authority.

The classifications must remain independent.

---

# 4. Release Authority is not Quality Assurance

MDS must also distinguish:

```text
Quality Assurance
≠
Release Authority
```

Quality Assurance is responsible for activities such as:

* defining verification strategy;
* defining test coverage;
* validating acceptance criteria;
* executing or coordinating verification;
* reporting defects;
* producing verification evidence;
* assessing observed quality.

Release Authority consumes verification evidence.

It does not replace QA.

Conceptually:

```text
QA
→ "Here is what was verified and what remains."

Release Authority
→ "Given the total evidence and applicable policy, may this release proceed?"
```

A QA PASS does not automatically create Release Approval.

A QA FAIL does not necessarily define the entire release decision semantics
unless release policy explicitly requires it.

---

# 5. Release Object

A release decision must apply to a clearly identifiable release object.

The release object should be traceable to information such as:

* release identifier;
* release version;
* release candidate;
* implementation baseline;
* included change set;
* target environment or release target;
* relevant specifications;
* relevant verification evidence.

Release Authority must not approve an ambiguous object such as:

```text
"the latest code"
```

without a stable identifiable release context.

---

# 6. Release Scope

Release scope defines what is actually being considered for release.

Conceptually:

```text
Release
│
├── included changes
├── excluded changes
├── implementation baseline
├── target
└── known limitations
```

Release Authority must evaluate the defined scope.

Approval of Release A does not automatically approve:

* unrelated changes;
* a later release candidate;
* a different environment;
* a materially changed implementation baseline.

---

# 7. Release Approval Gate

A Release Approval Gate is the governed point where available evidence is
evaluated before the release may proceed.

Conceptually:

```text
Release Candidate
       ↓
Evidence Collection
       ↓
Readiness Assessment
       ↓
──────────────────────
 RELEASE APPROVAL GATE
──────────────────────
       ↓
Release Authority
       ↓
Decision
```

The exact release gate contract belongs to the applicable workflow or
governance standard.

---

# 8. Required Release Evidence

A release gate may require evidence from multiple concerns.

Typical evidence may include:

```text
Implementation Evidence

Verification Evidence

Requirement Traceability

Known Defects

Known Risks

Architecture Conformance

Security Findings

Build Evidence

Deployment Readiness

Rollback / Recovery Readiness

Operational Readiness

Change Summary
```

Not every release requires every evidence type.

The applicable release policy defines the required evidence.

---

# 9. Evidence is not Authority

MDS must distinguish:

```text
Evidence
≠
Decision
```

For example:

```text
Tests passed
```

is evidence.

It is not automatically:

```text
RELEASE APPROVED
```

Similarly:

```text
Build succeeded
```

does not itself grant release permission.

Conceptually:

```text
Evidence
   ↓
Release Assessment
   ↓
Human Gate
   ↓
Release Authority
   ↓
Release Decision
```

Automation may produce evidence.

Automation may not silently convert evidence into Human Approval Authority.

---

# 10. Release Approval

`APPROVE` means:

> The Release Authority accepts that the identified release satisfies the
> applicable release gate conditions and is permitted to proceed within the
> scope of that gate.

Release approval may permit:

```text
Release Candidate
      ↓
Approved for target release action
```

Release Approval does not mean:

* the software is defect-free;
* all risks are eliminated;
* future runtime behaviour is guaranteed;
* every implementation decision is correct;
* architecture conformance is permanently proven.

It means the release is accepted under the evidence, constraints, and risk
conditions applicable at the decision time.

---

# 11. Release Rejection

`REJECT` means:

> The identified release is not permitted to proceed through the applicable
> release gate.

Possible reasons may include:

* failed mandatory verification;
* missing required evidence;
* unacceptable risk;
* unresolved critical defect;
* invalid release scope;
* missing upstream approval;
* incompatible release candidate;
* inadequate rollback readiness;
* governance violation.

Rejection must preserve the rejected release candidate and decision provenance.

---

# 12. Return for Clarification

`RETURN_FOR_CLARIFICATION` may be used when the release cannot yet be decided
because information is incomplete or inconsistent.

Examples:

```text
Verification result is unclear

Release scope is ambiguous

Risk ownership is unresolved

Evidence refers to different implementation versions

Required approval cannot be confirmed
```

Conceptually:

```text
Release Candidate
      ↓
Release Gate
      ↓
RETURN_FOR_CLARIFICATION
      ↓
Missing Information / Analysis
      ↓
Release Gate again
```

This is not the same as rejection.

---

# 13. Defer

`DEFER` means the release decision is intentionally postponed.

Possible reasons include:

* external dependency;
* timing constraint;
* maintenance window;
* unresolved lower-severity risk;
* additional observation required;
* operational readiness incomplete;
* another release must occur first.

Deferred release must not be represented as Approved.

Where applicable, deferment should preserve:

* reason;
* dependency;
* revisit condition;
* expected review point.

---

# 14. Upstream Approval Dependencies

A release may depend on governed decisions from other authority domains.

For example:

```text
Product Decision
Business Decision
Architecture Decision
        ↓
Implementation
        ↓
Verification
        ↓
Release Gate
```

Release Authority does not replace these authorities.

If release policy requires an upstream approval, Release Authority must not
silently override its absence.

---

# 15. Release Authority and Product Authority

Product Authority decides:

```text
What should the product pursue?
```

Release Authority decides:

```text
Is this identified implementation ready and permitted to be released?
```

Therefore:

```text
Product Approval
≠
Release Approval
```

A capability may be approved at product level while its implementation is not
yet ready for release.

---

# 16. Release Authority and Business Authority

Business Authority establishes authoritative business meaning.

Release Authority evaluates whether the release has sufficient evidence to
proceed.

Release Authority must not change a business requirement merely to allow a
release.

If implementation does not satisfy approved business truth:

```text
Mismatch
   ↓
Impact / Verification Evidence
   ↓
Governed correction or upstream reconsideration
```

The release gate must not silently rewrite Business Truth.

---

# 17. Release Authority and Architecture Authority

Architecture Authority establishes authoritative technical direction.

Release Authority may consume architecture conformance evidence when required.

Conceptually:

```text
Architecture Decision
        ↓
Implementation
        ↓
Conformance Evidence
        ↓
Release Assessment
```

Release Authority does not automatically have the right to waive architecture
decisions.

Any architecture exception must follow the applicable architecture governance
path.

---

# 18. Release Authority and Security

Security evidence may be required by release policy.

Examples include:

* unresolved vulnerabilities;
* security review result;
* security exception;
* risk assessment;
* required mitigation.

Release Authority may evaluate security evidence as part of release readiness.

It does not automatically replace any independently required security decision
or approval.

If governance requires a separate security gate:

```text
Security Decision
+
Release Decision
```

must remain distinguishable.

---

# 19. Release Authority and Implementation Plane

Release Authority does not perform implementation.

It also does not directly execute deployment.

Conceptually:

```text
Release Authority
      ↓
Release Permission
      ↓
Implementation / Delivery Plane
      ↓
Deployment Action
```

Therefore:

```text
Release Approval
≠
Deployment Execution
```

The external implementation and delivery plane is responsible for carrying out
the authorised action.

---

# 20. Release Authority and Runtime

Production or another runtime environment may provide evidence such as:

* health checks;
* telemetry;
* incidents;
* deployment observations;
* rollback evidence;
* operational state.

Runtime is an evidence environment.

It is not an authority.

```text
Runtime Evidence
      ↓
Human / Professional Assessment
      ↓
Applicable Authority Decision
```

---

# 21. Verification Evidence

Release Authority should be able to understand:

```text
What was verified?

Against which specification?

On which implementation version?

What passed?

What failed?

What was not tested?

What remains unknown?
```

A simple label such as:

```text
QA: PASS
```

should not be the only available information when the underlying evidence
matters to the release decision.

---

# 22. Evidence Correlation

Release evidence should refer to the same identifiable release context.

MDS should detect cases such as:

```text
Build evidence
→ Version A

Test evidence
→ Version B

Release candidate
→ Version C
```

Such evidence must not be silently treated as coherent.

Conceptually:

```text
Release Candidate
      ↓
Correlated Evidence Set
      ↓
Release Gate
```

Evidence correlation may be performed by MDS system capabilities.

The final release decision remains human.

---

# 23. Known Defects

A release may contain known defects.

The existence of a defect does not automatically define the release decision
unless release policy says so.

Release Authority should be able to review:

* defect severity;
* affected scope;
* workaround;
* impact;
* verification status;
* accepted risk;
* relevant authority or owner.

Approval must not cause known defects to disappear from Project Truth.

---

# 24. Known Risk

Release Authority may accept known release risk only within the limits of its
assigned authority and applicable policy.

Conceptually:

```text
Known Risk
    ↓
Assessment
    ↓
Release Gate
    ↓
ACCEPT / REJECT / DEFER
```

Risk acceptance must be distinguishable from risk absence.

```text
KNOWN AND ACCEPTED
≠
NO RISK
```

Where another authority is required to accept a specific class of risk,
Release Authority cannot replace that authority.

---

# 25. Rollback and Recovery Readiness

Release policy may require evidence that the release can be safely reversed or
recovered.

Possible evidence includes:

* rollback procedure;
* backup readiness;
* migration recovery plan;
* configuration reversal;
* operational recovery steps;
* known irreversible actions.

Release Authority does not design these mechanisms.

It evaluates their readiness when they are part of the release gate contract.

---

# 26. Data Migration

A release involving significant data migration may require additional evidence.

Examples include:

* migration plan;
* compatibility expectations;
* backup evidence;
* rollback limitations;
* verification method;
* integrity checks;
* irreversible transformation risk.

Release approval must not hide irreversible consequences.

If the migration creates architecture or business conflicts, the corresponding
authority paths remain applicable.

---

# 27. Operational Readiness

A release may be technically correct but operationally unready.

Release policy may consider evidence such as:

* monitoring readiness;
* alerting readiness;
* runbook availability;
* support readiness;
* operational dependencies;
* capacity readiness;
* recovery procedures.

This separates:

```text
"It works"
```

from:

```text
"It is ready to operate."
```

---

# 28. Release Baseline

A release decision must be bound to an identifiable baseline.

Conceptually:

```text
Release Decision
      │
      ├── release ID
      ├── version
      ├── implementation baseline
      ├── evidence set
      └── target
```

If the baseline materially changes after approval, the existing approval must
not automatically apply to the new baseline.

The applicable policy determines whether re-approval is required.

---

# 29. Change After Approval

Suppose:

```text
Release Candidate A
→ APPROVED
```

and implementation changes afterward.

MDS must not assume:

```text
Release Candidate B
→ also APPROVED
```

The changed release must be assessed according to the applicable release
policy.

Principle:

> Approval belongs to the governed release object that was actually reviewed.

---

# 30. Release Supersession

A later release decision may replace an earlier planned release or release
candidate.

Historical lineage must remain available.

Conceptually:

```text
Release Candidate v1
      ↓
Decision
      ↓
New Candidate v2
      ↓
New Decision
```

Older decisions must not be overwritten.

The exact artifact lifecycle semantics belong to the Artifact Truth Standard.

---

# 31. Emergency Release

Some governance models may support expedited or emergency release paths.

An emergency release path must not mean:

```text
No governance
```

Instead it may mean:

```text
Reduced / alternative gate contract
+
Explicit human authority
+
Mandatory audit trail
```

When used, MDS should preserve:

* why emergency processing was required;
* which normal conditions were bypassed;
* who authorised it;
* known risk;
* required follow-up work.

Emergency release semantics must be defined by an explicit policy before use.

---

# 32. Release Failure

Release Approval does not guarantee successful deployment or runtime outcome.

Conceptually:

```text
Release Approved
      ↓
Deployment
      ↓
Runtime
      ↓
Success or Failure
```

If release execution fails, runtime evidence may trigger:

* rollback;
* incident handling;
* investigation;
* follow-up verification;
* new release preparation.

The original Release Decision remains historical evidence of what was known at
decision time.

---

# 33. Release Outcome Feedback

Post-release evidence may reveal that release assumptions were incorrect.

Examples:

* unexpected runtime failure;
* performance regression;
* operational incident;
* hidden incompatibility;
* user-impacting defect.

This evidence should feed back into Project Truth and relevant professional
responsibilities.

It must not retroactively rewrite the historical release decision.

Instead:

```text
Past Decision
+
New Evidence
→ Future Analysis / Decision
```

---

# 34. Multiple Release Authorities

A project may contain multiple Release Authority holders.

For example, assignments may differ by:

* product;
* system;
* environment;
* release class;
* organisational scope;
* risk level.

This does not automatically require new Authority Types.

Prefer:

```text
release-authority
+
scoped Authority Assignment
```

before creating classifications such as:

```text
Production Release Authority
Mobile Release Authority
Backend Release Authority
Emergency Release Authority
```

unless their governance semantics are genuinely different.

---

# 35. Cross-Scope Release

Some releases may span multiple authority scopes.

Such releases may require:

* multiple release approvals;
* joint approval;
* higher-scope approval;
* escalation.

MDS must not assume one scoped holder can approve unrelated release domains.

The applicable policy defines quorum and precedence.

---

# 36. Self-Approval

Release Authority inherits self-approval semantics from `authority-model.md`.

MDS does not globally assume that:

```text
Developer cannot approve release
```

or:

```text
Developer may always approve release
```

The gate policy determines the required separation of duties.

A small personal project may use a single human across several responsibilities
and authorities.

A stricter governance model may require independent approval.

The canonical authority model supports both.

---

# 37. AI Assistance

AI may support Release Authority by:

* summarising release scope;
* correlating evidence;
* comparing release candidates;
* identifying missing evidence;
* checking required upstream approvals;
* summarising verification results;
* highlighting known defects;
* summarising known risks;
* detecting evidence-version mismatch;
* checking rollback readiness;
* surfacing unresolved blockers;
* showing impact;
* generating clarification questions;
* proposing a release recommendation.

AI must not:

* appoint itself Release Authority;
* silently approve a release;
* treat a successful build as approval;
* treat passing tests as approval;
* hide failed or missing evidence;
* reinterpret a different implementation baseline as the approved one;
* invent missing release evidence;
* accept risk on behalf of a human authority;
* bypass a required human gate.

Inherited principle:

```text
AI gathers, correlates, and recommends
Human Authority decides
MDS records and enforces
```

---

# 38. Release Decision Record

A governed Release Decision should be auditable.

At minimum MDS should be able to determine:

```text
Authority Holder

Authority Assignment

Release Gate

Release Identifier

Release Version / Candidate

Implementation Baseline

Target

Decision

Timestamp

Relevant Evidence

Known Risk

Known Defects

Rationale when required
```

For high-impact releases, it should also be possible to identify:

```text
Required Upstream Approvals

Verification Summary

Architecture Conformance

Security Evidence

Rollback / Recovery Readiness

Operational Readiness
```

The persistence structure belongs to `schemas/`.

---

# 39. Type-specific Invariants

Release Authority inherits all invariants from `authority-model.md`.

The following additional invariants apply.

### RELEASE-AUTH-INV-001

Implementation completion does not automatically create Release Approval.

### RELEASE-AUTH-INV-002

Successful build, verification, or deployment evidence does not itself hold
Human Release Authority.

### RELEASE-AUTH-INV-003

Release Authority may only decide within its assigned release scope.

### RELEASE-AUTH-INV-004

Release Approval applies only to the governed release object and baseline that
were reviewed.

### RELEASE-AUTH-INV-005

A materially changed release candidate must not silently inherit prior Release
Approval.

### RELEASE-AUTH-INV-006

Release Authority must not silently override required Product, Business,
Architecture, Security, or other governed decisions.

### RELEASE-AUTH-INV-007

Known defects and risks must remain visible after Release Approval.

### RELEASE-AUTH-INV-008

Release Approval does not guarantee successful deployment or runtime outcome.

### RELEASE-AUTH-INV-009

Evidence from different incompatible baselines must not be silently treated as
one coherent release evidence set.

### RELEASE-AUTH-INV-010

Emergency release paths must remain explicit, human-authorised, and auditable.

### RELEASE-AUTH-INV-011

Runtime evidence does not retroactively rewrite historical Release Decisions.

### RELEASE-AUTH-INV-012

Release execution belongs to the implementation/delivery plane, not to Release
Authority semantics.

---

# 40. Ownership Boundary

This file owns the type-specific semantics of:

```text
release-authority
```

It inherits general authority semantics from:

```text
authority-model.md
```

It does not own:

```text
DevOps / SRE professional responsibility
→ ../roles/devops-sre/

Quality Assurance responsibility
→ ../roles/quality-assurance/

Product Authority
→ ./product-authority.md

Business Authority
→ ./business-authority.md

Architecture Authority
→ ./architecture-authority.md

Artifact lifecycle
→ ../standards/artifact_truth.md

Implementation and deployment execution
→ ../implementation-plane/

Production/runtime evidence
→ ../runtime/

Schemas
→ ../schemas/

AI prompts
→ ../prompts/
```

Principle:

> Release Authority owns the human decision that a governed release may
> proceed. It does not own implementation, verification, deployment execution,
> or runtime operation.

---

# 41. Extension Principle

Do not create a new Release Authority Type for every environment, team,
application layer, or release mechanism.

Prefer:

```text
Release Authority
+
scoped Authority Assignment
+
gate policy
```

unless a genuinely different governance semantic requires a distinct authority
type.

Principle:

> **Release Authority models the right to permit a defined release based on
> governed evidence, not the mechanics used to deploy that release.**
