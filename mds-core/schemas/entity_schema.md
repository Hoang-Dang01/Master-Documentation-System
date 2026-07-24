# Đặc tả MDS Core — Lược đồ Định nghĩa Thực thể (entity_schema)

> **Vai trò:** Canonical Entity Schema (Lược đồ Thực thể Chuẩn tắc)
> **Sứ mệnh:** Định nghĩa phân loại các thực thể tri thức (Nodes) và quy chuẩn đặt mã định danh (IDs), siêu dữ liệu (Metadata) cùng các mối quan hệ (Edges) trong đồ thị tri thức của **MDS (Master Documentation System)**.

---

## 1. Bản đồ Phân nhóm Thực thể (Entity Layer Mapping)

Đồ thị tri thức MDS vNext bao gồm 23 thực thể chuẩn tắc được chia thành 5 lớp rõ ràng:

```text
                               ┌── CTX (Project Context / Bối cảnh dự án)
         ┌── Lớp Nghiệp Vụ ────┼── BRD (Business Requirements Document / Tài liệu yêu cầu nghiệp vụ)
         │                     ├── FLOW (Process Flow / Luồng quy trình nghiệp vụ)
         │                     ├── UC (Use Case / Kịch bản tương tác người dùng - hệ thống)
         │                     ├── REQ (Requirement / Yêu cầu nghiệp vụ)
         │                     ├── BR  (Business Rule / Quy tắc nghiệp vụ)
         │                     └── NFR (Non-Functional Requirement / Yêu cầu phi chức năng)
         │
         │                     ┌── ADR (Architecture Decision / Quyết định kiến trúc)
         │                     ├── HLD (High-Level Design / Thiết kế kiến trúc tổng thể)
         │                     ├── SEC (Security Specification / Thiết kế bảo mật)
         │                     ├── API (API Contract / Hợp đồng giao tiếp)
         │                     ├── DB  (Database Schema / Cơ sở dữ liệu logic/vật lý)
         │                     ├── SRV (Service/Component / Dịch vụ thành phần)
         │                     ├── UI  (UI Spec/Wireframe / Thiết kế giao diện)
         │                     └── DEC (Decision Log / Nhật ký quyết định nhỏ)
MDS      │
Entities ├── Lớp Triển Khai ───┼── TSK (Task / Nhiệm vụ phát triển)
         │                     ├── TC  (Test Case / Kịch bản kiểm thử)
         │                     ├── BUG (Bug Report / Báo cáo lỗi)
         │                     └── REL (Release / Kế hoạch phát hành)
         │
         │                     ┌── INC (Incident Report / Sự cố vận hành)
         │                     ├── RUN (Runbook / Hướng dẫn vận hành)
         │                     ├── FIN (Financial Cost / Chi phí tài chính)
         │                     └── RSK (Risk Register / Danh sách rủi ro)
         │
         └── Lớp Khởi Động ────┴── FSB (Feasibility Study / Đánh giá khả thi)
```

---

## 2. Đặc tả chi tiết các Thực thể (Canonical Entity Specs)

### 2.1 Lớp Khởi Động (Inception Layer)
*   **`FSB` (Feasibility Study)**:
    *   *Nội dung*: Đánh giá khả thi dự án theo 3 chiều: Kỹ thuật, Tài chính và Thời gian.
    *   *ID Định dạng*: `PM-FSB-PROJECT-NUMBER` (Ví dụ: `PM-FSB-EDU-001`).

### 2.2 Lớp Nghiệp Vụ (Business Layer)
*   **`CTX` (Context)**: 
    *   *Nội dung*: Lưu trữ thông tin nền tảng, bối cảnh kinh doanh, mục tiêu và ràng buộc dự án.
    *   *Các file đại diện*: `project_brief.md`, `business_context.md`, `constraints.md`.
    *   *ID Định dạng*: `CTX-PROJECT-FILE` (Ví dụ: `CTX-EDU-BRIEF`).
*   **`BRD` (Business Requirements Document)**:
    *   *Nội dung*: Tài liệu yêu cầu nghiệp vụ tổng quan dự án, mô tả phạm vi, user personas và functional decompose.
    *   *ID Định dạng*: `BA-BRD-PROJECT-NUMBER` (Ví dụ: `BA-BRD-EDU-001`).
*   **`FLOW` (Process Flow)**:
    *   *Nội dung*: Luồng quy trình nghiệp vụ biểu diễn qua sơ đồ (Swimlane, BPMN) và giải thích các bước nghiệp vụ.
    *   *ID Định dạng*: `BA-FLOW-PROJECT-COMPONENT-NUMBER` (Ví dụ: `BA-FLOW-EDU-AUTH-001`).
