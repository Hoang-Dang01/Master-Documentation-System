# MDS local data layout

MDS is a local-first desktop application. The repository contains executable
source code, governance, templates, workflows and a small EduMeet seed
project. User-owned project data must live outside the repository so an app
update, reinstall or fresh clone cannot overwrite it.

## Runtime boundary

```text
MDS source repository
├── apps/                 Electron shell and React renderer
├── packages/             Local application modules
├── mds-core/             Schemas, standards, prompts and templates
├── skills/               MDS-owned and attributed vendor skills
├── workflows/            Versioned workflow definitions
├── scripts/              Deterministic validation and generation
├── tests/                Automated tests
└── workspace/            Development seed/fixture only

MDS_DATA_DIR (default: %USERPROFILE%/Documents/MDS-Workspace)
├── projects/
│   ├── index.yaml
│   ├── active/<project-id>/
│   └── archived/<project-id>/
├── imports/              # Optional cross-project intake inbox
├── exports/              # Generated packages/reports
├── backups/              # User-managed backups
└── mds.sqlite            # Reserved for the local persistence layer
```

`MDS_DATA_DIR` can point to another local folder:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
npm.cmd run start
```

The first run creates the data directories and copies the repository's
`workspace/projects/active/edumeet/` seed only when the external data folder
does not already contain that project. Existing user data is never replaced.

## Project-owned data

Each project remains self-contained under `projects/active/<project-id>/`:

```text
<project-id>/
├── project_brief.md
├── business_context.md
├── constraints.md
├── status.md
├── decisions/
├── sources/              # Preserved original documents
├── imports/              # Normalized source artifacts
├── requirements/         # Requirement drafts and approved requirements
├── analysis/             # Impact and traceability reports
├── design/               # Architecture, backend, frontend and QA artifacts
├── testing/              # Test plans, cases and reports
└── operations/           # Deployment and operational artifacts
```

Folders are created when a workflow needs them; empty-folder symmetry is not
required. A document belongs to the project that owns its context, while
global templates and rules stay in the source repository.

## Application rule

The Electron main process resolves the data root once at startup. Renderer code
only receives the selected project path through the preload bridge. Parsers,
workflow code and persistence adapters must never assume that the repository
contains the user's runtime data.

