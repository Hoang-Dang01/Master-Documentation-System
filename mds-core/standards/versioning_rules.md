---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: versioning_standard
update_strategy: change only through the applicable governed approval process
---

# MDS Version Numbering Standard

## 1. Purpose

This standard defines the canonical version-number semantics used for versioned
MDS artifacts.

MDS uses a three-part semantic version number:

```text
MAJOR.MINOR.PATCH
```

For example:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

Version numbers identify the semantic revision of an artifact version.

They do not independently determine:

```text
Lifecycle State

Validity State

Execution State

Current Project Truth

Human Approval

Version lineage
```

---

## 2. Canonical Ownership

This standard owns:

```text
version-number syntax

MAJOR semantics

MINOR semantics

PATCH semantics

version bump selection

version ordering

version-number uniqueness within a lineage

legacy version-label compatibility
```

This standard does not own:

```text
Version lineage
→ ./artifact_truth.md

Supersession
→ ./artifact_truth.md

Approved lineage head
→ ./artifact_truth.md

Current Project Truth
→ ./artifact_truth.md

Lifecycle State
→ ./lifecycle_rules.md

Execution State
→ ./lifecycle_rules.md

Human Approval Authority
→ ../authorities/

Structured version fields
→ ../schemas/
```

---

## 3. Version Number is not Version Lineage

MDS must preserve:

```text
Version Number
≠
Version Lineage
```

A version number answers:

> Which semantic revision of this artifact does this version represent?

A lineage answers:

> Which immutable artifact versions belong to the same historical chain?

Lineage semantics belong to:

```text
./artifact_truth.md
```

This standard must not redefine lineage ownership.

---

## 4. Canonical Syntax

The canonical stored version format is:

```text
MAJOR.MINOR.PATCH
```

where each component is a non-negative integer.

Canonical examples:

```text
1.0.0
1.2.0
1.2.3
2.0.0
```

Canonical machine validation should follow the equivalent of:

```regex
^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$
```

The canonical stored value does not include a leading `v`.

Therefore:

```text
version: 1.2.0
```

is canonical.

A UI or human-facing view may display:

```text
v1.2.0
```

without changing the stored version value.

---

## 5. Lifecycle Must not be Encoded in the Version Number

MDS already represents lifecycle through:

```text
lifecycle_state
```

Therefore canonical version numbers must not encode lifecycle state through
suffixes such as:

```text
1.0.0-draft

1.0.0-review

1.0.0-rc1

1.0.0-approved
```

Instead:

```yaml
version: 1.0.0
lifecycle_state: DRAFT
```

or:

```yaml
version: 1.0.0
lifecycle_state: REVIEW
```

or:

```yaml
version: 1.0.0
lifecycle_state: APPROVED
```

MDS must preserve:

```text
Version Number
≠
Lifecycle State
```

Lifecycle semantics belong to:

```text
./lifecycle_rules.md
```

---

## 6. Version Number Does not Establish Approval

MDS must preserve:

```text
1.0.0
≠
APPROVED
```

A Draft may already carry:

```text
version: 1.0.0
```

while waiting for review and approval.

Likewise, a historical Approved artifact may carry:

```text
version: 1.0.0
```

after a successor such as:

```text
version: 2.0.0
```

has become the current approved lineage head.

The version number itself grants no authority.

---

## 7. Version Number Does not Establish Current Project Truth

MDS must preserve:

```text
Highest Version Number
≠
Current Project Truth
```

For example:

```text
1.0.0
→ APPROVED + CURRENT

2.0.0
→ DRAFT
```

The existence of `2.0.0` does not make it authoritative.

Current Project Truth is determined through:

```text
Lifecycle
+
Validity
+
Lineage
+
Governed Decisions
```

according to:

```text
./artifact_truth.md
```

---

## 8. Version Number Does not Establish Validity

MDS must preserve:

```text
Newer Version
≠
More Valid
```

A newer version may be:

```text
DRAFT

REVIEW

NEEDS_REVIEW

STALE

CONFLICTED
```

Version ordering is historical and semantic ordering.

It is not a validity ranking.

---

# Semantic Version Bumps

## 9. Version Bump Principle

Version bump selection must be based on the semantic effect of the change.

MDS must not determine version bump type only from:

```text
number of changed lines

file size

number of edited sections

AI confidence

implementation effort
```

The governing question is:

