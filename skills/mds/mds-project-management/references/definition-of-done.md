# MDS Definition of Done

A task is complete only when all applicable checks have fresh evidence.

## Task-level checks

- [ ] Every acceptance criterion is demonstrated or tested.
- [ ] Required typecheck, unit, integration, UI, or smoke checks passed.
- [ ] Verification commands and timestamps are recorded.
- [ ] Code/PR links to the task and upstream requirement.
- [ ] No unapproved API, database, scope, or architecture change occurred.
- [ ] Relevant documentation and diagrams were updated.
- [ ] Security, migration, rollback, and observability work is complete when applicable.
- [ ] Known limitations and residual risks are recorded.
- [ ] Blockers are empty and dependencies are completed.
- [ ] Responsible reviewer/QA acceptance is recorded when required.

## Release-level checks

- [ ] All committed `MUST` items are completed or explicitly waived by a human.
- [ ] Release acceptance criteria passed.
- [ ] Open bugs and risks have a documented disposition.
- [ ] Deployment and rollback plans are current.
- [ ] Operations/runbook/monitoring artifacts exist when applicable.
- [ ] Human release approval is recorded.

## Evidence rules

- Evidence must come from the current code/artifact version.
- A previous successful run does not prove the current state.
- "Agent reports done" is not evidence.
- A command name without its result is not evidence.
- Failed or skipped checks must remain visible.
- Never change `execution_state` to `COMPLETED` to make a metric look healthy.
