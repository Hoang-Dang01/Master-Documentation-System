# MDS agent guardrails

## Product boundary

- Treat `mds-core/` as the canonical knowledge and governance layer.
- Treat `skills/mds/` as MDS-owned and `skills/vendor/` as attributed imported material.
- Do not bulk-edit vendor skills unless the user explicitly requests an upstream import or adaptation.
- Put business rules in `packages/core/domain/`, use cases in `packages/application/`, and provider-specific code behind adapters.
- Keep Electron and React concerns inside `apps/desktop/`.
- Define automations as versioned YAML workflows in `workflows/definitions/`; do not hard-code one button per automation.

## Consolidation governance

- The target structure in `docs/TO_BE_STRUCTURE.md` was implemented on 2026-07-24.
- Consult `docs/CANONICAL_SOURCES.md` before adding or duplicating role rules, templates, standards, prompts, skills, workflows, or project data.
- Record consolidation decisions and evidence in `docs/MIGRATION_MAP.md`.
- Migrate one working vertical workflow at a time. The first target is `docs/migrations/CUSTOMER_CHANGE_ANALYSIS.md`.
- New project artifacts belong under `workspace/projects/active/<project-id>/`.
- Do not recreate the retired paths recorded in `docs/MIGRATION_MAP.md`.
- Treat folder ownership metadata in boundary `README.md` files as modification policy.
- Regenerate `docs/STRUCTURE.generated.md` with `npm run docs:structure`; do not hand-edit it.

## Approval gates

Human approval is mandatory before changing project scope, approving requirements or architecture, accepting breaking database changes, approving a release, or replacing an approved artifact.

## Data safety

- Preserve the archived teaching source at `../.backups/ERD-chien-source-20260724.zip` and the extracted references under `skills/mds/mds-diagram-modeling/assets/references/`.
- Preserve source documents and approved artifacts; create a new version instead of overwriting them.
- Do not auto-approve AI output. AI output starts as a draft.

## Verification

- Keep structured data as the source of truth; render Markdown from it where practical.
- Every generated conclusion must retain source references.
- Run relevant validation and report any unverified item instead of assuming completion.

## Frontend workflow

For UI work, follow `skills/mds/FRONTEND_WORKFLOW.md`:

1. Read `frontend-design` before selecting the visual direction.
2. Apply `vercel-react-best-practices` during React implementation.
3. Audit with `web-design-guidelines`.
4. Verify interactions with `agent-browser` when its CLI is available.
5. Use `webapp-testing` when Python Playwright is available.

## Diagram workflow

For academic software diagrams that must match the approved teaching samples, read
`skills/mds/mds-diagram-modeling/SKILL.md` before drawing or reviewing.
Use its engine router, traceability sidecar, matching reference style, and editable source requirements.

## Project delivery workflow

For Project Manager or Delivery Manager work, follow `skills/mds/PM_WORKFLOW.md`
and read `skills/mds/mds-project-management/SKILL.md`.

- Treat PM as delivery governance, not Product Management or detailed BA analysis.
- Start planning from approved requirements, architecture, and project constraints.
- Use vertical-slice tasks with explicit blocking edges and source links.
- Validate the delivery board before reporting progress or readiness.
- Require fresh Definition of Done evidence before marking work completed.
- Stop at the human gates for scope, requirements, architecture, breaking changes,
  backlog approval, release approval, and approved-artifact replacement.
