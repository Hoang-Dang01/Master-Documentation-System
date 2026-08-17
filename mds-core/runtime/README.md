---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
canonical_target:
  - ./runtime-model.md
  - ./runtime-registry.yaml
update_strategy: change only through the applicable governed approval process
---

# Runtime Environment

This directory defines the canonical **Runtime Environment** boundary of MDS.

Runtime represents the operational environment in which deployed implementation
artifacts execute and produce observable behaviour.

Runtime is primarily an **evidence boundary**.

It provides information about what actually happened during operation.

It does not decide what should be true.

---

## 1. Canonical Ownership

Canonical ownership within this directory is divided as follows:

```text
runtime-model.md
→ general Runtime Environment semantics, boundaries, and invariants

runtime-registry.yaml
→ canonical Runtime Evidence class registry
```

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed Runtime semantics.

---

## 2. Core Boundary

MDS must preserve:

```text
Project Truth
→ what the governed project knowledge says should be true

Runtime
→ what is actually observed while the system is operating
```

Conceptually:

```text
Implementation Plane
      ↓
Deployment
      ↓
────────────────────
 RUNTIME ENVIRONMENT
────────────────────
      ↓
Observed Behaviour
      ↓
Runtime Evidence
      ↓
MDS Correlation / Analysis
      ↓
Verification / Impact / Feedback
```

Runtime provides operational evidence.

MDS consumes, correlates, and reasons about that evidence.

---

## 3. Runtime is not Project Truth

MDS must preserve:

```text
Runtime State
≠
Project Truth
```

Observed runtime behaviour does not automatically become authoritative project
knowledge.

Likewise:

```text
Repository Reality
≠
Project Truth

Runtime Reality
≠
Project Truth
```

Runtime may reveal that Project Truth and operational reality differ.

The mismatch must be surfaced rather than silently reconciled.

---

## 4. Project Truth is not Runtime Conformance

The reverse distinction must also be preserved:

```text
Approved Specification
≠
Observed Runtime Behaviour
```

An approved specification does not prove that the deployed system behaves
according to that specification.

Runtime conformance requires evidence and the applicable verification process.

---

## 5. Runtime is not the Implementation Plane

MDS must preserve:

```text
Implementation Plane
≠
Runtime Environment
```

The Implementation Plane performs activities such as:

- modifying implementation artifacts;
- building software;
- running implementation tests;
- packaging artifacts;
- executing deployment.

Runtime begins when deployed implementation is operating in an environment.

Conceptually:

```text
Implementation Plane
      ↓
Deployment
      ↓
Runtime Environment
```

Implementation execution and operational observation are separate concerns.

Implementation Plane semantics belong to:

```text
../implementation-plane/
```

---

## 6. Deployment Success is not Runtime Health

MDS must preserve:

```text
Deployment Success
≠
Runtime Health
```

A deployment may complete successfully while the deployed system later becomes:

```text
DEGRADED

UNHEALTHY

UNAVAILABLE
```

Deployment evidence belongs to implementation and delivery execution.

Runtime health belongs to operational evidence.

---

## 7. Current Canonical Runtime Classes

MDS currently recognises the following canonical Runtime Evidence classes:

```text
Runtime Observation

Telemetry Evidence

Health Evidence

Incident Evidence

Operational Event
```

These classes are registered in:

```text
./runtime-registry.yaml
```

They represent runtime semantics.

They do not represent specific monitoring tools, vendors, services, or
environment names.

---

## 8. Runtime Observation

A Runtime Observation records something observed about runtime state or
behaviour.

It may capture:

- what was observed;
- where it was observed;
- when it was observed;
- the relevant runtime context;
- the evidence source;
- available implementation baseline information;
- provenance.

A Runtime Observation is evidence.

It is not a governed decision.

---

## 9. Telemetry Evidence

Telemetry Evidence represents machine-generated operational measurements such
as:

