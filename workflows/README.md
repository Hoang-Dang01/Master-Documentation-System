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

The first vertical slice is `customer-change-analysis.yaml`.

