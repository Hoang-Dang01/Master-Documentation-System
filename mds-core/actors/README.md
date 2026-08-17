---

ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
canonical_target:

* ./actor-model.md
* ./actor-registry.yaml
* ./customer-stakeholder.md
  update_strategy: extend only through an approved governed workflow

---

# External Actors

This boundary contains the canonical MDS model for people or organisations that
exist outside the professional responsibility model but interact with a project
through intent, process knowledge, confirmation, feedback, or change requests.

External Actors are not Professional Roles.

They are part of the external reality that MDS observes, preserves, and routes
into governed professional workflows.

---

## Canonical ownership

The External Actor boundary is divided into three canonical responsibilities:

```text
actor-model.md
→ defines the semantics, invariants, and boundaries of External Actors

actor-registry.yaml
→ registers the External Actor Types currently recognised by MDS

customer-stakeholder.md
→ defines the current canonical Customer / Stakeholder Actor Type
```

The global MDS classification model may identify `external_actor` as a
top-level classification, but detailed External Actor semantics are owned by
this folder.

No other document should independently redefine what an External Actor means.

---

## Current classification

The current canonical External Actor Type is:

```text
Customer / Stakeholder
```

This classification represents a person or organisation that may provide:

* intent;
* problems or needs;
* process knowledge;
* constraints;
* clarification;
* confirmation;
* feedback;
* change requests.

The canonical list of recognised Actor Types is maintained in
`actor-registry.yaml`.

---

## Boundary

`actors/` owns:

* External Actor semantics;
* External Actor classification rules;
* canonical Actor Type registration;
* type-specific External Actor definitions.

`actors/` does not own:

* professional responsibilities;
* approval authority;
* implementation authority;
* runtime environments;
* AI agent behaviour;
* artifact schemas;
* workflow execution;
* project-specific actor instances.

---

## Classification boundaries

External Actors must remain distinct from the other MDS classifications.

```text
Customer / Stakeholder
→ External Actor
→ actors/

Product / BA / System / Architecture / FE / BE / QA / ...
→ Professional Responsibility
→ roles/

Developer / Codex / IDE / CI-CD
→ External Implementation Plane
→ implementation-plane/

Human approval authorities
→ Approval Authority
→ authorities/

Production
→ Runtime Environment
→ runtime/

Orchestrator / Knowledge Curator / Validator / Context Builder
→ MDS System Capability
→ system-capabilities/
```

Classification does not imply authority.

A person may participate in more than one dimension of a project, but those
dimensions must remain independently modelled.

For example, a real person may simultaneously be:

```text
External Actor
+
Professional Responsibility holder
+
Approval Authority holder
```

without those classifications becoming equivalent.

---

## Actor Types and Actor Instances

`mds-core/actors/` contains canonical Actor Types only.

It must not contain project-specific people or organisations.

```text
MDS Core
Customer / Stakeholder
        │
        │ instantiated in a project
        ▼
Project Data
Actor Instance A
Actor Instance B
Actor Instance C
```

Actor Instances belong to project data and must follow the applicable schemas
and provenance rules.

---

## No autonomous actor agents

The existence of an Actor Type does not create an autonomous AI agent.

In particular:

```text
Customer / Stakeholder
≠
Customer Agent
≠
Stakeholder Agent
```

MDS may use AI to analyse information supplied by an External Actor, but AI
must not impersonate an External Actor and then treat generated output as real
actor input, confirmation, or authority.

Detailed invariants are defined in `actor-model.md`.

---

## No implicit approval authority

Being classified as a Customer / Stakeholder does not automatically grant
approval rights.

Approval authority is modelled separately in `authorities/`.

```text
Actor identity
≠
Approval authority
```

An Actor Instance may reference an Approval Authority when governance explicitly
grants that authority.

---

## Routing

Information supplied by an External Actor is routed into the appropriate
professional responsibility or governed workflow.

At a conceptual level:

```text
External Actor
      │
      ├── intent / problem / product feedback
      │            ↓
      │     Product Management
      │
      ├── process knowledge / business information
      │            ↓
      │      Business Analysis
      │
      ├── clarification / confirmation
      │            ↓
      │     requesting responsibility
      │
      └── change request
                   ↓
          governed change workflow
```

This README does not define workflow behaviour.

Workflow ownership remains outside the Actor boundary.

---

## Relationship to other MDS Core areas

```text
actors/
    │
    ├── professional responsibilities ──► roles/
    ├── approval authority ─────────────► authorities/
    ├── data structure ─────────────────► schemas/
    ├── governance rules ───────────────► standards/
    ├── interaction templates ──────────► templates/
    ├── AI instructions ────────────────► prompts/
    └── usage guidance ─────────────────► guides/
```

Each concern must remain owned by its canonical boundary.

Do not duplicate canonical rules across folders.

---

## Extension policy

MDS intentionally keeps the External Actor taxonomy minimal.

Do not create a new Actor Type merely because a project contains another job
title, department, organisation, or stakeholder category.

A new canonical Actor Type may be introduced only when:

1. the existing Actor Type cannot represent the required semantics;
2. the distinction changes how MDS must interpret or route project knowledge;
3. project-level metadata is insufficient to represent the distinction; and
4. the change is approved through the governed workflow.

The Actor registry must be updated whenever a new canonical Actor Type is
approved.

---

## Source-of-truth rule

For this boundary:

```text
External Actor semantics
→ actor-model.md

Canonical Actor Types
→ actor-registry.yaml

Customer / Stakeholder semantics
→ customer-stakeholder.md

Global MDS classification
→ ../roles/role-model.md
  and the applicable global registry
```

If another document conflicts with these sources, resolve the conflict through
the canonical-source and migration process rather than creating another
competing definition.