*   **`UC` (Use Case)**:
    *   *Nội dung*: Đặc tả tương tác chi tiết giữa người dùng và hệ thống (Preconditions, Happy Path, Exception Paths).
    *   *ID Định dạng*: `BA-UC-PROJECT-COMPONENT-NUMBER` (Ví dụ: `BA-UC-EDU-AUTH-001`).
*   **`REQ` (Requirement)**:
    *   *Nội dung*: Đặc tả chức năng chi tiết.
    *   *ID Định dạng*: `BA-REQ-PROJECT-COMPONENT-NUMBER` (Ví dụ: `BA-REQ-EDU-AUTH-001`).
*   **`BR` (Business Rule)**:
    *   *Nội dung*: Các ràng buộc chính sách nghiệp vụ, công thức tính toán độc lập công nghệ.
    *   *ID Định dạng*: `BA-BR-PROJECT-COMPONENT-NUMBER` (Ví dụ: `BA-BR-EDU-AUTH-015`).
*   **`NFR` (Non-Functional Requirement)**:
    *   *Nội dung*: Các yêu cầu phi chức năng: hiệu năng, bảo mật, độ tin cậy, khả năng mở rộng.
    *   *ID Định dạng*: `SA-NFR-PROJECT-COMPONENT-NUMBER` (Ví dụ: `SA-NFR-EDU-SYS-002`).

### 2.3 Lớp Kỹ Thuật (Technical Layer)
*   **`ADR` (Architecture Decision)**:
    *   *Nội dung*: Bản ghi nhật ký các quyết định thiết kế kiến trúc, đối sánh giải pháp và đánh đổi (trade-offs).
    *   *ID Định dạng*: `ARCH-ADR-PROJECT-COMPONENT-NUMBER` (Ví dụ: `ARCH-ADR-EDU-INFRA-003`).
*   **`HLD` (High-Level Design)**:
    *   *Nội dung*: Bản mô tả thiết kế hệ thống tổng thể, sơ đồ component, topo dịch vụ và sequence flow.
    *   *ID Định dạng*: `ARCH-HLD-PROJECT-COMPONENT-NUMBER` (Ví dụ: `ARCH-HLD-EDU-SYS-001`).
*   **`SEC` (Security Specification)**:
    *   *Nội dung*: Đặc tả mô hình đe dọa bảo mật (Threat Model), rủi ro an ninh (OWASP), chính sách phân quyền (Access Control) và mã hóa.
    *   *ID Định dạng*: `ARCH-SEC-PROJECT-COMPONENT-NUMBER` (Ví dụ: `ARCH-SEC-EDU-AUTH-001`).
*   **`API` (API Contract)**:
    *   *Nội dung*: Đặc tả endpoint, tham số truyền vào/ra, mã lỗi của API.
    *   *ID Định dạng*: `SA-API-PROJECT-COMPONENT-NUMBER` hoặc `BE-API-PROJECT-COMPONENT-NUMBER` (Ví dụ: `SA-API-EDU-AUTH-012`).
*   **`DB` (Database Schema)**:
    *   *Nội dung*: Sơ đồ ERD logic hoặc mã triển khai vật lý (Prisma/SQL migrations).
    *   *ID Định dạng*: `SA-DB-PROJECT-COMPONENT-NUMBER` hoặc `BE-DB-PROJECT-COMPONENT-NUMBER` (Ví dụ: `SA-DB-EDU-AUTH-001`).
*   **`SRV` (Service)**:
    *   *Nội dung*: Ranh giới và thông tin cấu hình của microservice hoặc module độc lập.
    *   *ID Định dạng*: `ARCH-SRV-PROJECT-COMPONENT-NUMBER` (Ví dụ: `ARCH-SRV-EDU-CORE-002`).
*   **`UI` (UI Spec/Wireframe)**:
    *   *Nội dung*: Bản phác thảo giao diện, wireframe, Figma link và các chỉ dẫn luồng người dùng (User Flows).
    *   *ID Định dạng*: `FE-UI-PROJECT-COMPONENT-NUMBER` (Ví dụ: `FE-UI-EDU-AUTH-005`).
*   **`DEC` (Decision Log)**:
    *   *Nội dung*: Quyết định kỹ thuật nhỏ không đủ tầm làm ADR để tránh mất ngữ cảnh.
    *   *ID Định dạng*: `ARCH-DEC-PROJECT-COMPONENT-NUMBER` (Ví dụ: `ARCH-DEC-EDU-INFRA-011`).

