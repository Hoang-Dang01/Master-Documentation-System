---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: naming_standard
update_strategy: change only through the applicable governed approval process
---

# MDS Naming and Identity Standard

## 1. Purpose

This standard defines canonical naming and stable identity rules for governed
MDS artifacts.

MDS separates:

```text
Identity
Display Name
Classification
Version
Lifecycle
Storage Location
```

These concerns must not be encoded into one overloaded name.

The core principle is:

> **Identity must remain stable even when how an artifact is classified,
> displayed, versioned, assigned, or stored changes.**

---

## 2. Canonical Ownership

This standard owns:

```text
governed artifact lineage identifier format

versioned artifact identity representation

project namespace token rules

human-readable title rules

filename rules

identifier stability

identifier migration rules

legacy identifier compatibility
```

This standard does not own:

```text
Artifact Type semantics
→ applicable canonical artifact model

Artifact Type structured representation
→ ../schemas/

Version-number semantics
→ ./versioning_rules.md

Version lineage semantics
→ ./artifact_truth.md

Lifecycle State
→ ./lifecycle_rules.md

Validity State
→ ./artifact_truth.md

Professional Responsibilities
→ ../roles/

Human Approval Authorities
→ ../authorities/

Relationship vocabulary
→ ./relationship_rules.md

Implementation identity
→ ../implementation-plane/

Runtime identity
→ ../runtime/
```

---

## 3. Naming Layers

A governed artifact has several independent naming layers.

Conceptually:

```text
Stable Identity
→ lineage_id

Version Identity
→ lineage_id + version

Human Display
→ title

Classification
→ artifact_type

Storage
→ filename / path
```

For example:

```text
lineage_id
ART-SAMPLE-0001

version
1.2.0

version identity
ART-SAMPLE-0001@1.2.0

title
Session Timeout Requirement

artifact_type
requirement

filename
session-timeout-requirement.md
```

These values serve different purposes.

They must not be treated as interchangeable.

---

## 4. Stable Artifact Identity

The canonical stable identity of a versioned governed artifact lineage is:

```text
lineage_id
```

Canonical format:

```text
ART-<PROJECT_KEY>-<SEQUENCE>
```

Example:

```text
ART-SAMPLE-0001
```

The `lineage_id` remains stable across all versions in the same artifact
lineage.

Conceptually:

```text
ART-SAMPLE-0001@1.0.0
ART-SAMPLE-0001@1.1.0
ART-SAMPLE-0001@2.0.0
```

all belong to:

```text
lineage_id: ART-SAMPLE-0001
```

---

## 5. Why Identity is Role-Neutral

Canonical artifact identity must not encode Professional Responsibility.

MDS must not require identity patterns such as:

```text
BA-...

SA-...

ARCH-...

BE-...

FE-...

QA-...

DEVOPS-...

PM-...
```

as canonical artifact identity.

Professional Responsibility may change during the life of an artifact.

Artifact identity should not.

MDS must preserve:

```text
Artifact Identity
≠
Professional Responsibility
```

Professional Responsibility semantics belong to:

```text
../roles/
```

---

## 6. Why Identity is Type-Neutral

Canonical `lineage_id` also does not encode the artifact subtype.

MDS must not require:

```text
REQ

ADR

API

DB

UI

TEST
```

inside the stable artifact identifier.

Classification belongs in structured metadata.

For example:

```yaml
lineage_id: ART-SAMPLE-0001
artifact_type: requirement
```

If later governed analysis determines that the artifact was incorrectly
classified, classification may be corrected without forcing an identity
migration.

MDS must preserve:

```text
Identity
≠
Classification
```

---

## 7. Why Identity is Lifecycle-Neutral

Artifact identity must not encode:

```text
DRAFT

REVIEW

APPROVED

DEPRECATED

ARCHIVED
```

Lifecycle is represented separately.

Therefore MDS must not create identifiers such as:

```text
ART-SAMPLE-0001-DRAFT

ART-SAMPLE-0001-APPROVED

APPROVED-ART-SAMPLE-0001
```

Instead:

```yaml
lineage_id: ART-SAMPLE-0001
lifecycle_state: APPROVED
```

Lifecycle semantics belong to:

```text
./lifecycle_rules.md
```

---

## 8. Why Identity is Version-Neutral

