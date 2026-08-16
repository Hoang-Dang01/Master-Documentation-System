<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: repository filesystem -->
<!-- COMMAND: npm run docs:structure -->

# MDS physical repository tree

This file is generated from the current filesystem. Use
`docs/STRUCTURE.md` for boundary explanations, `docs/MIGRATION_MAP.md` for
AS-IS/TO-BE decisions, and `docs/CANONICAL_SOURCES.md` for source-of-truth
ownership.

Excluded directories: `.git/`, `node_modules/`.
Generated build directories are shown but their contents are collapsed.
The generated file itself is omitted to keep output deterministic.

```text
Master-Documentation-System/
├── apps/
│   ├── desktop/
│   │   ├── dist/  [generated contents omitted]
│   │   ├── dist-electron/  [generated contents omitted]
│   │   ├── scripts/
│   │   │   ├── run-smoke.cjs
│   │   │   └── start-electron.cjs
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   └── index.ts
│   │   │   ├── preload/
│   │   │   │   └── index.ts
│   │   │   └── renderer/
│   │   │       ├── App.tsx
│   │   │       ├── global.d.ts
│   │   │       ├── index.html
│   │   │       ├── KnowledgeGraphView.tsx
│   │   │       ├── main.tsx
│   │   │       └── styles.css
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── tsconfig.electron.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   └── README.md
├── docs/
│   ├── archive/
│   │   └── .gitkeep
│   ├── foundation/
│   │   ├── architecture-decision.md
│   │   ├── artifact-truth-model.md
│   │   ├── delivery-board.json
│   │   ├── found-003-electron-smoke-evidence.md
│   │   ├── found-007-evidence.md
│   │   ├── found-008-evidence.md
│   │   ├── found-009-evidence.md
│   │   ├── found-009-implementation-plan.md
│   │   ├── found-009-lineage-storage-adr.md
│   │   ├── found-010-evidence.md
│   │   ├── found-011-evidence.md
│   │   ├── found-012-evidence.md
│   │   ├── product-boundary.md
│   │   ├── README.md
│   │   ├── repository-baseline.md
│   │   └── roadmap.md
│   ├── implementation/
│   │   └── knowledge-graph/
│   │       ├── adr.md
│   │       ├── delivery-board.json
│   │       ├── README.md
│   │       ├── repository-baseline.md
│   │       ├── requirement.md
│   │       ├── slice-1-evidence.md
│   │       ├── slice-2-adr.md
│   │       ├── slice-2-delivery-board.json
│   │       ├── slice-2-evidence.md
│   │       ├── slice-3-adr.md
│   │       ├── slice-3-delivery-board.json
│   │       ├── slice-3-evidence.md
│   │       ├── slice-4-adr.md
│   │       └── slice-4-evidence.md
│   ├── migrations/
│   │   └── CUSTOMER_CHANGE_ANALYSIS.md
│   ├── superpowers/
│   │   └── plans/
│   │       └── 2026-08-16-found-009-immutable-lineage.md
│   ├── views/
│   │   ├── project_view.md
│   │   ├── role_view.md
│   │   ├── solo_view.md
│   │   └── workflow_view.md
│   ├── ARCHITECTURE.md
│   ├── CANONICAL_SOURCES.md
│   ├── DATA_LAYOUT.md
│   ├── LEGACY_STRUCTURE.md
│   ├── MIGRATION_MAP.md
│   ├── QUICK_START.md
│   ├── README.md
│   ├── ROADMAP.md
│   ├── STRUCTURE.md
│   ├── SYSTEM_OVERVIEW.md
│   └── TO_BE_STRUCTURE.md
├── mds-core/
│   ├── examples/
│   │   └── pattern-library/
│   │       ├── architecture/
│   │       │   └── monolith.md
│   │       ├── database/
│   │       │   └── sharding.md
│   │       └── integration/
│   │           └── saga.md
│   ├── glossary/
│   │   ├── data/
│   │   │   ├── 01_core_terms.yaml
│   │   │   ├── 02_relations.yaml
│   │   │   ├── 03_artifact_types.yaml
│   │   │   ├── 04_backend_terms.yaml
│   │   │   ├── 05_database_terms.yaml
│   │   │   ├── 06_frontend_terms.yaml
│   │   │   ├── 07_devops_terms.yaml
│   │   │   └── 08_acronyms.yaml
│   │   ├── schemas/
│   │   │   └── glossary_term.schema.json
│   │   ├── glossary_01_core_terms.md
│   │   ├── glossary_02_relations.md
│   │   ├── glossary_03_artifact_types.md
│   │   ├── glossary_04_backend_terms.md
│   │   ├── glossary_05_database_terms.md
│   │   ├── glossary_06_frontend_terms.md
│   │   ├── glossary_07_devops_terms.md
│   │   ├── glossary_08_acronyms.md
│   │   ├── glossary_index.md
│   │   └── manifest.yaml
│   ├── guides/
│   │   ├── lifecycle/
│   │   │   ├── 00_intake/
│   │   │   │   └── workflow.md
│   │   │   ├── 01_discovery/
│   │   │   │   ├── checklist.md
│   │   │   │   ├── deliverables.md
│   │   │   │   └── workflow.md
│   │   │   ├── 02_analysis/
│   │   │   │   ├── checklist.md
│   │   │   │   ├── deliverables.md
│   │   │   │   └── workflow.md
│   │   │   ├── 03_design/
│   │   │   │   └── workflow.md
│   │   │   ├── 04_planning/
│   │   │   │   └── workflow.md
│   │   │   ├── 05_implementation/
│   │   │   │   └── workflow.md
│   │   │   ├── 06_testing/
│   │   │   │   └── workflow.md
│   │   │   ├── 07_deployment/
│   │   │   │   └── workflow.md
│   │   │   ├── 08_operations/
│   │   │   │   └── workflow.md
│   │   │   └── 09_evolution/
│   │   │       └── workflow.md
│   │   └── README.md
│   ├── prompts/
│   │   ├── agents/
│   │   │   ├── arch_agent.md
│   │   │   ├── ba_agent.md
│   │   │   ├── be_agent.md
│   │   │   ├── devops_agent.md
│   │   │   ├── fe_agent.md
│   │   │   ├── pm_agent.md
│   │   │   ├── qa_agent.md
│   │   │   └── sa_agent.md
│   │   ├── orchestrator/
│   │   │   ├── agent_topology.md
│   │   │   ├── context_builder.md
│   │   │   ├── execution_pipeline.md
│   │   │   ├── routing_rules.md
│   │   │   └── task_dispatcher.md
│   │   ├── shared/
│   │   │   ├── coding_prompt.md
│   │   │   ├── review_prompt.md
│   │   │   └── system_prompt.md
│   │   └── README.md
│   ├── roles/
│   │   ├── arch/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   ├── ba/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   ├── be/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   ├── devops/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   ├── fe/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   ├── pm/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   ├── qa/
│   │   │   ├── expected_outputs.md
│   │   │   ├── required_inputs.md
│   │   │   ├── responsibilities.md
│   │   │   └── workflow.md
│   │   └── sa/
│   │       ├── expected_outputs.md
│   │       ├── required_inputs.md
│   │       ├── responsibilities.md
│   │       └── workflow.md
│   ├── schemas/
│   │   ├── artifact_truth_schema.md
│   │   ├── entity_schema.md
│   │   ├── project_schema.md
│   │   ├── role_schema.md
│   │   └── workflow_schema.md
│   ├── standards/
│   │   ├── artifact_truth.md
│   │   ├── ba_traceability.md
│   │   ├── base_template_guide.md
│   │   ├── document_standards.md
│   │   ├── lifecycle_rules.md
│   │   ├── naming_convention.md
│   │   ├── README.md
│   │   ├── relationship_rules.md
│   │   └── versioning_rules.md
│   ├── templates/
│   │   ├── agent/
│   │   │   └── agent_spec_template.md
│   │   ├── arch/
│   │   │   ├── adr_template.md
│   │   │   ├── hld_template.md
│   │   │   ├── nfr_template.md
│   │   │   └── security_template.md
│   │   ├── ba/
│   │   │   ├── brd_template.md
│   │   │   ├── business_rule_template.md
│   │   │   ├── process_flow_template.md
│   │   │   ├── requirement_template.md
│   │   │   └── use_case_template.md
│   │   ├── base/
│   │   │   ├── base_guide.md
│   │   │   └── base_template.md
│   │   ├── be/
│   │   │   ├── api_template.md
│   │   │   ├── db_ddl_template.md
│   │   │   ├── integration_template.md
│   │   │   └── service_template.md
│   │   ├── devops/
│   │   │   ├── deployment_template.md
│   │   │   ├── incident_template.md
│   │   │   ├── infra_template.md
│   │   │   └── monitoring_template.md
│   │   ├── fe/
│   │   │   ├── component_template.md
│   │   │   ├── state_flow_template.md
│   │   │   ├── ui_spec_template.md
│   │   │   └── ux_flow_template.md
│   │   ├── pm/
│   │   │   ├── delivery_plan_template.md
│   │   │   ├── roadmap_template.md
│   │   │   └── scope_template.md
│   │   ├── qa/
│   │   │   ├── bug_report_template.md
│   │   │   ├── test_case_template.md
│   │   │   └── test_plan_template.md
│   │   ├── sa/
│   │   │   ├── dfd_template.md
│   │   │   ├── domain_model_template.md
│   │   │   ├── logic_spec_template.md
│   │   │   └── srs_template.md
│   │   └── README.md
│   └── README.md
├── packages/
│   ├── application/
│   │   ├── design/
│   │   │   └── .gitkeep
│   │   ├── impact/
│   │   │   └── .gitkeep
│   │   ├── ingestion/
│   │   │   ├── dist/  [generated contents omitted]
│   │   │   ├── src/
│   │   │   │   └── index.ts
│   │   │   ├── .gitkeep
│   │   │   ├── package.json
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── knowledge-base/
│   │   │   └── .gitkeep
│   │   ├── requirements/
│   │   │   ├── dist/  [generated contents omitted]
│   │   │   ├── src/
│   │   │   │   ├── graph/
│   │   │   │   │   └── ports/
│   │   │   │   │       ├── graph-index-repository.ts
│   │   │   │   │       └── index.ts
│   │   │   │   ├── graph.ts
│   │   │   │   ├── impact.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── lineage.ts
│   │   │   │   └── truth.ts
│   │   │   ├── .gitkeep
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   ├── .gitkeep
│   │   └── README.md
│   ├── core/
│   │   ├── approval/
│   │   │   └── .gitkeep
│   │   ├── audit/
│   │   │   └── .gitkeep
│   │   ├── domain/
│   │   │   ├── dist/  [generated contents omitted]
│   │   │   ├── src/
│   │   │   │   ├── index.ts
│   │   │   │   └── lineage.ts
│   │   │   ├── .gitkeep
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   ├── validation/
│   │   │   └── .gitkeep
│   │   └── README.md
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   └── .gitkeep
│   │   ├── filesystem/
│   │   │   └── README.md
│   │   ├── integrations/
│   │   │   └── .gitkeep
│   │   ├── persistence/
│   │   │   ├── dist/  [generated contents omitted]
│   │   │   ├── src/
│   │   │   │   ├── graph/
│   │   │   │   │   └── sqlite-graph-index-repository.ts
│   │   │   │   └── index.ts
│   │   │   ├── .gitkeep
│   │   │   ├── package.json
│   │   │   └── tsconfig.json
│   │   └── README.md
│   ├── shared/
│   │   ├── .gitkeep
│   │   └── README.md
│   ├── workflow-engine/
│   │   ├── automation-registry/
│   │   │   └── .gitkeep
│   │   ├── dist/  [generated contents omitted]
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── .gitkeep
│   │   ├── package.json
│   │   ├── README.md
│   │   └── tsconfig.json
│   └── README.md
├── scripts/
│   ├── automation/
│   │   ├── configs/
│   │   │   ├── .gitkeep
│   │   │   └── paths.config.json
│   │   └── scripts/
│   │       ├── glossary/
│   │       │   ├── build_glossary.js
│   │       │   ├── generate_index.js
│   │       │   ├── load_terms.js
│   │       │   ├── render_markdown.js
│   │       │   └── validate_terms.js
│   │       ├── detect_drift.js
│   │       ├── generate_structure.js
│   │       └── validate_skill_registry.js
│   ├── migrations/
│   │   ├── apply_human_first_template_metadata.js
│   │   ├── rewrite_target_structure_references.js
│   │   └── update_human_first_validator.js
│   └── README.md
├── skills/
│   ├── mds/
│   │   ├── mds-diagram-modeling/
│   │   │   ├── agents/
│   │   │   │   └── openai.yaml
│   │   │   ├── assets/
│   │   │   │   ├── references/
│   │   │   │   │   ├── architecture-diagram.png
│   │   │   │   │   ├── backend-package-diagram.png
│   │   │   │   │   ├── context-diagram.png
│   │   │   │   │   ├── database-design.png
│   │   │   │   │   ├── erd-diagram.png
│   │   │   │   │   ├── frontend-package-diagram.png
│   │   │   │   │   ├── sequence-diagram.png
│   │   │   │   │   └── use-case-diagram.png
│   │   │   │   └── templates/
│   │   │   │       ├── drawio/
│   │   │   │       │   └── context-diagram.drawio
│   │   │   │       ├── mermaid/
│   │   │   │       │   ├── c4-component.mmd
│   │   │   │       │   ├── c4-container.mmd
│   │   │   │       │   ├── c4-context.mmd
│   │   │   │       │   ├── class-diagram.mmd
│   │   │   │       │   ├── erd.mmd
│   │   │   │       │   ├── flowchart.mmd
│   │   │   │       │   ├── sequence.mmd
│   │   │   │       │   └── state.mmd
│   │   │   │       ├── plantuml/
│   │   │   │       │   ├── activity.puml
│   │   │   │       │   ├── class-diagram.puml
│   │   │   │       │   ├── component.puml
│   │   │   │       │   ├── deployment.puml
│   │   │   │       │   ├── package.puml
│   │   │   │       │   ├── sequence.puml
│   │   │   │       │   ├── state.puml
│   │   │   │       │   └── use-case.puml
│   │   │   │       └── traceability/
│   │   │   │           └── diagram.meta.yaml
│   │   │   ├── references/
│   │   │   │   ├── diagram-selection.md
│   │   │   │   ├── mermaid-c4-rules.md
│   │   │   │   ├── style-guide.md
│   │   │   │   ├── traceability.md
│   │   │   │   └── uml-rules.md
│   │   │   ├── scripts/
│   │   │   │   ├── check_drawio_style.mjs
│   │   │   │   ├── check-traceability.mjs
│   │   │   │   └── validate-text-diagram.mjs
│   │   │   └── SKILL.md
│   │   ├── mds-project-management/
│   │   │   ├── agents/
│   │   │   │   └── openai.yaml
│   │   │   ├── assets/
│   │   │   │   └── templates/
│   │   │   │       ├── delivery-board.json
│   │   │   │       ├── handoff.md
│   │   │   │       ├── release-plan.md
│   │   │   │       ├── risk-register.md
│   │   │   │       ├── roadmap.md
│   │   │   │       ├── status-report.md
│   │   │   │       └── task.md
│   │   │   ├── references/
│   │   │   │   ├── approval-gates.md
│   │   │   │   ├── definition-of-done.md
│   │   │   │   ├── dependency-rules.md
│   │   │   │   ├── priority-policy.md
│   │   │   │   └── workflow-schema.md
│   │   │   ├── scripts/
│   │   │   │   ├── board-utils.mjs
│   │   │   │   ├── calculate-progress.mjs
│   │   │   │   ├── detect-blocked-chain.mjs
│   │   │   │   └── validate-task-links.mjs
│   │   │   └── SKILL.md
│   │   ├── system-engineering-copilot/
│   │   │   ├── config/
│   │   │   │   ├── activation_rules.yaml
│   │   │   │   ├── dependency_graph.yaml
│   │   │   │   ├── execution_modes.yaml
│   │   │   │   ├── metadata.yaml
│   │   │   │   └── output_contract.yaml
│   │   │   ├── examples/
│   │   │   │   └── lms_case.md
│   │   │   ├── glossary/
│   │   │   │   ├── architecture_terms.md
│   │   │   │   └── devops_terms.md
│   │   │   ├── knowledge/
│   │   │   │   ├── anti_patterns.md
│   │   │   │   ├── architecture_patterns.md
│   │   │   │   ├── index.yaml
│   │   │   │   ├── scaling_patterns.md
│   │   │   │   └── security_patterns.md
│   │   │   ├── observability/
│   │   │   │   ├── error_registry.md
│   │   │   │   ├── execution_logs.md
│   │   │   │   └── metrics.yaml
│   │   │   ├── phases/
│   │   │   │   ├── phase_0_intake.md
│   │   │   │   ├── phase_1_business_analysis.md
│   │   │   │   ├── phase_2_domain_modeling.md
│   │   │   │   ├── phase_3_solution_architecture.md
│   │   │   │   ├── phase_4_technical_design.md
│   │   │   │   ├── phase_5_implementation_planning.md
│   │   │   │   ├── phase_6_testing_qa.md
│   │   │   │   ├── phase_7_deployment_release.md
│   │   │   │   └── phase_8_operations_sre.md
│   │   │   ├── rules/
│   │   │   │   ├── clarification_engine.yaml
│   │   │   │   ├── complexity_scoring.yaml
│   │   │   │   ├── deliverable_selector.yaml
│   │   │   │   ├── recommendation_engine.yaml
│   │   │   │   └── risk_assessment.yaml
│   │   │   ├── state/
│   │   │   │   ├── artifact_registry.yaml
│   │   │   │   ├── decision_log.md
│   │   │   │   └── project_context.yaml
│   │   │   ├── subskills/
│   │   │   │   ├── business_analyst/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── rules.yaml
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── devops_architect/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── rules.yaml
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── qa_architect/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── rules.yaml
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── solution_architect/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── rules.yaml
│   │   │   │   │   └── SKILL.md
│   │   │   │   ├── sre_architect/
│   │   │   │   │   ├── templates/
│   │   │   │   │   ├── rules.yaml
│   │   │   │   │   └── SKILL.md
│   │   │   │   └── technical_lead/
│   │   │   │       ├── templates/
│   │   │   │       ├── rules.yaml
│   │   │   │       └── SKILL.md
│   │   │   ├── templates/
│   │   │   │   ├── artifacts/
│   │   │   │   │   ├── functional_requirements.md
│   │   │   │   │   ├── non_functional_requirements.md
│   │   │   │   │   ├── release_plan.md
│   │   │   │   │   ├── risk_matrix.md
│   │   │   │   │   ├── runbook.md
│   │   │   │   │   └── test_plan.md
│   │   │   │   ├── diagrams/
│   │   │   │   │   ├── architecture/
│   │   │   │   │   │   └── c4_context.mmd
│   │   │   │   │   ├── business/
│   │   │   │   │   │   ├── bpmn.mmd
│   │   │   │   │   │   └── use_case.mmd
│   │   │   │   │   ├── data/
│   │   │   │   │   │   └── erd.mmd
│   │   │   │   │   ├── engineering/
│   │   │   │   │   │   └── sequence.mmd
│   │   │   │   │   ├── ops/
│   │   │   │   │   └── qa/
│   │   │   │   └── README.md
│   │   │   ├── validators/
│   │   │   │   ├── architecture_validator.yaml
│   │   │   │   ├── artifact_validator.yaml
│   │   │   │   └── diagram_validator.yaml
│   │   │   ├── workflows/
│   │   │   │   ├── discovery.yaml
│   │   │   │   ├── generate.yaml
│   │   │   │   ├── review.yaml
│   │   │   │   └── update.yaml
│   │   │   ├── DIRECTORY_STRUCTURE.md
│   │   │   ├── README.md
│   │   │   └── SKILL.md
│   │   ├── FRONTEND_WORKFLOW.md
│   │   └── PM_WORKFLOW.md
│   ├── vendor/
│   │   ├── anthropics/
│   │   │   ├── frontend-design/
│   │   │   │   ├── LICENSE.txt
│   │   │   │   └── SKILL.md
│   │   │   ├── webapp-testing/
│   │   │   │   ├── examples/
│   │   │   │   │   ├── console_logging.py
│   │   │   │   │   ├── element_discovery.py
│   │   │   │   │   └── static_html_automation.py
│   │   │   │   ├── scripts/
│   │   │   │   │   └── with_server.py
│   │   │   │   ├── LICENSE.txt
│   │   │   │   └── SKILL.md
│   │   │   └── README.md
│   │   ├── deanpeters-product-manager/
│   │   │   ├── epic-breakdown-advisor/
│   │   │   │   └── SKILL.md
│   │   │   ├── epic-hypothesis/
│   │   │   │   ├── examples/
│   │   │   │   │   └── sample.md
│   │   │   │   ├── SKILL.md
│   │   │   │   └── template.md
│   │   │   ├── prioritization-advisor/
│   │   │   │   └── SKILL.md
│   │   │   ├── roadmap-planning/
│   │   │   │   ├── examples/
│   │   │   │   │   └── sample.md
│   │   │   │   ├── SKILL.md
│   │   │   │   └── template.md
│   │   │   ├── user-story/
│   │   │   │   ├── examples/
│   │   │   │   │   └── sample.md
│   │   │   │   ├── scripts/
│   │   │   │   │   └── user-story-template.py
│   │   │   │   ├── SKILL.md
│   │   │   │   └── template.md
│   │   │   ├── user-story-splitting/
│   │   │   │   ├── examples/
│   │   │   │   │   └── sample.md
│   │   │   │   ├── SKILL.md
│   │   │   │   └── template.md
│   │   │   ├── workshop-facilitation/
│   │   │   │   ├── examples/
│   │   │   │   │   └── inline-input-flow.md
│   │   │   │   └── SKILL.md
│   │   │   └── LICENSE.md
│   │   ├── mattpocock/
│   │   │   ├── .agents/
│   │   │   │   ├── adr/
│   │   │   │   │   ├── 0001-explicit-setup-pointer-only-for-hard-dependencies.md
│   │   │   │   │   └── 0002-ship-as-a-claude-code-plugin.md
│   │   │   │   ├── invocation.md
│   │   │   │   └── writing-docs.md
│   │   │   ├── .changeset/
│   │   │   │   ├── ask-matt-wayfinder-guidance.md
│   │   │   │   ├── codex-skill-metadata.md
│   │   │   │   ├── config.json
│   │   │   │   ├── friendlier-setup-and-local-tickets.md
│   │   │   │   ├── grilling-general-use.md
│   │   │   │   ├── prototype-primary-source.md
│   │   │   │   ├── README.md
│   │   │   │   ├── ship-as-claude-plugin.md
│   │   │   │   ├── wayfinder-decision-tickets.md
│   │   │   │   ├── wayfinder-research-subagents.md
│   │   │   │   └── yagni-scope-improve-architecture.md
│   │   │   ├── .claude-plugin/
│   │   │   │   ├── marketplace.json
│   │   │   │   └── plugin.json
│   │   │   ├── .github/
│   │   │   │   └── workflows/
│   │   │   │       └── release.yml
│   │   │   ├── .out-of-scope/
│   │   │   │   ├── mainstream-issue-trackers-only.md
│   │   │   │   ├── question-limits.md
│   │   │   │   └── setup-skill-verify-mode.md
│   │   │   ├── docs/
│   │   │   │   ├── engineering/
│   │   │   │   │   ├── ask-matt.md
│   │   │   │   │   ├── code-review.md
│   │   │   │   │   ├── codebase-design.md
│   │   │   │   │   ├── diagnosing-bugs.md
│   │   │   │   │   ├── domain-modeling.md
│   │   │   │   │   ├── grill-with-docs.md
│   │   │   │   │   ├── implement.md
│   │   │   │   │   ├── improve-codebase-architecture.md
│   │   │   │   │   ├── prototype.md
│   │   │   │   │   ├── research.md
│   │   │   │   │   ├── resolving-merge-conflicts.md
│   │   │   │   │   ├── setup-matt-pocock-skills.md
│   │   │   │   │   ├── tdd.md
│   │   │   │   │   ├── to-spec.md
│   │   │   │   │   ├── to-tickets.md
│   │   │   │   │   ├── triage.md
│   │   │   │   │   └── wayfinder.md
│   │   │   │   └── productivity/
│   │   │   │       ├── grill-me.md
│   │   │   │       ├── grilling.md
│   │   │   │       ├── handoff.md
│   │   │   │       ├── teach.md
│   │   │   │       └── writing-great-skills.md
│   │   │   ├── scripts/
│   │   │   │   ├── link-skills.sh
│   │   │   │   └── list-skills.sh
│   │   │   ├── skills/
│   │   │   │   ├── deprecated/
│   │   │   │   │   ├── design-an-interface/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── qa/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── request-refactor-plan/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── ubiquitous-language/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── README.md
│   │   │   │   ├── engineering/
│   │   │   │   │   ├── ask-matt/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── code-review/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── codebase-design/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── DEEPENING.md
│   │   │   │   │   │   ├── DESIGN-IT-TWICE.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── diagnosing-bugs/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── scripts/
│   │   │   │   │   │   │   └── hitl-loop.template.sh
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── domain-modeling/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── ADR-FORMAT.md
│   │   │   │   │   │   ├── CONTEXT-FORMAT.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── grill-with-docs/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── implement/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── improve-codebase-architecture/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── HTML-REPORT.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── prototype/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── LOGIC.md
│   │   │   │   │   │   ├── SKILL.md
│   │   │   │   │   │   └── UI.md
│   │   │   │   │   ├── research/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── resolving-merge-conflicts/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── setup-matt-pocock-skills/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── domain.md
│   │   │   │   │   │   ├── issue-tracker-github.md
│   │   │   │   │   │   ├── issue-tracker-gitlab.md
│   │   │   │   │   │   ├── issue-tracker-local.md
│   │   │   │   │   │   ├── SKILL.md
│   │   │   │   │   │   └── triage-labels.md
│   │   │   │   │   ├── tdd/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── mocking.md
│   │   │   │   │   │   ├── SKILL.md
│   │   │   │   │   │   └── tests.md
│   │   │   │   │   ├── to-spec/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── to-tickets/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── triage/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── AGENT-BRIEF.md
│   │   │   │   │   │   ├── OUT-OF-SCOPE.md
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── wayfinder/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── README.md
│   │   │   │   ├── in-progress/
│   │   │   │   │   ├── batch-grill-me/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── claude-handoff/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── loop-me/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── setup-ts-deep-modules/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── dependency-cruiser.config.cjs
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── to-questionnaire/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── wizard/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── SKILL.md
│   │   │   │   │   │   └── template.sh
│   │   │   │   │   ├── writing-beats/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── writing-fragments/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── writing-shape/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── README.md
│   │   │   │   ├── misc/
│   │   │   │   │   ├── git-guardrails-claude-code/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   ├── scripts/
│   │   │   │   │   │   │   └── block-dangerous-git.sh
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── migrate-to-shoehorn/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── scaffold-exercises/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── setup-pre-commit/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── README.md
│   │   │   │   ├── personal/
│   │   │   │   │   ├── edit-article/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   ├── obsidian-vault/
│   │   │   │   │   │   ├── agents/
│   │   │   │   │   │   │   └── openai.yaml
│   │   │   │   │   │   └── SKILL.md
│   │   │   │   │   └── README.md
│   │   │   │   └── productivity/
│   │   │   │       ├── grill-me/
│   │   │   │       │   ├── agents/
│   │   │   │       │   │   └── openai.yaml
│   │   │   │       │   └── SKILL.md
│   │   │   │       ├── grilling/
│   │   │   │       │   ├── agents/
│   │   │   │       │   │   └── openai.yaml
│   │   │   │       │   └── SKILL.md
│   │   │   │       ├── handoff/
│   │   │   │       │   ├── agents/
│   │   │   │       │   │   └── openai.yaml
│   │   │   │       │   └── SKILL.md
│   │   │   │       ├── teach/
│   │   │   │       │   ├── agents/
│   │   │   │       │   │   └── openai.yaml
│   │   │   │       │   ├── GLOSSARY-FORMAT.md
│   │   │   │       │   ├── LEARNING-RECORD-FORMAT.md
│   │   │   │       │   ├── MISSION-FORMAT.md
│   │   │   │       │   ├── RESOURCES-FORMAT.md
│   │   │   │       │   └── SKILL.md
│   │   │   │       ├── writing-great-skills/
│   │   │   │       │   ├── agents/
│   │   │   │       │   │   └── openai.yaml
│   │   │   │       │   ├── GLOSSARY.md
│   │   │   │       │   └── SKILL.md
│   │   │   │       └── README.md
│   │   │   ├── .gitignore
│   │   │   ├── AGENTS.md
│   │   │   ├── CHANGELOG.md
│   │   │   ├── CLAUDE.md
│   │   │   ├── CONTEXT.md
│   │   │   ├── LICENSE
│   │   │   ├── package-lock.json
│   │   │   ├── package.json
│   │   │   └── README.md
│   │   ├── obra-superpowers/
│   │   │   ├── dispatching-parallel-agents/
│   │   │   │   └── SKILL.md
│   │   │   ├── executing-plans/
│   │   │   │   └── SKILL.md
│   │   │   ├── finishing-a-development-branch/
│   │   │   │   └── SKILL.md
│   │   │   ├── requesting-code-review/
│   │   │   │   ├── code-reviewer.md
│   │   │   │   └── SKILL.md
│   │   │   ├── subagent-driven-development/
│   │   │   │   ├── scripts/
│   │   │   │   │   ├── review-package
│   │   │   │   │   ├── sdd-workspace
│   │   │   │   │   └── task-brief
│   │   │   │   ├── implementer-prompt.md
│   │   │   │   ├── re-review-prompt.md
│   │   │   │   ├── SKILL.md
│   │   │   │   └── task-reviewer-prompt.md
│   │   │   ├── using-git-worktrees/
│   │   │   │   └── SKILL.md
│   │   │   ├── using-superpowers/
│   │   │   │   ├── references/
│   │   │   │   │   ├── antigravity-tools.md
│   │   │   │   │   ├── codex-tools.md
│   │   │   │   │   ├── gemini-tools.md
│   │   │   │   │   └── pi-tools.md
│   │   │   │   └── SKILL.md
│   │   │   ├── verification-before-completion/
│   │   │   │   └── SKILL.md
│   │   │   ├── writing-plans/
│   │   │   │   ├── plan-document-reviewer-prompt.md
│   │   │   │   └── SKILL.md
│   │   │   └── LICENSE
│   │   ├── vercel-labs/
│   │   │   ├── agent-browser/
│   │   │   │   ├── LICENSE
│   │   │   │   └── SKILL.md
│   │   │   ├── react-best-practices/
│   │   │   │   ├── rules/
│   │   │   │   │   ├── _sections.md
│   │   │   │   │   ├── _template.md
│   │   │   │   │   ├── advanced-effect-event-deps.md
│   │   │   │   │   ├── advanced-event-handler-refs.md
│   │   │   │   │   ├── advanced-init-once.md
│   │   │   │   │   ├── advanced-use-latest.md
│   │   │   │   │   ├── async-api-routes.md
│   │   │   │   │   ├── async-cheap-condition-before-await.md
│   │   │   │   │   ├── async-defer-await.md
│   │   │   │   │   ├── async-dependencies.md
│   │   │   │   │   ├── async-parallel.md
│   │   │   │   │   ├── async-suspense-boundaries.md
│   │   │   │   │   ├── bundle-analyzable-paths.md
│   │   │   │   │   ├── bundle-barrel-imports.md
│   │   │   │   │   ├── bundle-conditional.md
│   │   │   │   │   ├── bundle-defer-third-party.md
│   │   │   │   │   ├── bundle-dynamic-imports.md
│   │   │   │   │   ├── bundle-preload.md
│   │   │   │   │   ├── client-event-listeners.md
│   │   │   │   │   ├── client-localstorage-schema.md
│   │   │   │   │   ├── client-passive-event-listeners.md
│   │   │   │   │   ├── client-swr-dedup.md
│   │   │   │   │   ├── js-batch-dom-css.md
│   │   │   │   │   ├── js-cache-function-results.md
│   │   │   │   │   ├── js-cache-property-access.md
│   │   │   │   │   ├── js-cache-storage.md
│   │   │   │   │   ├── js-combine-iterations.md
│   │   │   │   │   ├── js-early-exit.md
│   │   │   │   │   ├── js-flatmap-filter.md
│   │   │   │   │   ├── js-hoist-regexp.md
│   │   │   │   │   ├── js-index-maps.md
│   │   │   │   │   ├── js-length-check-first.md
│   │   │   │   │   ├── js-min-max-loop.md
│   │   │   │   │   ├── js-request-idle-callback.md
│   │   │   │   │   ├── js-set-map-lookups.md
│   │   │   │   │   ├── js-tosorted-immutable.md
│   │   │   │   │   ├── rendering-activity.md
│   │   │   │   │   ├── rendering-animate-svg-wrapper.md
│   │   │   │   │   ├── rendering-conditional-render.md
│   │   │   │   │   ├── rendering-content-visibility.md
│   │   │   │   │   ├── rendering-hoist-jsx.md
│   │   │   │   │   ├── rendering-hydration-no-flicker.md
│   │   │   │   │   ├── rendering-hydration-suppress-warning.md
│   │   │   │   │   ├── rendering-resource-hints.md
│   │   │   │   │   ├── rendering-script-defer-async.md
│   │   │   │   │   ├── rendering-svg-precision.md
│   │   │   │   │   ├── rendering-usetransition-loading.md
│   │   │   │   │   ├── rerender-defer-reads.md
│   │   │   │   │   ├── rerender-dependencies.md
│   │   │   │   │   ├── rerender-derived-state-no-effect.md
│   │   │   │   │   ├── rerender-derived-state.md
│   │   │   │   │   ├── rerender-functional-setstate.md
│   │   │   │   │   ├── rerender-lazy-state-init.md
│   │   │   │   │   ├── rerender-memo-with-default-value.md
│   │   │   │   │   ├── rerender-memo.md
│   │   │   │   │   ├── rerender-move-effect-to-event.md
│   │   │   │   │   ├── rerender-no-inline-components.md
│   │   │   │   │   ├── rerender-simple-expression-in-memo.md
│   │   │   │   │   ├── rerender-split-combined-hooks.md
│   │   │   │   │   ├── rerender-transitions.md
│   │   │   │   │   ├── rerender-use-deferred-value.md
│   │   │   │   │   ├── rerender-use-ref-transient-values.md
│   │   │   │   │   ├── server-after-nonblocking.md
│   │   │   │   │   ├── server-auth-actions.md
│   │   │   │   │   ├── server-cache-lru.md
│   │   │   │   │   ├── server-cache-react.md
│   │   │   │   │   ├── server-dedup-props.md
│   │   │   │   │   ├── server-hoist-static-io.md
│   │   │   │   │   ├── server-no-shared-module-state.md
│   │   │   │   │   ├── server-parallel-fetching.md
│   │   │   │   │   ├── server-parallel-nested-fetching.md
│   │   │   │   │   └── server-serialization.md
│   │   │   │   ├── AGENTS.md
│   │   │   │   ├── metadata.json
│   │   │   │   ├── README.md
│   │   │   │   └── SKILL.md
│   │   │   ├── web-design-guidelines/
│   │   │   │   └── SKILL.md
│   │   │   └── README.md
│   │   ├── README.md
│   │   └── registry.yaml
│   └── README.md
├── tests/
│   ├── end-to-end/
│   │   └── .gitkeep
│   ├── fixtures/
│   │   ├── graph/
│   │   │   ├── list-object.md
│   │   │   ├── list.md
│   │   │   ├── malformed.md
│   │   │   ├── nested-map.md
│   │   │   └── scalar.md
│   │   ├── .gitkeep
│   │   └── mds-project-management-cycle.json
│   ├── integration/
│   │   ├── .gitkeep
│   │   ├── document-import.cjs
│   │   ├── graph-index.cjs
│   │   ├── graph-sqlite-benchmark.cjs
│   │   ├── graph-sqlite.cjs
│   │   ├── impact-traversal.cjs
│   │   ├── lineage-runtime.cjs
│   │   ├── requirements-review.cjs
│   │   ├── truth-context.cjs
│   │   └── workflow-runtime.cjs
│   └── README.md
├── workflows/
│   ├── definitions/
│   │   └── customer-change-analysis.yaml
│   └── README.md
├── workspace/
│   ├── projects/
│   │   ├── active/
│   │   │   └── edumeet/
│   │   │       ├── decisions/
│   │   │       │   └── .gitkeep
│   │   │       ├── design/
│   │   │       │   └── backend/
│   │   │       │       └── dao-tao-mo-hinh-phat-hien-url.md
│   │   │       ├── requirements/
│   │   │       │   └── .gitkeep
│   │   │       ├── business_context.md
│   │   │       ├── constraints.md
│   │   │       ├── project_brief.md
│   │   │       └── status.md
│   │   ├── archived/
│   │   │   └── .gitkeep
│   │   ├── index.yaml
│   │   └── project_index.md
│   └── README.md
├── .gitignore
├── AGENTS.md
├── package-lock.json
├── package.json
└── README.md
```
