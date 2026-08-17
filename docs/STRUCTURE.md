# Master Documentation System — Cấu trúc toàn hệ thống

> Cập nhật theo trạng thái repository ngày 24/07/2026.
>
> Tài liệu này giải thích boundary và trách nhiệm của từng vùng. Cây vật lý
> chính xác được sinh tự động tại
> [`STRUCTURE.generated.md`](STRUCTURE.generated.md) bằng
> `npm run docs:structure`; không cập nhật cây generated bằng tay.
>
> Cây giải thích bên dưới là bản đồ logic có chú thích, không phải inventory
> từng file. Mọi quyết định di chuyển nằm trong
> [`MIGRATION_MAP.md`](MIGRATION_MAP.md), còn cấu trúc đích đã triển khai nằm trong
> [`TO_BE_STRUCTURE.md`](TO_BE_STRUCTURE.md).

## 1. Cấu trúc tổng thể

```text
AI/
├── .backups/                              # Bản sao an toàn nằm ngoài Git repository
│   ├── ERD-chien-source-20260724.zip      # Nguồn ERD (Chiến) gốc đã lưu trữ
│   └── mattpocock-skills-git-metadata-20260724.zip
│                                          # Metadata Git của bộ skill nhập từ upstream
│
└── Master-Documentation-System/
    ├── .git/                              # Lịch sử và cấu hình Git (tự quản lý)
    ├── node_modules/                      # Dependency npm (sinh bởi npm install)
    │
    ├── apps/                              # Các ứng dụng dùng MDS
    │   └── desktop/                       # Electron shell + React renderer
    │
    ├── docs/                              # Tài liệu kiến trúc và hướng dẫn repository
    ├── mds-core/                          # Nguồn tri thức và governance chuẩn của MDS
    ├── skills/                            # Skill do MDS sở hữu và skill vendor
    ├── packages/                          # Module theo lớp kiến trúc
    ├── scripts/                           # Công cụ deterministic và automation
    ├── tests/                             # Fixture, integration và end-to-end test
    ├── workflows/                         # Định nghĩa automation bằng YAML
    ├── workspace/                         # Seed/fixture development, không phải runtime data
    │
    ├── .gitignore                         # Danh sách file/thư mục Git bỏ qua
    ├── AGENTS.md                          # Guardrail chung dành cho AI agent
    ├── package.json                       # npm workspace và lệnh chạy toàn hệ thống
    ├── package-lock.json                  # Khóa phiên bản dependency
    └── README.md                          # Giới thiệu và hướng dẫn chính
```

## 2. Ứng dụng desktop

```text
apps/
└── desktop/
    ├── src/
    │   ├── main/
    │   │   └── index.ts                   # Electron main process, tạo cửa sổ và lifecycle
    │   │
    │   ├── preload/
    │   │   └── index.ts                   # Cầu IPC an toàn giữa Electron và renderer
    │   │
    │   └── renderer/
    │       ├── App.tsx                    # Component giao diện chính
    │       ├── main.tsx                   # Entry point của React
    │       ├── global.d.ts                # Kiểu TypeScript cho API do preload cung cấp
    │       ├── index.html                 # HTML shell cho Vite
    │       └── styles.css                 # Style toàn ứng dụng
    │
    ├── scripts/
    │   └── start-electron.cjs             # Script khởi chạy Electron đã build
    │
    ├── dist/                              # Output build của Vite (không sửa trực tiếp)
    │   └── renderer/
    │       ├── index.html
    │       └── assets/
    │           ├── index-BNM36sFU.js
    │           └── index-DIv6wX7H.css
    │
    ├── dist-electron/                     # Output biên dịch Electron (không sửa trực tiếp)
    │   ├── main/
    │   │   └── index.js
    │   └── preload/
    │       └── index.js
    │
    ├── package.json                       # Script/devDependency riêng của desktop app
    ├── tsconfig.json                      # TypeScript config cho renderer
    ├── tsconfig.electron.json             # TypeScript config cho main và preload
    ├── vite.config.ts                     # Cấu hình Vite/React
    └── README.md                          # Boundary và cách chạy desktop app
```

Nguyên tắc boundary:

- `main/` quản lý Electron, filesystem, cửa sổ và bảo mật.
- `preload/` chỉ mở một API nhỏ, có kiểu dữ liệu rõ ràng.
- `renderer/` chỉ chứa UI React và trạng thái trình bày.
- Nghiệp vụ phân tích yêu cầu, impact analysis hoặc workflow không đặt trong `apps/desktop/`.

