# Implemented MDS target structure

This target structure was implemented on 2026-07-24. The exact physical tree is
generated in [`STRUCTURE.generated.md`](STRUCTURE.generated.md).

```text
Master-Documentation-System/
├── apps/
│   └── desktop/
│
├── packages/
│   ├── core/
│   │   ├── domain/
│   │   ├── validation/
│   │   └── approval/
│   ├── application/
│   │   ├── ingestion/
│   │   ├── requirements/
│   │   ├── impact/
│   │   └── design/
│   ├── infrastructure/
│   │   ├── persistence/
│   │   ├── ai/
│   │   ├── filesystem/
│   │   └── integrations/
│   ├── workflow-engine/
│   └── shared/
│
├── mds-core/
│   ├── roles/
│   ├── schemas/
│   ├── standards/
│   ├── templates/
│   ├── guides/
│   ├── glossary/
│   ├── prompts/
│   └── examples/
│
├── skills/
│   ├── mds/
│   └── vendor/
│
├── workflows/
├── workspace/
│   └── projects/
│       ├── index.yaml
│       ├── active/<project-id>/
│       └── archived/<project-id>/
├── scripts/
├── tests/
└── docs/
```

## Implemented decisions

- Role contracts live in `mds-core/roles/`.
- MDS-owned and imported skills are separated under `skills/mds/` and
  `skills/vendor/`.
- Package scaffolds are grouped by `core`, `application`, `infrastructure`,
  `workflow-engine`, and `shared`.
- Every active project has its own `active/<project-id>/` directory.
- `workspace/projects/index.yaml` is the canonical project registry.

## Next implementation slice

Prove one workflow end to end before approving physical restructuring:

```text
DOCX
→ parsed source
→ requirement DRAFT
→ human review
→ impact report
```

Architecture follows verified runtime needs; empty folder symmetry is not a
reason to split or move a package.
