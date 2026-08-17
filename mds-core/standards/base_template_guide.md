---
ownership: mds
status: transitional
source: internal
safe_to_modify: scoped
classification: authoring_compatibility_guide
canonical_target:
  - ./artifact_truth.md
  - ./lifecycle_rules.md
  - ./versioning_rules.md
  - ./relationship_rules.md
  - ./naming_convention.md
  - ../schemas/
  - ../templates/
  - ../guides/
update_strategy: relocate or retire after active template and authoring references have been migrated
---

# Base Template and Markdown Compatibility Guide

> **Transitional document**
>
> This file is retained to preserve compatibility with legacy MDS template and
> authoring references.
>
> It is not an MDS constitution, a meta-governance authority, or the canonical
> owner of Artifact Truth, lifecycle, relationships, identity, versioning,
> schemas, or approval rules.

---

## 1. Purpose

Earlier versions of MDS used this document as a combined source for:

```text
Markdown formatting

YAML conventions

artifact identity

template inheritance

Knowledge Graph rules

lifecycle

versioning

validation

approval workflow
```

That design mixed several independent concerns into one document.

The current MDS Core model separates those concerns.

This file now exists only to:

- preserve legacy references during migration;
- retain useful human-facing Markdown authoring guidance;
- route governance concerns to their actual canonical owners;
- prevent old template rules from silently overriding current standards;
- support eventual relocation of authoring guidance into `guides/` and
  `templates/`.

---

## 2. This File is not a Canonical Governance Authority

This document must not be interpreted as:

```text
MDS Constitution

highest governance authority

master standard above all schemas

master template inherited by every artifact

source of Human Approval Authority

source of Knowledge Graph semantics
```

MDS follows:

```text
Concern
   ↓
Canonical Owner
   ↓
Template / Guide / Prompt Consumer
```

not:

```text
base_template_guide.md
          ↓
all MDS semantics
```

---

## 3. Canonical Routing

The concerns historically defined here now belong to:

```text
Artifact Truth and Validity
→ ./artifact_truth.md

Lifecycle and Execution State
→ ./lifecycle_rules.md

Version Numbering
→ ./versioning_rules.md

Relationship and Graph Semantics
→ ./relationship_rules.md

Stable Identity and Naming
→ ./naming_convention.md

Structured Metadata Contracts
→ ../schemas/

Reusable Artifact Structures
→ ../templates/

Human Authoring Guidance
→ ../guides/

Professional Responsibilities
→ ../roles/

Human Approval Authorities
→ ../authorities/

MDS System Capabilities
→ ../system-capabilities/
```

If this document conflicts with one of those canonical owners, the canonical
owner governs the concern.

---

# Authoring Guidance

## 4. Markdown Structure

MDS Markdown documents should be readable by:

```text
humans

MDS parsers

AI consumers

version-control review
```

Authors should prefer simple and predictable Markdown over formatting that
depends on one specific renderer.

---

## 5. Heading Hierarchy

Use headings hierarchically.

Preferred structure:

```markdown
# Document Title

## Major Section

### Subsection

#### Detail
```

Avoid unnecessary heading-level jumps.

For example, prefer:

```text
H1
→ H2
→ H3
```

over:

```text
H1
→ H4
```

unless the applicable authoring structure intentionally requires otherwise.

---

## 6. One Primary Document Heading

A normal Markdown artifact should usually contain one primary `H1` document
heading.

For example:

```markdown
# Authentication Requirement
```

Subsequent sections should normally begin at:

```markdown
## Section
```

The exact artifact template may impose more specific structure.

Template ownership belongs to:

```text
../templates/
```

---

## 7. Human Readability

Canonical documentation should favor:

```text
clear section boundaries

short meaningful headings

explicit terminology

machine-readable metadata where required

traceable references

unambiguous normative statements
```

Formatting should support understanding.

Formatting must not carry hidden governance semantics.

---

## 8. Markdown Alerts

GitHub-style alerts may be used where the renderer supports them.

Example:

```markdown
> [!NOTE]
> Additional context.

> [!IMPORTANT]
> Information required for correct interpretation.

> [!WARNING]
> A known risk or compatibility concern.
```

Alerts are presentation devices.

MDS must preserve:

```text
Alert Type
≠
Governance State
```

For example:

```text
[!IMPORTANT]
```

does not mean:

```text
APPROVED
```

---

## 9. Lists

Use standard Markdown list syntax.

Preferred unordered list:

```markdown
- First item
- Second item
- Third item
```

Preferred ordered list:

```markdown
1. First step
2. Second step
3. Third step
```

List syntax must not be used to encode canonical relationships that belong in
structured metadata.

---

## 10. Tables

Markdown tables may be used for compact human-readable comparisons.

They should not become the only machine-readable representation of governed
data when MDS requires structured fields.

Conceptually:

```text
Markdown Table
→ human-facing view

Structured Metadata
→ machine-readable contract
```

---

## 11. Code Blocks

Use fenced code blocks when representing:

```text
code

configuration

structured examples

queries

commands

schemas

machine-readable samples
```

Example:

```yaml
example:
  value: sample
```

A code block inside a document is not automatically canonical structured
metadata.

---

# YAML Guidance

## 12. YAML Syntax

Where YAML is used, authors should:

- use spaces rather than tabs;
- preserve valid indentation;
- use consistent key naming;
- use valid YAML list syntax;
- avoid ambiguous scalar formatting where structured interpretation matters.

Preferred indentation is:

```text
2 spaces
```

unless an applicable schema explicitly requires otherwise.

---

## 13. YAML Frontmatter

Markdown artifacts may use YAML frontmatter where required by the applicable
artifact schema or template.

Canonical frontmatter uses:

```text
---
<yaml>
---
```

The exact required fields belong to:

```text
../schemas/
```

This guide must not independently define a universal frontmatter schema.

---

## 14. Standalone YAML Files

Standalone `.yaml` or `.yml` files are YAML documents.

They do not require Markdown frontmatter delimiters merely because Markdown
artifacts use them.

For example:

```yaml
registry:
  id: example
```

is valid standalone YAML.

---

## 15. Structured Metadata is Schema-Owned

This guide must not define universal required fields such as:

```text
owner

approved_by

reviewed_by

inherits_from

links

execution_state
```

for every artifact.

Whether a field is:

```text
required

optional

forbidden

conditional
```

belongs to the applicable schema and artifact contract.

Structured contracts belong to:

```text
../schemas/
```

---

# Template Boundary

## 16. Template is not Standard

MDS must preserve:

```text
Template
≠
Canonical Governance Standard
```

A template provides a reusable authoring structure.

A standard defines governed semantics.

Templates consume standards.

They do not override them.

---

## 17. No Universal Master Template Inheritance

Legacy MDS required every child template to declare:

```yaml
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1
```

That is no longer a universal MDS requirement.

Template inheritance may be used when an applicable template architecture
requires it.

It must not be assumed merely because this compatibility file exists.

---

## 18. Template Composition

Templates may derive structure from:

```text
artifact schema

Professional Responsibility contract

applicable standards

artifact-type requirements

project configuration
```

A template should contain only what is needed to author that artifact safely.

MDS should avoid one universal template containing every possible field.

---

## 19. Template Evolution

When a template changes, existing governed artifacts must not automatically be
rewritten to match the new template.

MDS must preserve:

```text
Template Changed
≠
Artifact Truth Changed
```

Existing artifacts remain governed by their own persisted content, versions,
and applicable migration rules.

---

# Identity Boundary

## 20. Legacy Role-Coded IDs

Earlier versions of this guide required identifiers such as:

```text
ROLE-TYPE-PROJECT-COMPONENT-NUMBER
```

That convention is no longer canonical for new governed artifact identity.

Canonical identity semantics belong to:

```text
./naming_convention.md
```

Existing legacy identifiers must remain traceable until explicitly migrated.

---

## 21. Identity Must not be Inferred from Template Location

MDS must not infer canonical artifact identity solely from:

```text
folder

template name

Professional Responsibility folder

filename
```

Canonical identity comes from the applicable structured identity contract.

---

# Relationship Boundary

## 22. Relationship Semantics

Canonical relationship vocabulary belongs to:

```text
./relationship_rules.md
```

This guide must not create custom canonical relationships.

A template may expose a field for relationships.

It must consume the global relationship semantics.

---

## 23. Outbound Relationship Storage

Where the applicable schema uses canonical outbound relationship storage, the
template may provide an appropriate structure.

The exact field representation belongs to:

```text
../schemas/
```

This guide must not independently define the persistence format.

---

## 24. Inbound Relationships

Inbound relationship views may be derived from canonical outbound edges.

MDS must preserve:

```text
Derived Inbound View
≠
Second Canonical Relationship Fact
```

Detailed semantics belong to:

```text
./relationship_rules.md
```

---

## 25. No Universal Orphan Rule

Legacy versions of this guide required every artifact to have at least one
relationship.

That is no longer a universal MDS invariant.

An artifact is only considered an Orphan when its applicable canonical contract
requires an anchoring relationship and that requirement is unsatisfied.

MDS must preserve:

```text
No Relationship
≠
Automatically Invalid
```

---

## 26. No Universal Knowledge Graph DAG

Legacy versions of this guide required the entire Knowledge Graph to be a
Directed Acyclic Graph.

That is no longer globally canonical.

MDS must preserve:

```text
Entire Knowledge Graph
≠
Universal DAG
```

Acyclicity is relationship-specific.

For example:

```text
supersedes
```

must remain acyclic.

Other graph structures may legitimately contain cycles.

Graph semantics belong to:

```text
./relationship_rules.md
```

---

# Lifecycle and Truth Boundary

## 27. Lifecycle

Canonical Lifecycle States belong to:

```text
./lifecycle_rules.md
```

This guide must not redefine their semantics.

Current canonical vocabulary is:

```text
DRAFT

REVIEW

APPROVED

DEPRECATED

ARCHIVED
```

---

## 28. Execution

Canonical Execution States also belong to:

```text
./lifecycle_rules.md
```

Current canonical vocabulary is:

```text
NOT_STARTED

IN_PROGRESS

BLOCKED

COMPLETED

NOT_APPLICABLE
```

---

## 29. Validity

Artifact Validity belongs to:

```text
./artifact_truth.md
```

Current canonical vocabulary is:

```text
CURRENT

NEEDS_REVIEW

STALE

CONFLICTED
```

MDS must preserve:

```text
Lifecycle
≠
Validity
≠
Execution
```

---

## 30. Approval Does not Mean Current Truth

MDS must preserve:

```text
APPROVED
≠
CURRENT
```

This guide must never instruct templates or consumers to equate:

```text
approved artifact
```

with:

```text
Current Project Truth
```

Artifact Truth semantics belong to:

```text
./artifact_truth.md
```

---

# Versioning Boundary

## 31. Version Numbers

Canonical artifact version numbers use:

```text
MAJOR.MINOR.PATCH
```

Version semantics belong to:

```text
./versioning_rules.md
```

This guide does not define independent version bump rules.

---

## 32. Lifecycle Must not be Encoded in Version

Do not use version suffixes such as:

```text
1.0.0-draft

1.0.0-approved

1.0.0-rc1
```

as canonical MDS lifecycle representation.

Use separate fields.

Conceptually:

```yaml
version: 1.0.0
lifecycle_state: REVIEW
```

---

# Mermaid Guidance

## 33. Mermaid is a Presentation Tool

Mermaid diagrams may be used to improve human understanding.

They may represent:

```text
flows

sequences

states

relationships

architecture concepts
```

Mermaid diagrams are presentation artifacts.

They are not automatically canonical machine-readable graph data.

MDS must preserve:

```text
Mermaid Diagram
≠
Canonical Knowledge Graph
```

---

## 34. Mermaid Syntax

When Mermaid is used, authors should prefer syntax that renders reliably.

Example:

```mermaid
flowchart LR
    A["Start"] --> B["Process"]
    B --> C["End"]
```

Complex labels may be quoted where required by Mermaid syntax.

Detailed diagram-authoring guidance should eventually belong to:

```text
../guides/
```

---

# Precision Guidance

## 35. Avoid Unbounded Ambiguity

Governed specifications should avoid wording whose interpretation cannot be
determined.

Examples of weak standalone terms include:

```text
fast

secure

scalable

stable

user-friendly

high performance
```

when no relevant expectation or interpretation is provided.

However, MDS must not adopt a simplistic rule that every descriptive word is
forbidden.

The appropriate requirement depends on context.

---

## 36. Measurable Requirements

Where behaviour must be objectively verified, authors should provide measurable
criteria when meaningful.

Conceptually:

```text
Expectation
+
Measurement Method
+
Applicable Threshold
```

is preferable to an undefined qualitative claim.

The exact required quality attributes belong to the applicable artifact
contract and Professional Responsibility model.

---

## 37. Precision Must not Create False Certainty

Authors must not invent numerical thresholds merely to make a requirement look
precise.

MDS must preserve:

```text
Unknown Requirement
≠
Invented Measurement
```

If an expectation has not yet been determined, represent the uncertainty or
request clarification.