## 3. Tài liệu repository

```text
docs/
├── README.md                             # Ownership và bản đồ tài liệu
├── ARCHITECTURE.md                        # Kiến trúc, boundary và luồng dữ liệu
├── CANONICAL_SOURCES.md                   # Source of truth theo concern
├── LEGACY_STRUCTURE.md                    # Cấu trúc cũ trước khi tái tổ chức
├── MIGRATION_MAP.md                       # AS-IS → TO-BE và removal gate
├── QUICK_START.md                         # Hướng dẫn cài đặt/chạy nhanh
├── ROADMAP.md                             # Lộ trình phát triển
├── STRUCTURE.md                           # Boundary và cây logic có chú thích
├── STRUCTURE.generated.md                 # Cây vật lý sinh tự động
├── TO_BE_STRUCTURE.md                     # Cấu trúc đích đã triển khai
│
├── migrations/
│   └── CUSTOMER_CHANGE_ANALYSIS.md        # Vertical migration đầu tiên
│
├── views/                                 # Các góc nhìn khác nhau lên cùng hệ thống
│   ├── project_view.md                    # Góc nhìn theo dự án
│   ├── role_view.md                       # Góc nhìn theo vai trò
│   ├── solo_view.md                       # Góc nhìn cho một người vận hành
│   └── workflow_view.md                   # Góc nhìn theo workflow
│
└── archive/                               # Tài liệu repository cũ (hiện đang trống)
```

## 4. MDS Core

`mds-core/` là nguồn chuẩn cho tri thức, quy tắc, template và prompt. App
chỉ đọc/sử dụng lớp này; không được sao chép business rule ngược vào UI.

```text
mds-core/
├── examples/                              # Ví dụ pattern đã tuyển chọn
├── glossary/                              # Từ điển thuật ngữ có cấu trúc
├── guides/                                # Hướng dẫn theo lifecycle
├── prompts/                               # Prompt cho agent và orchestrator
├── roles/                                 # Đúng 13 contract trách nhiệm chuyên môn
├── actors/                                # Customer / Stakeholder, không phải role
├── implementation-plane/                  # Developer / Codex / IDE / CI-CD ở ngoài MDS
├── authorities/                           # Thẩm quyền duyệt của con người
├── runtime/                               # Production, môi trường và evidence source
├── system-capabilities/                   # Khả năng MDS, không phải autonomous agent
├── schemas/                               # Schema các entity chính của MDS
├── standards/                             # Chuẩn tài liệu và governance
└── templates/                             # Template artifact theo chuyên môn
```

### 4.1. Pattern library

```text
mds-core/examples/
└── pattern-library/
    ├── architecture/
    │   └── monolith.md                    # Mẫu kiến trúc monolith
    ├── database/
    │   └── sharding.md                    # Mẫu phân mảnh dữ liệu
    └── integration/
        └── saga.md                        # Mẫu Saga cho distributed transaction
```

### 4.2. Glossary

```text
mds-core/glossary/
├── data/                                  # Source of truth dạng YAML
│   ├── 01_core_terms.yaml
│   ├── 02_relations.yaml
│   ├── 03_artifact_types.yaml
│   ├── 04_backend_terms.yaml
│   ├── 05_database_terms.yaml
│   ├── 06_frontend_terms.yaml
│   ├── 07_devops_terms.yaml
│   └── 08_acronyms.yaml
│
├── schemas/
│   └── glossary_term.schema.json          # JSON Schema kiểm tra từng thuật ngữ
│
├── glossary_01_core_terms.md              # Bản Markdown được render từ YAML
├── glossary_02_relations.md
├── glossary_03_artifact_types.md
├── glossary_04_backend_terms.md
├── glossary_05_database_terms.md
├── glossary_06_frontend_terms.md
├── glossary_07_devops_terms.md
├── glossary_08_acronyms.md
├── glossary_index.md                      # Mục lục glossary
└── manifest.yaml                          # Danh sách nguồn và thứ tự build
```

### 4.3. Lifecycle guides

