---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: artifact_truth_standard
update_strategy: change only through the applicable governed approval process
---

# MDS Artifact Truth and Lineage Standard

## 1. Purpose

This standard defines how MDS determines the governed truth status of versioned
project artifacts.

It owns the semantics of:

```text
Artifact Validity

Version Lineage

Approved Lineage Head

Supersession Consequences

Current Project Truth

Truth Invalidation

Truth Recovery

Impact-Driven Review

Context Authority
```

MDS must preserve:

```text
APPROVED
≠
CURRENT

COMPLETED
≠
AUTHORITATIVE

NEWEST VERSION
≠
CURRENT PROJECT TRUTH

EVIDENCE
≠
APPROVAL
```

Project Truth is not determined by one status field.

It is a governed projection derived from several independent facts.

---

## 2. Canonical Ownership

This standard owns:

```text
validity_state vocabulary

validity semantics

validity transitions

version-lineage semantics

approved lineage head semantics

supersession truth consequences

Current Project Truth projection

truth invalidation

truth recovery

impact-driven validity consequences

authoritative context eligibility
```

This standard does not own:

```text
Stable artifact identity format
→ ./naming_convention.md

Version-number syntax and bump semantics
→ ./versioning_rules.md

Lifecycle State
→ ./lifecycle_rules.md

Execution State
→ ./lifecycle_rules.md

Relationship vocabulary
→ ./relationship_rules.md

Human Approval Authority
→ ../authorities/

Professional Responsibilities
→ ../roles/

Implementation execution
→ ../implementation-plane/

Runtime semantics
→ ../runtime/

MDS System Capabilities
→ ../system-capabilities/

Concrete persistence structure
→ ../schemas/
```

Each concern must remain owned by its canonical source.

---

# State Separation

## 3. Independent State Axes

MDS separates three artifact state axes and one lineage dimension:

```text
Lifecycle
→ How mature is this governed content?

Validity
→ Is this artifact still trustworthy against current governed knowledge?

Execution
→ What is the operational progress associated with this artifact?

Lineage
→ Which immutable version succeeds which prior version?
```

Conceptually:

```text
Artifact Version
├── lifecycle_state
├── validity_state
├── execution_state
├── lineage_id
└── version
```

These dimensions answer different questions.

They must not be collapsed into one generic status.

---

## 4. State Independence

MDS must preserve:

```text
Lifecycle State
≠
Validity State
≠
Execution State
```

Examples of valid conceptual combinations include:

```text
APPROVED + CURRENT + NOT_STARTED

APPROVED + NEEDS_REVIEW + COMPLETED

APPROVED + STALE + COMPLETED

APPROVED + CONFLICTED + BLOCKED
```

The exact combinations permitted for an artifact type may be constrained by an
applicable schema or governed contract.

No state axis automatically determines another.

---

## 5. Lifecycle State

Canonical Lifecycle States are owned by:

```text
./lifecycle_rules.md
```

The canonical vocabulary is:

```text
DRAFT

REVIEW

APPROVED

DEPRECATED

ARCHIVED
```

This standard consumes Lifecycle State when projecting Project Truth.

It does not redefine Lifecycle State semantics.

---

## 6. Execution State

Canonical Execution States are owned by:

```text
./lifecycle_rules.md
```

The canonical vocabulary is:

```text
NOT_STARTED

IN_PROGRESS

BLOCKED

COMPLETED

NOT_APPLICABLE
```

Execution State does not determine whether an artifact is authoritative.

MDS must preserve:

```text
COMPLETED
≠
CURRENT
```

---

# Artifact Validity

## 7. Validity State

Validity State answers:

> Is this artifact version still trustworthy against current governed project
> knowledge?

The canonical Validity States are:

```text
CURRENT

NEEDS_REVIEW

STALE

CONFLICTED
```

Validity represents the current governed interpretation of an artifact version.

It does not rewrite the historical fact that the artifact may previously have
been Approved.

---

## 8. CURRENT

`CURRENT` means:

> No known governed change, accepted evidence, unresolved conflict, or
> established incompatibility currently invalidates the artifact version for
> its intended authoritative use.

`CURRENT` does not independently mean:

```text
APPROVED
```

A Draft may be internally consistent with current knowledge but still cannot
become authoritative Project Truth because it has not passed the applicable
approval process.

For authoritative use, Lifecycle and Validity must both satisfy the Current
Project Truth projection.

