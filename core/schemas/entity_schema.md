# Đặc tả MDS Core — Lược đồ Định nghĩa Thực thể (entity_schema)

> **Vai trò:** Canonical Entity Schema (Lược đồ Thực thể Chuẩn tắc)
> **Sứ mệnh:** Định nghĩa phân loại các thực thể tri thức (Nodes) và quy chuẩn đặt mã định danh (IDs), siêu dữ liệu (Metadata) cùng các mối quan hệ (Edges) trong đồ thị tri thức của **MDS (Master Documentation System)**.

---

## 1. Bản đồ Phân nhóm Thực thể (Entity Layer Mapping)

Đồ thị tri thức MDS vNext bao gồm 13 thực thể chuẩn tắc được chia thành 4 lớp nghiệp vụ/kỹ thuật rõ ràng:

```text
                               ┌── CTX (Project Context / Bối cảnh dự án)
         ┌── Lớp Nghiệp Vụ ────┼── REQ (Requirement / Yêu cầu nghiệp vụ)
         │                     └── BR  (Business Rule / Quy tắc nghiệp vụ)
         │
         │                     ┌── ADR (Architecture Decision / Quyết định kiến trúc)
         │                     ├── API (API Contract / Hợp đồng giao tiếp)
         ┌── Lớp Kỹ Thuật ─────┼── DB  (Database Schema / Cơ sở dữ liệu logic/vật lý)
         │                     └── SRV (Service/Component / Dịch vụ thành phần)
MDS      │
Entities │                     ┌── TSK (Task / Nhiệm vụ phát triển)
         ├── Lớp Triển Khai ───┼── TC  (Test Case / Kịch bản kiểm thử)
         │                     ├── BUG (Bug Report / Báo cáo lỗi)
         │                     └── REL (Release / Kế hoạch phát hành)
         │
         │                     ┌── INC (Incident Report / Sự cố vận hành)
         │                     ├── RUN (Runbook / Hướng dẫn vận hành)
         └── Lớp Vận Hành ─────┴── FIN (Financial Cost / Chi phí tài chính)
```

---

## 2. Đặc tả chi tiết các Thực thể (Canonical Entity Specs)

### 2.1 Lớp Nghiệp Vụ (Business Layer)
*   **`CTX` (Context)**: 
    *   *Nội dung*: Lưu trữ thông tin nền tảng, bối cảnh kinh doanh, mục tiêu và ràng buộc dự án.
    *   *Các file đại diện*: `project_brief.md`, `business_context.md`, `constraints.md`.
    *   *ID Định dạng*: `CTX-[TÊN_DỰ_ÁN]-[TÊN_FILE]` (Ví dụ: `CTX-VRMS-BRIEF`).
*   **`REQ` (Requirement)**:
    *   *Nội dung*: Đặc tả chức năng (Functional) và phi chức năng (Non-functional) chi tiết.
    *   *ID Định dạng*: `BA-REQ-[NUMBER]` (Ví dụ: `BA-REQ-001`).
*   **`BR` (Business Rule)**:
    *   *Nội dung*: Các ràng buộc chính sách nghiệp vụ, công thức tính toán độc lập công nghệ.
    *   *ID Định dạng*: `BA-BR-[NUMBER]` (Ví dụ: `BA-BR-015`).

### 2.2 Lớp Kỹ Thuật (Technical Layer)
*   **`ADR` (Architecture Decision)**:
    *   *Nội dung*: Bản ghi nhật ký các quyết định thiết kế kiến trúc, đối sánh giải pháp và tradeoffs.
    *   *ID Định dạng*: `ARCH-ADR-[NUMBER]` (Ví dụ: `ARCH-ADR-003`).
*   **`API` (API Contract)**:
    *   *Nội dung*: Đặc tả endpoint, tham số truyền vào/ra, mã lỗi của API.
    *   *ID Định dạng*: `SA-API-[NUMBER]` hoặc `BE-API-[NUMBER]` (Ví dụ: `SA-API-012`).
*   **`DB` (Database Schema)**:
    *   *Nội dung*: Sơ đồ ERD logic hoặc mã triển khai vật lý (Prisma/SQL migrations).
    *   *ID Định dạng*: `SA-DB-[NUMBER]` hoặc `BE-DB-[NUMBER]` (Ví dụ: `SA-DB-001`).
