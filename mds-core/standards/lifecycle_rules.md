---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: lifecycle_standard
update_strategy: change only through the applicable governed approval process
---

# MDS Lifecycle and Execution State Standard

## 1. Purpose

This standard defines the canonical semantics and transition rules for two
independent artifact state axes:

```text
Lifecycle State

Execution State
```

This standard does not define Artifact Truth validity.

Validity and Current Project Truth semantics belong to:

```text
./artifact_truth.md
```

MDS must preserve:

```text
Lifecycle State
≠
Validity State
≠
Execution State
```

No state axis silently determines another.

---

## 2. Canonical Ownership

This standard owns:

```text
Lifecycle State vocabulary

Lifecycle State semantics

Lifecycle transition rules

Execution State vocabulary

Execution State semantics

Execution transition rules

cross-axis separation rules
```

This standard does not own:

```text
Artifact Truth validity
→ ./artifact_truth.md

Current Project Truth
→ ./artifact_truth.md

Version lineage
→ ./artifact_truth.md

Version-number syntax
→ ./versioning_rules.md

Human Approval Authority
→ ../authorities/

Professional Responsibilities
→ ../roles/

Implementation execution
→ ../implementation-plane/

Runtime state
→ ../runtime/

structured persistence shape
→ ../schemas/
```

---

## 3. Three Independent State Axes

MDS artifacts may participate in three different state dimensions.

```text
Lifecycle
→ How mature is the governed content?

Validity
→ Is the artifact still trustworthy against current governed knowledge?

Execution
→ What is the operational progress associated with the artifact?
```

Conceptually:

```text
Artifact
├── lifecycle_state
├── validity_state
└── execution_state
```

These axes answer different questions.

They must not be collapsed into one generic `status` field where doing so would
destroy their semantic distinction.

---

## 4. Lifecycle State

Lifecycle State represents the maturity and governed approval condition of an
artifact version.

The canonical Lifecycle States are:

```text
DRAFT

REVIEW

APPROVED

DEPRECATED

ARCHIVED
```

Lifecycle State does not determine whether the artifact is currently valid.

For example:

```text
lifecycle_state: APPROVED
validity_state: NEEDS_REVIEW
```

is a valid conceptual combination.

Likewise:

```text
lifecycle_state: APPROVED
validity_state: STALE
```

may exist when previously approved knowledge is known no longer to represent
current governed upstream knowledge.

Validity semantics belong to:

```text
./artifact_truth.md
```

---

## 5. DRAFT

`DRAFT` means:

> The artifact version is under active development and has not passed the
> applicable governed approval gate.

A Draft may be:

```text
created

edited

expanded

corrected

restructured

prepared for review
```

subject to the applicable artifact and governance rules.

A Draft is not authoritative Project Truth.

MDS must preserve:

```text
DRAFT
≠
APPROVED

DRAFT
≠
CURRENT PROJECT TRUTH
```

A Draft may still contain useful project knowledge.

That knowledge must remain clearly identified as non-authoritative where
authority matters.

---

## 6. REVIEW

`REVIEW` means:

> The artifact version has been submitted for an applicable governed review and
> is awaiting a valid review outcome.

A Review artifact should be treated as a review candidate.

It must not automatically be treated as approved.

MDS must preserve:

```text
REVIEW
≠
APPROVED
```

While an artifact is in Review, changes that materially alter the reviewed
content should follow the applicable review policy.

Where material revision invalidates the current review basis, the artifact
should return to:

```text
DRAFT
```

and be submitted again.

The exact review workflow may be constrained by the applicable artifact,
standard, or gate contract.

---

## 7. APPROVED

`APPROVED` means:

> The artifact version has passed the applicable governed approval gate and the
> corresponding approval decision has taken effect.

Approval must be backed by valid governance provenance where required.

MDS must preserve:

```text
APPROVED
≠
CURRENT
```

An approved artifact may later become:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

without losing the historical fact that it was approved.