---

## 9. NEEDS_REVIEW

`NEEDS_REVIEW` means:

> A traceable governed change, new evidence, changed dependency, or other
> relevant condition may affect the artifact, but the actual consequence has
> not yet been resolved.

Conceptually:

```text
Previously CURRENT Artifact
          ↓
Potential Governed Impact Detected
          ↓
NEEDS_REVIEW
```

`NEEDS_REVIEW` expresses uncertainty.

It must not be silently interpreted as:

```text
still correct
```

or:

```text
definitely wrong
```

The artifact requires governed review before it can again be relied upon as
fully authoritative context.

---

## 10. STALE

`STALE` means:

> Available governed evidence establishes that the artifact no longer
> represents the current applicable governed state for its intended use.

A Stale artifact may remain historically valuable.

It must not be used as current authoritative instruction.

MDS must preserve:

```text
STALE
≠
DEPRECATED
```

because:

```text
STALE
→ Validity State

DEPRECATED
→ Lifecycle State
```

An artifact may become Stale before a successor has been approved.

---

## 11. CONFLICTED

`CONFLICTED` means:

> Relevant governed or evidentiary claims disagree and no applicable governed
> resolution has yet established which interpretation should be used.

Examples of conceptual conflict include:

```text
two governed sources make incompatible claims

accepted evidence contradicts an approved assumption

two applicable decisions appear inconsistent

current sources disagree about a required behaviour
```

MDS must preserve the conflict.

It must not silently select one side based on:

```text
file timestamp

AI confidence

source order

database order

graph traversal order

UI state
```

---

## 12. Validity is not Lifecycle History

A change in Validity does not erase historical Lifecycle State.

For example:

```text
APPROVED + CURRENT
        ↓
new upstream change
        ↓
APPROVED + NEEDS_REVIEW
```

The artifact remains historically Approved.

Only its current validity interpretation changes.

MDS must preserve:

```text
Historical Approval
≠
Current Validity
```

---

# Validity Transitions

## 13. CURRENT → NEEDS_REVIEW

A `CURRENT` artifact should become `NEEDS_REVIEW` when governed evidence
establishes a plausible unresolved impact.

Conceptually:

```text
CURRENT
   ↓
Evidence-backed possible impact
   ↓
NEEDS_REVIEW
```

This is a conservative safety transition.

Where an approved deterministic policy clearly establishes the condition, an
MDS System Capability may apply this transition automatically.

Such automation does not constitute Human Approval.

---

## 14. NEEDS_REVIEW → CURRENT

`NEEDS_REVIEW` may return to `CURRENT` when the applicable governed review
establishes that:

```text
the artifact remains applicable

the upstream change does not materially affect it

the evidence does not invalidate its meaning

the apparent conflict was resolved without changing the artifact
```

The transition must preserve sufficient evidence or decision provenance.

AI confidence alone must not restore `CURRENT`.

---

## 15. NEEDS_REVIEW → STALE

`NEEDS_REVIEW` becomes `STALE` when governed analysis establishes that the
artifact no longer represents applicable current knowledge.

Conceptually:

```text
NEEDS_REVIEW
      ↓
Impact confirmed
      ↓
STALE
```

This transition does not automatically create a successor version.

A successor may be authored separately through the applicable artifact
workflow.

---

## 16. Any Applicable State → CONFLICTED

An artifact may become `CONFLICTED` when unresolved governed claims become
incompatible.

Conceptually:

```text
CURRENT
   ↓
conflicting governed claims
   ↓
CONFLICTED
```

or:

```text
NEEDS_REVIEW
   ↓
conflict established
   ↓
CONFLICTED
```

MDS must retain the evidence for each conflicting claim.

---

## 17. CONFLICTED → Resolved Validity

A Conflicted artifact may leave `CONFLICTED` only after the conflict has been
resolved through the applicable governed process.

The resulting state may be:

```text
CURRENT

NEEDS_REVIEW

STALE
```

depending on the resolution.

The conflict history must remain queryable.

Resolution must not erase the evidence that the conflict existed.

---

## 18. STALE → CURRENT

A Stale classification may be corrected if later governed evidence establishes
that the artifact is still applicable without changing its content.

Such restoration requires explicit evidence and governed provenance.

MDS must not automatically restore:

```text
STALE
→ CURRENT
```

merely because:

