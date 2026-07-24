# MDS — Personal Engineering Operating System

MDS là ứng dụng desktop local-first giúp bạn biến tài liệu, ý tưởng, ticket và lỗi thành requirement có cấu trúc, phân tích tác động, thiết kế nháp, kế hoạch triển khai và context package cho coding agent.

Mục tiêu không phải để AI tự quyết định mọi thứ. Hệ thống tự động phần có quy tắc rõ, dùng AI để đề xuất bản nháp và giữ các quyết định quan trọng sau approval gate của con người.

Luồng ưu tiên đầu tiên:

```text
Tài liệu hoặc ý tưởng khách hàng
→ Requirement được duyệt
→ Impact analysis
→ Design DRAFT
→ Implementation plan
→ Agent context package
```

## Chạy desktop app

```powershell
npm.cmd install
npm.cmd run dev
```

Mặc định, dữ liệu người dùng được lưu ngoài source repository tại:

```text
%USERPROFILE%\Documents\MDS-Workspace
```

Muốn dùng ổ đĩa hoặc thư mục khác:

```powershell
$env:MDS_DATA_DIR = "D:\MDS-Workspace"
npm.cmd run dev
```

Thư mục [`workspace/`](workspace/) trong repository chỉ là seed EduMeet dành
cho phát triển và lần chạy đầu; không đặt dữ liệu khách hàng hoặc API key vào
đó. Xem [ranh giới dữ liệu local](docs/DATA_LAYOUT.md).

Kiểm tra và chạy bản production:

```powershell
npm.cmd run build
npm.cmd run smoke
npm.cmd start
```

---

## 💡 Tại sao bạn cần MDS? (Why MDS?)

Khi làm dự án phần mềm một mình hoặc cùng AI, bạn sẽ luôn gặp 3 vấn đề lớn:
1.  **Human Memory Limits**: Bạn không thể nhớ hết mọi ngóc ngách, logic và cấu trúc database của hệ thống khi dự án phình to.
2.  **AI Context Limits**: AI viết code rất nhanh nhưng sẽ "bốc phét" (hallucinate) hoặc phá vỡ cấu trúc cũ nếu không được cung cấp đúng và đủ ngữ cảnh (context).
3.  **Knowledge Drift**: Tài liệu thiết kế, sơ đồ database và code thực tế luôn bị lệch pha (drift) theo thời gian khi dự án cập nhật liên tục.

MDS được tạo ra để giải quyết triệt để 3 nỗi đau này.

---

## 🎯 MDS giúp bạn làm gì? (Concrete Example)

Ví dụ, khi khách hàng nhắn một câu:
> *“Tôi muốn xây dựng một hệ thống học trực tuyến (LMS) giống như Zoom.”*

MDS sẽ hướng dẫn bạn và AI biến câu nói mơ hồ đó thành chuỗi tài liệu kỹ nghệ chuẩn xác:
*   **Requirements (BA)**: Phân rã thành các tài liệu tính năng phòng học, quản lý học viên.
*   **Delivery Planning (PM)**: Chốt phạm vi, ưu tiên, roadmap, dependency, milestone và bằng chứng hoàn thành.
*   **Architecture Decisions (ARCH)**: Ghi nhận quyết định dùng công nghệ gì (ADR), ví dụ: WebRTC hay LiveKit.
*   **Database Schema (BE/DBA)**: Thiết kế chi tiết các bảng dữ liệu bằng mã nguồn SQL DDL.
*   **API Contracts (BE/FE)**: Thiết kế hợp đồng API để Backend và Frontend tích hợp không bị lệch pha.
*   **Verification (QA)**: Viết kịch bản kiểm thử (Test Cases) để tự động chạy kiểm tra chất lượng.

Mọi tài liệu trên đều được liên kết chặt chẽ với nhau. Nếu bạn sửa Database, hệ thống tự động cảnh báo những API hay Test Case nào đang bị ảnh hưởng.

---

## 📍 Trạng thái dự án hiện tại (Current State)

*   **Development seed**: [EduMeet](workspace/projects/active/edumeet/)
*   **Current Phase**: `Phase 03: Design` ➔ [mds-core/guides/lifecycle/03_design](mds-core/guides/lifecycle/03_design/)
*   **Current Focus**: Thiết kế kiến trúc tổng thể, cơ sở dữ liệu, API Contracts và các quyết định ADR.

---

## 🧭 Bản đồ kiến trúc mới