Validity semantics belong to:

```text
./artifact_truth.md
```

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 8. Approved Artifact Immutability

An approved artifact version is read-only with respect to material content.

MDS must preserve:

```text
Approved Version
+
Material Change
      ↓
New Version
```

not:

```text
Approved Version
      ↓
Silent In-Place Rewrite
```

A material change creates a new Draft version under the applicable lineage
rules.

Version lineage semantics belong to:

```text
./artifact_truth.md
```

Version-number semantics belong to:

```text
./versioning_rules.md
```

---

## 9. DEPRECATED

`DEPRECATED` means:

> The artifact version remains preserved as historical governed knowledge but
> must no longer act as the active approved lineage head.

Deprecation preserves:

```text
historical content

approval provenance

relationships

lineage

decision evidence

change rationale
```

Deprecation must not erase history.

A Deprecated artifact is excluded from Current Project Truth.

Detailed truth treatment belongs to:

```text
./artifact_truth.md
```

---

## 10. ARCHIVED

`ARCHIVED` means:

> The artifact version is retained for historical, audit, rollback, or
> reference purposes and is no longer an active lifecycle participant.

Archived artifacts are read-only.

MDS must preserve their historical provenance where required.

`ARCHIVED` must not be used as a substitute for deletion merely to hide
unresolved history.

Archived artifacts do not belong to Current Project Truth.

---

## 11. Canonical Lifecycle Flow

The normal lifecycle path is:

```text
DRAFT
  ↓
REVIEW
  ↓
APPROVED
  ↓
DEPRECATED
  ↓
ARCHIVED
```

However, review may return an artifact for revision:

```text
DRAFT
  ↓
REVIEW
  ↓
DRAFT
```

Conceptually:

```text
DRAFT ──────────────► REVIEW
  ▲                     │
  │                     │ revision required
  └─────────────────────┘
                        │
                        │ valid governed approval
                        ▼
                    APPROVED
                        │
                        │ superseded / retired
                        ▼
                   DEPRECATED
                        │
                        │ historical archival
                        ▼
                    ARCHIVED
```

This is a lifecycle model.

It is not a mandatory project waterfall.

---

## 12. Lifecycle Transition: DRAFT → REVIEW

A transition from:

```text
DRAFT
→
REVIEW
```

means that the artifact version is being submitted for governed review.

The applicable review contract may require:

```text
required fields

required source references

required relationships

required validation results

required evidence

required professional analysis
```

A Validator may check those requirements.

Validation success does not itself perform Human Approval.

MDS must preserve:

```text
Ready for Review
≠
Approved
```

---

## 13. Lifecycle Transition: REVIEW → DRAFT

A transition from:

```text
REVIEW
→
DRAFT
```

means that the artifact requires further authoring or material revision before
another governed review attempt.

Possible reasons may include:

```text
missing information

ambiguity

inconsistent evidence

requested revision

invalid assumptions

incomplete analysis

failed required validation
```

The reason should remain traceable where governance requires it.

Returning to Draft is not equivalent to deleting the prior review history.

---

## 14. Lifecycle Transition: REVIEW → APPROVED

A transition from:

```text
REVIEW
→
APPROVED
```

requires the applicable governed approval decision.

Conceptually:

```text
Review Candidate
      ↓
Required Analysis / Evidence
      ↓
Governed Gate
      ↓
Applicable Human Approval Authority
      ↓
APPROVE
      ↓
APPROVED
```

A Professional Responsibility may prepare or review the artifact.

An MDS System Capability may validate or route it.

Neither classification automatically holds Human Approval Authority.

Human Approval Authority is defined by:

```text
../authorities/
```

---

## 15. Rejection is a Decision, not a Lifecycle State

MDS does not define:

```text
REJECTED
```

as a canonical Lifecycle State in this standard.

`REJECT` is a governed decision outcome.

Human Authority decision semantics belong to:

```text
../authorities/
```