> How does this change affect the meaning or compatibility contract of the
> artifact?

---

## 10. MAJOR Version

Increase `MAJOR` when the successor introduces a breaking or incompatible
change to the governed meaning or contract represented by the artifact.

Example transition:

```text
1.4.2
→
2.0.0
```

A MAJOR change may include:

- removing an existing governed obligation;
- redefining an existing requirement incompatibly;
- changing a public contract incompatibly;
- replacing a fundamental constraint;
- changing an architectural contract in a way existing consumers cannot safely
  assume is compatible;
- changing governed semantics that require dependent artifacts to be
  reconsidered.

When MAJOR increases:

```text
MINOR → 0

PATCH → 0
```

Therefore:

```text
1.4.2
→
2.0.0
```

not:

```text
2.4.2
```

---

## 11. MAJOR Means Semantic Incompatibility

MAJOR does not mean:

```text
large document

important artifact

large implementation effort

many edited lines
```

A small textual change may require a MAJOR bump if it changes governed meaning
incompatibly.

Likewise, a large editorial restructuring may not require MAJOR if the governed
meaning remains compatible.

---

## 12. MINOR Version

Increase `MINOR` when the successor adds governed meaning or capability while
preserving compatibility with the existing contract.

Example:

```text
1.2.3
→
1.3.0
```

A MINOR change may include:

- adding a new compatible requirement;
- adding a compatible optional behaviour;
- adding a new supported case without invalidating existing cases;
- adding a new compatible contract element;
- extending an existing specification while preserving existing governed
  semantics.

When MINOR increases:

```text
PATCH → 0
```

Therefore:

```text
1.2.3
→
1.3.0
```

---

## 13. MINOR Means Compatible Semantic Expansion

MINOR must represent a semantic addition.

It must not be used merely because:

```text
a section was added

more explanation was added

more examples were added

the document became longer
```

If the added material does not change governed meaning, PATCH may be more
appropriate.

---

## 14. PATCH Version

Increase `PATCH` when the successor does not intentionally change governed
meaning.

Example:

```text
1.2.3
→
1.2.4
```

PATCH changes may include:

- correcting spelling;
- correcting grammar;
- clarifying wording without changing normative meaning;
- fixing a broken reference;
- correcting formatting;
- improving explanation;
- adding non-normative examples;
- correcting non-semantic documentation defects.

MDS must preserve:

```text
PATCH
→
No Intended Governed Semantic Change
```

---

## 15. PATCH Must not Hide Semantic Change

A change must not be classified as PATCH merely because it appears small.

If a wording correction changes:

```text
obligation

scope

constraint

behaviour

decision

contract

acceptance expectation
```

then the change is semantic and must be classified as MINOR or MAJOR according
to compatibility impact.

MDS must preserve:

```text
Small Diff
≠
PATCH
```

---

## 16. Bump Selection Decision

Conceptually:

```text
Does governed meaning change?
        │
        ├── NO
        │    ↓
        │   PATCH
        │
        └── YES
             │
             ├── Compatible extension?
             │        ↓
             │       MINOR
             │
             └── Incompatible change?
                      ↓
                     MAJOR
```

Where the impact cannot safely be determined:

```text
UNKNOWN
```

or:

```text
NEEDS_REVIEW
```

should be preserved through the applicable validation or governance mechanism.

MDS must not invent compatibility.

---

# Initial Versioning

## 17. Initial Canonical Version

A new governed artifact lineage should normally begin with the intended
baseline version:

```text
1.0.0
```

The artifact may still be:

```text
DRAFT
```

or:

```text
REVIEW
```

while carrying:

```text
version: 1.0.0
```

because Lifecycle State is represented separately.

Therefore MDS does not need:

```text
0.1.0-draft
```

merely to express Draft status.

---

## 18. Zero-Major Versions

Version numbers such as:

```text
0.1.0
0.2.0
0.2.1
```

may be preserved for:

- imported legacy artifacts;
- experimental artifacts where an applicable canonical contract explicitly
  permits pre-baseline versioning;
- migration compatibility.

They are not required to represent Draft lifecycle state.

For ordinary canonical authoring, MDS should prefer:

```text
1.0.0 + lifecycle_state
```

over encoding maturity through a `0.x` convention.

---

# Version Progression

## 19. Successor Version Must Advance

A successor artifact version in the same lineage must use a version number
greater than its immediate predecessor.

