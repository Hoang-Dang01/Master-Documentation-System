---
ownership: mds
status: canonical
source: internal-and-upstream
safe_to_modify: scoped
exceptions:
  - vendor
---

# MDS skill library

This directory contains MDS-owned skills and attributed vendor skills.

```text
skills/
├── mds/
│   ├── FRONTEND_WORKFLOW.md
│   ├── PM_WORKFLOW.md
│   ├── system-engineering-copilot/
│   ├── mds-diagram-modeling/
│   └── mds-project-management/
└── vendor/
    ├── anthropics/
    ├── deanpeters-product-manager/
    ├── mattpocock/
    ├── obra-superpowers/
    └── vercel-labs/
```

## Ownership

- `mds/system-engineering-copilot/` is maintained as part of MDS.
- `mds/mds-diagram-modeling/` is MDS-owned and preserves the approved teaching references.
- `mds/mds-project-management/` is MDS-owned and enforces delivery governance.
- `vendor/mattpocock/` is imported reference material. Preserve its license and upstream attribution.
- `vendor/deanpeters-product-manager/` and `vendor/obra-superpowers/` contain selected upstream skills and direct dependencies. Do not add MDS-specific policy inside those imported folders.

Community content is not automatically synchronized. Review upstream changes before copying a newer version into MDS.

For frontend work, follow [`mds/FRONTEND_WORKFLOW.md`](mds/FRONTEND_WORKFLOW.md).
For PM and delivery work, follow [`mds/PM_WORKFLOW.md`](mds/PM_WORKFLOW.md).
