---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
canonical_target:
  - ./implementation-plane-model.md
  - ./implementation-plane-registry.yaml
update_strategy: change only through the applicable governed approval process
---

# External Implementation Plane

This directory defines the canonical **External Implementation Plane** boundary
of MDS.

The Implementation Plane is the execution boundary in which governed technical
intent is translated into changes to a managed project.

It may contain:

```text
Human Implementers

Coding Agents

Development Tools / Environments

Delivery Automation
```

The Implementation Plane performs implementation execution.

It does not own Project Truth, Human Approval Authority, professional
responsibility semantics, or runtime truth.

---

## 1. Canonical Ownership

Canonical ownership within this directory is divided as follows:

```text
implementation-plane-model.md
→ general Implementation Plane semantics, boundaries, and invariants

implementation-plane-registry.yaml
→ canonical Implementation Plane participant-class registry
```

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed Implementation Plane
semantics.

---

## 2. Core Boundary

MDS must preserve the distinction:

```text
MDS
→ governs and preserves Project Truth

Implementation Plane
→ executes changes against the managed project
```

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

The Implementation Plane exists outside the MDS Project Truth authority
boundary.

---

## 3. Current Canonical Participant Classes

MDS currently recognises four canonical Implementation Plane participant
classes:

```text
Human Implementer

Coding Agent

Development Tool / Environment

Delivery Automation
```

These classes describe how implementation work may be performed.

They do not represent:

* Professional Responsibilities;
* External Actor Types;
* Human Approval Authorities;
* Runtime Environments;
* MDS System Capabilities.

The canonical class list is registered in:

```text
./implementation-plane-registry.yaml
```

---

## 4. Participant Class is not Tool Identity

Implementation Plane participant classes are semantic categories.

They must not be confused with specific tools, vendors, products, services, or
individual identities.

For example:

```text
Coding Agent
→ canonical participant class

specific coding product
→ project or integration instance
```

Likewise:

```text
Development Tool / Environment
→ canonical participant class

specific IDE or editor
→ project or integration instance
```

And:

```text
Delivery Automation
→ canonical participant class

specific CI/CD platform
→ project or integration instance
```

Principle:

> **Model implementation capability classes, not vendor catalogues.**

---

## 5. Implementation State is not Project Truth

MDS must preserve:

```text
Implementation State
≠
Project Truth
```

The existence of implementation artifacts does not automatically establish
authoritative project knowledge.

Examples of implementation artifacts may include:

* source code;
* test code;
* configuration;
* migrations;
* infrastructure definitions;
* scripts;
* build artifacts;
* deployment definitions.

Repository reality is evidence of implementation state.

It must not silently replace governed Project Truth.

Detailed semantics belong to:

```text
./implementation-plane-model.md
```

---

## 6. Project Truth is not Implementation Completion

The reverse distinction must also be preserved:

```text
Approved Project Truth
≠
Implemented Behaviour
```

An approved specification does not prove that the managed project currently
implements it.

Implementation completion must be supported by implementation evidence and the
applicable verification process.

---

## 7. Implementation Context

Implementation activity should be driven by a bounded context derived from
applicable Project Truth.

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

Implementation Context may include references to:

* requirements;
* system specifications;
* architecture decisions;
* constraints;
* acceptance criteria;
* affected artifacts;
* known risks;
* impact information;
* verification expectations.

The Implementation Plane consumes this context.

It does not make that context authoritative.

---

## 8. Context Provenance and Freshness

Implementation Context should remain traceable to the Project Truth from which
it was produced.

MDS should be able to determine:

```text
Which truth versions produced this context?

Which decisions were current?

Which constraints applied?

When was the context created?

Which implementation activity used it?
```

A context may become stale when relevant Project Truth changes.

An old context must not be silently treated as current.

Detailed context semantics belong to:

```text
./implementation-plane-model.md
```

---

## 9. Implementation Evidence