Conceptually:

```text
1.0.0
→ 1.0.1
→ 1.1.0
→ 2.0.0
```

A successor must not move backward:

```text
2.0.0
→ 1.9.0
```

and must not reuse the predecessor version number.

---

## 20. Version Number Uniqueness

Within one artifact lineage, each canonical artifact version must have a unique
version number.

MDS must reject or flag:

```text
lineage_id: L-001
version: 1.2.0

lineage_id: L-001
version: 1.2.0
```

for two different canonical artifact versions.

MDS must preserve:

```text
Same Lineage
+
Same Version Number
→
Same Canonical Version Identity
```

subject to the applicable artifact identity schema.

---

## 21. Version Ordering

Canonical ordering follows numeric semantic-version ordering.

For example:

```text
1.9.0
<
1.10.0
<
2.0.0
```

Version values must not be compared as plain lexical strings.

Therefore:

```text
"1.10.0"
```

must not be considered lower than:

```text
"1.9.0"
```

because of string sorting behaviour.

---

# Approved Artifact Changes

## 22. Approved Versions are Immutable

This standard follows the Artifact Truth invariant:

```text
Approved Artifact Version
→ Read-only historical version
```

A change to an Approved artifact creates a successor version.

Conceptually:

```text
Artifact@1.0.0
APPROVED
      ↓
Change required
      ↓
Artifact@1.1.0
DRAFT
```

The exact bump depends on semantic compatibility.

MDS must not silently edit:

```text
Artifact@1.0.0
```

in place after approval.

---

## 23. New Version Does not Automatically Supersede the Previous Version

Creating:

```text
Artifact@2.0.0
DRAFT
```

does not immediately supersede:

```text
Artifact@1.0.0
APPROVED
```

MDS must preserve:

```text
Successor Candidate Created
≠
Successor Approved
```

Supersession and approved-head transition belong to:

```text
./artifact_truth.md
```

---

## 24. Approval and Deprecation are not Version-Number Rules

This standard must not contain an invariant such as:

```text
count(lifecycle_state == APPROVED) == 1
```

because approval-head semantics belong to Artifact Truth.

The canonical lineage invariant is governed by:

```text
./artifact_truth.md
```

which determines the permitted active approved head for a lineage.

Version numbering only guarantees:

```text
ordered semantic version identifiers
```

It does not decide lifecycle transitions.

---

# Draft and Review Handling

## 25. Draft Version Numbers

A Draft successor may carry its intended final semantic version number.

For example:

```yaml
version: 2.0.0
lifecycle_state: DRAFT
```

The version number may be corrected while the artifact remains Draft if further
analysis shows that the intended semantic bump was classified incorrectly.

The change should remain traceable where governance requires it.

---

## 26. Review Version Stability

When an artifact enters:

```text
REVIEW
```

its version number should be treated as part of the review identity.

A material change that requires a different version classification should
return the artifact to the applicable authoring state before another review.

MDS should not silently change:

```text
version: 1.1.0
```

into:

```text
version: 2.0.0
```

while preserving the same review decision context.

---

## 27. Approval Freezes the Version Identifier

Once an artifact version becomes:

```text
APPROVED
```

its version number is immutable.

MDS must preserve:

```text
Approved Artifact@1.2.0
```

as historical identity.

It must never later be relabeled:

```text
Approved Artifact@1.3.0
```

without creating a new version.

---

# Automation and Governance

## 28. Validator Behaviour

The Validator may:

- validate version syntax;
- detect duplicate versions in a lineage;
- detect non-increasing successor versions;
- detect invalid MAJOR/MINOR/PATCH resets;
- detect lifecycle suffixes in canonical version values;
- identify likely bump inconsistencies;
- warn that a semantic change appears incompatible with the declared bump.

The Validator must not silently rewrite an Approved artifact's version.

MDS must preserve:

```text
Validation
≠
Approval
```

Validator semantics belong to:

```text
../system-capabilities/
```

---

## 29. AI-Assisted Bump Classification

AI may assist by recommending:

```text
MAJOR

MINOR

PATCH
```

based on the observed change.

AI may also provide:

```text
reasoning

compatibility analysis

impact indicators

uncertainty
```

However:

```text
AI Recommendation
≠
Canonical Version Decision
```

The declared version becomes part of the governed artifact and is subject to
the applicable review and approval process.