*   [`apps/desktop`](apps/desktop/) — Electron shell, preload bridge và React UI.
*   [`packages`](packages/) — Domain, application workflows và các adapter.
*   [`mds-core`](mds-core/) — Toàn bộ tiêu chuẩn, schema, template, glossary và hướng dẫn cũ đã được bảo toàn.
*   [`skills`](skills/) — Skill AI‑EOS của MDS và thư viện vendor đã gộp vào cùng repo.
*   [`skills/mds/PM_WORKFLOW.md`](skills/mds/PM_WORKFLOW.md) — Luồng Project/Delivery Management từ scope đến release và handoff.
*   [`workflows`](workflows/) — Automation definitions có version và approval gate.
*   [`docs/DATA_LAYOUT.md`](docs/DATA_LAYOUT.md) — Ranh giới giữa source repo và dữ liệu runtime local.
*   [`workspace/projects`](workspace/projects/) — Seed/fixture EduMeet cho development; dữ liệu thật nằm trong `MDS_DATA_DIR`.
*   [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Ranh giới kiến trúc và vertical slice đầu tiên.
*   [`docs/STRUCTURE.md`](docs/STRUCTURE.md) — Cây thư mục hiện tại.
*   [`docs/STRUCTURE.generated.md`](docs/STRUCTURE.generated.md) — Cây vật lý tự sinh bằng `npm run docs:structure`.
*   [`docs/MIGRATION_MAP.md`](docs/MIGRATION_MAP.md) — Bản ghi di chuyển, ownership và trạng thái consolidation.
*   [`docs/CANONICAL_SOURCES.md`](docs/CANONICAL_SOURCES.md) — Source of truth cho từng loại nội dung.
*   [`docs/ROADMAP.md`](docs/ROADMAP.md) — Lộ trình từ 0.1 đến Personal Engineering OS.

---

## 🚀 Cổng điều hướng nhanh (MDS Portal)

### 1. Tôi Là Ai? (Who Am I?)
*Xem chi tiết trách nhiệm, tài liệu đầu vào/đầu ra của từng vai trò:*
*   [PM (Project/Delivery Manager)](mds-core/roles/pm) — Phạm vi, ưu tiên, roadmap, dependency, tiến độ, risk và release gate.
*   [BA (Business Analyst)](mds-core/roles/ba) — Quy tắc nghiệp vụ, quy trình và yêu cầu.
*   [SA (System Analyst)](mds-core/roles/sa) — Đặc tả hệ thống (SRS) và thiết kế logic.
*   [ARCH (Architect)](mds-core/roles/arch) — Quyết định kiến trúc (ADR) và tiêu chuẩn bảo mật.
*   [BE (Backend Dev)](mds-core/roles/be) — Cơ sở dữ liệu (DDL), API Contracts và logic backend.
*   [FE (Frontend Dev)](mds-core/roles/fe) — Giao diện (UI Specs), components và trạng thái client.
*   [QA (Quality Assurance)](mds-core/roles/qa) — Kịch bản kiểm thử (Test Cases) và báo cáo lỗi.
*   [DEVOPS (Platform Ops)](mds-core/roles/devops) — Triển khai (IaC), CI/CD và giám sát SRE.

### 2. Tôi Đang Ở Phase Nào? (What Phase Am I In?)
*Theo dõi tài liệu cần bàn giao theo tiến độ dự án:*
*   [Phase 0: Intake](mds-core/guides/lifecycle/00_intake) ➔ [Phase 1: Discovery](mds-core/guides/lifecycle/01_discovery) ➔ [Phase 2: Analysis](mds-core/guides/lifecycle/02_analysis)
*   [Phase 3: Design](mds-core/guides/lifecycle/03_design) ➔ [Phase 4: Planning](mds-core/guides/lifecycle/04_planning) ➔ [Phase 5: Implementation](mds-core/guides/lifecycle/05_implementation)
*   [Phase 6: Testing](mds-core/guides/lifecycle/06_testing) ➔ [Phase 7: Deployment](mds-core/guides/lifecycle/07_deployment) ➔ [Phase 8: Operations](mds-core/guides/lifecycle/08_operations)
*   [Phase 9: Evolution](mds-core/guides/lifecycle/09_evolution)

### 3. Tôi Nên Vào Đâu? (Virtual Views)
*Góc nhìn ảo tối ưu hóa luồng công việc:*
*   👉 **[Góc Nhìn Solo (Solo View)](docs/views/solo_view.md) [Khuyên dùng]**: Bàn làm việc tinh gọn hàng ngày của bạn.
*   👉 **[Góc Nhìn Dự Án Active (Project View)](docs/views/project_view.md)**: Không gian làm việc của dự án hiện tại.

---

## 📖 Hướng dẫn đọc (Reading Order)

### Cho người mới bắt đầu (Onboarding)
1.  **[README.md](README.md)**: Bản đồ tổng quan này.
2.  **[QUICK_START.md](docs/QUICK_START.md)**: Hướng dẫn setup nhanh dự án mới và AI trong 5 phút.
3.  **[DOCUMENT_STANDARDS.md](mds-core/standards/document_standards.md)**: 5 Quy tắc chuẩn tắc bắt buộc của hệ thống.

### Cho vận hành hàng ngày (Daily Operations)
1.  **[SOLO_VIEW.md](docs/views/solo_view.md)**: Nhận nhiệm vụ và bắt đầu làm việc.
2.  **[PROJECT_VIEW.md](docs/views/project_view.md)**: Xem toàn bộ hồ sơ thiết kế của dự án active.