```text
mds-core/guides/
├── lifecycle/
│   ├── 00_intake/
│   │   └── workflow.md                    # Tiếp nhận nhu cầu ban đầu
│   ├── 01_discovery/
│   │   ├── workflow.md
│   │   ├── checklist.md
│   │   └── deliverables.md
│   ├── 02_analysis/
│   │   ├── workflow.md
│   │   ├── checklist.md
│   │   └── deliverables.md
│   ├── 03_design/
│   │   └── workflow.md
│   ├── 04_planning/
│   │   └── workflow.md
│   ├── 05_implementation/
│   │   └── workflow.md
│   ├── 06_testing/
│   │   └── workflow.md
│   ├── 07_deployment/
│   │   └── workflow.md
│   ├── 08_operations/
│   │   └── workflow.md
│   └── 09_evolution/
│       └── workflow.md
│
└── roles/
    ├── product-management/                # Product direction
    ├── business-analysis/                  # Requirements and business rules
    ├── system-analysis/                    # System behavior and decomposition
    ├── architecture-tech-lead/             # Technical constraints and decisions
    ├── ui-ux/                              # Experience specifications
    ├── frontend/                           # Frontend specifications
    ├── backend/                            # Backend specifications
    ├── database/                           # Data specifications
    ├── quality-assurance/                  # Verification specifications
    ├── devops-sre/                         # Reliability specifications
    ├── support-operations/                 # Operational feedback
    ├── project-management/                 # Cross-cutting delivery governance
    ├── security/                           # Cross-cutting security governance
    ├── README.md                           # Ownership, routing, and contract shape
    ├── role-model.md                       # Canonical responsibility model
    └── role-registry.yaml                  # Ordered role registry and aliases
```

The adjacent boundaries under `mds-core/` keep non-role concepts out of the
professional-role tree:

```text
mds-core/
├── actors/                                 # Customer / Stakeholder
├── implementation-plane/                   # Developer / Codex / IDE / CI-CD
├── authorities/                            # Human approver / Product Owner / Architecture authority
├── runtime/                                # Production environment and evidence source
└── system-capabilities/                    # Orchestrator / Knowledge Curator / Validator / Context Builder
```

Each is a routing boundary with a canonical README. It does not add an
autonomous agent, a runtime integration, or an approval mechanism.

`role-registry.yaml` defines the sequence shown above. `ui-ux`, `frontend`,
`backend`, and `database` are parallel delivery-design responsibilities after
solution constraints are known; their display order does not force a waterfall.
Short codes such as `BA` and `BE` are aliases in the registry, never a second
role folder.

Mỗi role contract that has been designed has this shape:

```text
<role>/
├── responsibilities.md                   # Trách nhiệm của vai trò
├── required_inputs.md                    # Input bắt buộc trước khi làm việc
├── expected_outputs.md                   # Output phải tạo
└── workflow.md                            # Trình tự thực hiện
```

### 4.4. Prompts

```text
mds-core/prompts/
├── agents/
│   ├── arch_agent.md
│   ├── ba_agent.md
│   ├── be_agent.md
│   ├── devops_agent.md
│   ├── fe_agent.md
│   ├── pm_agent.md
│   ├── qa_agent.md
│   └── sa_agent.md
│
├── orchestrator/
│   ├── agent_topology.md                 # Quan hệ và phạm vi của các agent
│   ├── context_builder.md                # Cách dựng context cho một nhiệm vụ
│   ├── execution_pipeline.md             # Pipeline thực thi
│   ├── routing_rules.md                  # Quy tắc chọn agent/skill
│   └── task_dispatcher.md                # Quy tắc giao task
│
└── shared/
    ├── system_prompt.md                  # Guardrail dùng chung
    ├── coding_prompt.md                  # Quy tắc triển khai code
    └── review_prompt.md                  # Quy tắc review
```

### 4.5. Schemas

```text
mds-core/schemas/
├── entity_schema.md                      # Contract cho entity/artifact
├── project_schema.md                     # Contract dữ liệu dự án
├── role_schema.md                        # Contract vai trò
└── workflow_schema.md                    # Contract workflow
```

### 4.6. Standards

```text
mds-core/standards/
├── ba_traceability.md                    # Truy vết business requirement
├── base_template_guide.md                # Cách dùng template nền
├── document_standards.md                 # Chuẩn trình bày tài liệu
├── lifecycle_rules.md                    # Gate và trạng thái theo lifecycle
├── naming_convention.md                  # Quy ước đặt tên/ID
├── relationship_rules.md                 # Quy tắc liên kết artifact
└── versioning_rules.md                   # Quy tắc phiên bản và approved artifact
```