- logs;
- metrics;
- traces;
- counters;
- timings;
- resource measurements;
- availability measurements;
- throughput measurements.

Telemetry may support analysis of:

- performance;
- reliability;
- anomalies;
- failures;
- operational behaviour;
- runtime drift.

Telemetry does not hold Human Approval Authority.

---

## 10. Health Evidence

Health Evidence describes whether a runtime component or system appears to be
operating within applicable health expectations.

Conceptual observations may include:

```text
HEALTHY

DEGRADED

UNHEALTHY

UNKNOWN
```

The exact health-state contract belongs to the applicable schema or operational
standard.

Health Evidence does not automatically modify Project Truth.

---

## 11. Incident Evidence

Incident Evidence describes an operational condition involving meaningful
failure, degradation, risk, or unexpected impact.

Incident Evidence may include:

- incident identity;
- affected runtime scope;
- detection time;
- symptoms;
- impact;
- timeline;
- observed failures;
- related implementation baseline;
- mitigation;
- recovery evidence.

An incident records what happened.

It does not automatically establish the confirmed root cause.

---

## 12. Operational Event

An Operational Event is a runtime-relevant event useful for traceability or
analysis.

Examples may include:

- restart;
- recovery;
- dependency failure;
- failover;
- scaling event;
- configuration reload;
- threshold breach;
- runtime verification event.

MDS must preserve:

```text
Operational Event
≠
Incident
```

Not every runtime event represents an incident.

---

## 13. Evidence is not Approval

MDS must preserve:

```text
Runtime Evidence
≠
Human Approval
```

For example:

```text
Health Check PASS
≠
Release Approval

No Incident Detected
≠
Business Approval

Acceptable Performance
≠
Architecture Approval
```

Runtime evidence may support a governed human decision.

Evidence itself does not hold authority.

Human Approval Authority semantics belong to:

```text
../authorities/
```

---

## 14. Observed Behaviour is not Automatically Correct Behaviour

MDS must preserve:

```text
Observed Behaviour
≠
Automatically Correct Behaviour
```

A system may consistently behave in a way that conflicts with:

- Business Truth;
- System Specification;
- Architecture constraints;
- quality expectations;
- security expectations.

Observed behaviour must not silently become authoritative simply because it
exists.

---

## 15. Runtime Conformance

Runtime Evidence may be compared with authoritative expectations.

Conceptually:

```text
Project Truth
      │
      ├───────────────┐
      ↓               ↓
Expected Behaviour   Runtime Evidence
      │               │
      └───────┬───────┘
              ↓
      Conformance Analysis
```

Possible conceptual outcomes may include:

```text
CONFORMS

DOES_NOT_CONFORM

PARTIALLY_CONFORMS

UNKNOWN
```

The exact verification state belongs to the applicable schema or standard.

Runtime itself does not issue the conformance decision.

---

## 16. Runtime Drift

Runtime Drift exists when observed runtime behaviour differs from current
authoritative expectations.

```text
Project Truth
     ≠
Observed Runtime Behaviour
```

Possible causes may include:

- implementation defects;
- configuration drift;
- infrastructure problems;
- dependency changes;
- stale Project Truth;
- incorrect assumptions;
- environment-specific behaviour;
- undocumented operational changes.

MDS must surface the mismatch.

It must not automatically choose the cause or mutate Project Truth.

---

## 17. Runtime Context

Runtime Evidence should retain sufficient context for correct interpretation.

Runtime context may include:

- environment;
- region;
- runtime component;
- service;
- instance;
- deployment identifier;
- configuration version;
- observation window;
- dependency state;
- implementation baseline.

The concrete representation belongs to:

```text
../schemas/
```

---

## 18. Runtime Environment Identity

The canonical Runtime Environment concept must remain separate from
project-specific environment instances.

Conceptually:

```text
Runtime Environment
→ canonical semantic concept

Specific Environment
→ project or operational instance
```

Project-specific instances may use labels such as:

```text
development

test

staging

production
```

These labels must not automatically become new canonical Runtime Types.

---

## 19. Environment is not Authority

MDS must preserve:

```text
Production Environment
≠
Release Authority
```

An environment is an operational context.

An Authority is a governed human decision right.

Environment names must not grant approval authority.

---

## 20. Runtime Evidence and Implementation Baseline

Runtime Evidence should be linked to an identifiable implementation baseline
when possible and relevant.

A baseline may be represented using:

```text
repository revision

commit

build identifier

artifact identifier

deployment identifier

release identifier
```

MDS must not silently assume a baseline when it cannot be established.

Unknown baseline identity must remain visible as uncertainty.

---

## 21. Stale Runtime Evidence

Runtime Evidence may become stale.

Conceptually:

```text
Observation at Time A
      ↓
Runtime changes
      ↓
Observation may no longer describe current state
```

MDS should preserve timestamps and observation windows.

Historical evidence may remain valid historical evidence without being valid
current-state evidence.

---

## 22. Conflicting Runtime Evidence

Different runtime evidence sources may disagree.

For example:

```text
Health Probe
→ HEALTHY

Error Rate
→ DEGRADED

Observed User Outcome
→ FAILURE
```

MDS must not silently choose one source.

Conflicting evidence should remain visible until analysis resolves the
discrepancy.

AI may identify and explain evidence conflicts.

AI must not silently resolve them by preference.

---

## 23. Incident is not Confirmed Root Cause

MDS must preserve:

```text
Observed Incident
≠
Confirmed Root Cause
```

Conceptually:

```text
Incident Observation
      ↓
Root-Cause Hypothesis
      ↓
Analysis
      ↓
Supporting Evidence
      ↓
Confirmed Cause
```

A hypothesis must remain distinguishable from confirmed knowledge.

---

## 24. Runtime Feedback

Runtime provides feedback into the broader MDS knowledge process.

Conceptually:

```text
Project Truth
      ↓
Implementation
      ↓
Runtime
      ↓
Operational Evidence
      ↓
Feedback
      ↓
Analysis / Impact / Change
      ↓
Updated Project Truth if governed
```

Runtime feedback may reveal:

- incorrect assumptions;
- missing requirements;
- unexpected behaviour;
- operational constraints;
- performance limitations;
- reliability issues;
- architecture weaknesses;
- actual usage patterns.

Runtime evidence must not directly modify Project Truth.

---

## 25. Runtime and Product Feedback

Operational evidence may provide product-level signals such as:

- usage patterns;
- adoption;
- observed outcomes;
- operational impact;
- recurring failures.

These signals may inform Product Management and Product Authority.

Runtime itself does not determine:

```text
Product Scope

Product Priority

Product Direction
```

---

## 26. Runtime and Business Truth

Observed runtime behaviour may conflict with approved Business Truth.

```text
Approved Business Truth
        ≠
Observed Runtime Behaviour
```

The mismatch may indicate:

- an implementation defect;
- a missing requirement;
- incorrect configuration;
- stale Business Truth;
- an incorrect assumption.

Runtime behaviour alone does not supersede a governed business decision.

---

## 27. Runtime and Architecture Truth

Runtime may expose incorrect or outdated architecture assumptions.

Examples may include:

- unexpected latency;
- reliability problems;
- scaling limitations;
- operational coupling;
- dependency instability;
- resource exhaustion.

Conceptually:

```text
Runtime Evidence
      ↓
Architecture Analysis
      ↓
Architecture Governance
```

Runtime evidence may justify architecture reconsideration.

It does not directly rewrite Architecture Truth.

---

## 28. Runtime and Release

Release Authority determines whether a defined release may proceed.

Runtime provides operational evidence after or during execution.

Conceptually:

```text
Release Authority
      ↓
Release Permission
      ↓
Deployment
      ↓
Runtime Environment
      ↓
Operational Evidence
```