### 2.4 Lớp Triển Khai & Kiểm Thử (Implementation & Verification Layer)
*   **`TSK` (Task)**:
    *   *Nội dung*: Các đơn vị công việc cụ thể được phân rã để gán cho các Agent thực thi.
    *   *ID Định dạng*: `PM-TSK-PROJECT-COMPONENT-NUMBER` (Ví dụ: `PM-TSK-EDU-AUTH-001`).
*   **`TC` (Test Case / QA-TC)**:
    *   *Nội dung*: Kịch bản các bước kiểm thử tự động hoặc thủ công.
    *   *ID Định dạng*: `QA-TC-PROJECT-COMPONENT-NUMBER` (Ví dụ: `QA-TC-EDU-AUTH-044`).
*   **`BUG` (Bug Report)**:
    *   *Nội dung*: Báo cáo lỗi kỹ thuật phát hiện trong quá trình phát triển/kiểm thử.
    *   *ID Định dạng*: `QA-BUG-PROJECT-COMPONENT-NUMBER` (Ví dụ: `QA-BUG-EDU-AUTH-002`).
*   **`REL` (Release)**:
    *   *Nội dung*: Kế hoạch phát hành, ghi chú phát hành (Release Notes) của phiên bản.
    *   *ID Định dạng*: `PM-REL-PROJECT-VERSION` (Ví dụ: `PM-REL-EDU-v1.0.0`).

### 2.5 Lớp Vận Hành (Operations Layer)
*   **`INC` (Incident)**:
    *   *Nội dung*: Nhật ký ghi nhận lỗi nóng trên production và phân tích nguyên nhân gốc rễ (RCA).
    *   *ID Định dạng*: `DEVOPS-INC-PROJECT-COMPONENT-NUMBER` (Ví dụ: `DEVOPS-INC-EDU-CORE-002`).
*   **`RUN` (Runbook)**:
    *   *Nội dung*: Hướng dẫn các bước khắc phục sự cố hoặc triển khai vận hành hạ tầng bằng tay.
    *   *ID Định dạng*: `DEVOPS-RUN-PROJECT-COMPONENT-NUMBER` (Ví dụ: `DEVOPS-RUN-EDU-INFRA-005`).
*   **`FIN` (Financial Cost)**:
    *   *Nội dung*: Tài liệu dự toán hoặc hóa đơn thực tế của tài nguyên hạ tầng đám mây.
    *   *ID Định dạng*: `PM-FIN-PROJECT-COMPONENT-NUMBER` (Ví dụ: `PM-FIN-EDU-INFRA-001`).
*   **`RSK` (Risk Register)**:
    *   *Nội dung*: Danh sách rủi ro dự án kèm xác suất, mức độ ảnh hưởng và kế hoạch giảm thiểu.
    *   *ID Định dạng*: `PM-RSK-PROJECT-COMPONENT-NUMBER` (Ví dụ: `PM-RSK-EDU-PROJ-001`).

---

## 3. Các mối quan hệ trong Graph (Graph Edges / Relations)

Các thực thể tri thức được liên kết chặt chẽ với nhau để tạo thành chuỗi truy vết logic (Traceability Chain):

*   **`implements` (Hiện thực hóa)**:
    *   `BRD` ➔ `implements` ➔ `FSB` / `CTX` (BRD hiện thực hóa đánh giá khả thi hoặc bối cảnh brief).
    *   `FLOW` / `UC` ➔ `implements` ➔ `BRD` (Quy trình nghiệp vụ hoặc kịch bản tương tác hiện thực hóa BRD).
    *   `REQ` ➔ `implements` ➔ `BRD` / `FLOW` / `UC` (Yêu cầu chức năng chi tiết hiện thực hóa BRD, luồng FLOW hoặc kịch bản UC).
    *   `HLD` / `SEC` ➔ `implements` ➔ `REQ` / `NFR` (High-Level Design và Security Spec hiện thực hóa các yêu cầu lớn).
    *   `API` / `DB` / `UI` ➔ `implements` ➔ `REQ` (Thiết kế kỹ thuật/UI hiện thực hóa yêu cầu BA).
    *   `TSK` ➔ `implements` ➔ `API` / `DB` / `REQ` (Code task hiện thực hóa các đặc tả).