### 4.7. Artifact templates

```text
mds-core/templates/
├── base/
│   ├── base_guide.md
│   └── base_template.md
│
├── agent/
│   └── agent_spec_template.md
│
├── arch/
│   ├── adr_template.md
│   ├── hld_template.md
│   ├── nfr_template.md
│   └── security_template.md
│
├── ba/
│   ├── brd_template.md
│   ├── business_rule_template.md
│   ├── process_flow_template.md
│   ├── requirement_template.md
│   └── use_case_template.md
│
├── be/
│   ├── api_template.md
│   ├── db_ddl_template.md
│   ├── integration_template.md
│   └── service_template.md
│
├── devops/
│   ├── deployment_template.md
│   ├── incident_template.md
│   ├── infra_template.md
│   └── monitoring_template.md
│
├── fe/
│   ├── component_template.md
│   ├── state_flow_template.md
│   ├── ui_spec_template.md
│   └── ux_flow_template.md
│
├── pm/
│   ├── delivery_plan_template.md
│   ├── roadmap_template.md
│   └── scope_template.md
│
├── qa/
│   ├── bug_report_template.md
│   ├── test_case_template.md
│   └── test_plan_template.md
│
└── sa/
    ├── dfd_template.md
    ├── domain_model_template.md
    ├── logic_spec_template.md
    └── srs_template.md
```

## 5. Skills

```text
skills/
├── README.md                              # Phân loại và ownership của skill
├── mds/                                   # Skill và workflow do MDS sở hữu
│   ├── FRONTEND_WORKFLOW.md               # Chuỗi skill chuẩn khi triển khai FE
│   ├── PM_WORKFLOW.md                     # Chuỗi skill PM/Delivery và approval gate
│   ├── system-engineering-copilot/        # Skill lõi AI-EOS
│   ├── mds-diagram-modeling/              # Skill sơ đồ theo mẫu giảng viên
│   └── mds-project-management/            # Skill quản trị delivery của MDS
│
└── vendor/                                # Skill nhập từ nguồn bên ngoài
    ├── anthropics/
    ├── deanpeters-product-manager/
    ├── obra-superpowers/
    ├── vercel-labs/
    └── mattpocock/
```

### 5.1. System Engineering Copilot

```text
skills/mds/system-engineering-copilot/
├── SKILL.md                               # Entry point và quy trình điều phối
├── README.md                              # Giới thiệu skill
├── DIRECTORY_STRUCTURE.md                 # Cây nội bộ riêng của skill
│
├── config/
│   ├── activation_rules.yaml              # Khi nào skill được kích hoạt
│   ├── dependency_graph.yaml              # Phụ thuộc giữa phase/subskill/artifact
│   ├── execution_modes.yaml               # Chế độ chạy
│   ├── metadata.yaml                      # Metadata của skill
│   └── output_contract.yaml               # Contract đầu ra
│
├── phases/
│   ├── phase_0_intake.md
│   ├── phase_1_business_analysis.md
│   ├── phase_2_domain_modeling.md
│   ├── phase_3_solution_architecture.md
│   ├── phase_4_technical_design.md
│   ├── phase_5_implementation_planning.md
│   ├── phase_6_testing_qa.md
│   ├── phase_7_deployment_release.md
│   └── phase_8_operations_sre.md
│
├── rules/
│   ├── clarification_engine.yaml          # Xác định câu hỏi cần làm rõ
│   ├── complexity_scoring.yaml            # Chấm độ phức tạp
│   ├── deliverable_selector.yaml          # Chọn artifact cần tạo
│   ├── recommendation_engine.yaml         # Luật đề xuất giải pháp
│   └── risk_assessment.yaml               # Đánh giá rủi ro
│
├── state/
│   ├── artifact_registry.yaml             # Registry artifact của phiên/dự án
│   ├── decision_log.md                    # Nhật ký quyết định
│   └── project_context.yaml               # Context có cấu trúc
│
├── subskills/
│   ├── business_analyst/
│   │   ├── SKILL.md
│   │   ├── rules.yaml
│   │   └── templates/                     # Chưa có template
│   ├── solution_architect/
│   │   ├── SKILL.md
│   │   ├── rules.yaml
│   │   └── templates/                     # Chưa có template
│   ├── technical_lead/
│   │   ├── SKILL.md
│   │   ├── rules.yaml
│   │   └── templates/                     # Chưa có template
│   ├── qa_architect/
│   │   ├── SKILL.md
│   │   ├── rules.yaml
│   │   └── templates/                     # Chưa có template
│   ├── devops_architect/
│   │   ├── SKILL.md
│   │   ├── rules.yaml
│   │   └── templates/                     # Chưa có template
│   └── sre_architect/
│       ├── SKILL.md
│       ├── rules.yaml
│       └── templates/                     # Chưa có template
│
├── knowledge/
│   ├── index.yaml
│   ├── architecture_patterns.md
│   ├── scaling_patterns.md
│   ├── security_patterns.md
│   └── anti_patterns.md
│
├── glossary/
│   ├── architecture_terms.md
│   └── devops_terms.md
│
├── templates/
│   ├── artifacts/
│   │   ├── functional_requirements.md
│   │   ├── non_functional_requirements.md
│   │   ├── release_plan.md
│   │   ├── risk_matrix.md
│   │   ├── runbook.md
│   │   └── test_plan.md
│   │
│   └── diagrams/
│       ├── architecture/
│       │   └── c4_context.mmd
│       ├── business/
│       │   ├── bpmn.mmd
│       │   └── use_case.mmd
│       ├── data/
│       │   └── erd.mmd
│       ├── engineering/
│       │   └── sequence.mmd
│       ├── ops/                           # Chưa có template
│       └── qa/                            # Chưa có template
│
├── validators/
│   ├── architecture_validator.yaml
│   ├── artifact_validator.yaml
│   └── diagram_validator.yaml
│
├── workflows/
│   ├── discovery.yaml
│   ├── generate.yaml
│   ├── review.yaml
│   └── update.yaml
│
├── observability/
│   ├── error_registry.md
│   ├── execution_logs.md
│   └── metrics.yaml
│
└── examples/
    └── lms_case.md
```