After rejection, the applicable gate contract determines the resulting
lifecycle treatment.

For example, governance may require that the candidate:

```text
returns to DRAFT

remains preserved as a rejected REVIEW candidate

or is otherwise closed through an applicable governed rule
```

The rejection decision and its evidence must remain traceable.

MDS must not invent a Lifecycle State merely because a decision result exists.

---

## 16. Return for Clarification is not a Lifecycle State

Likewise:

```text
RETURN_FOR_CLARIFICATION
```

is a governed authority decision, not a canonical Lifecycle State.

The applicable gate may cause the artifact to return to:

```text
DRAFT
```

or another permitted state according to the applicable governance contract.

MDS must preserve:

```text
Decision Type
≠
Lifecycle State
```

---

## 17. Lifecycle Transition: APPROVED → DEPRECATED

An Approved version may become Deprecated when it is superseded or otherwise
retired through an applicable governed transition.

For version succession, MDS must preserve the invariant:

```text
New Approved Successor
+
Former Approved Head Deprecation
=
One Governed Lineage Transition
```

Detailed lineage semantics belong to:

```text
./artifact_truth.md
```

MDS must not create multiple active non-deprecated Approved heads in the same
lineage where the Artifact Truth Standard prohibits it.

---

## 18. Lifecycle Transition: DEPRECATED → ARCHIVED

A Deprecated artifact may become Archived when the applicable retention or
governance process determines that it no longer needs to remain an active
historical lifecycle object.

Archival must retain the evidence necessary for:

```text
audit

lineage

historical reconstruction

rollback analysis

traceability
```

where applicable.

Archival must not rewrite prior approval or deprecation history.

---

## 19. Lifecycle Transition Integrity

MDS must reject or flag invalid lifecycle transitions.

Canonical transitions defined by this standard are:

```text
DRAFT
→ REVIEW

REVIEW
→ DRAFT

REVIEW
→ APPROVED

APPROVED
→ DEPRECATED

DEPRECATED
→ ARCHIVED
```

Additional artifact-specific transition behaviour may only be introduced by an
applicable canonical contract without contradicting this standard.

A Prompt, Guide, Template, Example, AI output, or UI action must not silently
create a new canonical Lifecycle State or transition.

---

## 20. Lifecycle Transition Provenance

Governed lifecycle transitions should preserve sufficient provenance.

Where applicable, MDS should be able to determine:

```text
artifact identity

artifact version

previous lifecycle state

new lifecycle state

transition time

transition reason

governed gate

authority decision reference

evidence references

applicable rule or contract
```

The concrete persistence structure belongs to:

```text
../schemas/
```

---

## 21. Lifecycle and Human Approval Authority

Lifecycle State does not define who may approve.

This standard must not contain logic such as:

```text
PM approves

BA approves

SA approves

Architect approves

QA approves

DevOps approves
```

because Professional Responsibility and Human Approval Authority are different
classifications.

MDS must preserve:

```text
Professional Responsibility
≠
Human Approval Authority
```

The applicable gate determines the required Authority Type.

Project governance determines the current human holder of that authority.

Authority semantics belong to:

```text
../authorities/
```

---

## 22. Lifecycle and AI

AI may assist lifecycle processing by:

```text
checking readiness

detecting missing information

summarising review context

identifying conflicts

preparing evidence

recommending a next state

explaining transition blockers
```

AI must not autonomously perform a Human Approval decision.

MDS must preserve:

```text
AI Recommendation
≠
Governed Approval

AI Confidence
≠
Lifecycle Authority
```

An AI recommendation may inform a governed transition.

It does not itself authorize the transition where Human Approval is required.

---

## 23. Lifecycle and MDS System Capabilities

MDS System Capabilities may interact with lifecycle state.

For example:

```text
Orchestrator
→ identifies the applicable next governed activity

Validator
→ checks transition prerequisites

Knowledge Curator
→ maintains structural consistency and provenance

Context Builder
→ prepares review or decision context
```

