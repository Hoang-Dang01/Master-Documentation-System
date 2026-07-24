# MDS human approval gates

AI may prepare evidence and a recommendation but may not approve these actions.

| Gate | Trigger | Required evidence | Approver |
|---|---|---|---|
| Scope | Add, remove, or materially redefine committed scope | Impact on value, schedule, cost, risk | Human project authority |
| Requirement | Promote requirement to `APPROVED` | BA review and traceability | Human authority named by project |
| Architecture | Promote ADR/HLD or replace approved design | Alternatives, trade-offs, affected artifacts | Human architect |
| Breaking change | Break API or database compatibility | Migration, rollback, consumer impact | Human architect/project authority |
| Backlog | Approve executable task graph | Acceptance criteria, estimates, links, DAG check | Human PM/project authority |
| Release | Deploy or declare a release approved | DoD evidence, unresolved risks, rollback | Human release authority |
| Approved artifact | Modify or replace approved content | New version and supersession link | Original authority or delegate |

## Stop format

When a gate is reached, report:

```text
Gate:
Decision requested:
Recommended option:
Alternatives:
Evidence:
Impact:
Unverified:
Approver:
```

Continue safe analysis while waiting, but do not cross the gate.
