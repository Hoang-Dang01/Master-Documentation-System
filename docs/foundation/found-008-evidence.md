---
id: PM-REL-MDS-FOUND-008
title: Foundation task 008 workflow contract evidence
project: mds
lifecycle_state: APPROVED
execution_state: COMPLETED
version: 1.0.0
owner: pm_agent
created_by: codex
created_at: 2026-08-14
last_updated: 2026-08-14
source_refs:
  - BA-REQ-MDS-TRUTH-001@1.0.0
  - ARCH-ADR-MDS-FOUND-001@1.0.0
  - PM-TSK-MDS-FOUND-008
tags: [foundation, workflow, customer-change-analysis, evidence]
links:
  - type: implements
    target: BA-REQ-MDS-TRUTH-001
---

# Foundation task 008 workflow contract evidence

## Delivered contract

`customer-change-analysis.yaml@1.0.0` now covers:

- source preservation and deterministic DRAFT extraction;
- lineage resolution without editing approved content;
- metadata/source validation;
- explicit human approval;
- atomic approved-head transition;
- derived graph rebuild and evidence-backed impact traversal;
- limited `CURRENT → NEEDS_REVIEW` propagation;
- Current Project Truth refresh; and
- authority-labeled implementation context export.

## Boundary evidence

The definition explicitly forbids managed-project source/test mutation, commit
creation, PR merge, deployment, and automatic approval. It ends at the
implementation context package.

## Runtime truth

The YAML is the approved target contract, not a claim that all steps are
implemented. Every incomplete step remains marked `PENDING`. Runtime work is
tracked by FOUND-009 through FOUND-012.

## Verification

Fresh on 2026-08-14:

```text
Workflow static contract check
→ 11 unique steps; every depends_on target exists; boundary/version assertions passed

npm.cmd run docs:structure
→ generated docs/STRUCTURE.generated.md

npm.cmd run validate:docs
npm.cmd run validate:structure
npm.cmd run validate:skills
→ passed

npm.cmd run test:workflow
→ build passed; persisted start, wait-for-approval, resume and load passed
```

The workflow runtime test proves the current generic persisted state machine.
It does not claim that the new lineage, truth, impact, or context executors are
implemented.

## Residual risk

- Full YAML registry parsing/execution remains future workflow-engine work.
- The runtime still starts from caller-supplied step IDs rather than loading and
  enforcing this definition.
- Immutable lineage storage requires a separately approved detailed design
  before FOUND-009 implementation.