```text
a dependency changed again

an AI model predicts compatibility

a newer artifact disappeared

a warning was dismissed
```

---

## 19. Validity Transition Provenance

A governed Validity transition should preserve, where applicable:

```text
artifact lineage

artifact version

previous validity

new validity

transition time

reason

triggering change

evidence references

relationship path

governed decision reference

deterministic rule reference

execution mechanism
```

The concrete persistence structure belongs to:

```text
../schemas/
```

---

# Version Lineage

## 20. Lineage Definition

A Version Lineage represents the immutable historical chain of versions that
belong to one governed artifact identity.

All versions in a lineage share one stable:

```text
lineage_id
```

For example:

```text
ART-SAMPLE-0001@1.0.0
ART-SAMPLE-0001@1.1.0
ART-SAMPLE-0001@2.0.0
```

belong to:

```text
ART-SAMPLE-0001
```

Stable identity semantics belong to:

```text
./naming_convention.md
```

Version-number semantics belong to:

```text
./versioning_rules.md
```

---

## 21. Immutable Approved Versions

An Approved artifact version is read-only with respect to material content.

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
In-place Semantic Rewrite
```

The historical Approved version must remain reproducible.

---

## 22. Successor Version

A material change to an Approved artifact creates a successor Draft in the same
lineage.

Conceptually:

```text
ART-SAMPLE-0001@1.0.0
APPROVED
      ↓
material change required
      ↓
ART-SAMPLE-0001@1.1.0
DRAFT
```

or, when incompatible:

```text
ART-SAMPLE-0001@2.0.0
DRAFT
```

The version bump is governed by:

```text
./versioning_rules.md
```

---

## 23. `supersedes`

A successor version declares:

```text
supersedes
```

toward its immediate predecessor.

Conceptually:

```text
ART-SAMPLE-0001@2.0.0
      ↓ supersedes
ART-SAMPLE-0001@1.1.0
```

Relationship vocabulary and direction belong to:

```text
./relationship_rules.md
```

This standard owns the lineage consequences of that relationship.

MDS must preserve:

```text
supersedes
≠
DEPRECATED
```

because one is a relationship and the other is a Lifecycle State.

---

## 24. Immediate Predecessor

A successor must point to its immediate predecessor in the lineage.

If the lineage is:

```text
1.0.0
→ 1.1.0
→ 2.0.0
```

the canonical succession is:

```text
1.1.0 supersedes 1.0.0

2.0.0 supersedes 1.1.0
```

The lineage must remain reconstructable without skipping intermediate governed
versions.

---

## 25. Lineage Must Be Acyclic

A Version Lineage must never form a cycle.

Invalid:

```text
1.0.0
→ supersedes
→ 2.0.0
→ supersedes
→ 1.0.0
```

A lineage cycle is a blocking integrity defect.

Relationship validation belongs to:

```text
./relationship_rules.md
```

---

# Approved Lineage Head

## 26. Approved Head Definition

An **Approved Lineage Head** is the active non-deprecated Approved version at
the head of a governed artifact lineage.

MDS must preserve:

```text
At most one non-deprecated APPROVED head
per lineage
```

This does not mean:

```text
Only one version in history may ever have been APPROVED.
```

Historical versions may remain recorded as previously Approved after becoming:

```text
DEPRECATED
```

or:

```text
ARCHIVED
```

---

## 27. New Draft Does not Replace the Approved Head

Creating a newer Draft does not replace the existing Approved head.

For example:

```text
1.0.0
APPROVED + CURRENT

2.0.0
DRAFT
```

The active Approved head remains:

```text
1.0.0
```

until the successor completes the applicable governed approval transition.

MDS must preserve:

```text
Newer Version Exists
≠
New Approved Head
```

---

## 28. New Review Candidate Does not Replace the Approved Head

Likewise:

```text
2.0.0
REVIEW
```

does not replace:

```text
1.0.0
APPROVED
```

merely because it is newer or under review.

A candidate becomes the new Approved head only through the applicable governed
approval transition.

---

## 29. Successor Approval Transition

When a successor version is approved as the replacement for the existing
Approved head, MDS should treat:

```text
successor approval

+

former head deprecation
```

as one governed lineage transition.

Conceptually:

```text
Before
──────

1.0.0
APPROVED
CURRENT

2.0.0
REVIEW


Governed successor approval
          ↓


After
─────

1.0.0
DEPRECATED

