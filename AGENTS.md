# MDS agent guardrails

## Product boundary

- Treat `mds-core/` as the canonical knowledge and governance layer.
- Put business rules in `packages/domain/`, use cases in `packages/application/`, and provider-specific code behind adapters.
- Keep Electron and React concerns inside `apps/desktop/`.
- Define automations as versioned YAML workflows in `workflows/definitions/`; do not hard-code one button per automation.

## Approval gates

Human approval is mandatory before changing project scope, approving requirements or architecture, accepting breaking database changes, approving a release, or replacing an approved artifact.

## Data safety

- Never edit, move, rename, or delete `../ERD(chiến).doc` unless the user explicitly requests that exact action.
- Preserve source documents and approved artifacts; create a new version instead of overwriting them.
- Do not auto-approve AI output. AI output starts as a draft.

## Verification

- Keep structured data as the source of truth; render Markdown from it where practical.
- Every generated conclusion must retain source references.
- Run relevant validation and report any unverified item instead of assuming completion.