Release Approval does not guarantee healthy runtime behaviour.

Runtime failure does not erase the historical release decision.

---

## 29. Runtime and Support / Operations

Support / Operations may consume Runtime Evidence.

However:

```text
Runtime Environment
≠
Support / Operations Responsibility
```

Runtime is the operational evidence boundary.

Support / Operations is a Professional Responsibility.

Professional responsibility semantics belong to:

```text
../roles/
```

---

## 30. Observation is not Operational Control

MDS may observe Runtime information where necessary for:

- verification;
- evidence collection;
- incident correlation;
- impact analysis;
- operational feedback.

MDS must preserve:

```text
Can Observe
≠
Can Operate
```

Observability does not automatically allow MDS to:

- restart services;
- modify runtime configuration;
- scale infrastructure;
- execute recovery;
- alter operational data;
- deploy changes.

Operational mutation belongs to the applicable external execution boundary.

---

## 31. MDS System Capability Boundary

MDS System Capabilities may interact with Runtime Evidence.

They may:

- ingest telemetry;
- correlate operational events;
- detect stale evidence;
- detect evidence conflict;
- identify Runtime Drift;
- correlate incidents with implementation baselines;
- calculate impact;
- prepare verification context;
- surface anomalies.

They must not become Runtime Environments.

System capability semantics belong to:

```text
../system-capabilities/
```

---

## 32. Tool Independence

The canonical Runtime model must remain vendor-independent.

MDS may integrate with different:

- logging platforms;
- monitoring systems;
- tracing systems;
- observability platforms;
- infrastructure systems;
- cloud environments.

Specific products or vendors belong to integration or project configuration.

They must not define the canonical Runtime taxonomy.

Principle:

> **Model what is observed at runtime, not which vendor observes it.**

---

## 33. Routing Boundary

This directory owns Runtime Environment and Runtime Evidence semantics only.

Related concerns must be routed as follows:

```text
Professional Responsibilities
→ ../roles/

External Actors
→ ../actors/

Human Approval Authorities
→ ../authorities/

Implementation Execution
→ ../implementation-plane/

Artifact Truth and governance
→ ../standards/

Structured Runtime Contracts
→ ../schemas/

MDS System Capabilities
→ ../system-capabilities/

AI Instructions
→ ../prompts/

Usage Guidance
→ ../guides/

Examples
→ ../examples/
```

This routing prevents Runtime semantics from being duplicated across unrelated
MDS Core boundaries.

---

## 34. What This Boundary Owns

`runtime/` owns:

- Runtime Environment semantics;
- Runtime Evidence semantics;
- Runtime Observation semantics;
- Runtime Context semantics;
- runtime-versus-truth boundaries;
- runtime-versus-implementation boundaries;
- runtime evidence provenance;
- runtime feedback semantics.

It does not own:

- Professional Responsibility definitions;
- Human Approval Authority;
- implementation execution;
- Project Truth lifecycle;
- concrete runtime schemas;
- vendor integrations;
- AI prompt behaviour.

---

## 35. Extension Policy

The Runtime taxonomy must remain intentionally small.

Before adding a new canonical Runtime class, determine whether the proposed
concept is merely:

```text
a vendor

a monitoring tool

a telemetry platform

an environment name

a project-specific service

a specialised evidence source
```

of an existing Runtime class.

Prefer:

```text
Canonical Runtime Class
+
Project / Integration Configuration
```

over creating new canonical classes for specific operational technologies.

A new Runtime class should only be introduced when it represents a genuinely
different runtime semantic.

---

## 36. Source of Truth

Canonical ownership within this boundary is:

```text
General Runtime semantics and invariants
→ ./runtime-model.md

Canonical Runtime Evidence class registry
→ ./runtime-registry.yaml
```

Specific monitoring systems, environments, vendors, runtime instances, and
integration configurations belong to project or integration data.

This README defines the directory boundary and routing model only.

It must not become a competing source for detailed Runtime semantics.