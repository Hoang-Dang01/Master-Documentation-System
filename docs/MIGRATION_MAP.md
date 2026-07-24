# MDS migration map

The physical AS-IS to TO-BE relocation was completed on 2026-07-24. This file
now records the canonical destinations and the remaining content-level
consolidation work.

## Decision vocabulary

| Value | Meaning |
|---|---|
| `UNASSESSED` | Origin, ownership, references, or replacement are not known yet. |
| `KEEP` | Keep the current path as canonical. |
| `MERGE` | Consolidate duplicate content into one canonical source. |
| `MOVE` | Relocate after compatibility and reference migration are ready. |
| `VENDOR` | Preserve as attributed upstream material; update by replacement. |
| `GENERATED` | Produce from structured/canonical input; do not hand-edit. |
| `ARCHIVE` | Preserve for history but remove from active decision paths. |
| `DELETE_LATER` | Delete only after the removal gate passes. |

Migration state is tracked separately as `UNASSESSED`, `PENDING`,
`IN_PROGRESS`, `BLOCKED`, or `DONE`.

## Inventory

| Current source | Origin | Canonical source or proposed target | Decision | State | Notes |
|---|---|---|---|---|---|
| `mds-core/standards/` | MDS legacy | Same path | `KEEP` | `DONE` | Canonical governance rules. |
| `mds-core/templates/` | MDS legacy | Same path | `KEEP` | `DONE` | Canonical artifact templates. |
| `mds-core/roles/` | MDS legacy | Same path | `MOVE` | `DONE` | Canonical role contracts. |
| `mds-core/prompts/agents/` | MDS legacy | Generate/reference role contracts later | `MERGE` | `PENDING` | Remove repeated role policy gradually, one role at a time. |
| `skills/mds/system-engineering-copilot/phases/` | Copilot import | Reference lifecycle guides and role contracts | `MERGE` | `PENDING` | Preserve entry workflow while reducing duplicated rules. |
| `skills/mds/system-engineering-copilot/templates/` | Copilot import | `mds-core/templates/` | `MERGE` | `PENDING` | Do not delete until all relative references migrate. |
| `skills/mds/system-engineering-copilot/subskills/` | Copilot import | Reference MDS role contracts | `MERGE` | `PENDING` | Migrate by vertical workflow, not role-wide bulk edits. |
| `skills/mds/mds-diagram-modeling/` | MDS project | Same path | `KEEP` | `DONE` | MDS-owned project skill. |
| `skills/mds/mds-project-management/` | MDS project | Same path | `KEEP` | `DONE` | MDS-owned delivery governance skill. |
| `skills/vendor/anthropics/` | Upstream | Same path | `VENDOR` | `DONE` | Do not bulk-edit. |
| `skills/vendor/vercel-labs/` | Upstream | Same path | `VENDOR` | `DONE` | Do not bulk-edit. |
| `skills/vendor/mattpocock/` | Upstream | Same path | `VENDOR` | `DONE` | Imported repository with attribution. |
| `skills/vendor/deanpeters-product-manager/` | Upstream | Same path | `VENDOR` | `DONE` | CC BY-NC-SA 4.0 notice retained. |
| `skills/vendor/obra-superpowers/` | Upstream | Same path | `VENDOR` | `DONE` | MIT license retained. |
| `packages/core`, `application`, `infrastructure`, `workflow-engine`, `shared` | MDS restructure | Same paths | `MOVE` | `DONE` | Physical boundaries consolidated; implementation remains incremental. |
| `workspace/projects/active/edumeet/` | MDS legacy | Development seed for `MDS_DATA_DIR/projects/active/edumeet/` | `KEEP` | `DONE` | Repository copy is used for development and first-run bootstrap only. |
| `workspace/projects/project_index.md` | MDS legacy | `MDS_DATA_DIR/projects/index.yaml` plus compatibility view | `KEEP` | `DONE` | Runtime YAML is canonical; repository copy remains a seed/fixture. |
| `docs/STRUCTURE.md` | MDS restructure | Human boundary guide | `KEEP` | `DONE` | Must not be the physical-tree source of truth. |
| `docs/STRUCTURE.generated.md` | Repository scanner | Generated from filesystem | `GENERATED` | `DONE` | Rebuild with `npm run docs:structure`. |
| `docs/LEGACY_STRUCTURE.md` | MDS legacy | `docs/archive/` after references are checked | `ARCHIVE` | `PENDING` | Still useful during consolidation. |

## Removal gate

Do not delete, replace, or archive a duplicate until all checks pass:

1. A canonical replacement is named.
2. Repository search shows no unresolved reference to the old path.
3. Scripts, workflows, prompts, and skills use the replacement.
4. The desktop application builds and typechecks.
5. Relevant validators and tests pass.
6. Git history or an explicit backup preserves provenance.
7. A human approves removal when the artifact was approved or scope-affecting.

Until then, use a compatibility reference or archive plan; do not silently
rewrite content contracts.

## Migration strategy

Migrate by a working vertical workflow:

```text
workflow definition
→ role contract
→ template/schema
→ application use case
→ adapter
→ validation
→ desktop interaction
→ evidence
```

The first slice is
[`migrations/CUSTOMER_CHANGE_ANALYSIS.md`](migrations/CUSTOMER_CHANGE_ANALYSIS.md).