MDS must preserve:

```text
Routing
≠
Approval

Validation
≠
Approval

Knowledge Curation
≠
Approval

Context Construction
≠
Approval
```

System Capability semantics belong to:

```text
../system-capabilities/
```

---

# Execution State

## 24. Execution State Purpose

Execution State represents operational progress associated with an artifact.

It answers:

> What is the current progress of the governed work represented or tracked by
> this artifact?

Execution State does not answer:

```text
Is this artifact approved?

Is this artifact currently valid?

Is this artifact authoritative?

Has Human Approval occurred?
```

Those are separate concerns.

---

## 25. Canonical Execution States

The canonical Execution States are:

```text
NOT_STARTED

IN_PROGRESS

BLOCKED

COMPLETED

NOT_APPLICABLE
```

Execution State should only be used where operational progress is meaningful.

Artifacts without meaningful execution progress should use:

```text
NOT_APPLICABLE
```

where the applicable schema requires an explicit value.

---

## 26. NOT_STARTED

`NOT_STARTED` means:

> The applicable execution work has not begun.

It does not imply that the artifact is Draft.

For example, an Approved specification may legitimately have:

```text
lifecycle_state: APPROVED
execution_state: NOT_STARTED
```

Likewise, `NOT_STARTED` does not determine validity.

---

## 27. IN_PROGRESS

`IN_PROGRESS` means:

> The applicable execution work has begun and has not yet reached its defined
> completion condition.

Execution work may occur in the external Implementation Plane or another
applicable execution context.

This state does not imply successful implementation or verification.

MDS must preserve:

```text
IN_PROGRESS
≠
CONFORMS
```

---

## 28. BLOCKED

`BLOCKED` means:

> The applicable execution work cannot currently proceed because a traceable
> dependency, prerequisite, decision, evidence gap, or external condition is
> unresolved.

A blocked state should preserve a reason where applicable.

Conceptually:

```text
execution_state: BLOCKED
blocked_reason: <traceable reason>
```

Where possible, the blocker should reference the actual dependency or governed
condition rather than only free text.

Blocked execution does not change Artifact Truth automatically.

---

## 29. COMPLETED

`COMPLETED` means:

> The defined execution work has reached its applicable completion condition.

MDS must preserve:

```text
COMPLETED
≠
APPROVED

COMPLETED
≠
CURRENT

COMPLETED
≠
VERIFIED

COMPLETED
≠
RELEASED
```

Completion only describes the execution dimension.

Other governed processes determine:

```text
verification

conformance

approval

release readiness

runtime success
```

---

## 30. NOT_APPLICABLE

`NOT_APPLICABLE` means:

> Execution State is not meaningful for this artifact or governed object.

MDS must not force artificial execution progress onto knowledge that does not
represent executable or trackable work.

`NOT_APPLICABLE` is not equivalent to:

```text
NOT_STARTED
```

The distinction is:

```text
NOT_STARTED
→ execution applies, but has not begun

NOT_APPLICABLE
→ execution does not meaningfully apply
```

---

## 31. Canonical Execution Flow

The normal execution flow is:

```text
NOT_STARTED
      ↓
IN_PROGRESS
      ↓
COMPLETED
```

Execution may become blocked before or during work:

```text
NOT_STARTED
      ↓
BLOCKED
      ↓
IN_PROGRESS
```

or:

```text
IN_PROGRESS
      ↓
BLOCKED
      ↓
IN_PROGRESS
```

Conceptually:

```text
              ┌─────────── BLOCKED ◄───────────┐
              │                │               │
              │                ▼               │
NOT_STARTED ──┴──────────► IN_PROGRESS ────────┴──► COMPLETED
```

`NOT_APPLICABLE` exists outside this progress flow.

---

## 32. Canonical Execution Transitions

Canonical execution transitions are:

```text
NOT_STARTED
→ IN_PROGRESS

NOT_STARTED
→ BLOCKED

IN_PROGRESS
→ BLOCKED

BLOCKED
→ IN_PROGRESS

IN_PROGRESS
→ COMPLETED
```

A blocked object may remain Blocked until its blocking condition is resolved.

`NOT_APPLICABLE` does not normally transition into an execution-progress state
unless the applicability classification itself is explicitly corrected or
changed through the applicable governed process.

---

## 33. Rework and Reopening

`COMPLETED` should not silently transition back to `IN_PROGRESS`.

If completed work requires rework, the applicable execution contract should
record that rework explicitly.

Depending on the governed object, this may involve:

```text
a new execution cycle

a new task

a successor artifact version

an explicit reopen record
```

MDS must preserve the historical fact that the earlier execution cycle reached
completion.

A UI toggle must not erase prior completion history.

---

## 34. Blocking Provenance

Where an artifact is `BLOCKED`, MDS should preserve sufficient blocker context.

Where applicable:

```text
blocker identity

blocker type

blocked since

blocking dependency

required resolution

evidence

owner of the unresolved work if applicable
```

Professional ownership does not imply Approval Authority.

The concrete blocker schema belongs to:

```text
../schemas/
```

---

## 35. Execution and the Implementation Plane

Execution State may reflect progress occurring in the external Implementation
Plane.

For example, MDS may consume evidence showing that external implementation work
is:

```text
not started

in progress

blocked

completed
```

However:

```text
Execution Tracking
≠
Implementation Authority
```

MDS System Capabilities do not gain permission to modify managed-project source
code merely because they track execution progress.

Implementation semantics belong to:

```text
../implementation-plane/
```

---

## 36. Execution Evidence

Execution State should be supported by evidence where the applicable workflow
requires reliable operational tracking.

Evidence may include:

```text
implementation evidence

verification evidence

workflow records

external execution records

completion records

dependency evidence
```

Evidence does not automatically determine authoritative Project Truth.

MDS must preserve:

```text
Evidence
≠
Approval
```

---

# Cross-Axis Rules

## 37. Lifecycle Does Not Imply Validity

MDS must preserve:

```text
APPROVED
≠
CURRENT
```

Possible conceptual combinations include:

```text
APPROVED + CURRENT

APPROVED + NEEDS_REVIEW

APPROVED + STALE

APPROVED + CONFLICTED
```

The exact truth treatment belongs to:

```text
./artifact_truth.md
```

---

## 38. Lifecycle Does Not Imply Execution

Examples of valid conceptual combinations include:

```text
APPROVED + NOT_STARTED

APPROVED + IN_PROGRESS

APPROVED + BLOCKED

APPROVED + COMPLETED

APPROVED + NOT_APPLICABLE
```

Whether a particular combination is allowed for a specific artifact type may be
restricted by its applicable schema or workflow contract.

The Lifecycle axis itself does not determine Execution State.

---

## 39. Execution Does Not Imply Lifecycle

MDS must preserve:

```text
COMPLETED
≠
APPROVED
```

Execution completion cannot be used as a shortcut around a required governed
approval gate.

Likewise:

```text
IN_PROGRESS
```

does not automatically mean:

```text
REVIEW
```

The axes remain independent.

---

## 40. Execution Does Not Imply Validity

MDS must preserve:

```text
COMPLETED
≠
CURRENT
```

Completed work may still correspond to:

```text
NEEDS_REVIEW

STALE

CONFLICTED
```

knowledge.

Operational completion cannot restore validity automatically.

---

## 41. Validity Does Not Rewrite Lifecycle History

A validity change does not erase historical lifecycle state.

For example:

```text
APPROVED + CURRENT
        ↓
upstream governed change
        ↓
APPROVED + NEEDS_REVIEW
```

The artifact remains historically Approved.

Only its current validity interpretation changes.

Validity semantics belong to:

```text
./artifact_truth.md
```

---

