---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
classification: implementation_plane
update_strategy: change only through the applicable governed approval process
---

# External Implementation Plane Model

## 1. Purpose

This document defines the canonical model for the **External Implementation Plane**
within MDS.

The Implementation Plane is the execution boundary in which governed technical
intent is translated into changes to a managed project.

It may contain:

* Human Implementers;
* Coding Agents;
* Development Tools / Environments;
* Delivery Automation.

The Implementation Plane is external to the MDS Project Truth authority boundary.

Conceptually:

```text
Project Truth
      ↓
Bounded Implementation Context
      ↓
────────────────────────────
 EXTERNAL IMPLEMENTATION PLANE
────────────────────────────
      ↓
Implementation Activity
      ↓
Implementation Evidence
      ↓
MDS Correlation / Verification
```

MDS governs and preserves Project Truth.

The Implementation Plane performs implementation execution.

---

## 2. Definition

The **External Implementation Plane** is:

> The execution boundary in which humans, coding agents, development tools,
> and delivery automation may create, modify, build, test, package, or deploy
> implementation artifacts belonging to a managed project.

Implementation artifacts may include:

* source code;
* test code;
* configuration;
* infrastructure definitions;
* database migrations;
* scripts;
* deployment definitions;
* generated implementation output;
* build artifacts.

The existence or modification of an implementation artifact does not
automatically make it authoritative Project Truth.

---

## 3. MDS and the Implementation Plane

MDS and the Implementation Plane have different responsibilities.

```text
MDS
→ defines, preserves, relates, and governs Project Truth

Implementation Plane
→ executes changes against the managed project
```

MDS may provide:

* authoritative specifications;
* approved decisions;
* constraints;
* impact information;
* context packages;
* implementation expectations;
* verification expectations.

The Implementation Plane may return:

* commits;
* diffs;
* changed-file information;
* build results;
* test results;
* static-analysis results;
* migration results;
* deployment results;
* implementation notes;
* other implementation evidence.

The two boundaries must remain distinct.

---

## 4. Implementation State is not Project Truth

MDS must preserve:

```text
Implementation State
≠
Project Truth
```

The existence of code does not automatically establish the authoritative
technical specification.

Likewise:

```text
Repository Reality
≠
Automatically Approved Truth
```

Repository state may provide evidence about what currently exists.

MDS may compare that evidence against authoritative Project Truth.

A mismatch must be surfaced rather than silently reconciled.

---

## 5. Project Truth is not Implementation State

The reverse distinction must also be preserved:

```text
Approved Specification
≠
Implemented Behaviour
```

An approved requirement, system specification, or architecture decision does
not prove that the managed project currently implements it.

Conceptually:

```text
Authoritative Specification
        ↓
Implementation Context
        ↓
Implementation Plane
        ↓
Implementation Evidence
        ↓
Verification
```

Implementation claims must be supported by implementation evidence.

---

## 6. Canonical Participant Classes

The Implementation Plane may contain several different participant classes.

These classes must not be treated as equivalent merely because all of them
participate in implementation execution.

The canonical participant classes are:

```text
Human Implementer

Coding Agent

Development Tool / Environment

Delivery Automation
```

These classifications describe how implementation work is performed.

They are not:

* Professional Responsibilities;
* External Actor Types;
* Human Approval Authorities;
* Runtime Environments;
* MDS System Capabilities.

---

## 7. Human Implementer

A **Human Implementer** is a human who directly performs implementation work
within a managed project.

A Human Implementer may:

* inspect implementation artifacts;
* modify source code;
* modify test code;
* modify configuration;
* create migrations;
* execute development commands;
* review diffs;
* create commits;
* perform debugging;
* perform implementation tasks.

Implementation Plane participation does not automatically grant:

* Product Authority;
* Business Authority;
* Architecture Authority;
* Release Authority.

A Human Implementer may separately hold professional responsibilities or
approval authorities through the applicable governance model.

---

## 8. Coding Agent

A **Coding Agent** is an AI-enabled implementation executor capable of
inspecting, creating, or modifying implementation artifacts.

A Coding Agent may:

* inspect source code;
* modify source code;
* modify tests;
* modify configuration;
* execute development commands;
* generate implementation artifacts;
* run builds;
* run tests;
* produce commits;
* return implementation evidence.

