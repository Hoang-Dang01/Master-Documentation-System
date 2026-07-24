# MDS project delivery workflow

Use this chain for Project Manager/Delivery Manager work. PM governs delivery;
PM does not replace product discovery, BA analysis, architecture, coding, QA, or
human approval.

```text
Approved requirements and constraints
                ↓
prioritization-advisor
Choose a framework and propose commitment/order
                ↓ human scope/priority approval
roadmap-planning
Sequence outcomes, releases, dependencies, and risks
                ↓ human roadmap approval
epic-breakdown-advisor
Split epics into independently valuable slices
                ↓
to-tickets
Create vertical-slice tasks and blocking edges
                ↓ Gate 04 backlog approval
writing-plans
Write technical execution steps after design approval
                ↓
subagent-driven-development OR executing-plans
Execute with checkpoints within granted authority
                ↓
verification-before-completion
Require fresh completion evidence
                ↓ human release approval
handoff
Preserve resumable state and references
```

The MDS router and governance contract live at
[`mds-project-management/SKILL.md`](mds-project-management/SKILL.md).

## Imported sources

- Dean Peters: prioritization, roadmapping, epic breakdown, and their direct dependencies.
- Matt Pocock: `to-tickets` and `handoff`.
- Obra Superpowers: planning, execution, worktree, review, and verification.

Imported community files retain upstream ownership. MDS-specific approval,
traceability, artifact paths, templates, and deterministic validators live only
in `mds-project-management/`.