The Implementation Plane may return evidence such as:

```text
Commit

Diff

Changed Files

Build Result

Test Result

Static Analysis Result

Migration Result

Deployment Result

Implementation Note
```

Implementation Evidence describes observed implementation activity or state.

It does not automatically become Project Truth.

It also does not constitute Human Approval Authority.

---

## 10. Evidence is not Approval

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
Release Approval
```

Evidence may support an authoritative human decision.

Evidence itself does not hold authority.

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 11. Implementation is not Verification

MDS must preserve:

```text
Implementation Complete
≠
Verified
```

An implementation executor may claim that work is complete.

Verification requires relevant evidence and the applicable verification
process.

Conceptually:

```text
Implementation Claim
        ↓
Implementation Evidence
        ↓
Verification / Correlation
        ↓
Conformance Result
```

Implementation and verification must remain separate concerns.

---

## 12. Human Implementer Boundary

A Human Implementer may directly perform implementation work such as:

* modifying source code;
* modifying tests;
* modifying configuration;
* creating migrations;
* executing development commands;
* reviewing diffs;
* creating commits.

Implementation Plane participation does not automatically grant:

```text
Professional Responsibility

or

Human Approval Authority
```

A human may separately hold those classifications through the applicable
governance model.

---

## 13. Coding Agent Boundary

A Coding Agent may:

* inspect implementation artifacts;
* modify source code;
* modify tests;
* modify configuration;
* execute development commands;
* run builds;
* run tests;
* produce commits;
* return implementation evidence.

A Coding Agent may be highly autonomous within implementation execution.

However:

```text
Implementation Autonomy
≠
Governance Authority
```

A Coding Agent must not be treated as Product, Business, Architecture, or
Release Authority.

---

## 14. Development Tool / Environment Boundary

A Development Tool / Environment provides implementation capability.

It may include:

* editors;
* IDEs;
* shells;
* debuggers;
* repository clients;
* build tools;
* development containers;
* local development environments.

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
Human Approval Authority
```

---

## 15. Delivery Automation Boundary

Delivery Automation may:

* build implementation artifacts;
* execute automated tests;
* package artifacts;
* promote artifacts;
* execute deployments;
* verify deployment execution;
* return delivery evidence.

Delivery Automation may execute an authorised release action.

It does not become Release Authority.

Conceptually:

```text
Release Authority
      ↓
Release Permission
      ↓
Delivery Automation
      ↓
Deployment Execution
```

Release permission and deployment execution must remain distinct.

---

## 16. Read Access is not Mutation Authority

MDS may inspect managed-project implementation artifacts where necessary for:

* evidence collection;
* traceability;
* impact analysis;
* verification;
* drift detection;
* context generation.

Read access does not imply permission to modify the managed project.

MDS must preserve:

```text
Can Read
≠
Can Modify
```

Implementation mutation belongs to the external Implementation Plane.

---

## 17. Repository Boundary

Source repositories may provide implementation evidence.

MDS may consume information such as:

* commits;
* branches;
* tags;
* diffs;
* changed files;
* repository state;
* implementation baselines.

Repository mutation remains outside the MDS Project Truth management boundary.

Conceptually:

```text
Repository
→ implementation evidence source

MDS
→ evidence consumer and correlator
```

---

## 18. Implementation Baseline

Implementation evidence should refer to an identifiable implementation baseline
whenever baseline identity affects verification.

A baseline may be represented using information such as:

```text
repository

commit

revision

build identifier

artifact identifier
```

MDS must not silently correlate evidence from incompatible baselines.

Detailed baseline semantics belong to:

```text
./implementation-plane-model.md
```

---

## 19. Implementation Drift

Implementation Drift exists when observed implementation state differs from
current authoritative Project Truth.

```text
Project Truth
     ≠
Observed Implementation
```

MDS should surface the mismatch.

It must not silently:

```text
change Project Truth to match code
```