Conceptually:

```text
MDS Context Package
      ↓
Coding Agent
      ↓
Implementation Change
      ↓
Implementation Evidence
```

A Coding Agent is an implementation executor.

It must not be treated as a Human Approval Authority.

---

## 9. Development Tool / Environment

A **Development Tool / Environment** provides capabilities through which
implementation work is performed.

This class may include:

* editors;
* IDEs;
* shells;
* debugging tools;
* local development environments;
* repository clients;
* build tools;
* development containers.

A Development Tool / Environment does not necessarily act as an independent
implementation decision maker.

MDS must preserve:

```text
Development Tool
≠
Human Implementer

Development Tool
≠
Coding Agent

Development Tool
≠
Approval Authority
```

It provides implementation capability rather than governance authority.

---

## 10. Delivery Automation

**Delivery Automation** represents automated mechanisms that build, verify,
package, promote, or deploy implementation artifacts.

It may include capabilities such as:

* automated builds;
* automated tests;
* artifact packaging;
* environment promotion;
* infrastructure execution;
* deployment execution;
* deployment verification.

Delivery Automation may produce implementation and delivery evidence.

It must not be treated as Human Release Authority.

Conceptually:

```text
Release Authority
      ↓
Release Permission
      ↓
Delivery Automation
      ↓
Release / Deployment Execution
```

Release permission and release execution are separate concerns.

---

## 11. Participant Class is not Vendor Identity

MDS Core should model implementation semantics rather than specific products,
vendors, or services.

Prefer:

```text
Coding Agent
```

rather than creating a canonical class for every coding product.

Prefer:

```text
Development Tool / Environment
```

rather than creating a canonical class for every editor or IDE.

Prefer:

```text
Delivery Automation
```

rather than creating a canonical class for every CI/CD platform.

Specific tools belong to project configuration or integration data.

Principle:

> **Model implementation capability classes, not vendor catalogues.**

---

## 12. Implementation Context

Implementation work should be driven by a bounded context derived from
applicable Project Truth.

An Implementation Context may reference:

* requirement versions;
* system specifications;
* architecture decisions;
* constraints;
* acceptance criteria;
* affected artifacts;
* known risks;
* impact information;
* relevant source information;
* verification expectations.

Conceptually:

```text
Project Truth
      ↓
Context Builder
      ↓
Bounded Implementation Context
      ↓
Implementation Plane
```

The concrete context-package structure belongs to the applicable schema and
system-capability boundaries.

---

## 13. Bounded Implementation Context

Implementation Context should be intentionally bounded.

MDS should avoid undefined instructions such as:

```text
"Fix the project."
```

when the intended change cannot be traced to governed project knowledge.

A bounded implementation request should make clear, where applicable:

```text
What should change?

Why should it change?

Which authoritative specifications apply?

Which constraints must remain true?

Which areas may be affected?

What must not change?

How will the result be verified?
```

The required level of detail depends on the implementation task.

---

## 14. Context Provenance

Implementation Context must remain traceable to the Project Truth from which it
was derived.

MDS should be able to determine:

```text
Which truth versions produced this context?

Which decisions were current?

Which constraints were included?

When was the context generated?

Which implementation activity used it?
```

This prevents implementation instructions from becoming detached from the
governed knowledge that justified them.

---

## 15. Context Freshness

An Implementation Context may become stale when relevant Project Truth changes.

Conceptually:

```text
Context Package v1
      ↓
Relevant Project Truth changes
      ↓
Context Package v1 may no longer be current
```

MDS must not silently assume that an old Implementation Context remains valid.

Where applicable, context freshness may be represented through states such as:

```text
CURRENT

POTENTIALLY_STALE

STALE
```

The exact state contract belongs to the applicable schema or standard.

---

## 16. Implementation Execution Boundary

Implementation execution occurs outside the MDS truth-management boundary.

MDS must not directly mutate managed-project implementation artifacts as part
of its canonical responsibility.

This includes directly modifying:

* managed-project source code;
* managed-project test code;
* implementation configuration;
* implementation scripts;
* infrastructure code;
* migrations.

The external Implementation Plane performs those changes.

