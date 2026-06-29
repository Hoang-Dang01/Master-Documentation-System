# MDS — Master Documentation System

MDS là một hệ thống giúp bạn quản lý toàn bộ quá trình phát triển phần mềm cùng với AI, từ lúc khách hàng đưa yêu cầu ban đầu cho đến khi hệ thống chạy ổn định trên production.

Nó biến toàn bộ tri thức của dự án thành một **bản đồ tri thức (Knowledge Graph)** mà cả con người và AI đều có thể hiểu, truy vấn và tự động kiểm tra chéo lẫn nhau.

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
*   **Requirements (BA/PM)**: Phân rã thành các tài liệu tính năng phòng học, quản lý học viên.
*   **Architecture Decisions (ARCH)**: Ghi nhận quyết định dùng công nghệ gì (ADR), ví dụ: WebRTC hay LiveKit.
*   **Database Schema (BE/DBA)**: Thiết kế chi tiết các bảng dữ liệu bằng mã nguồn SQL DDL.
*   **API Contracts (BE/FE)**: Thiết kế hợp đồng API để Backend và Frontend tích hợp không bị lệch pha.
*   **Verification (QA)**: Viết kịch bản kiểm thử (Test Cases) để tự động chạy kiểm tra chất lượng.

Mọi tài liệu trên đều được liên kết chặt chẽ với nhau. Nếu bạn sửa Database, hệ thống tự động cảnh báo những API hay Test Case nào đang bị ảnh hưởng.

---

## 📍 Trạng thái dự án hiện tại (Current State)

*   **Active Project**: [projects/active](projects/active/)
*   **Current Phase**: `Phase 03: Design` ➔ [lifecycle/03_design](lifecycle/03_design/)
*   **Current Focus**: Thiết kế kiến trúc tổng thể, cơ sở dữ liệu, API Contracts và các quyết định ADR.

---

## 🚀 Cổng điều hướng nhanh (MDS Portal)

### 1. Tôi Là Ai? (Who Am I?)
*Xem chi tiết trách nhiệm, tài liệu đầu vào/đầu ra của từng vai trò:*
*   [PM (Project Manager)](roles/pm) — Lộ trình, milestones, phạm vi và tiến độ.
*   [BA (Business Analyst)](roles/ba) — Quy tắc nghiệp vụ, quy trình và yêu cầu.
*   [SA (System Analyst)](roles/sa) — Đặc tả hệ thống (SRS) và thiết kế logic.
*   [ARCH (Architect)](roles/arch) — Quyết định kiến trúc (ADR) và tiêu chuẩn bảo mật.
*   [BE (Backend Dev)](roles/be) — Cơ sở dữ liệu (DDL), API Contracts và logic backend.
*   [FE (Frontend Dev)](roles/fe) — Giao diện (UI Specs), components và trạng thái client.
*   [QA (Quality Assurance)](roles/qa) — Kịch bản kiểm thử (Test Cases) và báo cáo lỗi.
*   [DEVOPS (Platform Ops)](roles/devops) — Triển khai (IaC), CI/CD và giám sát SRE.

### 2. Tôi Đang Ở Phase Nào? (What Phase Am I In?)
*Theo dõi tài liệu cần bàn giao theo tiến độ dự án:*
*   [Phase 0: Intake](lifecycle/00_intake) ➔ [Phase 1: Discovery](lifecycle/01_discovery) ➔ [Phase 2: Analysis](lifecycle/02_analysis)
*   [Phase 3: Design](lifecycle/03_design) ➔ [Phase 4: Planning](lifecycle/04_planning) ➔ [Phase 5: Implementation](lifecycle/05_implementation)
*   [Phase 6: Testing](lifecycle/06_testing) ➔ [Phase 7: Deployment](lifecycle/07_deployment) ➔ [Phase 8: Operations](lifecycle/08_operations)
*   [Phase 9: Evolution](lifecycle/09_evolution)

### 3. Tôi Nên Vào Đâu? (Virtual Views)
*Góc nhìn ảo tối ưu hóa luồng công việc:*
*   👉 **[Góc Nhìn Solo (Solo View)](views/solo_view.md) [Khuyên dùng]**: Bàn làm việc tinh gọn hàng ngày của bạn.
*   👉 **[Góc Nhìn Dự Án Active (Project View)](views/project_view.md)**: Không gian làm việc của dự án hiện tại.

---

## 📖 Hướng dẫn đọc (Reading Order)

### Cho người mới bắt đầu (Onboarding)
1.  **[README.md](README.md)**: Bản đồ tổng quan này.
2.  **[QUICK_START.md](QUICK_START.md)**: Hướng dẫn setup nhanh dự án mới và AI trong 5 phút.
3.  **[DOCUMENT_STANDARDS.md](core/standards/document_standards.md)**: 5 Quy tắc chuẩn tắc bắt buộc của hệ thống.

### Cho vận hành hàng ngày (Daily Operations)
1.  **[SOLO_VIEW.md](views/solo_view.md)**: Nhận nhiệm vụ và bắt đầu làm việc.
2.  **[PROJECT_VIEW.md](views/project_view.md)**: Xem toàn bộ hồ sơ thiết kế của dự án active.