---

# Layer Separation

## 38. Separation of Concern

Different governed artifacts may operate at different abstraction levels.

For example:

```text
business meaning

system behaviour

architecture

implementation specification

verification

operational evidence
```

Authors should avoid introducing lower-level implementation decisions into
higher-level governed meaning unless the dependency is actually required.

---

## 39. Technology Independence is Contextual

A business-level artifact should generally avoid accidental dependence on a
specific implementation technology.

However, MDS must not create an absolute rule that technical terminology can
never appear in business context.

A technology may itself be a legitimate governed business constraint.

The important distinction is:

```text
required constraint
```

versus:

```text
accidental implementation leakage
```

---

## 40. Implementation Content Boundary

Managed-project source code and implementation artifacts belong to the
external:

```text
../implementation-plane/
```

MDS specifications may describe required implementation contracts where
appropriate.

MDS System Capabilities must not become implementation executors merely because
a document contains technical details.

---

# Validation

## 41. Validation Pipeline

MDS may validate artifacts through applicable System Capabilities.

Conceptually:

```text
Artifact
   ↓
Schema Validation
   ↓
Relationship Validation
   ↓
Applicable Governance Checks
   ↓
Human Gate where required
```

This is a conceptual validation composition.

It is not a mandatory universal workflow for every artifact.

---

## 42. Validator

Validation is an MDS System Capability concern.

Canonical semantics belong to:

```text
../system-capabilities/
```

The Validator may detect:

```text
invalid schema

broken references

invalid relationships

missing required metadata

invalid state transition

naming violations

versioning violations
```

---

## 43. Validation is not Approval

MDS must preserve:

```text
Validation PASS
≠
Human Approval
```

Likewise:

```text
Validation FAIL
≠
Human Rejection
```

A governance contract may require particular validation results before a gate
may proceed.

The Validator does not hold the Human Approval Authority.

---

## 44. No Hard-Coded Approver Roles

This guide must not define rules such as:

```text
Product Owner must approve

Architect must approve

BA must approve

QA must approve
```

Human Approval Authority belongs to:

```text
../authorities/
```

A project may assign an Authority Type to a particular human.

That assignment is separate from Professional Responsibility.

---

# AI Boundary

## 45. AI-Assisted Authoring

AI may assist authors by:

```text
drafting structure

summarising sources

detecting ambiguity

suggesting clearer wording

checking consistency

suggesting metadata

proposing relationships
```

AI output remains subject to the applicable canonical governance.

---

## 46. AI Does not Establish Truth

MDS must preserve:

```text
AI Output
≠
Project Truth
```

AI must not fabricate:

```text
approval

source provenance

business meaning

measurements

authority decisions

canonical relationships
```

merely to satisfy a template.

---

## 47. AI Does not Create Authority

MDS must preserve:

```text
AI
≠
Human Approval Authority
```

A prompt, agent, model, or System Capability must not gain approval authority
because this guide is used during authoring.

---

# Quality Checklist

## 48. General Authoring Checklist

Where applicable, authors may verify:

```text
[ ] Markdown structure is readable.

[ ] YAML syntax is valid where YAML is used.

[ ] Required schema fields are present.

[ ] Artifact identity follows the applicable naming standard.

[ ] Version information follows the versioning standard.

[ ] Lifecycle, Validity, and Execution are represented separately.

[ ] Canonical relationships use registered relationship semantics.

[ ] Internal relationship targets resolve.

[ ] Source provenance is retained where required.

[ ] Unknown information has not been invented.

[ ] Human Approval Authority has not been inferred from role or AI identity.

[ ] Templates have not introduced rules that conflict with canonical standards.

[ ] Mermaid or presentation content does not substitute for structured
    canonical data where machine-readable data is required.
```

This checklist is guidance.

The applicable schema and standards determine actual machine-validatable
requirements.

---

# Legacy Compatibility

## 49. Legacy `inherits_from`

Historical artifacts or templates may contain:

```yaml
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1
```

The field may remain as legacy metadata.

It must not be interpreted as granting this document higher semantic authority.

Migration may remove or replace the field when the template architecture is
canonicalized.

---

## 50. Legacy Approval Metadata

Historical artifacts may contain fields such as:

```yaml
reviewed_by: arch_agent
approved_by: product_owner
owner: arch_agent
created_by: arch_agent
```

These values must be treated according to their historical context.

They must not establish the canonical future Authority model.

