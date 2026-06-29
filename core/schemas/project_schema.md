# Đặc tả MDS Core — Lược đồ Ngữ cảnh Dự án (project_schema)

> **Vai trò:** Project Context Schema Spec (Lược đồ Ngữ cảnh Dự án)
> **Sứ mệnh:** Định nghĩa quy chuẩn bắt buộc cho bộ ba tài liệu ngữ cảnh nền tảng (Project Profiles) tại thư mục `projects/active/` nhằm thiết lập ranh giới nghiệp vụ, mục tiêu kinh doanh và các ràng buộc tối cao cho dự án trước khi vận hành.

---

## 1. Bản đồ Hồ sơ Ngữ cảnh Dự án (Project Profiles Matrix)

Mọi dự án vận hành trên hệ điều hành MDS bắt buộc phải định nghĩa và duy trì bộ ba tài liệu sau ở trạng thái phê duyệt (`APPROVED`) tại thư mục `projects/active/`:

```text
                           ┌── project_brief.md     (Mục tiêu, Phạm vi & Nhân sự)
projects/active/ ──────────┼── business_context.md  (Bối cảnh kinh doanh & ROI)
                           └── constraints.md       (Ràng buộc tối cao kỹ thuật/vận hành)
```

---

## 2. Đặc tả Cấu trúc Tài liệu (Document Structures)

### 2.1 project_brief.md — Đặc tả Hồ sơ dự án & Nhân sự
Tài liệu này xác định mục tiêu vĩ mô và phân bổ nguồn lực:
*   **Mục tiêu Chiến lược (Strategic Goals)**: Mô tả vấn đề dự án cần giải quyết và kết quả kỳ vọng.
*   **Ma trận Phân bổ Nhân sự (RACI Matrix)**: Phân định vai trò chịu trách nhiệm chính (Responsible), phê duyệt (Accountable), tư vấn (Consulted) và nhận thông tin (Informed) giữa Con người (Human PO/Architect) và các AI Worker Agents.
*   **Phạm vi nghiệp vụ (In-Scope & Out-of-Scope)**:
    *   *In-Scope*: Các tính năng bắt buộc phải thực hiện trong phiên bản release hiện tại.
    *   *Out-of-Scope*: Các tính năng bị loại trừ để tránh phình phạm vi (Scope Creep).
*   **Mốc thời gian (Milestone Timeline)**: Các dấu mốc bàn giao và phát hành chính.

### 2.2 business_context.md — Đặc tả Bối cảnh Kinh doanh & ROI
Tài liệu này đảm bảo dự án mang lại giá trị thực tế:
*   **Bối cảnh thị trường (Market Context)**: Lý do dự án cần được thực hiện và đối thủ cạnh tranh.
*   **Chân dung người dùng (User Personas)**: Phân tích hành vi, nhu cầu và điểm đau (Pain points) của đối tượng khách hàng mục tiêu.
*   **Chỉ số Đo lường Hiệu quả (Key Metrics / KPIs)**: Ví dụ: Tốc độ tăng trưởng người dùng, tỷ lệ giữ chân (Retention rate).
*   **Bài toán Lợi ích đầu tư (ROI Analysis)**: Đánh giá chi phí phát triển so với doanh thu hoặc giá trị kinh doanh mang lại.

### 2.3 constraints.md — Đặc tả Ràng buộc tối cao
Tài liệu quan trọng nhất để áp đặt giới hạn (Guardrails) cho hệ thống:
*   **Ràng buộc Kỹ thuật (Technical Constraints)**: Quy định bắt buộc về ngăn xếp công nghệ (Tech Stack) được ARCH phê duyệt (ví dụ: PostgreSQL, Next.js, React).
*   **Ràng buộc Vận hành (Operational Constraints)**:
    *   *Ngân sách hạ tầng*: Giới hạn chi phí dịch vụ đám mây hàng tháng (ví dụ: dưới $300/tháng).
    *   *Cam kết dịch vụ (SLA)*: Cam kết thời gian hoạt động liên tục (Uptime SLA, ví dụ: 99.9%).
*   **Ràng buộc Bảo mật & Tuân thủ (Compliance Constraints)**: Quy chuẩn bảo mật phải tuân thủ (GDPR, PCI-DSS, mã hóa dữ liệu tĩnh và dữ liệu truyền đi).

---

## 3. Hợp đồng Siêu dữ liệu Bắt buộc (Mandatory Metadata Contracts)

Cả ba tài liệu ngữ cảnh dự án phải chứa YAML Frontmatter chuẩn tắc để các phân hệ Control Plane tự động quét bối cảnh (Context Assembly):

### 3.1 Metadata cho `project_brief.md`
```yaml
---
id: CTX-PROJECT-BRIEF
title: Hồ sơ dự án và Phân bổ Nhân sự
status: DRAFT | REVIEW | APPROVED
version: X.Y.Z
owner: pm_agent
last_synchronized: YYYY-MM-DD
---
```

### 3.2 Metadata cho `business_context.md`
```yaml
---
id: CTX-BUSINESS-CONTEXT
title: Bối cảnh nghiệp vụ và ROI dự án
status: DRAFT | REVIEW | APPROVED
version: X.Y.Z
owner: ba_agent
last_synchronized: YYYY-MM-DD
---
```

### 3.3 Metadata cho `constraints.md`
```yaml
---
id: CTX-PROJECT-CONSTRAINTS
title: Ràng buộc Kỹ thuật và Vận hành Tối cao
status: DRAFT | REVIEW | APPROVED
version: X.Y.Z
owner: arch_agent
last_synchronized: YYYY-MM-DD
---
```

---

## 4. Quy tắc Kiểm duyệt & Cưỡng chế (Governance Rules)

*   **Rule 1 — Cổng khởi động dự án (Project Gate)**: Không một luồng phát triển nào (BA/ARCH/BE/FE/QA) được phép kích hoạt nếu bộ ba tài liệu ngữ cảnh chưa chuyển sang trạng thái phê duyệt `APPROVED` bởi con người.
*   **Rule 2 — Kiểm tra chênh lệch ràng buộc (Drift Constraint Validation)**: Bất kỳ thay đổi nào trong `constraints.md` đều bị coi là **Thay đổi Trọng yếu (Major Change)**. Khi `constraints.md` thay đổi:
    1. Kích hoạt tự động quét đối soát toàn bộ các quyết định kiến trúc (`arch-adr-*`) để phát hiện các quyết định vi phạm ràng buộc mới.
    2. Gửi cảnh báo đỏ (Critical Warning) lên con người và dừng pipeline triển khai tự động.
*   **Rule 3 — Ranh giới sở hữu tài liệu (Ownership Boundary)**:
    *   PM Agent sở hữu và duy trì `project_brief.md`.
    *   BA Agent sở hữu và duy trì `business_context.md`.
    *   ARCH Agent sở hữu và duy trì `constraints.md`.