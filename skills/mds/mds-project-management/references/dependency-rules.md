# MDS task and dependency rules

## Task shape

Each task must:

- deliver a narrow end-to-end behavior or a justified mechanical migration;
- fit one fresh agent context;
- have measurable acceptance criteria;
- link to at least one approved requirement or design artifact;
- declare all direct blockers;
- declare verification commands or evidence;
- name an owner role, not an invented person.

## Graph rules

- `blocked_by` edges point from a task to its prerequisites.
- Every referenced task ID must exist.
- Self-dependencies are invalid.
- The dependency graph must be a DAG.
- A completed task cannot remain blocked.
- A task is on the ready frontier only when every blocker is `COMPLETED`.
- Use the smallest set of genuine blockers; do not encode preference as dependency.

## Vertical slices

Prefer:

```text
Import one DOCX → show parsed text → verify stored source reference
```

Avoid:

```text
Build all database tables → build all APIs → build all screens
```

Use expand–migrate–contract for a wide mechanical change that cannot remain
green as a normal vertical slice.

## Blocker handling

When a task becomes blocked, record:

- blocking task or external decision;
- date detected;
- responsible owner;
- impact on milestone/release;
- next action;
- escalation threshold.

Do not move a blocked task back to `IN_PROGRESS` until the blocking evidence has
changed.