The stable lineage identifier must not contain the version number.

MDS must not create:

```text
ART-SAMPLE-0001-V1

ART-SAMPLE-0001-V2
```

as independent lineage identifiers for successor versions.

Instead:

```text
lineage_id
ART-SAMPLE-0001

version
1.0.0
```

and:

```text
lineage_id
ART-SAMPLE-0001

version
2.0.0
```

represent two versions in the same lineage.

Version semantics belong to:

```text
./versioning_rules.md
```

---

# Project Namespace

## 9. Project Key

`PROJECT_KEY` is a stable namespace token used to distinguish governed artifact
identities across projects.

Canonical format:

```text
[A-Z][A-Z0-9]{1,15}
```

Conceptually:

```text
SAMPLE

CORE

PROJECT1
```

A Project Key:

- uses uppercase ASCII letters and digits;
- begins with a letter;
- contains no spaces;
- contains no punctuation;
- contains no lifecycle information;
- contains no Professional Responsibility information;
- contains no artifact type information.

---

## 10. Project Key is not the Project Display Name

MDS must preserve:

```text
Project Key
≠
Project Display Name
```

For example:

```text
project_key:
SAMPLE

project title:
Sample Application
```

The human-readable project title may change.

The Project Key should remain stable once governed artifact identities exist.

---

## 11. Project Key Stability

Once a Project Key is used inside persisted canonical artifact identifiers, it
must be treated as identity-bearing infrastructure.

Changing:

```text
SAMPLE
```

to:

```text
NEWSAMPLE
```

would change all identifiers containing that namespace.

Therefore such a change is an explicit identity migration.

It must not occur automatically when a project is renamed.

---

# Sequence

## 12. Sequence Component

`SEQUENCE` is an opaque numeric identity component.

Canonical minimum representation:

```text
0001
```

Examples:

```text
0001
0002
0042
1024
```

The sequence does not encode:

```text
priority

artifact type

Professional Responsibility

Lifecycle State

Version

creation phase
```

It exists only to provide stable identity.

---

## 13. Sequence Width

Canonical generated identifiers should use at least four digits:

```text
0001
```

MDS may expand naturally beyond four digits:

```text
9999
10000
```

The sequence must never wrap or reuse a previously allocated canonical
identifier within the same Project Key namespace.

---

## 14. Identifier Uniqueness

Within an MDS workspace, canonical `lineage_id` values must be unique.

MDS must reject or flag duplicate identities such as:

```text
ART-SAMPLE-0042
ART-SAMPLE-0042
```

representing two unrelated artifact lineages.

MDS must preserve:

```text
One lineage_id
→ One governed artifact lineage
```

---

## 15. Identifier Allocation

A newly allocated canonical `lineage_id` must not later be reused for a
different artifact merely because the original artifact becomes:

```text
DEPRECATED

ARCHIVED

deleted from a projection
```

Identity reuse destroys historical traceability.

Allocated canonical identifiers are permanently reserved.

---

# Version Identity

## 16. Versioned Artifact Identity

A specific immutable artifact version is identified conceptually as:

```text
<lineage_id>@<version>
```

Example:

```text
ART-SAMPLE-0001@1.0.0
```

This is the canonical human-readable version identity notation.

It combines:

```text
lineage identity
+
semantic version
```

without changing either component.

---

## 17. Version Identity is not a New Lineage

MDS must preserve:

```text
ART-SAMPLE-0001@1.0.0

ART-SAMPLE-0001@2.0.0
```

as:

```text
two versions
```

of:

```text
one lineage
```

not:

```text
two unrelated artifacts
```

Lineage semantics belong to:

```text
./artifact_truth.md
```

---

## 18. Relationship Target Identity

Where a relationship must point to an exact artifact version, its structured
representation should preserve:

```text
lineage_id

version
```

rather than embedding version semantics into a second unrelated identifier.

Conceptually:

```yaml
target: ART-SAMPLE-0001
target_version: 1.2.0
```

or another equivalent representation defined by the applicable schema.

Relationship structure belongs to:

```text
../schemas/
```

Relationship semantics belong to:

```text
./relationship_rules.md
```

---

# Human Display Names

## 19. Title

`title` is the human-readable name of an artifact.

The title should describe the artifact's subject or governed meaning.

Good conceptual examples:

```text
Session Timeout Requirement

Authentication Architecture Decision

Order Validation Contract
```

The title is intended primarily for human understanding.

It is not the artifact identity.

---

## 20. Title Must not Include the Identifier by Default

Canonical titles should not be written as:

```text
ART-SAMPLE-0001 - Session Timeout Requirement
```

The application may display the identifier next to the title where useful.

The stored title should remain:

```text
Session Timeout Requirement
```

MDS must preserve:

```text
title
≠
lineage_id
```

---

## 21. Title Must not Encode Lifecycle

Titles should not contain prefixes or suffixes such as:

```text
[DRAFT]

[APPROVED]

FINAL

LATEST

OLD

DEPRECATED
```

Lifecycle and validity are metadata.

For example:

```text
Session Timeout Requirement
```

with:

```yaml
lifecycle_state: APPROVED
validity_state: CURRENT
```

is preferable to:

```text
[APPROVED] Session Timeout Requirement FINAL
```

---

## 22. Title Must not Encode Version

Titles should not normally contain:

```text
v1

v2

v1.2.0
```

to distinguish canonical versions.

Version identity is already represented structurally.

MDS should display version information separately where useful.

---

## 23. Title Must not Encode Professional Responsibility

Titles must not require prefixes such as:

```text
BA:

SA:

ARCH:

BE:

FE:

QA:

DEVOPS:
```

Professional Responsibility metadata or application views may expose
responsibility where appropriate.

The title itself describes the governed artifact.

---

# Filenames

## 24. Filename Purpose

A filename is a storage locator.

It is not the canonical artifact identity.

MDS must preserve:

```text
Filename
≠
Artifact Identity
```

Changing a filename must not require changing `lineage_id`.

---

## 25. Canonical Artifact Filename

The preferred filename pattern is:

```text
<human-readable-slug>.<extension>
```

For Markdown artifacts:

```text
<human-readable-slug>.md
```

Example:

```text
session-timeout-requirement.md
```

A filename exists for filesystem usability.

Canonical references between governed artifacts should use identifiers rather
than filenames where applicable.

---

## 26. Filename Slug Rules

The human-readable slug must:

- use lowercase ASCII letters `a-z`;
- use digits `0-9` where useful;
- use `-` as the word separator;
- begin with a letter or digit;
- end with a letter or digit;
- not contain consecutive `--`;
- normally remain at or below 80 characters excluding the extension;
- describe content rather than governance state.

Canonical examples:

```text
session-timeout-requirement.md

authentication-boundary.md

api-error-contract.md
```

---

## 27. Filename Must not Encode Governance State

Do not place the following in canonical project artifact filenames:

```text
DRAFT

REVIEW

APPROVED

FINAL

LATEST

UPDATED

DEPRECATED
```

Lifecycle and validity belong to structured state.

---

## 28. Filename Must not Encode Version

Canonical filenames should not normally contain:

```text
v1

v2

v1.0.0

v2.1.3
```

Version identity belongs to metadata and lineage structures.

If immutable versions are physically stored in separate versioned paths by an
applicable storage contract, that storage representation must remain a storage
detail and must not redefine artifact identity.

---

## 29. Filename Must not Encode Professional Responsibility

Canonical filenames must not require prefixes such as:

```text
ba-

sa-

arch-

be-

fe-

qa-

devops-

pm-
```

merely to communicate professional ownership.

MDS must preserve:

```text
Storage Name
≠
Professional Responsibility
```

---

## 30. Filename Rename

A filename may be changed for:

```text
clarity

spelling correction

storage reorganisation

human readability
```

without changing the artifact identity.

For example:

```text
session-timeout.md
```

may become:

```text
session-timeout-requirement.md
```

while preserving:

```text
lineage_id: ART-SAMPLE-0001
```

Any path-based indexes must be updated accordingly.

---

# Metadata Separation

## 31. Canonical Separation

MDS should represent separate concerns through separate fields.

Conceptually:

```yaml
lineage_id: ART-SAMPLE-0001
title: Session Timeout Requirement
artifact_type: requirement
version: 1.0.0
lifecycle_state: APPROVED
validity_state: CURRENT
```

This example demonstrates concern separation only.

The exact metadata contract belongs to:

```text
../schemas/
```

---