2.0.0
APPROVED
CURRENT
```

The transition must not leave two active non-deprecated Approved heads.

---

## 30. Atomicity of Head Transition

The governed transition should prevent intermediate persisted states such as:

```text
old head APPROVED

new head APPROVED
```

both acting as active lineage heads.

Likewise, MDS should avoid a transition that loses both heads because only part
of the governed operation succeeded.

The concrete transaction mechanism belongs to implementation.

The semantic invariant belongs here.

---

## 31. Rejected Successor

Rejection of a successor candidate must not erase:

```text
candidate artifact

candidate version

review history

decision evidence

change rationale
```

The existing Approved head remains unaffected unless a separate governed
decision changes its validity.

MDS must preserve:

```text
Rejected Successor
≠
Existing Head Becomes Invalid
```

unless evidence independently establishes that condition.

---

# Current Project Truth

## 32. Definition

**Current Project Truth** is the deterministic governed projection of project
knowledge that MDS may treat as currently authoritative.

It is not:

```text
a folder

a database table

a renderer view

the latest files

all Approved artifacts

all completed work

all graph nodes
```

Conceptually:

```text
Governed Source Records
        ↓
Lifecycle
+
Validity
+
Lineage
+
Applicable Decisions
        ↓
Artifact Truth Rules
        ↓
Current Project Truth
```

---

## 33. Authoritative Inclusion Rule

A versioned artifact may be included as authoritative Current Project Truth when
it is:

```text
the active Approved lineage head

AND

validity_state == CURRENT

AND

not DEPRECATED

AND

not ARCHIVED

AND

not excluded by an unresolved applicable governance condition
```

Conceptually:

```text
Approved Head
+
CURRENT
      ↓
Authoritative Current Project Truth
```

---

## 34. APPROVED is Necessary but not Sufficient

MDS must preserve:

```text
APPROVED
≠
CURRENT PROJECT TRUTH
```

An artifact may be:

```text
APPROVED + NEEDS_REVIEW

APPROVED + STALE

APPROVED + CONFLICTED
```

and therefore fail authoritative Current Project Truth eligibility.

Approval records historical governed acceptance.

Validity records current trustworthiness.

Both matter.

---

## 35. NEEDS_REVIEW Treatment

An Approved head whose validity is:

```text
NEEDS_REVIEW
```

must not be presented as fully authoritative instruction.

It may appear as:

```text
warning-bearing context

impact-analysis input

review context

historical reference
```

with its unresolved condition clearly visible.

MDS must not hide the warning merely to complete a context package.

---

## 36. STALE Treatment

A Stale artifact must be excluded from authoritative Current Project Truth.

It may remain visible for:

```text
history

impact analysis

remediation

lineage

audit

comparison
```

MDS must preserve it as governed historical knowledge.

---

## 37. CONFLICTED Treatment

A Conflicted artifact must be excluded from authoritative Current Project Truth
for the affected governed concern.

The unresolved conflict must remain visible.

Where the conflict creates a governance blocker, the applicable governance
contract determines the blocked activity.

MDS must not invent a resolution.

---

## 38. DRAFT and REVIEW Treatment

Artifacts in:

```text
DRAFT

REVIEW
```

must not be presented as authoritative Current Project Truth.

They may be exposed as clearly labeled:

```text
candidate knowledge

work in progress

review context

proposed change
```

where useful.

Candidate knowledge must remain distinguishable from authoritative truth.

---

## 39. DEPRECATED and ARCHIVED Treatment

Artifacts in:

```text
DEPRECATED

ARCHIVED
```

are excluded from Current Project Truth.

They remain available for:

```text
history

lineage reconstruction

audit

rollback analysis

decision analysis

incident analysis
```

Historical retention does not make them current.

---

## 40. Project State is Broader than Project Truth

MDS must preserve:

```text
Project State
≠
Current Project Truth
```

Project State may contain:

```text
Drafts

Review candidates

Approved artifacts

Validity warnings

Conflicts

Stale knowledge

Deprecated versions

Archived history

Implementation evidence

Runtime evidence

Validation findings
```

Current Project Truth is only the governed authoritative projection within that
broader state.

---

# Canonical Source and Derived State

## 41. Source Records and Derived Projections

Current Project Truth is derived from canonical source records.

Derived structures may include:

```text
SQLite indexes

Knowledge Graph projections

search indexes

cached views

impact indexes

