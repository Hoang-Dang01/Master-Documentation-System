# MDS v7.0 - Directory Tree Map

Bản đồ chi tiết cấu trúc cây thư mục 2 cấp của **MDS (Master Documentation System) v7.0 — UX Optimized Edition**.

```text
MDS/
│
├── [HUMAN]_DOCUMENTATION_SYSTEM/             # Phân vùng tài liệu nghiệp vụ & kỹ thuật (Con người sử dụng)
│   ├── 00_[ALL]_META/                        # Tài liệu cấu trúc lõi (INDEX, STANDARDS, MATRIX)
│   │   ├── INDEX.md                          # Chỉ mục tài liệu
│   │   ├── CHANGELOG.md                      # Nhật ký thay đổi
│   │   ├── GLOSSARY.md                       # Từ điển thuật ngữ
│   │   ├── TAG_DICTIONARY.md                 # Từ điển nhãn phân loại
│   │   ├── DECISION_LOG.md                   # Nhật ký quyết định kiến trúc
│   │   ├── TRACEABILITY_MATRIX.md            # Ma trận liên kết vết chéo
│   │   ├── DOCUMENT_STANDARDS.md             # Tiêu chuẩn tài liệu
│   │   └── templates/                        # Thư mục biểu mẫu thiết kế
│   │       ├── BASE-TEMPLATE.md              # Khung metadata nền tảng
│   │       ├── REQ-SRS-TEMPLATE.md           # Biểu mẫu Yêu cầu (REQ)
│   │       ├── API-BE-TEMPLATE.md            # Biểu mẫu API Backend (API)
│   │       ├── DB-DDL-TEMPLATE.md            # Biểu mẫu Database (DB)
│   │       ├── ADR-TEMPLATE.md               # Biểu mẫu Quyết định (DEC)
│   │       ├── QA-TC-TEMPLATE.md             # Biểu mẫu Test Case (TC)
│   │       ├── INC-OPS-TEMPLATE.md           # Biểu mẫu Sự cố (INC)
│   │       └── FIN-COST-TEMPLATE.md          # Biểu mẫu Chi phí (FIN)
│   ├── 01_[PM_BA]_DISCOVERY_INTAKE/          # Tiếp nhận yêu cầu mới, biên bản họp, khảo sát
│   ├── 02_[BA]_BUSINESS_DISCOVERY/           # Phân tích quy trình nghiệp vụ AS-IS & TO-BE, Business Rules
│   ├── 03_[SA]_DOMAIN_ANALYSIS/              # Thiết kế miền nghiệp vụ (DDD), Bounded Contexts, Entities
│   ├── 04_[SA]_REQUIREMENTS_ENGINEERING/     # Đặc tả yêu cầu phần mềm chi tiết (SRS, Use Cases, Edge Cases)
│   ├── 05_[SA]_PROCESS_INTELLIGENCE/         # Sơ đồ quy trình hệ thống, BPMN, Sequence, State Machine
│   ├── 06_[ARC]_ENTERPRISE_ARCHITECTURE/     # Kiến trúc giải pháp tổng thể, C4 Model, Integration
│   ├── 07_[ARC_SEC]_RISK_SECURITY_COMPLIANCE/ # Đánh giá rủi ro, Threat Modeling & Bảo mật hệ thống
│   ├── 08_[DBA]_DATA_INTELLIGENCE/           # Sơ đồ dữ liệu, ERD, DDL, Data Dictionary & Lineage
│   ├── 09_[BE]_SERVICE_ENGINEERING/          # API Contracts, Services, Event Contracts, Job Workers
│   ├── 10_[FE]_EXPERIENCE_ENGINEERING/        # User Journeys, Wireframes, Mockups, Design System
│   ├── 11_[AI_DATA]_AI_ANALYTICS_LAYER/      # AI Requirements, Prompts, Datasets & RAG
│   ├── 12_[PM]_DELIVERY_MANAGEMENT/          # Roadmaps, Sprints, Release Plans, Ownership Matrix
│   ├── 13_[QA]_QUALITY_ASSURANCE/            # Test Strategy, Test Cases, UAT & Performance Test
│   ├── 14_[DEVOPS]_PLATFORM_OPERATIONS/      # Hạ tầng môi trường, CI/CD pipelines, IaC, CDN
│   ├── 15_[SRE]_OBSERVABILITY_RELIABILITY/   # Logs, Metrics, Tracing, SLOs & Incident Response
│   ├── 16_[OPS]_PRODUCTION_SUPPORT/          # SOPs, Runbooks, Incidents & Phân tích nguyên nhân (RCA)
│   ├── 17_[ALL]_AUDIT_TRAIL/                 # Governance logs, Change requests, Approvals
│   ├── 18_[SA_ARC]_LEGACY_REVERSE_ENGINEERING/ # Đảo ngược mã nguồn, DB & hành vi hệ thống legacy cũ
│   │   ├── SOURCE_ANALYSIS/                  # Phân tích mã nguồn cũ
│   │   ├── LEGACY_SCHEMA/                    # Sơ đồ và cấu trúc dữ liệu cũ
│   │   ├── OLD_API_BEHAVIOR/                 # Đặc tả hành vi API cũ
│   │   ├── DEPENDENCY_MAP/                   # Bản đồ phụ thuộc của hệ thống legacy
│   │   ├── MIGRATION_GAPS/                   # Khoảng cách nghiệp vụ & công nghệ cần di chuyển
│   │   ├── LEGACY_BUSINESS_RULES/            # Các quy tắc nghiệp vụ cũ được dịch ngược từ code cũ
│   │   └── UNKNOWN_BEHAVIORS/                # Các hành vi hệ thống kỳ lạ hoặc chưa rõ nguyên nhân
│   ├── 19_[PM_FIN]_FINANCIAL_MODELING/       # Chi phí hạ tầng, CAPEX/OPEX, ROI
│   ├── 20_[ALL]_GOVERNANCE_POLICIES/         # Chính sách phát triển, coding standards, branching, release policies
│   ├── 21_[ALL]_KNOWLEDGE_TRANSFER/          # Onboarding, đào tạo, tri thức ẩn (Tribal Knowledge)
│   └── 22_[PM_ARC]_STRATEGIC_EVOLUTION/      # Tầm nhìn sản phẩm 3 năm, Product Evolution & Sunset plan
│
├── [SYSTEM]_KNOWLEDGE_GRAPH/                 # Phân vùng đối soát tự động & sơ đồ liên kết thực thể (Hệ thống)
│   ├── 23_[ALL]_SYSTEM_REGISTRY/             # Danh mục đăng ký thực thể tập trung (Master Registry)
│   │   ├── REQUIREMENTS_REGISTRY.md          # Đăng ký các Yêu cầu nghiệp vụ
│   │   ├── MODULE_REGISTRY.md                # Đăng ký các Phân hệ chức năng
│   │   ├── API_REGISTRY.md                   # Đăng ký các Điểm cuối API
│   │   ├── DATABASE_REGISTRY.md              # Đăng ký các Bảng cơ sở dữ liệu
│   │   ├── INCIDENT_REGISTRY.md              # Đăng ký các Sự cố vận hành
│   │   └── ASSET_REGISTRY.md                 # Đăng ký các Tài sản số/Hạ tầng server
│   ├── 24_[ALL]_CHANGE_IMPACT_ANALYSIS/      # Phân tích tác động thay đổi hệ thống (Change Management)
│   │   ├── IMPACT_ASSESSMENTS/               # Báo cáo đánh giá tác động chi tiết cho mỗi RFC
│   │   ├── BREAKING_CHANGES/                 # Quản lý các thay đổi phá vỡ tương thích ngược
│   │   └── DEPENDENCY_RISK/                  # Đánh giá rủi ro và mức độ ảnh hưởng dây chuyền
│   ├── 25_[ARC_SRE]_RUNTIME_ARCHITECTURE/    # Kiến trúc vận hành thực tế ở Production (Actual Behavior)
│   │   ├── SERVICE_TOPOLOGY/                 # Bản đồ topo kết nối dịch vụ
│   │   ├── REQUEST_FLOWS/                    # Luồng đi chi tiết của yêu cầu dữ liệu qua các services
│   │   ├── HOT_PATHS/                        # Các điểm xử lý tải cao cần lưu ý
│   │   ├── BOTTLENECK_ANALYSIS/              # Dự báo và phân tích điểm nghẽn cổ chai
│   │   └── LATENCY_BREAKDOWN/                # Phân tích thời gian phản hồi chi tiết từng chặng
│   ├── 26_[ALL]_ORGANIZATIONAL_ARCHITECTURE/  # Sơ đồ tổ chức nhân sự, nhóm hỗ trợ & escalation paths
│   │   ├── TEAM_TOPOLOGY.md                  # Cấu trúc đội nhóm theo Team Topologies
│   │   ├── RESPONSIBILITY_GRAPH.md           # Ma trận RACI chi tiết
│   │   ├── ESCALATION_PATH.md                # Quy trình leo thang xử lý sự cố vận hành
│   │   └── COMMUNICATION_MATRIX.md           # Các kênh và tần suất trao đổi thông tin trong dự án
│   └── 27_[ALL]_DECISION_INTELLIGENCE/       # Cây lập luận quyết định (Reasoning Tree) & phân tích đa chiều
│       ├── decision_intelligence_framework.md # Khung quy chuẩn phân tích quyết định
│       └── DEC-ATT-001_LIVEKIT_OVER_JITSI.md  # Quyết định mẫu thực tế phân tích chọn LiveKit
│
├── [AI]_CONTEXT_ENGINE/                      # Phân vùng làm việc, nạp ngữ cảnh & tự động hóa của AI (AI Agents)
│   ├── 28_[AI_DEVOPS]_AUTOMATION_ENGINE/     # Kịch bản tự động hóa, kiểm tra tài liệu drift & AI tools
│   │   ├── ci_gate_config.yml                # Cấu hình mẫu Git Gate tự động chặn PR khi drift tài liệu
│   │   ├── scripts/                          # Thư mục chứa scripts mẫu đối soát
│   │   │   └── detect_drift.py               # Script Python đối soát tài liệu
│   │   └── ai_agent_prompts.md               # Prompt hệ thống nạp đồ thị tri thức MDS vào Chatbot AI
│   └── 90_[ALL]_ORCHESTRATION_ENGINE/        # Động cơ điều phối AI Agents, nhật ký phiên và ngữ cảnh chạy
│       ├── ACTIVE_CONTEXTS/                  # Đóng gói ngữ cảnh chạy (Context Capsules) nạp cho AI
│       │   └── attendance_context.yaml       # Hộp ngữ cảnh mẫu cho phân hệ điểm danh
│       ├── AI_WORKLOGS/                      # Nhật ký làm việc chi tiết của từng Agent dưới dạng YAML
│       │   └── AI-SESSION-001.yaml           # Nhật ký làm việc kiểm toán mẫu
│       ├── CHECKLISTS/                       # Danh sách kiểm tra chất lượng tự động hóa
│       ├── CONSISTENCY_REPORTS/              # Báo cáo tự động phát hiện lệch pha tri thức toàn dự án
│       ├── DAILY_MISSIONS/                   # Nhiệm vụ hằng ngày phân bổ cho AI Agents
│       │   └── 2026-06-26.md                 # Kịch bản phân bổ nhiệm vụ hằng ngày mẫu
│       └── README.md                         # Hướng dẫn chi tiết cách thức vận hành AI Orchestration
│
├── [ARCHIVE]/                                # Lưu trữ tài liệu lịch sử cũ (Phân vùng 99)
│
├── README.md                                 # Hướng dẫn triết lý, nguyên lý & Vận hành nhanh MDS
├── STRUCTURE.md                              # [Tập tin này] Bản đồ chi tiết cây thư mục của toàn bộ MDS
├── TEMPLATES.md                              # Hướng dẫn tiêu chuẩn biểu mẫu & 7 Mẫu thực thể lõi
└── ENTITY_SCHEMA.md                          # Sơ đồ định nghĩa thực thể chuẩn tắc của MDS
```

---
*Lưu ý: Để tìm hiểu chi tiết các quy ước và nguyên lý vận hành của hệ thống, vui lòng đọc file [README.md](README.md) tại thư mục gốc.*
