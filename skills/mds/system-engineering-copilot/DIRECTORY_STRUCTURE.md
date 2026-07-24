# CẤU TRÚC THƯ MỤC HỆ ĐIỀU HÀNH PHÁT TRIỂN PHẦN MỀM AI (AI-EOS)
## System Engineering Copilot - Final Enterprise Structure

Tài liệu này mô tả cấu trúc thư mục hoàn chỉnh của hệ thống **AI Engineering Operating System (AI-EOS)**, được xây dựng dưới dạng một bộ skill AI có khả năng hỗ trợ toàn bộ vòng đời phát triển phần mềm (**Software Development Life Cycle - SDLC**).

---

```text
system_engineering_copilot/
├── README.md                           # Giới thiệu tổng quan AI-EOS
├── SKILL.md                            # Central Orchestrator & Entry Point
├── config/                             # Cấu hình tĩnh
│   ├── activation_rules.yaml           # Trigger words để auto activate skill
│   ├── dependency_graph.yaml           # Quan hệ phụ thuộc giữa các artifacts
│   ├── execution_modes.yaml            # Discovery / Generate / Review / Update
│   ├── metadata.yaml                   # Version, author, release notes
│   ├── output_contract.yaml            # Quy chuẩn format output SSS Master
│   └── sss_mapping.yaml                # Ánh xạ các phase SDLC ➔ 38 chapter SSS
├── prompts/                            # Prompt chiến lược tư duy cho AI
│   ├── discovery_prompt.md             # Chiến lược làm rõ yêu cầu & phát hiện Gap
│   ├── architecture_prompt.md          # Chiến lược thiết kế Solution Architecture
│   ├── review_prompt.md                # Chiến lược rà soát lỗi thiết kế
│   └── refinement_prompt.md            # Chiến lược tinh chỉnh API/DB/UI
├── phases/                             # Hướng dẫn chi tiết quy trình cho từng Phase
│   ├── phase_0_intake.md               # Chuẩn hóa đầu vào thô
│   ├── phase_1_business_analysis.md    # Phân tích nghiệp vụ BA
│   ├── phase_2_domain_modeling.md     # Thiết kế thực thể & ERD
│   ├── phase_3_solution_architecture.md# Thiết kế kiến trúc tổng thể
│   ├── phase_4_technical_design.md     # Thiết kế API, Sequence, DTO, State
│   ├── phase_5_implementation_planning.md # Lập kế hoạch Sprint & WBS
│   ├── phase_6_testing_qa.md           # Thiết kế kịch bản test & QA
│   ├── phase_7_deployment_release.md   # Thiết kế CI/CD và hạ tầng
│   └── phase_8_operations_sre.md       # Giám sát vận hành & SRE
├── rules/                              # Quy tắc suy luận logic nghiệp vụ
│   ├── clarification_engine.yaml       # Quy tắc hỏi làm rõ (Gap Analysis Gate)
│   ├── complexity_scoring.yaml         # Tính điểm độ phức tạp hệ thống
│   ├── deliverable_selector.yaml       # Chọn các chương SSS cần sinh
│   ├── recommendation_engine.yaml      # Đề xuất Tech Stack & Database
│   └── risk_assessment.yaml            # Đánh giá rủi ro thiết kế
├── knowledge/                          # Cơ sở tri thức thiết kế chuyên sâu
│   ├── index.yaml
│   ├── architecture/                   # Thiết kế kiến trúc & Anti-patterns
│   │   ├── anti_patterns.md
│   │   └── architecture_patterns.md
│   ├── database/                       # Thiết kế DB & Caching
│   │   ├── schema_patterns.md
│   │   ├── indexing_patterns.md
│   │   └── scaling_patterns.md
│   ├── security/                       # Bảo mật hệ thống & Mã hóa
│   │   ├── security_patterns.md
│   │   └── auth_patterns.md
│   ├── devops/                         # Tri thức CI/CD & Cloud
│   │   ├── cicd_patterns.md
│   │   └── cloud_patterns.md
│   ├── mobile/                         # Thiết kế Mobile & Offline Cache
│   │   ├── offline_patterns.md
│   │   └── sync_patterns.md
│   └── backend/                        # Thiết kế API & Microservices
│       ├── api_patterns.md
│       └── service_patterns.md
├── subskills/                          # Các vai trò chuyên gia con để điều phối
│   ├── business_analyst/               # Chuyên gia BA
│   ├── solution_architect/             # Chuyên gia SA
│   ├── technical_lead/                 # Chuyên gia Tech Lead
│   ├── database_architect/             # Chuyên gia DBA
│   ├── api_architect/                  # Chuyên gia API Design
│   ├── qa_architect/                   # Chuyên gia QA Lead
│   ├── devops_architect/               # Chuyên gia DevOps
│   └── sre_architect/                  # Chuyên gia SRE/Vận hành
├── templates/                          # Mẫu tài liệu và code Mermaid
├── validators/                         # Cổng kiểm định chất lượng tài liệu
├── workflows/                          # Hướng dẫn quy trình chạy tự động
├── state/                              # Lưu giữ bộ nhớ của dự án hiện tại
│   ├── project_context.yaml
│   ├── artifact_registry.yaml
│   └── decision_log.md
├── observability/                      # Giám sát & Logs của hệ điều hành
│   ├── execution_logs.md
│   ├── error_registry.md
│   └── metrics.yaml
├── examples/                           # Các Case studies mẫu
├── glossary/                           # Thuật ngữ chuyên ngành
└── deliverables/                       # Nơi lưu trữ tài liệu đặc tả thật
    ├── archive/
    └── current/
        └── sss/                        # THƯ MỤC TÀI LIỆU ĐẶC TẢ SSS (38 CHAPTERS)
            ├── MASTER_INDEX.md         # Mục lục đọc theo vai trò
            ├── part_a_business_foundation/
            │   ├── 01_introduction.md
            │   ├── 02_business_context.md
            │   ├── 03_project_goals.md
            │   ├── 04_system_scope.md
            │   └── 05_user_roles.md
            ├── part_b_requirement_analysis/
            │   ├── 06_workflow_analysis.md
            │   ├── 07_functional_requirements.md
            │   ├── 08_non_functional_requirements.md
            │   ├── 09_business_rules.md
            │   └── 10_use_cases.md
            ├── part_c_data_design/
            │   ├── 11_domain_model.md
            │   ├── 12_erd.md
            │   ├── 13_data_dictionary.md
            │   ├── 14_crud_matrix.md
            │   └── 15_database_schema.md
            ├── part_d_application_design/
            │   ├── 16_ui_ux_design.md
            │   ├── 17_screen_specs.md
            │   ├── 18_state_machine.md
            │   ├── 19_notification_flow.md
            │   └── 20_attachment_design.md
            ├── part_e_backend_design/
            │   ├── 21_api_design.md
            │   ├── 22_backend_modules.md
            │   ├── 23_service_contracts.md
            │   ├── 24_background_jobs.md
            │   └── 25_cache_strategy.md
            ├── part_f_solution_architecture/
            │   ├── 26_system_architecture.md
            │   ├── 27_component_architecture.md
            │   ├── 28_security_architecture.md
            │   └── 29_integration_architecture.md
            ├── part_g_devops/
            │   ├── 30_infrastructure.md
            │   ├── 31_deployment.md
            │   ├── 32_ci_cd.md
            │   └── 33_monitoring_logging.md
            └── part_h_operations/
                ├── 34_testing_strategy.md
                ├── 35_audit_logging.md
                ├── 36_runbook.md
                ├── 37_release_strategy.md
                └── 38_future_enhancements.md
```

---

## 🗺️ Bản đồ Đọc Tài liệu theo Vai trò (Role-based Reading)

- **Business Analyst (BA):** Đọc *Part A* & *Part B* để nắm chắc nghiệp vụ và phạm vi.
- **Database Architect (DBA):** Đọc *Part C* để thiết kế mô hình dữ liệu vật lý và chỉ mục.
- **Frontend / Mobile Developer:** Đọc *Part D* để nắm rõ các luồng màn hình UI/UX và phác thảo wireframes.
- **Backend Developer:** Đọc *Part E* để lập trình các API endpoints, cấu trúc DTOs và caching.
- **Solution Architect (SA):** Đọc *Part F* để kiểm soát kiến trúc hệ thống và tích hợp.
- **DevOps / SRE:** Đọc *Part G* & *Part H* để thiết lập hạ tầng CI/CD, runbooks và hệ thống logs/monitoring.