### 5.2. MDS Diagram Modeling

```text
skills/mds/mds-diagram-modeling/
├── SKILL.md                               # Router và workflow tạo/review diagram
│
├── agents/
│   └── openai.yaml                        # Metadata và prompt mặc định
│
├── references/
│   ├── diagram-selection.md               # Chọn đúng loại sơ đồ
│   ├── style-guide.md                     # Style theo mẫu giảng viên
│   ├── uml-rules.md                       # Quy tắc UML
│   ├── mermaid-c4-rules.md                # Quy tắc Mermaid và C4
│   └── traceability.md                    # Truy vết diagram ↔ requirement/source
│
├── assets/
│   ├── references/                        # Ảnh mẫu được giữ từ tài liệu ERD (Chiến)
│   │   ├── architecture-diagram.png
│   │   ├── backend-package-diagram.png
│   │   ├── context-diagram.png
│   │   ├── database-design.png
│   │   ├── erd-diagram.png
│   │   ├── frontend-package-diagram.png
│   │   ├── sequence-diagram.png
│   │   └── use-case-diagram.png
│   │
│   └── templates/
│       ├── drawio/
│       │   └── context-diagram.drawio
│       ├── mermaid/
│       │   ├── c4-component.mmd
│       │   ├── c4-container.mmd
│       │   ├── c4-context.mmd
│       │   ├── class-diagram.mmd
│       │   ├── erd.mmd
│       │   ├── flowchart.mmd
│       │   ├── sequence.mmd
│       │   └── state.mmd
│       ├── plantuml/
│       │   ├── activity.puml
│       │   ├── class-diagram.puml
│       │   ├── component.puml
│       │   ├── deployment.puml
│       │   ├── package.puml
│       │   ├── sequence.puml
│       │   ├── state.puml
│       │   └── use-case.puml
│       └── traceability/
│           └── diagram.meta.yaml
│
└── scripts/
    ├── validate-text-diagram.mjs          # Kiểm tra Mermaid/PlantUML
    ├── check_drawio_style.mjs             # Kiểm tra style Draw.io
    └── check-traceability.mjs             # Kiểm tra metadata truy vết
```

### 5.3. MDS Project Management