*   **`SRV` (Service)**:
    *   *Nội dung*: Ranh giới và thông tin cấu hình của microservice hoặc module độc lập.
    *   *ID Định dạng*: `ARCH-SRV-[NUMBER]` (Ví dụ: `ARCH-SRV-002`).

### 2.3 Lớp Triển Khai & Kiểm Thử (Implementation & Verification Layer)
*   **`TSK` (Task)**:
    *   *Nội dung*: Các đơn vị công việc được phân rã để gán cho các Agent thực thi.
    *   *ID Định dạng*: `T-[NUMBER]` (Ví dụ: `T-001`).
*   **`TC` (Test Case / QA-TC)**:
    *   *Nội dung*: Kịch bản các bước kiểm thử tự động hoặc thủ công.
    *   *ID Định dạng*: `QA-TC-[NUMBER]` (Ví dụ: `QA-TC-044`).
*   **`BUG` (Bug Report)**:
    *   *Nội dung*: Báo cáo sự cố kỹ thuật trong quá trình phát triển/kiểm thử.
    *   *ID Định dạng*: `BUG-YYYY-[NUMBER]` (Ví dụ: `BUG-2026-002`).
*   **`REL` (Release)**:
    *   *Nội dung*: Kế hoạch phát hành, ghi chú phát hành (Release Notes) của phiên bản.
    *   *ID Định dạng*: `PM-REL-[VERSION]` (Ví dụ: `PM-REL-1.0.0`).

### 2.4 Lớp Vận Hành (Operations Layer)
*   **`INC` (Incident)**:
    *   *Nội dung*: Nhật ký ghi nhận lỗi nóng trên production và phân tích nguyên nhân gốc rễ (RCA).
    *   *ID Định dạng*: `INC-[PROD/STG]-[NUMBER]` (Ví dụ: `INC-PROD-002`).
*   **`RUN` (Runbook)**:
    *   *Nội dung*: Hướng dẫn các bước khắc phục sự cố hoặc triển khai vận hành hạ tầng bằng tay.
    *   *ID Định dạng*: `OPS-RUN-[NUMBER]` (Ví dụ: `OPS-RUN-005`).
*   **`FIN` (Financial Cost)**:
    *   *Nội dung*: Tài liệu dự toán hoặc hóa đơn thực tế của tài nguyên hạ tầng đám mây.
    *   *ID Định dạng*: `FIN-INFRA-[NUMBER]` (Ví dụ: `FIN-INFRA-001`).

---

## 3. Các mối quan hệ trong Graph (Graph Edges / Relations)

Các thực thể tri thức được liên kết chặt chẽ với nhau để tạo thành chuỗi truy vết logic (Traceability Chain):

*   **`implements` (Hiện thực hóa)**:
    *   `REQ` ➔ `implements` ➔ `CTX` (Yêu cầu nghiệp vụ giải quyết bối cảnh dự án).
    *   `API` / `DB` ➔ `implements` ➔ `REQ` (Thiết kế kỹ thuật hiện thực hóa yêu cầu BA).
*   **`adheres_to` (Tuân thủ)**:
    *   `API` / `DB` ➔ `adheres_to` ➔ `ADR` (Thiết kế chi tiết tuân thủ kiến trúc vĩ mô).
    *   `REQ` ➔ `adheres_to` ➔ `constraints.md` (Yêu cầu tuân thủ ràng buộc phi chức năng).
*   **`depends_on` (Phụ thuộc vào)**:
    *   `REQ` ➔ `depends_on` ➔ `REQ` (Tính năng A yêu cầu tính năng B phải hoạt động trước).
*   **`verifies` (Kiểm chứng)**:
    *   `TC` ➔ `verifies` ➔ `REQ` (Kịch bản test xác thực yêu cầu BA).
    *   `TC` ➔ `verifies` ➔ `API` (Kiểm thử API xác thực hợp đồng dữ liệu).
*   **`derived_from` (Nguồn gốc từ)**:
    *   `REQ` ➔ `derived_from` ➔ Ghi chú cuộc họp thô / ý kiến khách hàng.
*   **`resolves` (Giải quyết)**:
    *   Mã nguồn / Vá lỗi ➔ `resolves` ➔ `BUG` hoặc `INC`.