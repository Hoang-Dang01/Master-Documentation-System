# MDS canonical source registry

One concern has one canonical source. Prompts, skills, UI, and validators may
consume or render that source but must not redefine it independently.

Boundary `README.md` metadata uses:

- `ownership`: `mds`, `upstream`, `project-runtime`, or `development-fixture`;
- `status`: `canonical`, `transitional`, or `vendor`;
- `source`: origin of the content;
- `safe_to_modify`: `true`, `false`, `limited`, `scoped`, or
  `approval-gated`;
- `canonical_target`: destination/source to consult while transitional;
- `update_strategy`: how vendor or generated content is refreshed.

| Concern | Canonical source | Consumers | Drift rule |
|---|---|---|---|
| Document naming, lifecycle, relationships | `mds-core/standards/` | Schemas, prompts, skills, validators | Standards win. |
| Artifact validity, version lineage, Current Project Truth | `mds-core/standards/artifact_truth.md` | Schemas, graph/impact use cases, context builder, desktop views | The truth standard wins; derived caches and views never redefine authority. |
| Product boundary and feature routing | `docs/foundation/product-boundary.md` and `docs/foundation/architecture-decision.md` | Architecture docs, lifecycle, roles, prompts, roadmap | Approved Foundation boundary wins for managed-project control-plane versus Implementation Plane decisions. |
| Role taxonomy and responsibility boundaries | `mds-core/roles/role-model.md` and `mds-core/roles/role-registry.yaml` | Role contracts, prompts, subskills, UI role view | The model/registry name and route roles; consumers must not create a competing taxonomy. |
| Non-role classification: actors, authorities, Implementation Plane, runtime, capabilities | `mds-core/roles/role-model.md` and `mds-core/roles/role-registry.yaml`; boundary routing in `mds-core/{actors,implementation-plane,authorities,runtime,system-capabilities}/README.md` | Schemas, workflows, prompts, UI | These categories never become a professional role merely because a person or tool participates in a workflow. The README files route to the model; they do not redefine it. |
| Role responsibilities, inputs, outputs, workflow | `mds-core/roles/<role>/` | Agent prompts, subskills, UI role view | Consumers reference the registry's `contract_path`; repeated policy is transitional. |
| Lifecycle phases and quality gates | `mds-core/guides/lifecycle/` and `mds-core/schemas/workflow_schema.md` | Workflows, PM/ORCH prompts, desktop progress UI | Schema/guides win. |
| Artifact structure | `mds-core/templates/` | Skills, agents, generators | Skill-local duplicate templates are transitional unless output-specific. |
| Glossary terms | `mds-core/glossary/data/*.yaml` | Generated glossary Markdown, prompts, UI | Generated Markdown must match YAML. |
| Agent instructions | `mds-core/prompts/` | Agent runtime | Prompt may route to policy but should not create a conflicting policy. |
| Desktop UI visual foundation and primitives | `apps/desktop/src/renderer/ui/` | Desktop shell, views, and renderer features | Use the semantic tokens and primitives; individual views may specialize density but must not redefine status meaning. |
| MDS-owned skills | `skills/mds/system-engineering-copilot/` and `skills/mds/` | Agent runtime | Safe to modify within MDS guardrails. |
| Third-party skills | `skills/vendor/` | MDS-owned routing skills | Vendor content is read-only; adapt in `skills/mds/`, not in vendor folders. |
| Runtime automation | `workflows/definitions/*.yaml` | Workflow engine and desktop UI | UI does not hard-code workflow policy. |
| Package boundaries | `packages/README.md` | Package implementations and architecture docs | Split only when dependency/build boundary is real. |
| Project runtime artifacts | `MDS_DATA_DIR/projects/` | Application, workflow engine, desktop UI | Runtime data stays outside the source repository. |
| Development project seed | `workspace/projects/` | First-run bootstrap, tests, development | Seed content is not the user's canonical runtime data. |
| Physical repository tree | `docs/STRUCTURE.generated.md` | Humans and agents | Regenerate; never edit manually. |
| Architecture intent | `docs/ARCHITECTURE.md` | Contributors and agents | Code changes must preserve or explicitly revise it. |
| Migration decisions | `docs/MIGRATION_MAP.md` | All consolidation work | Record destinations and exit evidence. |

## Conflict resolution

When two sources disagree:

1. Identify the concern type in the table.
2. Treat the canonical source as authoritative.
3. Mark the non-canonical copy in `MIGRATION_MAP.md`.
4. Update one vertical workflow and its consumers.
5. Verify references and runtime behavior.
6. Remove the duplicate only after the removal gate passes.

Do not resolve drift by copying the same rule into more locations.
