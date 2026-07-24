---
ownership: development-fixture
status: seed-only
source: repository-example
safe_to_modify: limited
canonical_target: MDS_DATA_DIR/projects/active/<project-id>/
---

# Development workspace seed

This directory contains the small EduMeet project seed used by development,
tests and first-run bootstrapping. It is not the user's canonical runtime data.

The desktop app copies the seed to the external data root on first run:

```text
MDS_DATA_DIR/projects/active/edumeet/
```

The default data root is `%USERPROFILE%/Documents/MDS-Workspace`; set
`MDS_DATA_DIR` to choose another local directory. See
[`docs/DATA_LAYOUT.md`](../docs/DATA_LAYOUT.md) for the complete boundary.