## 32. No Hidden Semantics in the Identifier

Consumers must not infer the following from:

```text
ART-SAMPLE-0001
```

alone:

```text
artifact type

Professional Responsibility

approval state

validity

version

priority

implementation status

release status
```

Those values must come from their canonical fields or governed sources.

---

## 33. No Hidden Semantics in the Filename

Likewise, consumers must not infer governed semantics from:

```text
session-timeout-requirement.md
```

alone.

The filename is not evidence that the artifact is:

```text
a canonical requirement

approved

current

owned by a particular role
```

Structured metadata and canonical governance determine those facts.

---

# Identity Mutation

## 34. Lineage Identity is Immutable

Once a canonical artifact lineage is persisted and referenced:

```text
lineage_id
```

must be treated as immutable.

MDS must preserve:

```text
Stable Identity
→ Stable Traceability
```

Changing a title does not change identity.

Changing a filename does not change identity.

Changing a Professional Responsibility does not change identity.

Changing Artifact Type classification does not automatically change identity.

Creating a new version does not change lineage identity.

---

## 35. Identity Migration

If a `lineage_id` must genuinely change because of:

```text
legacy normalization

namespace collision

invalid identifier

project namespace migration

data-recovery correction
```

the operation is an explicit identity migration.

The migration must preserve, where applicable:

```text
old identifier

new identifier

migration reason

migration time

affected references

affected relationships

affected evidence

migration provenance
```

---

## 36. Identity Migration is not Rename

MDS must preserve:

```text
Title Rename
≠
Identity Migration

Filename Rename
≠
Identity Migration

Project Display Rename
≠
Identity Migration
```

Identity migration is a governed structural operation.

It must not occur as a side effect of ordinary editing.

---

## 37. Referential Integrity During Migration

An identity migration must update or map all applicable canonical references.

MDS must not leave:

```text
old unresolved targets
```

without explicit migration treatment.

The Validator may detect unresolved identity references.

Validation semantics belong to:

```text
../system-capabilities/
```

---

# System and Reserved Names

## 38. System Files

Some MDS infrastructure files may use stable reserved filenames rather than
human-readable artifact slugs.

Examples conceptually include:

```text
README.md

index.yaml

manifest.yaml

lineage.json
```

Such files are system structures.

They are not governed project artifact filenames merely because they exist
inside an MDS workspace.

The applicable schema or subsystem owns their exact names.

---

## 39. Templates

Template filenames are authoring infrastructure.

They do not need canonical artifact identities until instantiated as governed
project artifacts.

MDS must preserve:

```text
Template
≠
Artifact Instance
```

Template semantics belong to:

```text
../templates/
```

---

## 40. Generated Files

Generated indexes, caches, graph projections, reports, or temporary outputs may
use subsystem-defined filenames.

Generated storage names must not be confused with canonical governed artifact
identity.

Where generated data can be reconstructed from canonical sources, the
generated filename itself has no Project Truth authority.

---

# Legacy Compatibility

## 41. Legacy Role-Coded Identifiers

Earlier MDS artifacts may use identifiers such as:

```text
<ROLE>-<TYPE>-<PROJECT>-<SEQUENCE>
```

These identifiers are legacy-compatible identities.

Existing persisted identifiers must not be silently rewritten.

MDS should preserve them until an explicit migration is performed.

However, new canonical artifact identities must not require this role-coded
format.

---

## 42. Legacy Type-Coded Identifiers

Historical artifacts may also encode artifact classification directly in their
identifier.

Those IDs remain valid historical identities where required for compatibility.

MDS must not infer that the legacy encoding represents the current canonical
classification model.

The actual artifact classification must come from canonical metadata.

---

## 43. Legacy Identifier Migration

A legacy identifier may be migrated conceptually as:

```text
legacy:
ROLE-TYPE-PROJECT-001

canonical:
ART-PROJECT-0001
```

but only through an explicit migration process.

MDS must preserve the mapping:

```text
legacy_id
→
canonical_lineage_id
```

where historical references require it.

No bulk migration should occur solely because a newer naming standard exists.

---

## 44. Existing Historical References

Legacy references using historical identifiers must remain resolvable during
the migration period.

Possible mechanisms may include:

```text
identity aliases

migration maps

redirect indexes

legacy identifier registries
```

