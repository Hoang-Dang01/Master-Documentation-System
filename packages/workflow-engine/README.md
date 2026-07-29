---
ownership: mds
status: canonical
source: internal
safe_to_modify: true
---

# Workflow engine

Execution and registry boundary for versioned definitions under
`workflows/definitions/`.

The current runtime provides a persisted, file-based state machine for starting,
advancing, waiting for approval, resuming and failing workflow runs. Full YAML
step orchestration, retry policy and provider-backed executors remain future
work.
