---
ownership: mds
status: canonical
source: internal
safe_to_modify: approval-gated
---

# Automation workflows

Each automation is data: a versioned YAML definition with a trigger, inputs, ordered steps, approval gates, outputs and audit metadata. The desktop UI reads these definitions and displays progress; it does not own workflow policy.

Supported executor families:

- deterministic
- document-parser
- file
- git
- database
- ai
- validation
- export
- human-approval

Persisted workflow states:

```text
PENDING
RUNNING
WAITING_FOR_APPROVAL
BLOCKED
FAILED
COMPLETED
CANCELLED
```

The first vertical slice is `customer-change-analysis.yaml`. Version 1.0.0 is
the human-approved Foundation contract:

```text
preserve source
→ create a requirement DRAFT version
→ human approval
→ transition the approved lineage head
→ traverse graph impact
→ propose NEEDS_REVIEW validity
→ refresh Current Project Truth
→ export a safe implementation context package
```

The workflow terminates at the context package. No workflow executor may modify
managed-project source/test code, create commits, merge pull requests, deploy,
or auto-approve an artifact.