*   **`adheres_to` (Tuân thủ)**:
    *   `BRD` / `FLOW` / `UC` ➔ `adheres_to` ➔ `constraints.md` (BRD, FLOW, và UC tuân thủ ràng buộc hệ thống tối cao).
    *   `API` / `DB` / `HLD` / `SEC` ➔ `adheres_to` ➔ `ADR` (Thiết kế chi tiết/tổng thể/bảo mật tuân thủ kiến trúc vĩ mô).
    *   `REQ` / `SEC` ➔ `adheres_to` ➔ `constraints.md` (Yêu cầu & Bảo mật tuân thủ ràng buộc hệ thống tối cao).
    *   `REQ` / `FLOW` / `UC` ➔ `adheres_to` ➔ `BR` (Yêu cầu, Quy trình nghiệp vụ, & Use Case tuân thủ/bị ràng buộc bởi Business Rule).
    *   `API` / `SEC` ➔ `adheres_to` ➔ `NFR` (API và Thiết kế bảo mật tuân thủ yêu cầu phi chức năng).
*   **`depends_on` (Phụ thuộc vào)**:
    *   `REQ` ➔ `depends_on` ➔ `REQ` (Tính năng A yêu cầu tính năng B phải hoạt động trước).
    *   `FLOW` / `UC` ➔ `depends_on` ➔ `FLOW` / `UC` (Quy trình/Kịch bản A yêu cầu quy trình/kịch bản B hoàn tất).
*   **`verifies` (Kiểm chứng)**:
    *   `TC` ➔ `verifies` ➔ `REQ` / `API` / `HLD` / `SEC` / `FLOW` / `UC` (Kiểm thử chức năng xác thực yêu cầu, API, bảo mật, quy trình, & kịch bản tương tác).
    *   `TC` ➔ `validates_nfr` ➔ `NFR` (Kịch bản test tải xác thực yêu cầu phi chức năng).
    *   `REQ` / `API` / `NFR` / `SEC` / `FLOW` / `UC` ➔ `tested_by` ➔ `TC` (Được kiểm chứng/test bởi Test Case nào).
*   **`derived_from` (Nguồn gốc từ)**:
    *   `REQ` ➔ `derived_from` ➔ Ghi chú cuộc họp thô / ý kiến khách hàng.
    *   `FSB` ➔ `derived_from` ➔ `intake_brief.md` / `project_brief.md`.
*   **`resolves` (Giải quyết)**:
    *   Mã nguồn / Vá lỗi ➔ `resolves` ➔ `BUG` hoặc `INC`.
*   **`mitigates` (Giảm thiểu)**:
    *   `ADR` / `RUN` / `DEC` / `SEC` ➔ `mitigates` ➔ `RSK` (Thiết kế bảo mật / Runbook giảm thiểu rủi ro an ninh).
*   **`produces` (Sinh ra)**:
    *   `BRD` ➔ `produces` ➔ `BA-FLOW` / `BA-UC` / `BA-REQ` / `BA-BR` (BRD sinh ra các luồng quy trình, kịch bản use cases, yêu cầu và quy tắc nghiệp vụ).
    *   `HLD` / `ADR` / `SEC` ➔ `produces` ➔ `API` / `DB` / `TSK` / `RUN` (Kiến trúc & Bảo mật sinh ra các đặc tả và task con).
*   **`synthesizes` (Tổng hợp)**:
    *   `HLD` / `SEC` ➔ `synthesizes` ➔ `ADR` (Thiết kế tổng thể & Bảo mật tích hợp nhiều quyết định kiến trúc đơn lẻ).
*   **`elaborates` (Chi tiết hóa / Làm rõ)**:
    *   `FLOW` / `UC` / `UI` ➔ `elaborates` ➔ `REQ` (Quy trình nghiệp vụ, kịch bản tương tác hoặc giao diện wireframe làm rõ yêu cầu chức năng).
*   **`references` (Tham chiếu)**:
    *   `SEC` / `ADR` / `BRD` / `FLOW` / `UC` ➔ `references` ➔ `EXT-REF-[NAME]` (Tham chiếu tài liệu hoặc tiêu chuẩn bên ngoài).
*   **`supersedes` (Thay thế)**:
    *   `ADR` / `DEC` / `RUN` / `FLOW` / `UC` ➔ `supersedes` ➔ `ADR` / `DEC` / `RUN` / `FLOW` / `UC` (Thay thế quy trình/kịch bản cũ hơn).
*   **`includes` (Nhúng)**:
    *   `UC` ➔ `includes` ➔ `UC` (Use Case nhúng hành vi của Use Case con bắt buộc).
*   **`extends` (Mở rộng)**:
    *   `UC` ➔ `extends` ➔ `UC` (Use Case mở rộng hành vi của Use Case cơ sở).