```text
skills/mds/mds-project-management/
├── SKILL.md                               # Router scope → release → handoff
│
├── agents/
│   └── openai.yaml                        # Metadata và prompt mặc định
│
├── references/
│   ├── workflow-schema.md                 # Phase, input, output và gate
│   ├── priority-policy.md                 # MoSCoW/RICE/ICE/value/risk policy
│   ├── dependency-rules.md                # Vertical slice và task DAG
│   ├── approval-gates.md                  # Các quyết định bắt buộc người duyệt
│   └── definition-of-done.md              # Evidence trước khi hoàn thành
│
├── assets/
│   └── templates/
│       ├── delivery-board.json             # Structured source of truth
│       ├── roadmap.md
│       ├── task.md
│       ├── risk-register.md
│       ├── status-report.md
│       ├── release-plan.md
│       └── handoff.md
│
└── scripts/
    ├── board-utils.mjs                    # Hàm dùng chung cho delivery board
    ├── validate-task-links.mjs            # Kiểm tra ID/link/state/cycle
    ├── detect-blocked-chain.mjs           # Tìm ready frontier và blocker
    └── calculate-progress.mjs             # Tính progress theo count/effort
```

### 5.4. Community skills của Anthropic

```text
skills/vendor/anthropics/
├── README.md                              # Nguồn và attribution
│
├── frontend-design/
│   ├── SKILL.md                           # Xác định visual direction và thiết kế FE
│   └── LICENSE.txt
│
└── webapp-testing/
    ├── SKILL.md                           # Kiểm thử web bằng Playwright
    ├── LICENSE.txt
    ├── scripts/
    │   └── with_server.py                 # Chạy test cùng local server
    └── examples/
        ├── console_logging.py
        ├── element_discovery.py
        └── static_html_automation.py
```

### 5.5. Community skills của Vercel Labs

```text
skills/vendor/vercel-labs/
├── README.md                              # Nguồn và attribution
│
├── agent-browser/
│   ├── SKILL.md                           # Điều khiển browser để kiểm tra UI
│   └── LICENSE
│
├── web-design-guidelines/
│   └── SKILL.md                           # Audit accessibility, responsive và UX
│
└── react-best-practices/
    ├── SKILL.md                           # Entry point quy tắc React/Next.js
    ├── AGENTS.md                          # Hướng dẫn agent trong skill
    ├── README.md
    ├── metadata.json
    └── rules/                             # Thư viện quy tắc chi tiết
        ├── _sections.md
        ├── _template.md
        ├── advanced-*.md                  # Effect event, refs, init once...
        ├── async-*.md                     # Parallel/defer await, Suspense...
        ├── bundle-*.md                    # Import, dynamic load, preload...
        ├── client-*.md                    # Event listener, storage, SWR...
        ├── js-*.md                        # Tối ưu JavaScript và collection
        ├── rendering-*.md                 # Hydration, SVG, scripts, transitions...
        ├── rerender-*.md                  # State, memo, hook và render optimization
        └── server-*.md                    # Cache, auth, fetching và serialization
```

### 5.6. Community PM skills của Dean Peters

```text
skills/vendor/deanpeters-product-manager/
├── LICENSE.md                            # Attribution + CC BY-NC-SA 4.0
├── roadmap-planning/                     # Outcome roadmap và sequencing
├── prioritization-advisor/               # Chọn framework ưu tiên
├── epic-breakdown-advisor/               # Chia epic thành story/slice
├── workshop-facilitation/                # Dependency: protocol hỏi đáp
├── user-story-splitting/                 # Dependency: pattern chia story
├── user-story/                           # Dependency: format story/AC
└── epic-hypothesis/                      # Dependency: giả thuyết epic
```

Mỗi thư mục là một upstream skill độc lập, có `SKILL.md` và resource đi kèm.

### 5.7. Community execution skills của Obra Superpowers

```text
skills/vendor/obra-superpowers/
├── LICENSE                               # MIT License
├── writing-plans/
├── executing-plans/
├── subagent-driven-development/
├── dispatching-parallel-agents/
├── verification-before-completion/
├── using-superpowers/                    # Dependency: router của bộ skill
├── using-git-worktrees/                  # Dependency: isolated workspace
├── finishing-a-development-branch/       # Dependency: kết thúc branch
└── requesting-code-review/               # Dependency: review trước hoàn tất
```

Các skill này cung cấp discipline lập kế hoạch, thực thi, review và bằng chứng;
approval policy riêng của MDS vẫn nằm trong `mds-project-management/`.

### 5.8. Vendor skills của Matt Pocock

Đây là một upstream skill collection độc lập được đặt dưới `skills/vendor/`.
Mỗi skill thường có `SKILL.md` và `agents/openai.yaml`; một số skill có thêm
script hoặc tài liệu chuyên biệt.