context caches
```

Such structures are rebuildable derived state.

MDS must preserve:

```text
Derived Index
≠
Independent Project Truth
```

A derived index must not silently override its canonical source records.

---

## 42. Evidence is not Project Truth

MDS may consume:

```text
source evidence

implementation evidence

verification evidence

runtime evidence
```

Evidence may affect analysis, validation, Validity, or governed decisions.

Evidence does not automatically become authoritative Project Truth.

MDS must preserve:

```text
Evidence
≠
Governed Truth
```

---

## 43. Repository Reality is not Project Truth

Implementation repositories may contain behaviour that differs from approved
Project Truth.

MDS must preserve:

```text
Repository Reality
≠
Project Truth
```

The difference may indicate:

```text
implementation drift

stale specification

untraced change

incorrect implementation

missing governed change
```

MDS must surface the mismatch rather than silently choosing one side.

Implementation semantics belong to:

```text
../implementation-plane/
```

---

## 44. Runtime Reality is not Project Truth

Observed runtime behaviour may differ from Project Truth.

MDS must preserve:

```text
Runtime Reality
≠
Project Truth
```

Runtime Evidence may expose:

```text
incorrect assumptions

implementation defects

configuration drift

stale knowledge

unexpected operational behaviour
```

Observed behaviour does not automatically rewrite governed truth.

Runtime semantics belong to:

```text
../runtime/
```

---

# Change and Impact Propagation

## 45. Upstream Governed Change

When a new upstream version becomes the applicable Approved head, MDS should
evaluate governed downstream relationships for possible impact.

Conceptually:

```text
Upstream Change
      ↓
Governed Relationship Graph
      ↓
Potential Downstream Impact
      ↓
Validity Analysis
```

Relationship traversal belongs to:

```text
./relationship_rules.md
```

Truth consequences belong here.

---

## 46. Relationship Path is not Proof of Impact

MDS must preserve:

```text
Graph Path Exists
≠
Impact Proven
```

A relationship path provides evidence for impact analysis.

Different relationship types may carry different impact significance.

For example:

```text
depends_on
```

may generally provide stronger impact evidence than:

```text
references
```

but the actual consequence still depends on applicable semantics and evidence.

---

## 47. Evidence-Backed Possible Impact

Where governed relationships and available evidence establish a plausible but
unresolved downstream impact:

```text
CURRENT
→
NEEDS_REVIEW
```

is the conservative validity treatment.

This transition may be applied deterministically under an approved policy.

MDS must retain:

```text
changed upstream artifact

relationship path

affected downstream artifact

evidence

rule used

transition provenance
```

---

## 48. Confirmed Incompatibility

Where governed analysis establishes that a downstream artifact no longer
represents the applicable current state:

```text
CURRENT
or
NEEDS_REVIEW
      ↓
STALE
```

may be appropriate.

A System Capability must not infer confirmed incompatibility solely from AI
confidence.

The transition requires the applicable governed basis.

---

## 49. Conflict Propagation

Where an upstream change exposes incompatible governed claims rather than a
simple known invalidation:

```text
CONFLICTED
```

may be the correct validity state.

MDS must preserve all relevant claims and evidence.

It must not convert conflict into Stale merely to simplify the state model.

---

## 50. Unrelated Artifacts Must not Change

Impact propagation must be bounded.

MDS must not invalidate every artifact merely because one upstream artifact
changed.

Only artifacts reached through applicable governed relationships, rules, and
evidence should be considered for validity consequences.

MDS must preserve:

```text
Change
≠
Global Invalidation
```

---

## 51. Impact Path Provenance

Every propagated validity consequence should remain explainable.

MDS should be able to answer:

```text
What changed?

Which version changed?

Which relationship path connected the artifacts?

Why was this artifact considered affected?

Which evidence supported the conclusion?

Which rule changed its Validity State?

Was the result deterministic, AI-assisted, or human-governed?
```

This explainability is required for trustworthy Project Truth management.

---

# Context Safety

## 52. Context Package Authority

A Context Builder may package project knowledge for:

```text
Professional Responsibility work

Human Authority review

Implementation Plane handoff

verification

impact analysis

other MDS capabilities
```

Context Builder semantics belong to:

```text
../system-capabilities/
```

Artifact Truth determines which content may be represented as authoritative.

---

## 53. Authoritative Context

Only content satisfying Current Project Truth eligibility may be presented as
authoritative instruction.

For versioned governed artifacts, this normally requires:

```text
active Approved lineage head

