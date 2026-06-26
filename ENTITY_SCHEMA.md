# MDS v7.0 - Master Entity Schema

> **MDS — Master Documentation System**
> *Canonical Entity Taxonomy for Human-AI Engineering Collaboration*

Tài liệu này định nghĩa phân loại các **Thực thể Tri thức chuẩn tắc (Canonical Entities)** được công nhận trong toàn bộ hệ thống MDS. Việc định nghĩa rõ ràng các thực thể giúp Con người và các AI Agents thống nhất ngôn ngữ chung, ngăn ngừa việc AI tự phát minh ra các thực thể lạ không khớp với kiến trúc thông tin của dự án.

---

## 1. Bản Đồ Phân Loại Thực Thể (Entity Taxonomy)

Mọi thực thể tri thức trong MDS bắt buộc phải thuộc một trong 5 nhóm chính sau:

```text
                               ┌── Requirement (REQ)
         ┌── Business ─────────┼── Business Rule (BR)
         │  Entities           ├── Stakeholder (STK)
         │                     └── Key Metric / KPI (KPI)
         │
         │                     ┌── Module (MOD)
         │                     ├── Service (SRV)
         ┌── Engineering ──────┼── API Contract (API)
         │  Entities           ├── Database Schema (DB)
         │                     └── Event Contract (EVT)
         │
MDS ─────│                     ┌── Task / Sprint (TSK)
Entities │                     ├── Release Plan (REL)
         ├── Delivery ─────────┼── Test Case (TC)
         │  Entities           └── Bug Report (BUG)
         │
         │                     ┌── Incident (INC)
         │                     ├── Alert Rule (ALT)
         ┌── Operations ───────┼── Metric / SLO (SLO)
         │  Entities           └── Runbook / SOP (RUN)
         │
         │                     ┌── Architecture Decision (DEC/ADR)
         │                     ├── AI Session Log (ORC-LOG)
         └── Intelligence ─────┼── Context Capsule (ORC-CTX)
            Entities           └── Consistency Report (ORC-RPT)
```

---

## 2. Đặc Tả Chi Tiết Từng Nhóm Thực Thể

### Nhóm 1: Thực Thể Nghiệp Vụ (Business Entities)
Định nghĩa các khía cạnh kinh doanh và yêu cầu chức năng của hệ thống.
*   **`Requirement (REQ)`**: Đặc tả yêu cầu phần mềm chi tiết. *Ví dụ ID: `REQ-ATT-001`*.
*   **`Business Rule (BR)`**: Quy tắc nghiệp vụ bắt buộc phải tuân theo. *Ví dụ ID: `BR-ATT-002`*.
*   **`Stakeholder (STK)`**: Tác nhân nghiệp vụ liên quan đến dự án. *Ví dụ ID: `STK-CLIENT-001`*.
*   **`Key Metric / KPI (KPI)`**: Chỉ số đo lường thành công của nghiệp vụ. *Ví dụ ID: `KPI-BIZ-003`*.

### Nhóm 2: Thực Thể Kỹ Thuật (Engineering Entities)
Định nghĩa kiến trúc tĩnh, cấu trúc dữ liệu và giao diện kết nối của phần mềm.
*   **`Module (MOD)`**: Phân hệ/Mô-đun chức năng lớn trong hệ thống. *Ví dụ ID: `MOD-ATT-001`*.
*   **`Service (SRV)`**: Dịch vụ nền tảng hoặc microservice. *Ví dụ ID: `SRV-ATTENDANCE-002`*.
*   **`API Contract (API)`**: Hợp đồng điểm cuối API. *Ví dụ ID: `API-ATT-021`*.
*   **`Database Schema (DB)`**: Cấu trúc bảng dữ liệu vật lý. *Ví dụ ID: `DB-ATT-001`*.
*   **`Event Contract (EVT)`**: Đặc tả sự kiện/Message Queue. *Ví dụ ID: `EVT-ORDER-004`*.

### Nhóm 3: Thực Thể Triển Khai & Bàn Giao (Delivery Entities)
Định nghĩa các cấu phần phục vụ quản lý dự án và đảm bảo chất lượng.
*   **`Task / Sprint (TSK)`**: Công việc cần hoàn thành trong một giai đoạn. *Ví dụ ID: `TSK-DEV-012`*.
*   **`Release Plan (REL)`**: Kế hoạch phát hành phiên bản. *Ví dụ ID: `REL-PHASE1-002`*.
*   **`Test Case (TC)`**: Kịch bản kiểm thử chất lượng phần mềm. *Ví dụ ID: `TC-ATT-044`*.
*   **`Bug Report (BUG)`**: Báo cáo lỗi kỹ thuật phát hiện khi test. *Ví dụ ID: `BUG-2026-102`*.

### Nhóm 4: Thực Thể Vận Hành (Operations Entities)
Định nghĩa các khía cạnh giám sát, độ tin cậy và xử lý sự cố trong môi trường thực tế.
*   **`Incident (INC)`**: Sự cố vận hành thực tế tại Production. *Ví dụ ID: `INC-PROD-004`*.
*   **`Alert Rule (ALT)`**: Quy tắc cảnh báo tự động trên hệ thống giám sát. *Ví dụ ID: `ALT-CPU-002`*.
*   **`Metric / SLO (SLO)`**: Chỉ số cam kết chất lượng dịch vụ vận hành. *Ví dụ ID: `SLO-LATENCY-001`*.
*   **`Runbook / SOP (RUN)`**: Hướng dẫn vận hành tiêu chuẩn để xử lý sự cố. *Ví dụ ID: `RUN-DB-RECOVER-001`*.

### Nhóm 5: Thực Thể Trí Tuệ & Điều Phối (Intelligence Entities)
Định nghĩa các quyết định chiến lược, phiên làm việc của AI và các báo cáo đối soát.
*   **`Architecture Decision (DEC/ADR)`**: Nhật ký quyết định kiến trúc quan trọng. *Ví dụ ID: `DEC-ARCH-012`*.
*   **`AI Session Log (ORC-LOG)`**: Nhật ký kiểm toán phiên làm việc của AI. *Ví dụ ID: `ORC-LOG-001`*.
*   **`Context Capsule (ORC-CTX)`**: Hộp nạp ngữ cảnh đóng gói cho AI Agent. *Ví dụ ID: `ORC-CTX-001`*.
*   **`Consistency Report (ORC-RPT)`**: Báo cáo tự động phát hiện lệch pha tri thức. *Ví dụ ID: `ORC-RPT-001`*.

---
*Lưu ý: Để sao chép các biểu mẫu cấu trúc dữ liệu cho các thực thể này, vui lòng truy cập [TEMPLATES.md](TEMPLATES.md).*