or:

```text
claim the implementation is correct because code exists
```

The applicable analysis, verification, or governance process determines the
required response.

---

## 20. Untraced Implementation Changes

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

However, it must not be silently represented as governed implementation.

---

## 21. Runtime Boundary

The Implementation Plane and Runtime are separate boundaries.

```text
Implementation Plane
      ↓
Deployment
      ↓
Runtime Environment
```

The Implementation Plane concerns execution of implementation changes.

Runtime concerns observed operational state and runtime evidence after those
changes are operating.

Runtime semantics belong to:

```text
../runtime/
```

---

## 22. Professional Responsibility Boundary

The Implementation Plane does not define professional responsibility.

For example:

```text
Backend Responsibility
≠
Human Implementer

Architecture Responsibility
≠
Coding Agent

DevOps / SRE Responsibility
≠
Delivery Automation
```

Professional responsibilities describe professional accountability and work.

Implementation Plane classes describe execution participants or mechanisms.

Professional responsibility semantics belong to:

```text
../roles/
```

---

## 23. Human Approval Authority Boundary

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

Development Tool / Environment
≠
Human Approval Authority

Delivery Automation
≠
Human Approval Authority
```

Human authority semantics belong to:

```text
../authorities/
```

---

## 24. MDS System Capability Boundary

MDS system capabilities may interact with the Implementation Plane.

They may:

* build context packages;
* export implementation context;
* ingest evidence;
* correlate evidence;
* detect stale context;
* identify baseline mismatches;
* detect implementation drift;
* calculate impact;
* prepare verification context.

They must not become implementation executors merely because they inspect or
process implementation information.

System capability semantics belong to:

```text
../system-capabilities/
```

---

## 25. Routing Boundary

This directory owns External Implementation Plane semantics only.

Related concerns must be routed as follows:

```text
Professional Responsibilities
→ ../roles/

External Actors
→ ../actors/

Human Approval Authorities
→ ../authorities/

Runtime and operational evidence
→ ../runtime/

Artifact Truth and governance standards
→ ../standards/

Structured data contracts
→ ../schemas/

MDS internal automation
→ ../system-capabilities/

AI instructions
→ ../prompts/

Usage guidance
→ ../guides/

Examples
→ ../examples/
```

This routing prevents implementation semantics from becoming duplicated across
unrelated MDS Core boundaries.

---

## 26. What This Boundary Owns

`implementation-plane/` owns:

* external implementation execution semantics;
* Implementation Plane participant-class semantics;
* Implementation Context semantics;
* Implementation Evidence semantics;
* Implementation Baseline semantics;
* implementation-versus-truth boundaries;
* implementation-versus-verification boundaries;
* implementation-versus-runtime boundaries.

It does not own:

* Project Truth lifecycle;
* professional responsibility definitions;
* human authority semantics;
* runtime semantics;
* evidence schemas;
* AI prompt behaviour;
* vendor-specific integration configuration.

---

## 27. Extension Policy

The Implementation Plane taxonomy must remain intentionally small.

Before adding a new participant class, determine whether the concept is merely:

```text
a vendor

a product

a tool

an integration

a specialised instance
```

of an existing canonical participant class.

Prefer:

```text
Canonical Participant Class
+
Project / Integration Configuration
```

over creating a new canonical class for every tool or implementation
technology.

A new participant class should only be introduced when it represents a
meaningfully different implementation semantic.

Principle:

> **Model how implementation is executed, not which vendor performs it.**

---

## 28. Source of Truth

Canonical ownership within this boundary is:

```text
General Implementation Plane semantics and invariants
→ ./implementation-plane-model.md

Canonical participant-class registry
→ ./implementation-plane-registry.yaml
```

Specific tools, vendors, humans, integrations, repositories, environments, and
project configurations belong to project or integration data rather than the
canonical MDS Core participant taxonomy.

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed Implementation Plane
semantics.