The exact mechanism belongs to the applicable schema and implementation.

The naming invariant is:

> Historical traceability must not be destroyed merely to make identifiers look
> newer.

---

## 45. Legacy `id` Field

Historical artifacts may use:

```yaml
id: <legacy value>
```

as their canonical traceability identity.

For governed versioned artifacts, the target canonical model uses:

```yaml
lineage_id: ART-<PROJECT_KEY>-<SEQUENCE>
```

with version represented separately.

Migration of `id` to `lineage_id` must be governed by the applicable schema
migration.

Until migrated, legacy `id` values remain historical source facts.

---

# Validation

## 46. Validator Responsibilities

The Validator may check:

```text
lineage_id syntax

Project Key syntax

sequence syntax

duplicate identifiers

identifier reuse

invalid version identity

filename slug validity

governance words embedded in filenames

legacy identifier presence

unresolved identity references
```

The Validator may produce:

```text
PASS

FAIL

WARNING

UNKNOWN
```

according to the applicable validation contract.

---

## 47. Validation Does not Rewrite Identity

MDS must preserve:

```text
Invalid Identifier
      ↓
Validator
      ↓
Finding
```

not:

```text
Invalid Identifier
      ↓
Validator
      ↓
Silent Identity Rewrite
```

Identity correction requires an explicit authoring or migration operation.

---

## 48. AI and Naming

AI may assist with:

```text
title suggestions

filename slug generation

legacy ID classification

migration candidate analysis
```

AI must not autonomously reassign canonical artifact identities.

MDS must preserve:

```text
AI Suggested Identity Migration
≠
Executed Identity Migration
```

---

# General Invariants

## 49. Naming and Identity Invariants

### NAMING-INV-001

Stable artifact identity is separate from human-readable title.

### NAMING-INV-002

Stable artifact identity is separate from filename and storage path.

### NAMING-INV-003

Canonical artifact identity must not encode Professional Responsibility.

### NAMING-INV-004

Canonical artifact identity must not encode Artifact Type classification.

### NAMING-INV-005

Canonical artifact identity must not encode Lifecycle State.

### NAMING-INV-006

Canonical lineage identity must not encode version number.

### NAMING-INV-007

A governed version is identifiable using lineage identity plus version.

### NAMING-INV-008

Changing title does not change artifact identity.

### NAMING-INV-009

Changing filename does not change artifact identity.

### NAMING-INV-010

Changing Professional Responsibility does not change artifact identity.

### NAMING-INV-011

Reclassification does not automatically change artifact identity.

### NAMING-INV-012

Allocated canonical artifact identifiers must not be reused.

### NAMING-INV-013

Canonical artifact identifiers must be unique within the applicable MDS
workspace namespace.

### NAMING-INV-014

Lifecycle and validity information must not be inferred from filenames.

### NAMING-INV-015

Role ownership must not be inferred from canonical artifact identifiers.

### NAMING-INV-016

Version-number semantics must remain separate from identity semantics.

### NAMING-INV-017

Legacy identifiers may remain resolvable without remaining canonical for new
artifact creation.

### NAMING-INV-018

Identity migration must preserve traceability and provenance.

---

## 50. Relationship to Other Canonical Sources

```text
Naming and Stable Identity
→ ./naming_convention.md

Artifact Truth and Lineage
→ ./artifact_truth.md

Version Numbering
→ ./versioning_rules.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Relationship Semantics
→ ./relationship_rules.md

Professional Responsibilities
→ ../roles/

Human Approval Authorities
→ ../authorities/

Structured Metadata Contracts
→ ../schemas/

MDS System Capabilities
→ ../system-capabilities/
```

Each concern must remain owned by its canonical source.

---

## 51. Source of Truth

This document is the canonical owner of:

```text
artifact lineage identifier format

Project Key naming

identity stability

versioned identity notation

human-readable title rules

filename rules

identity migration principles

legacy naming compatibility
```

It is not the canonical owner of:

```text
Artifact Type semantics

Version lineage semantics

Version-number semantics

Lifecycle State

Validity State

Professional Responsibility

Human Approval Authority

Relationship semantics

concrete metadata schema
```

Those concerns must resolve through their respective canonical owners.

Principle:

> **Name things for humans, identify them for systems, classify them through
> metadata, and never confuse one concern with another.**
