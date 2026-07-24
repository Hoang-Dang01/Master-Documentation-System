# Repository structure

```text
Master-Documentation-System/
├── apps/
│   └── desktop/                 # Electron main, preload and React renderer
├── packages/
│   ├── domain/
│   ├── application/
│   ├── document-ingestion/
│   ├── requirement-analysis/
│   ├── impact-analysis/
│   ├── system-design/
│   ├── knowledge-base/
│   ├── persistence/
│   ├── ai-providers/
│   ├── validation/
│   ├── workflow-engine/
│   ├── automation-registry/
│   ├── approval/
│   ├── audit/
│   ├── integrations/
│   └── shared/
├── mds-core/                    # Canonical knowledge and governance
│   ├── schemas/
│   ├── standards/
│   ├── templates/
│   ├── glossary/
│   ├── guides/
│   ├── examples/
│   └── prompts/
├── workflows/
│   └── definitions/             # Versioned automation recipes
├── workspace/
│   └── workspace/projects/                # Runtime project contexts and artifacts
├── scripts/
│   └── automation/              # Existing deterministic validation tools
├── tests/
│   ├── fixtures/
│   ├── integration/
│   └── end-to-end/
├── docs/
│   ├── views/
│   └── archive/
├── AGENTS.md
├── package.json
└── README.md
```

`docs/LEGACY_STRUCTURE.md` preserves the pre-restructure map for reference.