---

## 17. Read Access and Mutation Authority

MDS may inspect or ingest managed-project information where necessary for:

* evidence;
* verification;
* impact analysis;
* traceability;
* drift detection;
* context generation.

Read access does not imply mutation authority.

MDS must preserve:

```text
Can Read
≠
Can Modify
```

This distinction applies to:

* repositories;
* source files;
* test files;
* configuration;
* build output;
* repository metadata;
* implementation artifacts.

---

## 18. Repository Boundary

A source repository may provide implementation evidence.

MDS may consume information such as:

* commit identifiers;
* parent commits;
* branches;
* tags;
* diffs;
* changed files;
* repository status;
* implementation baselines.

Repository mutation remains an Implementation Plane concern.

Conceptually:

```text
Repository
→ implementation evidence source

MDS
→ evidence consumer and correlator
```

Repository operations must not become part of MDS Project Truth authority.

---

## 19. Implementation Baseline

Implementation evidence should refer to an identifiable baseline whenever
baseline identity affects verification or traceability.

A baseline may be identified through information such as:

```text
repository
commit
revision
build identifier
artifact identifier
```

MDS should avoid authoritative claims such as:

```text
"Implementation verified"
```

when the implementation baseline being referenced cannot be determined.

---

## 20. Implementation Evidence

The Implementation Plane may return evidence describing what occurred.

Examples include:

```text
Diff

Commit

Changed Files

Build Result

Test Result

Static Analysis Result

Migration Result

Deployment Result

Implementation Note
```

Evidence should remain attributable to the implementation baseline to which it
belongs.

---

## 21. Evidence is not Project Truth

Implementation Evidence describes observed implementation state.

It does not automatically rewrite Project Truth.

For example:

```text
Observed Code Behaviour
≠
Automatically Approved Requirement
```

If observed implementation differs from authoritative Project Truth, MDS must
surface the mismatch.

Possible governed outcomes may include:

```text
Implementation must change
```

or:

```text
Project Truth must be reconsidered through governance
```

MDS must not silently choose between them.

---

## 22. Evidence is not Approval

MDS must preserve:

```text
Implementation Evidence
≠
Human Approval
```

For example:

```text
Build PASS
≠
Architecture Approval

Tests PASS
≠
Business Approval

Deployment SUCCESS
≠
Release Authority
```

Evidence may support a governed human decision.

Evidence itself does not hold Human Approval Authority.

---

## 23. Implementation Claim is not Verification

An implementation executor may report:

```text
IMPLEMENTATION COMPLETE
```

This is an implementation claim.

It must remain distinguishable from:

```text
VERIFIED
```

MDS should preserve the distinction between:

```text
claimed implementation state

observed implementation evidence

verified conformance
```

Verification requires the applicable evidence and verification process.

---

## 24. Implementation and Verification

MDS may correlate implementation evidence against authoritative Project Truth.

Conceptually:

```text
Authoritative Specification
        │
        ├──────────────┐
        ↓              ↓
Implementation     Verification
Evidence              Rules
        │              │
        └──────┬───────┘
               ↓
        Conformance Analysis
```

The Implementation Plane provides evidence.

The applicable professional responsibilities and MDS system capabilities
perform verification and correlation.

---

## 25. Implementation Drift

Implementation Drift exists when observed implementation state differs from
current authoritative Project Truth.

Conceptually:

```text
Project Truth
     ≠
Observed Implementation
```

MDS should be able to detect or record this mismatch.

Implementation Drift must not automatically mutate either side.

It may trigger:

* analysis;
* review;
* impact assessment;
* implementation correction;
* governed truth change.

---

## 26. Untraced Implementation Changes

A managed project may contain implementation changes that cannot be traced to a
known governed Implementation Context.

Conceptually:

```text
Observed Change
      ↓
No matching governed context
      ↓
UNTRACED IMPLEMENTATION CHANGE
```

An untraced change is not automatically invalid.

However, it must not be silently assumed to be governed.

MDS may require further analysis or evidence before associating the change with
Project Truth.

---

## 27. Partial Implementation

Implementation may satisfy only part of the requested scope.

MDS should not force implementation state into a simple binary model when
evidence shows partial completion.

Conceptually:

```text
Requested Scope
├── Part A → implemented
├── Part B → implemented
└── Part C → not implemented
```

Implementation evidence should preserve the observed state rather than
overstate completion.

---

## 28. Failed Implementation

Failed implementation activity remains valid historical evidence.

Examples include:

* failed builds;
* failing tests;
* failed migrations;
* incomplete changes;
* abandoned attempts;
* Coding Agent failures;
* reverted changes.

A later successful attempt must not silently erase evidence of earlier failed
attempts when those attempts are relevant to lineage or analysis.

---

## 29. Implementation Attempts and Rework

Implementation may require multiple attempts.

Conceptually:

```text
Implementation Context
        ↓
Attempt 1
        ↓
Evidence
        ↓
Rework
        ↓
Attempt 2
        ↓
Evidence
```

Where relevant, MDS should preserve the relationship between attempts.

A later successful attempt must not rewrite the historical existence of prior
attempts.

---

## 30. Implementation and Business Truth

Implementation must not silently redefine approved business meaning.

If observed implementation conflicts with authoritative Business Truth:

```text
Observed Implementation
        ≠
Approved Business Truth
```

the mismatch must be surfaced.

Repository behaviour alone does not supersede a governed business decision.

---

## 31. Implementation and Architecture Truth

The Implementation Plane consumes authoritative architecture knowledge where
applicable.

It does not independently redefine Architecture Truth.

If implementation evidence shows that an architecture decision is impractical
or harmful:

```text
Implementation Evidence
        ↓
Architecture Analysis
        ↓
Architecture Governance
```

must occur where required.

Implementation convenience must not silently redefine Architecture Truth.

---

## 32. Implementation and Release

Implementation completion does not create Release Approval.

MDS must preserve:

```text
Implementation Complete
≠
Release Approved
```

Conceptually:

```text
Implementation
      ↓
Evidence
      ↓
Verification
      ↓
Release Assessment
      ↓
Release Authority
      ↓
Release Permission
      ↓
Delivery Execution
```

The exact release governance contract belongs to the applicable authority and
governance boundaries.

---

## 33. Deployment Execution

Deployment execution may occur within the external Implementation Plane through:

* Human Implementers;
* Delivery Automation;
* other governed implementation mechanisms.

Deployment execution is distinct from runtime operation.

Conceptually:

```text
Release Permission
      ↓
Deployment Execution
      ↓
Runtime Environment
```

Deployment Evidence may be returned to MDS.

Ongoing operational state belongs to the Runtime boundary.

---

## 34. Runtime Boundary

The Implementation Plane may deliver changes into a Runtime Environment.

Runtime is a separate canonical MDS boundary.

```text
Implementation Plane
      ↓
Deployment
      ↓
Runtime Environment
```

The Implementation Plane concerns execution of implementation changes.

Runtime concerns observed operational state and runtime evidence.

The two must not be collapsed into the same classification.

---

## 35. Approval Authority Boundary

No Implementation Plane participant automatically holds Human Approval
Authority.

MDS must preserve:

```text
Human Implementer
≠
Human Approval Authority

Coding Agent
≠
Human Approval Authority

Development Tool
≠
Human Approval Authority

Delivery Automation
≠
Human Approval Authority
```

A Human Implementer may separately receive an Authority Assignment.

That assignment belongs to the Authority governance model.

---

## 36. Coding Agent and Governance Authority

Coding Agents may perform highly autonomous implementation activity.

Implementation autonomy does not imply governance authority.

A Coding Agent may:

```text
analyse code
modify code
run tests
produce commits
produce evidence
```

but must not be interpreted as having the right to:

```text
approve Product Truth
approve Business Truth
approve Architecture Truth
approve Release
assign itself authority
```

Implementation capability and governance authority remain separate.

---

## 37. MDS System Capabilities

MDS system capabilities may interact with the Implementation Plane.

They may:

* build implementation context;
* export context packages;
* ingest implementation evidence;
* correlate evidence;
* identify baseline mismatch;
* detect stale context;
* detect implementation drift;
* calculate impact;
* prepare verification context.

They must not become implementation executors merely because they interact with
implementation artifacts or evidence.

System capability semantics belong to:

```text
../system-capabilities/
```

---

## 38. Tool Independence

The canonical Implementation Plane model must remain tool-independent.

MDS may integrate with different:

* coding agents;
* IDEs;
* repository systems;
* build systems;
* test systems;
* CI/CD systems.

The canonical model must not require any specific vendor or product.

Vendor-specific integration details belong to integration or project
configuration rather than this semantic model.

---

## 39. Participant Registry

This document defines general Implementation Plane semantics.

Canonical participant classes are registered separately in:

```text
./implementation-plane-registry.yaml
```

The registry must distinguish between:

```text
Canonical Participant Class
```

and:

```text
Specific Tool / Vendor / Integration
```

A product name must not become a canonical participant class merely because MDS
supports that product.

---

## 40. General Invariants

### IMPLEMENTATION-INV-001

The Implementation Plane is external to the MDS Project Truth authority
boundary.

### IMPLEMENTATION-INV-002

MDS must not directly modify managed-project source code or test code as part
of its canonical responsibility.

### IMPLEMENTATION-INV-003

Implementation State must not automatically become Project Truth.

### IMPLEMENTATION-INV-004

Approved Project Truth does not prove implementation completion.

### IMPLEMENTATION-INV-005

Implementation Evidence does not constitute Human Approval Authority.

### IMPLEMENTATION-INV-006

Coding Agents must not hold Human Approval Authority.

### IMPLEMENTATION-INV-007

Development Tools and Delivery Automation must not hold Human Approval
Authority.

### IMPLEMENTATION-INV-008

Implementation Evidence should be traceable to an identifiable implementation
baseline whenever baseline identity affects verification.

### IMPLEMENTATION-INV-009

Implementation Context should remain traceable to the authoritative Project
Truth from which it was derived.

### IMPLEMENTATION-INV-010

A stale Implementation Context must not be silently treated as current.

### IMPLEMENTATION-INV-011

Observed implementation divergence must not silently overwrite authoritative
Project Truth.

### IMPLEMENTATION-INV-012

Implementation completion must remain distinguishable from verification.

### IMPLEMENTATION-INV-013

Release Approval must remain distinct from deployment or release execution.

### IMPLEMENTATION-INV-014

Runtime Environments must remain distinct from the Implementation Plane.

### IMPLEMENTATION-INV-015

Read access to managed-project implementation artifacts does not imply mutation
authority.

### IMPLEMENTATION-INV-016

Vendor-specific tools must not define the canonical Implementation Plane
taxonomy.

### IMPLEMENTATION-INV-017

Failed or superseded implementation attempts must not be silently erased when
they are relevant to implementation lineage.

### IMPLEMENTATION-INV-018

Participation in the Implementation Plane does not automatically grant a
Professional Responsibility or Human Approval Authority.

---

## 41. Relationship to Other MDS Core Boundaries

```text
implementation-plane/
    │
    ├── Project Truth and governance
    │   → ../standards/
    │
    ├── Professional Responsibilities
    │   → ../roles/
    │
    ├── Human Approval Authorities
    │   → ../authorities/
    │
    ├── External Actors
    │   → ../actors/
    │
    ├── Runtime Evidence
    │   → ../runtime/
    │
    ├── Structured Contracts
    │   → ../schemas/
    │
    ├── MDS System Capabilities
    │   → ../system-capabilities/
    │
    └── AI Instructions
        → ../prompts/
```

This boundary owns:

* external implementation execution semantics;
* implementation participant-class semantics;
* Implementation Context semantics;
* Implementation Evidence semantics;
* Implementation Baseline semantics;
* implementation execution boundary rules.

It must not duplicate canonical rules owned by other MDS Core boundaries.

---

## 42. Extension Principle

The Implementation Plane taxonomy should remain intentionally small.

Before adding a new canonical participant class, determine whether the proposed
concept is merely:

```text
a vendor

a tool

an integration

a product

a specialised instance
```

of an existing class.

Prefer:

```text
Canonical Participant Class
+
Project / Integration Configuration
```

over creating a new canonical class for every implementation technology.

A new participant class should only be introduced when it represents a
meaningfully different implementation-plane semantic.

Principle:

> **Model how implementation is executed, not which vendor performs it.**
