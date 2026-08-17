---
id: MDS-ROLE-MODEL-001
title: MDS professional responsibility model
version: 0.1.0
lifecycle_state: DRAFT
owner: human-project-authority
source_refs:
  - docs/foundation/product-boundary.md
  - docs/foundation/architecture-decision.md
  - mds-core/standards/artifact_truth.md
---

# MDS professional responsibility model

## Purpose

MDS represents responsibilities that surround governed Project Truth. The
model is a collaboration map, not an organization chart, a strict waterfall,
or a set of autonomous implementation agents.

## Classification boundary

`roles/` models only the 13 internal professional responsibilities. It must
not be used as a catch-all folder for people, tools, environments, or MDS
internals. The surrounding model is classified as follows:

```text
MDS model
├── roles/                 13 professional responsibilities
├── actors/                Customer / Stakeholder
├── implementation-plane/  Developer / Codex / IDE / CI-CD
├── authorities/           Human approver / Product Owner / Architecture authority
├── runtime/               Production
└── system-capabilities/   Orchestrator / Knowledge Curator / Validator / Context Builder
```

The five named non-role folders are intentional physical boundaries. This
classification does not authorize a separate folder for every listed entry, a
new agent, or a runtime feature. A later implementation may model a concept in
detail only when a governed workflow needs it.

### Professional responsibility is not approval authority

A person may hold both a professional responsibility and an approval authority
in a project. MDS records those facts separately:

```text
Product Management     → decides what outcome or priority to propose
Product Owner authority → may approve the relevant human gate
```

Neither label automatically grants the other. Human approval requirements
remain governed by the applicable artifact and workflow gate.

### MDS role is not implementation actor

MDS roles such as Frontend, Backend, and Database define or review governed
specifications, constraints, quality gates, and evidence. A Developer, Codex,
IDE, or CI/CD system in the external Implementation Plane performs the actual
managed-project implementation and can return read-only evidence to MDS.

```text
Customer / Stakeholder
          ↓
Product Management → Business Analysis → System Analysis → Architecture / Tech Lead
          ↓
UI/UX · Frontend · Backend · Database → Quality Assurance → DevOps / SRE
          ↓
Support / Operations ───────────────────────────────────────→ product feedback

Project Management and Security apply across the flow.
```

## MDS boundary

MDS captures, structures, analyses, approves through human gates, traces, and
presents governed artifacts. It can create a bounded context package for the
external Implementation Plane and receive read-only implementation evidence.

No role contract authorizes MDS to modify a managed project's source or test
code, create commits or pull requests, deploy, release, or auto-approve an
artifact. Those actions belong to a developer, IDE, coding agent, CI/CD, and
the relevant human authority outside MDS.

## Responsibility groups

| Group | Roles | Primary contribution to Project Truth |
|---|---|---|
| Product direction | Product Management, Business Analysis | Problem, outcome, scope proposal, requirements, business rules |
| Solution definition | System Analysis, Architecture / Tech Lead | System behavior, constraints, interfaces, technical decisions |
| Delivery design | UI/UX, Frontend, Backend, Database | Experience, contracts, data and behavior specifications |
| Verification and operations | Quality Assurance, DevOps / SRE, Support / Operations | Verification criteria, operational expectations, evidence, feedback |
| Cross-cutting governance | Project Management, Security | Delivery coordination and risk; security constraints and evidence |

Customer/Stakeholder is an external actor. Production is a runtime environment
and evidence source. Neither is a folder under `roles/`.

## Directory sequence

The canonical directory sequence makes the responsibility flow visible:

```text
01 Product Management
02 Business Analysis
03 System Analysis
04 Architecture / Tech Lead
05 UI/UX
06 Frontend
07 Backend
08 Database
09 Quality Assurance
10 DevOps / SRE
11 Support / Operations
12 Project Management (cross-cutting)
13 Security (cross-cutting)
```

The four delivery-design responsibilities at 05–08 are parallel specialisms
after solution constraints are known, not a claim that each waits for the
previous one to finish.

## Authority rules

1. A role may propose or review within its contract; it cannot promote its own
   proposal to Project Truth.
2. Approved upstream artifacts are required before downstream binding work.
   Draft, stale, conflicted, or unverified material remains labelled input.
3. A role's output must retain source references, version lineage, and the
   reason for its conclusion.
4. Project Management coordinates delivery; Product Management owns product
   direction. Neither name is an alias for the other.
5. Security is a cross-cutting constraint and evidence discipline, not a final
   sign-off added after implementation.

## Migration rule

The registry records only long-form professional identities. Legacy short
codes are aliases in metadata, never a second role contract or folder. The
role contents migrate by vertical workflow in this order:

```text
Business Analysis → System Analysis → Architecture / Tech Lead
→ Backend → Quality Assurance
```

Do not invent detailed role content before the role-design work is authorized.
Until then, a canonical role folder may contain only its routing README. Add or
refine a role contract without bulk-rewriting unrelated prompts or skills.
Removal of a legacy alias folder requires the removal gate in
`docs/MIGRATION_MAP.md`.