```text
skills/vendor/mattpocock/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── CONTEXT.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── package-lock.json
│
├── .agents/                               # Agent metadata của upstream
├── .changeset/                            # Changeset của upstream
├── .claude-plugin/                        # Metadata Claude plugin
├── .github/                               # GitHub workflow của upstream
├── .out-of-scope/                         # Nội dung upstream không kích hoạt
│
├── scripts/
│   ├── link-skills.sh
│   └── list-skills.sh
│
├── docs/
│   ├── engineering/
│   │   ├── ask-matt.md
│   │   ├── codebase-design.md
│   │   ├── code-review.md
│   │   ├── diagnosing-bugs.md
│   │   ├── domain-modeling.md
│   │   ├── grill-with-docs.md
│   │   ├── implement.md
│   │   ├── improve-codebase-architecture.md
│   │   ├── prototype.md
│   │   ├── research.md
│   │   ├── resolving-merge-conflicts.md
│   │   ├── setup-matt-pocock-skills.md
│   │   ├── tdd.md
│   │   ├── to-spec.md
│   │   ├── to-tickets.md
│   │   ├── triage.md
│   │   └── wayfinder.md
│   └── productivity/
│       ├── grilling.md
│       ├── grill-me.md
│       ├── handoff.md
│       ├── teach.md
│       └── writing-great-skills.md
│
└── skills/
    ├── engineering/
    │   ├── ask-matt/
    │   ├── codebase-design/
    │   ├── code-review/
    │   ├── diagnosing-bugs/
    │   ├── domain-modeling/
    │   ├── grill-with-docs/
    │   ├── implement/
    │   ├── improve-codebase-architecture/
    │   ├── prototype/
    │   ├── research/
    │   ├── resolving-merge-conflicts/
    │   ├── setup-matt-pocock-skills/
    │   ├── tdd/
    │   ├── to-spec/
    │   ├── to-tickets/
    │   ├── triage/
    │   └── wayfinder/
    │
    ├── productivity/
    │   ├── grilling/
    │   ├── grill-me/
    │   ├── handoff/
    │   ├── teach/
    │   └── writing-great-skills/
    │
    ├── personal/
    │   ├── edit-article/
    │   └── obsidian-vault/
    │
    ├── misc/
    │   ├── git-guardrails-claude-code/
    │   ├── migrate-to-shoehorn/
    │   ├── scaffold-exercises/
    │   └── setup-pre-commit/
    │
    ├── in-progress/
    │   ├── batch-grill-me/
    │   ├── claude-handoff/
    │   ├── loop-me/
    │   ├── setup-ts-deep-modules/
    │   ├── to-questionnaire/
    │   ├── wizard/
    │   ├── writing-beats/
    │   ├── writing-fragments/
    │   └── writing-shape/
    │
    └── deprecated/
        ├── design-an-interface/
        ├── qa/
        ├── request-refactor-plan/
        └── ubiquitous-language/
```

Ownership:

- `skills/mds/` do MDS sở hữu, có thể phát triển trực tiếp.
- `skills/vendor/` là nội dung nhập từ upstream, phải giữ attribution và không bulk-edit.
- Skill trong `deprecated/` hoặc `in-progress/` không được xem là contract ổn định.

## 6. Các package nghiệp vụ

Các package được nhóm theo dependency direction; phần triển khai vẫn đang được
thêm dần mà không đưa business rule vào Electron/React.

```text
packages/
├── README.md                              # Mô tả dependency direction
├── core/
│   ├── domain/                            # Entity, value object, domain rule
│   ├── validation/                        # Validation engine
│   ├── approval/                          # Human approval gate
│   └── audit/                             # Audit trail và lịch sử thay đổi
├── application/
│   ├── ingestion/                         # Nhập/đọc tài liệu nguồn
│   ├── requirements/                      # Trích xuất và phân tích requirement
│   ├── impact/                            # Phân tích tác động thay đổi
│   ├── design/                            # Mô hình và thiết kế hệ thống
│   └── knowledge-base/                    # Truy cập kho tri thức MDS
├── infrastructure/
│   ├── persistence/                       # Repository/database adapter
│   ├── ai/                                # Adapter provider AI
│   ├── filesystem/                        # Adapter filesystem local-first
│   └── integrations/                      # Adapter hệ thống bên ngoài
├── workflow-engine/
│   └── automation-registry/               # Registry automation có phiên bản
└── shared/
    └── README.md                          # Kiểu/hàm dùng chung tối thiểu
```