Where semantic impact is uncertain, AI should surface the uncertainty rather
than force a bump classification.

---

## 30. Versioning and Impact Analysis

A version bump may provide a useful signal for impact analysis.

For example:

```text
MAJOR
→ likely high compatibility impact

MINOR
→ compatible semantic expansion

PATCH
→ no intended governed semantic change
```

However:

```text
Version Bump
≠
Complete Impact Analysis
```

Actual impact must be determined from governed relationships, evidence, changed
semantics, and applicable analysis.

A PATCH version must not automatically suppress impact analysis if evidence
indicates meaningful downstream impact.

---

# Legacy Compatibility

## 31. Legacy `v` Prefix

Legacy values may include:

```text
v1.0.0
```

Consumers may parse the leading `v` for migration compatibility.

Canonical writes should normalize the value to:

```text
1.0.0
```

The original legacy source should remain traceable where provenance matters.

---

## 32. Legacy Lifecycle Suffixes

Legacy versions may include values such as:

```text
1.0.0-draft

1.0.0-rc1
```

MDS may support reading such values during migration.

They must not become canonical output.

Migration should separate:

```text
Version Number
```

from:

```text
Lifecycle State
```

For example:

```text
legacy:
1.0.0-draft

canonical:
version: 1.0.0
lifecycle_state: DRAFT
```

Migration must preserve the original value as provenance where required.

---

## 33. Legacy Role-Coded Examples

Historical documentation may contain version examples tied to role-coded
artifact identifiers.

Those identifiers may remain historical data.

This standard does not use role identity to determine version semantics.

MDS must preserve:

```text
Version Semantics
≠
Professional Responsibility
```

Professional Responsibility semantics belong to:

```text
../roles/
```

---

# General Invariants

## 34. Versioning Invariants

### VERSION-INV-001

Canonical version values use:

```text
MAJOR.MINOR.PATCH
```

without lifecycle suffixes.

### VERSION-INV-002

A leading `v` is presentation-only and is not part of the canonical stored
version value.

### VERSION-INV-003

Version Number does not imply Lifecycle State.

### VERSION-INV-004

Version Number does not imply Validity State.

### VERSION-INV-005

Version Number does not imply Current Project Truth.

### VERSION-INV-006

Version Number does not grant Human Approval Authority.

### VERSION-INV-007

Version Number and Version Lineage are separate concerns.

### VERSION-INV-008

Version numbers must be unique within an artifact lineage.

### VERSION-INV-009

A successor version must have a greater version number than its immediate
predecessor.

### VERSION-INV-010

MAJOR represents incompatible governed semantic change.

### VERSION-INV-011

MINOR represents compatible governed semantic expansion.

### VERSION-INV-012

PATCH represents no intended governed semantic change.

### VERSION-INV-013

Diff size alone must not determine version bump type.

### VERSION-INV-014

Approved artifact versions and their version numbers are immutable.

### VERSION-INV-015

Creating a newer Draft version does not automatically supersede an older
Approved version.

### VERSION-INV-016

The highest version number does not automatically represent Current Project
Truth.

### VERSION-INV-017

AI may recommend a version bump but must not silently establish authoritative
version meaning.

### VERSION-INV-018

Legacy version syntax may be supported for migration without becoming canonical
output.

---

## 35. Relationship to Other Canonical Sources

```text
Version Numbering
→ ./versioning_rules.md

Version Lineage
→ ./artifact_truth.md

Artifact Validity
→ ./artifact_truth.md

Current Project Truth
→ ./artifact_truth.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Naming and Artifact Identity
→ ./naming_convention.md

Human Approval Authorities
→ ../authorities/

Professional Responsibilities
→ ../roles/

MDS System Capabilities
→ ../system-capabilities/

Structured Contracts
→ ../schemas/
```

Each concern must remain owned by its canonical source.

---

## 36. Source of Truth

This document is the canonical owner of:

```text
version-number syntax

semantic version bump meaning

version-number progression

version-number uniqueness

legacy version-label compatibility
```

It is not the canonical owner of:

```text
version lineage

supersession

approved lineage head

Artifact Truth validity

Current Project Truth

Lifecycle State

Execution State

Human Approval Authority
```

Those concerns must resolve through their respective canonical owners.

Principle:

> **Version numbers describe semantic revision. They do not decide truth,
> approval, or authority.**