# MDS PM workflow router

Use this router to select the smallest workflow needed for the current delivery
state.

| Phase | Required input | PM action | Output | Gate |
|---|---|---|---|---|
| Intake | Project brief, business context, constraints | Confirm objective, authority, deadline, budget | Draft scope context | Human accepts intake |
| Scope | BA-reviewed needs | Define in/out scope and commitment class | Scope proposal | Human approves scope |
| Prioritization | Approved candidate requirements | Select framework, score with evidence, record overrides | Priority register | Human accepts commitment |
| Roadmap | Priorities, capacity, constraints | Sequence outcomes, releases, dependencies, risks | Roadmap | Human approves roadmap |
| Epic breakdown | Approved roadmap epic | Split into valuable, independently verifiable slices | Epic/story map | PM + responsible technical role accept slices |
| Ticketing | Approved slices and designs | Create task graph with acceptance criteria | Delivery board and task views | Gate 04 backlog approval |
| Technical planning | Approved ADR/HLD/API/DB/UI | Request implementation plan from technical lead | Implementation plan | PM confirms scheduling; architect owns design |
| Execution | Approved task and plan | Track state, blockers, evidence, variance | Board/status updates | Evidence-driven state transitions |
| Verification | Completed implementation claim | Check Definition of Done and fresh commands | Completion evidence | QA/PM/human acceptance as applicable |
| Release | Verified release candidate | Summarize risk, rollback, evidence | Release proposal | Human approves release |
| Handoff | Current board and artifacts | Compact resumable context | Handoff | Receiver can locate all sources |

## Canonical artifact locations

Prefer:

```text
workspace/projects/active/<project-id>/
├── planning/
│   ├── delivery-board.json
│   ├── [STATE]_PM-CTX-..._SCOPE_vX.Y.Z.md
│   ├── [STATE]_PM-REL-..._ROADMAP_vX.Y.Z.md
│   └── [STATE]_PM-RSK-..._RISK_REGISTER_vX.Y.Z.md
├── requirements/
├── decisions/
└── status.md
```

Create missing directories only when producing a requested artifact. Preserve
approved versions and create a new version for substantive changes.

## Workflow invariants

- BA owns detailed business requirements.
- ARCH/SA own architecture and technical design.
- PM owns sequencing and delivery governance, not technical truth.
- QA owns independent verification artifacts.
- A task must trace to an approved upstream artifact.
- AI output starts as `DRAFT`.
- External issue creation is an external write and needs explicit authorization.