+

CURRENT validity
```

A context package must not silently promote lower-confidence knowledge.

---

## 54. Warning-Bearing Context

Content in:

```text
NEEDS_REVIEW
```

may be included when relevant, but must be visibly identified as unresolved.

It must not be merged into authoritative instructions without distinction.

---

## 55. Non-Authoritative Context

The following must never be presented as authoritative Current Project Truth:

```text
DRAFT

REVIEW

STALE

CONFLICTED

DEPRECATED

ARCHIVED
```

They may still be included when the consumer explicitly needs:

```text
history

comparison

impact analysis

review context

conflict resolution

migration context
```

Their status must remain visible.

---

## 56. Context Version Identity

Where applicable, every governed context item should preserve:

```text
lineage_id

version

lifecycle_state

validity_state

source references

relevant warnings
```

and enough provenance to determine why the item was included.

The concrete context schema belongs to:

```text
../schemas/
```

---

## 57. Context Freshness

A context package may become stale when relevant Current Project Truth changes.

MDS must preserve:

```text
Context Built at Time A
        ↓
Relevant Truth Changes
        ↓
Context may no longer be current
```

A Context Builder should detect stale context where possible.

It must not silently continue presenting an outdated package as current.

---

## 58. Implementation Handoff

A context package may be handed to the external Implementation Plane.

MDS must preserve:

```text
Context Package
≠
Implementation Authority
```

Providing authoritative context does not grant MDS itself permission to modify
managed-project source code.

Implementation execution belongs to:

```text
../implementation-plane/
```

---

# Governance and Automation

## 59. Human Approval Authority

This standard does not assign approval authority by:

```text
job title

Professional Responsibility

role abbreviation

AI identity

System Capability
```

Where approval is required, the applicable Authority Type and assignment must
resolve through:

```text
../authorities/
```

MDS must preserve:

```text
Professional Responsibility
≠
Human Approval Authority
```

---

## 60. System Capability Boundary

MDS System Capabilities may:

```text
detect possible impact

calculate relationship paths

validate lineage

detect stale context

propose validity changes

apply explicitly authorized deterministic safety rules

prepare review context
```

They must not gain Human Approval Authority from performing those functions.

System Capability semantics belong to:

```text
../system-capabilities/
```

---

## 61. AI Boundary

AI may assist with:

```text
impact analysis

conflict detection

candidate validity assessment

relationship discovery

context preparation

explanation
```

MDS must preserve:

```text
AI Output
≠
Project Truth

AI Confidence
≠
Human Approval

AI Recommendation
≠
Governed Decision
```

AI may propose a validity result.

It must not silently establish authoritative truth where the applicable
governance model requires stronger evidence or human decision.

---

## 62. Conservative Automated Invalidation

An approved deterministic policy may allow MDS to conservatively reduce trust,
for example:

```text
CURRENT
→
NEEDS_REVIEW
```

when a qualifying upstream change is detected.

This does not create new authoritative truth.

It reduces reliance until review occurs.

MDS must preserve:

```text
Automatic Safety Downgrade
≠
Automatic Human Decision
```

---

## 63. Restoring Authority Requires Governed Basis

Moving an artifact toward stronger authoritative use, especially:

```text
NEEDS_REVIEW
→ CURRENT

STALE
→ CURRENT

CONFLICTED
→ CURRENT
```

requires explicit governed basis.

That basis may be provided through:

```text
applicable human decision

or an explicitly approved deterministic rule
```

depending on the governing contract.

AI confidence alone is insufficient.

---

# Historical Integrity

## 64. History Must Remain Queryable

MDS must preserve sufficient history to reconstruct:

```text
what was approved

when it was approved

which version was current

which version superseded which predecessor

why validity changed

which evidence triggered review

which decisions resolved conflicts

