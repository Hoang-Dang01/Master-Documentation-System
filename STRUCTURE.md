# MDS vNext - Cây Thư Mục Chi Tiết (Directory Tree Map)

Bản đồ chi tiết cấu trúc cây thư mục 2 cấp của **MDS vNext — Solo AI-Native Edition**.

```text
mds/
│
├── README.md                      # Landing page chính của MDS
├── STRUCTURE.md                   # Bản đồ toàn bộ cây thư mục (file này)
├── QUICK_START.md                 # Hướng dẫn setup nhanh cho Human + AI
│
├── ai_skills/                     # AI orchestration và cấu hình AI workers
│   ├── orchestrator/              # Luật điều phối, context builder, task dispatcher
│   ├── agents/                    # Prompts cụ thể cho từng AI Agent theo vai trò
│   └── prompts/                   # Prompts dùng chung (System, Review, Coding prompts)
│
├── archive/                       # Lưu trữ tài liệu lịch sử cũ
│
├── automation/                    # Động cơ tự động hóa đối soát drift tài liệu
│   ├── scripts/                   # Scripts thực thi tự động
│   │   ├── detect_drift.js        # Script đối soát drift và liên kết toàn hệ thống
│   │   └── glossary/              # Trình biên dịch từ điển tự động
│   │       ├── load_terms.js
│   │       ├── validate_terms.js
│   │       ├── render_markdown.js
│   │       ├── generate_index.js
│   │       └── build_glossary.js
│   │
│   └── configs/                   # Cấu hình bộ luật
│       └── paths.config.json      # Bản đồ định tuyến các đường dẫn hệ thống
│
├── core/                          # Thư viện lõi bất biến (Immutable Core Library)
│   ├── standards/                 # Các quy tắc kỹ nghệ chuẩn tắc bắt buộc
│   │   ├── document_standards.md  # 5 Canonical Rules chi tiết
│   │   ├── naming_convention.md   # Quy ước đặt tên file chuẩn tắc
│   │   ├── versioning_rules.md    # Hướng dẫn phiên bản SemVer 3 chỉ số
│   │   ├── relationship_rules.md  # Định nghĩa links graph (DAG)
│   │   └── lifecycle_rules.md     # Ma trận trạng thái tài liệu
│   │
│   ├── schemas/                   # Lược đồ mô tả dữ liệu
│   │   ├── entity_schema.md       # Định nghĩa thực thể tri thức (REQ, API, DB...)
│   │   ├── role_schema.md         # Quy chuẩn định nghĩa vai trò nhân sự
│   │   ├── project_schema.md      # Định dạng thiết kế bối cảnh dự án
│   │   └── workflow_schema.md     # Sơ đồ hóa các giai đoạn vòng đời dự án
│   │
│   ├── templates/                 # Thư viện biểu mẫu sạch (sử dụng TGE Model)
│   │   ├── base/                  # Biểu mẫu nền tảng (BASE_TEMPLATE, BASE_GUIDE, BASE_EXAMPLE)
│   │   ├── pm/                    # Biểu mẫu PM (ROADMAP, SCOPE, DELIVERY_PLAN)
│   │   ├── ba/                    # Biểu mẫu BA (BRD, USE_CASE, BUSINESS_RULE, PROCESS_FLOW)
│   │   ├── sa/                    # Biểu mẫu SA (SRS, DOMAIN_MODEL, DFD, LOGIC_SPEC)
│   │   ├── arch/                  # Biểu mẫu Kiến trúc (ADR, HLD, SECURITY, NFR)
│   │   ├── be/                    # Biểu mẫu Backend (API, SERVICE, DB_DDL, INTEGRATION)
│   │   ├── fe/                    # Biểu mẫu Frontend (UI_SPEC, COMPONENT, STATE_FLOW, UX_FLOW)
│   │   ├── qa/                    # Biểu mẫu Đảm bảo chất lượng (TEST_PLAN, TEST_CASE, BUG_REPORT)
│   │   └── devops/                # Biểu mẫu Vận hành (DEPLOYMENT, INFRA, MONITORING, INCIDENT)
│   │
│   └── glossary/                  # Từ điển thuật ngữ (Versioned Semantic Knowledge Module)
│       ├── MANIFEST.yaml          # File khai báo siêu dữ liệu của module glossary
│       ├── glossary_index.md      # Bản đồ tra cứu chéo toàn bộ thuật ngữ
│       │
│       ├── schemas/               # Lược đồ cấu trúc dữ liệu máy đọc
│       │   └── glossary_term.schema.json
│       │
│       ├── data/                  # Nguồn cấp dữ liệu gốc (YAML Single Source of Truth)
│       │   ├── 01_core_terms.yaml
│       │   ├── 02_relations.yaml
│       │   ├── 03_artifact_types.yaml
│       │   ├── 04_backend_terms.yaml
│       │   ├── 05_database_terms.yaml
│       │   ├── 06_frontend_terms.yaml
│       │   ├── 07_devops_terms.yaml
│       │   └── 08_acronyms.yaml
│       │
│       ├── glossary_01_core_terms.md # File generated - Thuật ngữ cốt lõi hệ thống
│       ├── glossary_02_relations.md  # File generated - Ngữ nghĩa các mối liên kết
│       ├── glossary_03_artifact_types.md # File generated - Các loại tài liệu thực thể
│       ├── glossary_04_backend_terms.md # File generated - Thuật ngữ chuyên sâu Backend
│       ├── glossary_05_database_terms.md # File generated - Thuật ngữ chuyên sâu Database
│       ├── glossary_06_frontend_terms.md # File generated - Thuật ngữ chuyên sâu Frontend
│       ├── glossary_07_devops_terms.md # File generated - Thuật ngữ chuyên sâu DevOps
│       └── glossary_08_acronyms.md   # File generated - Từ điển viết tắt
│
├── lifecycle/                     # Bản đồ hóa theo 10 giai đoạn vòng đời dự án (00 - 09)
│   ├── 00_intake/                 # Tiếp nhận yêu cầu ban đầu (Initial Request)
│   ├── 01_discovery/              # Khảo sát bối cảnh và quy trình hiện tại (As-Is)
│   ├── 02_analysis/               # Phân tích đặc tả yêu cầu (BRD, SRS, REQ)
│   ├── 03_design/                 # Thiết kế hệ thống, DB, API và Infra (ADR)
│   ├── 04_planning/               # Hoạch định lộ trình, chia sprint và quản lý rủi ro
│   ├── 05_implementation/         # Viết mã nguồn và triển khai cấu trúc code (BE/FE)
│   ├── 06_testing/                # Kiểm thử chức năng, tích hợp và bảo mật
│   ├── 07_deployment/             # Triển khai hệ thống lên môi trường production
│   ├── 08_operations/             # Vận hành, giám sát (metrics) và xử lý sự cố (SRE)
│   └── 09_evolution/              # Bảo trì, tối ưu hóa và phát triển tính năng mới
│
├── pattern_library/               # Thư viện lưu trữ các mẫu thiết kế và giải pháp công nghệ
│   ├── architecture/              # Mẫu kiến trúc (monolith, PATTERN_CAPP...)
│   ├── database/                  # Mẫu database (sharding, indexing)
│   └── integration/               # Mẫu tích hợp (saga, event_bus)
│
├── projects/                      # Ngữ cảnh runtime của dự án thực tế đang chạy
│   ├── project_index.md           # Danh sách theo dõi toàn bộ dự án
│   ├── active/                    # Dự án hiện tại đang chạy (Brief, Context, Constraints...)
│   └── archived/                  # Các dự án cũ đã đóng gói để tra cứu
│
├── roles/                         # Mapping theo vai trò (PM, BA, SA, ARCH, BE, FE, QA, DEVOPS)
│
└── views/                         # Phân vùng lưu trữ các góc nhìn ảo (Virtual Views)
    ├── solo_view.md               # Góc nhìn tinh gọn hàng ngày
    ├── role_view.md               # Góc nhìn lọc theo vai trò
    ├── workflow_view.md           # Góc nhìn theo vòng đời dự án
    └── project_view.md            # Góc nhìn nhanh định vị thông tin dự án
```