Human Approval semantics belong to:

```text
../authorities/
```

---

## 51. Legacy Relationship Metadata

Historical templates may contain:

```yaml
links:
  - type: adheres_to
    target: ART-SAMPLE-0001
```

Existing data should remain readable.

Future structured representation must follow the applicable relationship
schema.

Relationship meaning remains governed by:

```text
./relationship_rules.md
```

---

## 52. Legacy Graph Assumptions

Historical material may contain assumptions such as:

```text
every artifact must have a relationship

the entire graph must be a DAG

every orphan is invalid

Graph Validation blocks approval directly
```

Those assumptions are not globally canonical.

They must be evaluated against the current:

```text
relationship standard

artifact contract

governance model
```

---

## 53. Legacy ID Format

Historical data using:

```text
ROLE-TYPE-PROJECT-COMPONENT-NUMBER
```

must remain traceable.

New canonical identity should follow:

```text
./naming_convention.md
```

Migration must be explicit.

Legacy IDs must not be silently rewritten.

---

## 54. Legacy Version Prefixes

Historical material may display:

```text
v1.0.0
```

or lifecycle suffixes.

Canonical version semantics belong to:

```text
./versioning_rules.md
```

Legacy representations may be read for compatibility without becoming canonical
future output.

---

# Future Location

## 55. Intended Decomposition

The useful content remaining in this file should eventually be split into:

```text
Markdown authoring guidance
→ ../guides/

Mermaid authoring guidance
→ ../guides/

Reusable artifact structure
→ ../templates/

Frontmatter structure
→ ../schemas/

Governance semantics
→ focused standards
```

This file should not remain permanently inside `standards/`.

---

## 56. Retirement Conditions

This file may be retired when:

```text
active templates no longer inherit from it

active schemas no longer depend on its legacy metadata

active prompts do not reference it as higher-order authority

active guides no longer route here for governance

legacy ID and relationship assumptions have explicit migration treatment

Markdown and Mermaid guidance have been relocated where still useful
```

Retirement must preserve relevant historical references or migration mappings.

---

# General Invariants

## 57. Compatibility Invariants

### BASE-GUIDE-INV-001

This file is not an MDS constitutional or meta-governance authority.

### BASE-GUIDE-INV-002

Templates do not override canonical standards.

### BASE-GUIDE-INV-003

Schemas own structured field requirements.

### BASE-GUIDE-INV-004

Canonical identity must follow the Naming Standard rather than legacy
role-coded template identity.

### BASE-GUIDE-INV-005

The entire MDS Knowledge Graph is not universally required to be a DAG.

### BASE-GUIDE-INV-006

An artifact with no relationship is not automatically an Orphan.

### BASE-GUIDE-INV-007

Validation does not constitute Human Approval.

### BASE-GUIDE-INV-008

Professional Responsibility does not automatically grant Human Approval
Authority.

### BASE-GUIDE-INV-009

AI does not hold Human Approval Authority.

### BASE-GUIDE-INV-010

Markdown formatting must not encode hidden governance state.

### BASE-GUIDE-INV-011

Template changes do not automatically change existing Artifact Truth.

### BASE-GUIDE-INV-012

Presentation diagrams do not replace canonical structured graph data.

### BASE-GUIDE-INV-013

Precision must not be achieved by inventing unsupported requirements.

### BASE-GUIDE-INV-014

Legacy content must remain traceable during migration without remaining
canonical for future authoring.

---

## 58. Source of Truth

This file owns only:

```text
legacy base-template compatibility guidance

temporary Markdown authoring guidance

routing of legacy authoring rules to canonical owners
```

It does not own:

```text
Artifact Truth

Lifecycle

Execution State

Validity State

Versioning

Stable Identity

Relationship semantics

Human Approval Authority

Professional Responsibility

schema structure

template contracts
```

Current canonical ownership is:

```text
Artifact Truth
→ ./artifact_truth.md

Lifecycle and Execution
→ ./lifecycle_rules.md

Version Numbering
→ ./versioning_rules.md

Relationships
→ ./relationship_rules.md

Naming and Identity
→ ./naming_convention.md

Schemas
→ ../schemas/

Templates
→ ../templates/

Guides
→ ../guides/

Authorities
→ ../authorities/

Professional Responsibilities
→ ../roles/

System Capabilities
→ ../system-capabilities/
```

Principle:

> **Authoring guidance explains how to write. Canonical models and standards
> determine what the governed content means.**