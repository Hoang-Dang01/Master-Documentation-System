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
| `mds-core/roles/` | MDS legacy | Same path | `MOVE` | `IN_PROGRESS` | BA, BE and QA canonical contracts were populated for Customer Change Analysis under Foundation task FOUND-007; remaining roles retain their prior state. |
| `mds-core/prompts/agents/` | MDS legacy | Generate/reference role contracts later | `MERGE` | `IN_PROGRESS` | BA/BE/QA prompts now route to canonical role and Foundation authority. Conflicting legacy detail remains explicitly transitional pending later removal evidence. |
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
| Scalar-only frontmatter parsing in application packages | MDS runtime | Shared deterministic graph parser/normalizer seam under `packages/application/requirements/src/graph.ts` | `MERGE` | `IN_PROGRESS` | Slice 1 adds evidence-backed relationship parsing without removing existing ingestion/review parsers; consolidation requires compatibility evidence and a later approved migration. |
| Reserved `MDS_DATA_DIR/mds.sqlite` graph storage | MDS runtime | `GraphIndexRepository` port plus `better-sqlite3` adapter in `packages/application/requirements/src/sqlite-graph-repository.ts` | `KEEP` | `IN_PROGRESS` | Slice 2 proves transactional rebuildable storage and Electron runtime compatibility; wiring into Electron and incremental indexing remain separately gated. |
| Desktop graph access | MDS runtime | Typed preload operations backed by Electron main and application graph use cases | `KEEP` | `DONE` | Slice 3 verifies build/query/node/validation IPC through the sandboxed renderer bridge; UI and incremental refresh remain out of scope. |
| Knowledge Graph visualization | MDS runtime | `apps/desktop/src/renderer/KnowledgeGraphView.tsx` with Cytoscape as renderer only | `KEEP` | `DONE` | Slice 4 verifies the sandboxed desktop view, filtering, evidence inspector, issue display, and missing-target rendering. |
| Product-boundary statements across README, overview, architecture, roadmap, lifecycle and prompts | Mixed MDS legacy/current | `docs/foundation/product-boundary.md` and `docs/foundation/architecture-decision.md`, then approved versions in canonical architecture/governance sources | `MERGE` | `IN_PROGRESS` | Foundation boundary and Option A were human-approved on 2026-08-14. Existing concern-specific canonical sources remain in force until versioned migration and artifact replacement gates complete. |
| Artifact status/truth semantics across standards, schemas, templates and runtime | MDS legacy/current | `docs/foundation/artifact-truth-model.md`, then `mds-core/standards/` plus runtime domain/validation contracts | `MERGE` | `IN_PROGRESS` | The truth model was human-approved on 2026-08-14 and lineage storage Option A on 2026-08-16. FOUND-009 implements immutable Requirement versions, FOUND-010 emits evidence-backed NEEDS_REVIEW proposals, FOUND-011 provides deterministic truth/context DTOs, and FOUND-012 wires review/truth/impact interactions into the desktop; remaining migration is outside this proving slice. |
| BE/FE and orchestrator prompts that assign managed-project code implementation to MDS agents | MDS legacy | Canonical role contracts governed by the approved Foundation boundary; implementation instructions become external-plane handoff contracts | `MERGE` | `IN_PROGRESS` | BE was migrated for Customer Change Analysis and its prompt has an explicit non-authoritative legacy notice. FE/orchestrator migration is deferred; do not bulk-edit. |
| Ten-phase lifecycle language that treats MDS as the implementation executor | MDS legacy | Versioned lifecycle/workflow policy that distinguishes MDS governance/verification from the external Implementation Plane | `MERGE` | `PENDING` | Existing approved workflow schema is not replaced by the DRAFT Foundation pack. Requires architecture and approved-artifact gates. |
| `workflows/definitions/customer-change-analysis.yaml@0.1.0` | MDS runtime definition | Same path at version 1.0.0 under approved Foundation truth/control-plane policy | `MERGE` | `DONE` | Human-approved backlog authorized the versioned contract. v1 stops at a safe implementation context package and forbids managed-project source/test mutation; runtime implementation remains tracked by FOUND-009 through FOUND-012. |

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