when a version became deprecated or archived
```

Current Project Truth must not destroy historical Project State.

---

## 65. Deprecation Does not Erase Approval

When a former Approved head becomes:

```text
DEPRECATED
```

MDS must preserve the historical fact that the version was previously Approved.

Conceptually:

```text
historically Approved
+
currently Deprecated
```

are compatible facts.

History must not be rewritten into:

```text
this version was never approved
```

---

## 66. Validity History Must Remain Explainable

If an artifact moves:

```text
CURRENT
→ NEEDS_REVIEW
→ STALE
```

MDS should preserve the reason for each transition.

Likewise:

```text
CONFLICTED
→ CURRENT
```

must preserve the conflict and resolution history.

---

# General Invariants

## 67. Artifact Truth Invariants

### ARTIFACT-TRUTH-INV-001

Lifecycle, Validity, and Execution are independent state axes.

### ARTIFACT-TRUTH-INV-002

`APPROVED` does not imply `CURRENT`.

### ARTIFACT-TRUTH-INV-003

`COMPLETED` does not imply authoritative Project Truth.

### ARTIFACT-TRUTH-INV-004

The highest version number does not automatically represent Current Project
Truth.

### ARTIFACT-TRUTH-INV-005

An Approved artifact version is immutable with respect to material content.

### ARTIFACT-TRUTH-INV-006

A material change creates a successor version in the same lineage.

### ARTIFACT-TRUTH-INV-007

All versions in one lineage share the same stable `lineage_id`.

### ARTIFACT-TRUTH-INV-008

A successor identifies its immediate predecessor through the canonical
supersession relationship.

### ARTIFACT-TRUTH-INV-009

Version lineage must remain acyclic.

### ARTIFACT-TRUTH-INV-010

At most one non-deprecated Approved head may be active in one lineage.

### ARTIFACT-TRUTH-INV-011

Creating a newer Draft or Review version does not replace the existing Approved
head.

### ARTIFACT-TRUTH-INV-012

Successor approval and former-head deprecation must preserve one governed
lineage transition.

### ARTIFACT-TRUTH-INV-013

Historical approval, lineage, evidence, and decisions must remain queryable.

### ARTIFACT-TRUTH-INV-014

An Approved head must also be `CURRENT` to qualify as authoritative Current
Project Truth.

### ARTIFACT-TRUTH-INV-015

`NEEDS_REVIEW` content must not be presented as fully authoritative
instruction.

### ARTIFACT-TRUTH-INV-016

`STALE`, `CONFLICTED`, `DEPRECATED`, and `ARCHIVED` content must not be
presented as authoritative Current Project Truth.

### ARTIFACT-TRUTH-INV-017

Evidence does not automatically become Project Truth.

### ARTIFACT-TRUTH-INV-018

Repository Reality does not automatically become Project Truth.

### ARTIFACT-TRUTH-INV-019

Runtime Reality does not automatically become Project Truth.

### ARTIFACT-TRUTH-INV-020

A graph path does not independently prove impact.

### ARTIFACT-TRUTH-INV-021

Possible evidence-backed impact may conservatively reduce Validity to
`NEEDS_REVIEW`.

### ARTIFACT-TRUTH-INV-022

AI must not silently resolve `CONFLICTED` or establish stronger authoritative
Validity.

### ARTIFACT-TRUTH-INV-023

Validity transitions must preserve sufficient provenance for explanation where
governance requires it.

### ARTIFACT-TRUTH-INV-024

Current Project Truth is a governed projection, not a storage location or
derived index.

---

## 68. Relationship to Other Canonical Sources

```text
Artifact Validity and Current Project Truth
→ ./artifact_truth.md

Stable Identity and Naming
→ ./naming_convention.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Version Numbering
→ ./versioning_rules.md

Relationship Vocabulary
→ ./relationship_rules.md

Human Approval Authorities
→ ../authorities/

Professional Responsibilities
→ ../roles/

MDS System Capabilities
→ ../system-capabilities/

Implementation Plane
→ ../implementation-plane/

Runtime Environment and Evidence
→ ../runtime/

Structured Contracts
→ ../schemas/
```

Each concern must remain owned by its canonical source.

---

## 69. Source of Truth

This document is the canonical owner of:

```text
Artifact Validity

Validity State semantics

Validity transition semantics

Version Lineage consequences

Approved Lineage Head semantics

Current Project Truth projection

truth invalidation

truth recovery

impact-driven truth consequences

authoritative context eligibility
```

It is not the canonical owner of:

```text
stable identifier syntax

version-number syntax

Lifecycle State

Execution State

relationship vocabulary

Human Approval Authority

Professional Responsibility

implementation execution

Runtime state

schema structure
```

Those concerns must resolve through their respective canonical owners.

Principle:

> **Approval records what was governed. Validity determines whether it can
> still be trusted. Lineage preserves history. Current Project Truth is the
> governed intersection of those facts.**