## 42. Deprecation and Execution

Deprecating an artifact does not automatically erase historical Execution
State.

If an artifact reached:

```text
COMPLETED
```

before later becoming:

```text
DEPRECATED
```

both facts may remain historically valid.

MDS must preserve historical state rather than overwrite one axis with another.

---

## 43. Archived State and Historical Evidence

Archival must preserve relevant historical Lifecycle, Validity, Execution,
decision, and evidence records where required.

MDS must not interpret:

```text
ARCHIVED
```

as:

```text
history no longer matters
```

Archived knowledge may remain necessary for:

```text
audit

rollback analysis

traceability

decision reconstruction

incident analysis
```

---

# Governance

## 44. State Transition Validation

The Validator may determine whether a requested transition satisfies applicable
machine-validatable rules.

It may produce results such as:

```text
PASS

FAIL

WARNING

UNKNOWN
```

Validation does not authorize a Human Approval transition.

MDS must preserve:

```text
Validation PASS
≠
APPROVAL
```

Validator semantics belong to:

```text
../system-capabilities/
```

---

## 45. Unknown State Information

MDS must not invent a Lifecycle or Execution State when available evidence is
insufficient.

If the current state cannot safely be established, MDS should preserve the
uncertainty through the applicable schema or system mechanism.

MDS must prefer:

```text
UNKNOWN
```

as an observation or validation result where appropriate rather than silently
inventing one of the canonical state values.

`UNKNOWN` is not introduced here as a canonical Lifecycle or Execution State.

It is an epistemic condition about unavailable or insufficient state
information.

---

## 46. Conflicting State Information

Different sources may disagree about an artifact's state.

MDS must not silently choose one based solely on:

```text
file age

source order

AI confidence

UI value

database cache
```

The conflict should be surfaced and resolved through the canonical ownership
and governance model.

Derived indexes must not override authoritative source records.

---

## 47. Derived State

Some state information may be derived from canonical records.

For example:

```text
Current Project Truth inclusion

transition readiness

blocked indicators

review-required indicators
```

Derived state must remain distinguishable from its authoritative source facts.

MDS should preserve the evidence and rules used to derive the result.

---

## 48. State and Project Truth Projection

Lifecycle State participates in Current Project Truth projection but does not
independently determine it.

Conceptually:

```text
Lifecycle
+
Validity
+
Lineage
+
Governed Decisions
      ↓
Artifact Truth Rules
      ↓
Current Project Truth Projection
```

The canonical projection rules belong to:

```text
./artifact_truth.md
```

This standard must not redefine that projection.

---

## 49. State and Context Packages

A Context Builder may include Lifecycle and Execution State in a bounded context
package.

However, it must follow Artifact Truth rules when deciding whether content is
authoritative.

MDS must preserve:

```text
lifecycle_state: APPROVED
```

alone as insufficient evidence that an artifact may be presented as Current
Project Truth.

Context Builder semantics belong to:

```text
../system-capabilities/
```

---

## 50. State and Runtime

Runtime operational state is a separate domain.

MDS must preserve:

```text
Artifact Execution State
≠
Runtime Health State
```

For example:

```text
execution_state: COMPLETED
```

does not imply:

```text
runtime health: HEALTHY
```

Runtime semantics belong to:

```text
../runtime/
```

---

## 51. State and Release

Execution completion does not grant Release Authority.

Likewise, Lifecycle Approval does not automatically grant release permission.

MDS must preserve:

```text
Artifact APPROVED
≠
Release Approved

Execution COMPLETED
≠
Release Approved
```

Release Authority belongs to:

```text
../authorities/
```

---

## 52. Prompts and State Transitions

Prompts may instruct AI to:

```text
inspect state

validate transition readiness

explain blockers

recommend a transition

prepare review context
```

Prompts must not redefine:

```text
canonical state vocabulary

canonical transition rules

Human Approval requirements
```

Prompts belong to:

```text
../prompts/
```