Dependency direction dự kiến:

```text
apps/desktop
      ↓
packages/application
      ↓
packages/core/domain

Provider, database, AI và integration
      ↓
được nối vào qua adapter/interface
```

## 7. Automation scripts

```text
scripts/
└── automation/
    ├── configs/
    │   └── paths.config.json              # Đường dẫn source/output cho automation
    │
    └── scripts/
        ├── detect_drift.js                # Phát hiện tài liệu render bị lệch source
        ├── generate_structure.js          # Sinh/kiểm tra cây vật lý repository
        └── glossary/
            ├── build_glossary.js          # Pipeline build glossary
            ├── generate_index.js          # Sinh glossary_index.md
            ├── load_terms.js              # Đọc YAML term
            ├── render_markdown.js         # Render term thành Markdown
            └── validate_terms.js          # Validate bằng schema/quy tắc
```

## 8. Tests

Các suite integration/end-to-end còn là scaffold; `fixtures/` đã có dữ liệu
kiểm tra dependency cycle cho skill PM.

```text
tests/
├── fixtures/
│   ├── .gitkeep
│   └── mds-project-management-cycle.json  # Board lỗi dùng kiểm tra cycle detector
├── integration/
│   └── .gitkeep                           # Test tương tác giữa package/adapter
└── end-to-end/
    └── .gitkeep                           # Test luồng hoàn chỉnh qua desktop app
```

## 9. Versioned workflows

```text
workflows/
├── README.md                              # Contract và cách khai báo workflow
└── definitions/
    └── customer-change-analysis.yaml      # Workflow phân tích yêu cầu thay đổi
```

Nguyên tắc: mỗi automation nghiệp vụ phải là một YAML có version trong
`workflows/definitions/`; không hard-code một nút UI riêng cho từng workflow.

## 10. Project workspace

`workspace/` trong repository chỉ là seed/fixture để development và first-run
bootstrap. Runtime data canonical nằm ngoài repository tại `MDS_DATA_DIR`.

```text
MDS_DATA_DIR/                              # Mặc định: Documents/MDS-Workspace
├── projects/
│   ├── index.yaml                         # Registry dự án canonical
│   ├── active/<project-id>/               # Context và artifact của project
│   └── archived/<project-id>/             # Project đã đóng
├── imports/                                # Intake inbox dùng chung (tuỳ chọn)
├── exports/                                # Gói export/report
├── backups/                                # Backup do người dùng quản lý
└── mds.sqlite                             # Persistence local (reserved)
```

Mỗi project có thể tạo thư mục theo workflow khi cần:

```text
<project-id>/
├── project_brief.md
├── business_context.md
├── constraints.md
├── status.md
├── decisions/
├── sources/
├── imports/
├── requirements/
├── analysis/
├── design/
├── testing/
└── operations/
```

Seed development tương ứng vẫn nằm tại
`workspace/projects/active/edumeet/`; app sẽ copy seed này sang data root chỉ
khi project external chưa tồn tại.

## 11. Vai trò của các file cấp root

| File | Vai trò |
|---|---|
| `.gitignore` | Loại `node_modules`, build output, cache và file cục bộ khỏi Git. |
| `AGENTS.md` | Guardrail về boundary, approval, an toàn dữ liệu, FE và diagram workflow. |
| `package.json` | Khai báo npm workspace và các lệnh `dev`, `build`, `typecheck`, `smoke`, `start`, `validate:docs`, `build:glossary`. |
| `package-lock.json` | Khóa dependency để cài đặt có thể lặp lại. |
| `README.md` | Điểm bắt đầu cho người sử dụng và contributor. |

## 12. Luồng hoạt động tổng quát

```text
Người dùng / Desktop UI
          ↓
Workflow definition + Application use case
          ↓
MDS Core
  ├── guide
  ├── standard
  ├── template
  ├── prompt
  └── skill
          ↓
AI provider / deterministic automation
          ↓
Draft artifact + source references
          ↓
Validation
          ↓
Human approval
          ↓
Approved version + audit trail
```

AI output luôn bắt đầu ở trạng thái draft. Các thay đổi scope, requirement,
architecture, database breaking change, release hoặc artifact đã approved đều
phải đi qua human approval.
