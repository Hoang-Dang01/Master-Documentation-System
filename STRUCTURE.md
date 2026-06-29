# MDS vNext - Cây Thư Mục Chi Tiết (Directory Tree Map)

Bản đồ chi tiết cấu trúc cây thư mục 2 cấp của **MDS vNext — Solo AI-Native Edition**.

```text
MDS/
│
├── README.md                      # Landing page chính của MDS
├── STRUCTURE.md                   # Bản đồ toàn bộ cây thư mục (file này)
├── QUICK_START.md                 # Hướng dẫn setup nhanh cho Human + AI
│
├── 00_CORE/                       # Thư viện lõi bất biến (Immutable Core Library)
│   ├── standards/                 # Các quy tắc kỹ nghệ chuẩn tắc bắt buộc
│   │   ├── DOCUMENT_STANDARDS.md  # 5 Canonical Rules chi tiết
│   │   ├── NAMING_CONVENTION.md   # Quy ước đặt tên file chuẩn tắc
│   │   ├── VERSIONING_RULES.md    # Hướng dẫn phiên bản SemVer 3 chỉ số
│   │   ├── RELATIONSHIP_RULES.md  # Định nghĩa links graph (DAG)
│   │   └── LIFECYCLE_RULES.md     # Ma trận trạng thái tài liệu
│   │
│   ├── schemas/                   # Lược đồ mô tả dữ liệu
│   │   ├── ENTITY_SCHEMA.md       # Định nghĩa thực thể tri thức (REQ, API, DB...)
│   │   ├── ROLE_SCHEMA.md         # Quy chuẩn định nghĩa vai trò nhân sự
│   │   ├── PROJECT_SCHEMA.md      # Định dạng thiết kế bối cảnh dự án
│   │   └── WORKFLOW_SCHEMA.md     # Sơ đồ hóa các giai đoạn vòng đời dự án
│   │
│   ├── templates/                 # Thư viện biểu mẫu sạch (sử dụng TGE Model)
│   │   ├── BASE/                  # Biểu mẫu nền tảng (BASE_TEMPLATE, BASE_GUIDE, BASE_EXAMPLE)
│   │   ├── PM/                    # Biểu mẫu PM (ROADMAP, SCOPE, DELIVERY_PLAN)
│   │   ├── BA/                    # Biểu mẫu BA (BRD, USE_CASE, BUSINESS_RULE, PROCESS_FLOW)
│   │   ├── SA/                    # Biểu mẫu SA (SRS, DOMAIN_MODEL, DFD, LOGIC_SPEC)
│   │   ├── ARCH/                  # Biểu mẫu Kiến trúc (ADR, HLD, SECURITY, NFR)
│   │   ├── BE/                    # Biểu mẫu Backend (API, SERVICE, DB_DDL, INTEGRATION)
│   │   ├── FE/                    # Biểu mẫu Frontend (UI_SPEC, COMPONENT, STATE_FLOW, UX_FLOW)
│   │   ├── QA/                    # Biểu mẫu Đảm bảo chất lượng (TEST_PLAN, TEST_CASE, BUG_REPORT)
│   │   └── DEVOPS/                # Biểu mẫu Vận hành (DEPLOYMENT, INFRA, MONITORING, INCIDENT)
│   │
│   └── glossary/                  # Từ điển thuật ngữ kỹ thuật và nghiệp vụ (AI-First Glossary)
│       ├── GLOSSARY_CORE_TERMS.md # Thuật ngữ cốt lõi nền tảng (Artifact, Canonical, Drift...)
│       ├── GLOSSARY_ARTIFACT_TYPES.md # Đặc tả các loại tài liệu thực thể (REQ, API, DB...)
│       ├── GLOSSARY_RELATIONS.md  # Định nghĩa ngữ nghĩa của các liên kết graph
│       ├── GLOSSARY_ACRONYMS.md   # Từ điển viết tắt (BA, SA, ADR, RBAC...)
│       └── domain/                # Phân từ điển theo lĩnh vực chuyên biệt
│           ├── BACKEND_TERMS.md   # Thuật ngữ Backend (idempotency, consistency...)
│           ├── FRONTEND_TERMS.md  # Thuật ngữ Frontend (state management...)
│           ├── DATABASE_TERMS.md  # Thuật ngữ Database (sharding...)
│           └── DEVOPS_TERMS.md    # Thuật ngữ DevOps (error budget...)
│
├── 10_ROLES/                      # Mapping theo vai trò (PM, BA, SA, ARCH, BE, FE, QA, DEVOPS)
│
├── 20_LIFECYCLE/                  # Mapping theo lifecycle phát triển của dự án (01 - 06)
│
├── 30_PROJECTS/                   # Ngữ cảnh runtime của dự án thực tế đang chạy
│   ├── PROJECT_INDEX.md           # Danh sách theo dõi toàn bộ dự án
│   ├── ACTIVE/                    # Dự án hiện tại đang chạy (Brief, Context, Constraints...)
│   └── ARCHIVED/                  # Các dự án cũ đã đóng gói để tra cứu
│
├── 35_PATTERN_LIBRARY/            # Thư viện lưu trữ các mẫu thiết kế và giải pháp công nghệ
│   ├── architecture/              # Mẫu kiến trúc (monolith, modulith, microservices)
│   ├── database/                  # Mẫu database (sharding, indexing)
│   └── integration/               # Mẫu tích hợp (saga, event_bus)
│
├── 40_AI_SKILLS/                  # AI orchestration và cấu hình AI workers
│   ├── ORCHESTRATOR/              # Luật điều phối, context builder, task dispatcher
│   ├── AGENTS/                    # Prompts cụ thể cho từng AI Agent theo vai trò
│   └── PROMPTS/                   # Prompts dùng chung (System, Review, Coding prompts)
│
├── 50_AUTOMATION/                 # Động cơ tự động hóa đối soát drift tài liệu
│   ├── scripts/                   # Scripts nodejs thực thi (detect_drift.js, validate_links.js...)
│   └── configs/                   # Cấu hình bộ luật linter và workflow rules
│
├── 90_VIEWS/                      # Phân vùng lưu trữ các góc nhìn ảo (Virtual Views)
│   ├── SOLO_VIEW.md               # Góc nhìn tinh gọn hàng ngày
│   ├── ROLE_VIEW.md               # Góc nhìn lọc theo vai trò
│   ├── WORKFLOW_VIEW.md           # Góc nhìn theo vòng đời dự án
│   └── PROJECT_VIEW.md            # Góc nhìn nhanh định vị thông tin dự án
│
└── 99_ARCHIVE/                    # Lưu trữ tài liệu lịch sử cũ
```