---

## 53. Templates and State Fields

Templates may expose:

```text
lifecycle_state

validity_state

execution_state
```

where applicable.

Templates do not own the semantics of those fields.

They consume:

```text
Lifecycle / Execution semantics
→ this standard

Validity semantics
→ ./artifact_truth.md

Structured field representation
→ ../schemas/
```

---

## 54. Guides and Workflow

Guides may describe recommended sequences involving Lifecycle or Execution
State.

A guide must not convert a recommended sequence into a universal mandatory
workflow unless an applicable canonical governance rule requires it.

MDS must preserve:

```text
Lifecycle State Machine
≠
Project Delivery Methodology
```

The lifecycle:

```text
DRAFT
→ REVIEW
→ APPROVED
```

does not require the entire project to operate as a waterfall.

---

## 55. General Invariants

### LIFECYCLE-INV-001

Lifecycle, Validity, and Execution are independent state axes.

### LIFECYCLE-INV-002

`APPROVED` does not imply `CURRENT`.

### LIFECYCLE-INV-003

`COMPLETED` does not imply authoritative content.

### LIFECYCLE-INV-004

A Draft is not authoritative Project Truth.

### LIFECYCLE-INV-005

A Review candidate is not Approved until the applicable governed approval
decision takes effect.

### LIFECYCLE-INV-006

A material change to an Approved artifact creates a new version rather than an
in-place rewrite.

### LIFECYCLE-INV-007

Professional Responsibility does not automatically grant Human Approval
Authority.

### LIFECYCLE-INV-008

AI does not hold Human Approval Authority.

### LIFECYCLE-INV-009

Validation PASS does not constitute Approval.

### LIFECYCLE-INV-010

Rejection and Return for Clarification are governed decision types, not
canonical Lifecycle States.

### LIFECYCLE-INV-011

Deprecation must preserve historical approval and lineage information.

### LIFECYCLE-INV-012

Archival must not erase required historical evidence.

### LIFECYCLE-INV-013

Execution State does not independently determine Lifecycle State.

### LIFECYCLE-INV-014

Execution State does not independently determine Validity State.

### LIFECYCLE-INV-015

Execution completion does not imply verification, release approval, or runtime
health.

### LIFECYCLE-INV-016

A System Capability may validate or route a transition but must not gain Human
Approval Authority from doing so.

### LIFECYCLE-INV-017

A Prompt, Guide, Template, Example, or UI action must not redefine canonical
Lifecycle or Execution semantics.

### LIFECYCLE-INV-018

State conflict or uncertainty must not be silently resolved through unsupported
assumption.

---

## 56. Relationship to Other Canonical Sources

```text
Lifecycle and Execution State
→ ./lifecycle_rules.md

Artifact Validity and Current Project Truth
→ ./artifact_truth.md

Version Numbering
→ ./versioning_rules.md

Relationship Semantics
→ ./relationship_rules.md

Naming
→ ./naming_convention.md

Human Approval Authority
→ ../authorities/

Professional Responsibilities
→ ../roles/

MDS System Capabilities
→ ../system-capabilities/

External Implementation
→ ../implementation-plane/

Runtime Evidence
→ ../runtime/

Structured Contracts
→ ../schemas/
```

Each concern must remain owned by its canonical source.

---

## 57. Source of Truth

This document is the canonical owner of:

```text
Lifecycle State vocabulary

Lifecycle State semantics

Lifecycle transition rules

Execution State vocabulary

Execution State semantics

Execution transition rules

Lifecycle / Execution separation rules
```

It is not the canonical owner of:

```text
Artifact validity

Current Project Truth

version lineage

version-number syntax

Human Approval Authority

Professional Responsibilities

implementation execution

Runtime state

schema structure
```

Those concerns must be resolved through their respective canonical owners.

This standard must not become a competing source for Artifact Truth,
Authority, Implementation Plane, Runtime, Role, or System Capability semantics.