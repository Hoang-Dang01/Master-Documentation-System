# Đặc tả MDS Core — Lược đồ Ngữ cảnh Dự án (project_schema)

> **Vai trò:** Project Context Schema Spec (Lược đồ Ngữ cảnh Dự án)
> **Sứ mệnh:** Định nghĩa quy chuẩn bắt buộc cho bộ hồ sơ ngữ cảnh nền tảng (Project Profiles) tại thư mục `workspace/projects/active/` nhằm thiết lập ranh giới nghiệp vụ, mục tiêu kinh doanh, ràng buộc tối cao và cấu hình chế độ vận hành cho dự án trước khi vận hành.

> **Liên kết hệ thống:**
> - Xem phân loại thực thể đầy đủ: [`entity_schema.md`](entity_schema.md)
> - Xem vòng đời và Quality Gates: [`workflow_schema.md`](workflow_schema.md)
> - Xem phân định vai trò và RACI: [`role_schema.md`](role_schema.md)

---

## 1. Bản đồ Hồ sơ Ngữ cảnh Dự án (Project Profiles Matrix)

Mọi dự án vận hành trên hệ điều hành MDS bắt buộc phải định nghĩa và duy trì bộ hồ sơ sau ở trạng thái phê duyệt (`APPROVED`) tại thư mục `workspace/projects/active/`:

```text
                           ┌── intake_brief.md      (Yêu cầu thô + Go/No-Go) ──── Phase 00
                           │
                           ├── feasibility.md        (FSB — Đánh giá khả thi) ──── Phase 00
workspace/projects/active/ ──────────┤
                           ├── project_brief.md      (Mục tiêu, Phạm vi & Nhân sự) Phase 01
                           ├── business_context.md   (Bối cảnh kinh doanh & ROI) ── Phase 01
                           └── constraints.md        (Ràng buộc tối cao kỹ thuật) ── Phase 01
```

> **Cổng bắt buộc**: Không một luồng phát triển nào (BA/ARCH/BE/FE/QA) được phép khởi động khi toàn bộ bộ hồ sơ này chưa đạt trạng thái `APPROVED` bởi Con người.

---

## 2. Đặc tả Cấu trúc Tài liệu (Document Structures)

### 2.1 `intake_brief.md` — Tóm tắt Yêu cầu Thô Ban đầu

Tài liệu đầu tiên ghi nhận tiếng nói của khách hàng ở dạng thô, chưa qua phân tích:
*   **Nguồn yêu cầu (Request Source)**: Email, chat log, cuộc họp kick-off, RFP — ghi nguyên văn không sửa.
*   **Mô tả bài toán ban đầu (Raw Problem Statement)**: Khách hàng muốn gì, tại sao, kết quả kỳ vọng là gì.
*   **Bên liên quan (Stakeholders)**: Danh sách người tham gia quyết định.
*   **Quyết định Tiếp nhận (Intake Decision)**: `PROCEED` / `REJECT` / `NEED_MORE_INFO` — do PM quyết định.

---

### 2.2 `feasibility.md` — Đánh giá Khả thi (Feasibility Study / `FSB`)

Tài liệu quyết định Go/No-Go trước khi đầu tư vào Discovery:
*   **Khả thi Kỹ thuật (Technical Feasibility)**: Đội ngũ/Tech Stack hiện tại có đáp ứng được không?
*   **Khả thi Tài chính (Financial Feasibility)**: Chi phí ước tính so với ngân sách. ROI dự kiến.
*   **Khả thi Thời gian (Schedule Feasibility)**: Timeline kỳ vọng của khách hàng có thực tế không?
*   **Verdict**: `GO` / `NO_GO` / `CONDITIONAL_GO` kèm điều kiện ràng buộc nếu là conditional.
*   **Rủi ro Sơ bộ (Initial Risks)**: Các rủi ro lớn phát hiện ngay từ đầu để lên kế hoạch sớm.

---

### 2.3 `project_brief.md` — Đặc tả Hồ sơ Dự án & Nhân sự

Tài liệu xác định mục tiêu vĩ mô, phân bổ nguồn lực và cấu hình chế độ vận hành:
*   **Mục tiêu Chiến lược (Strategic Goals)**: Mô tả vấn đề dự án cần giải quyết và kết quả kỳ vọng.
*   **Chế độ Vận hành (Workflow Mode)**: Khai báo `workflow_mode` cho toàn bộ dự án:
    *   `strict_waterfall` — Gate cứng 100% (Banking, Medical, Regulated).
    *   `hybrid_agile` — Overlap có kiểm soát (Startup, Product Companies).
    *   `fast_iteration` — Compress cycle (Solo, AI-driven, PoC).
*   **Ma trận Phân bổ Nhân sự (RACI Matrix)**: Phân định vai trò giữa Con người và AI Agents (tham chiếu `role_schema.md`).
*   **Phạm vi nghiệp vụ (In-Scope & Out-of-Scope)**:
    *   *In-Scope*: Các tính năng bắt buộc phải thực hiện trong phiên bản release hiện tại.
    *   *Out-of-Scope*: Các tính năng bị loại trừ để tránh phình phạm vi (Scope Creep).
*   **Mốc thời gian (Milestone Timeline)**: Các dấu mốc bàn giao và phát hành chính.

---

### 2.4 `business_context.md` — Đặc tả Bối cảnh Kinh doanh & ROI

Tài liệu đảm bảo dự án mang lại giá trị thực tế và có thể đo lường được:
*   **Bối cảnh thị trường (Market Context)**: Lý do dự án cần được thực hiện và phân tích đối thủ cạnh tranh.
*   **Chân dung người dùng (User Personas)**: Phân tích hành vi, nhu cầu và điểm đau (Pain points) của đối tượng khách hàng mục tiêu.
*   **Chỉ số Đo lường Hiệu quả (Key Metrics / KPIs)**: Ví dụ: Tốc độ tăng trưởng người dùng, tỷ lệ giữ chân (Retention rate).
*   **Bài toán Lợi ích đầu tư (ROI Analysis)**: Đánh giá chi phí phát triển so với doanh thu hoặc giá trị kinh doanh mang lại.

---

### 2.5 `constraints.md` — Đặc tả Ràng buộc Tối cao

Tài liệu quan trọng nhất để áp đặt giới hạn (Guardrails) cứng cho toàn bộ hệ thống. Mọi thay đổi ở đây đều là **Major Change**:
*   **Ràng buộc Kỹ thuật (Technical Constraints)**: Ngăn xếp công nghệ (Tech Stack) bắt buộc được ARCH phê duyệt (ví dụ: PostgreSQL, Next.js, React).
*   **Ràng buộc Vận hành (Operational Constraints)**:
    *   *Ngân sách hạ tầng*: Giới hạn chi phí dịch vụ đám mây hàng tháng (ví dụ: dưới $300/tháng).
    *   *Cam kết dịch vụ (SLA)*: Uptime cam kết (ví dụ: 99.9%) — được sử dụng trực tiếp để tạo `NFR`.
*   **Ràng buộc Bảo mật & Tuân thủ (Compliance Constraints)**: Quy chuẩn bảo mật phải tuân thủ (GDPR, PCI-DSS, mã hóa dữ liệu tĩnh và truyền đi).
*   **Ràng buộc NFR Nguồn gốc (NFR Seeds)**: Danh sách các yêu cầu phi chức năng cứng nhất (latency SLA, security baseline) — SA sẽ phát triển thành `NFR-XXX.md` chi tiết ở Phase 02.

---

## 3. Hợp đồng Siêu dữ liệu Bắt buộc (Mandatory Metadata Contracts)

Tất cả tài liệu trong Project Profiles phải chứa YAML Frontmatter chuẩn tắc để hệ thống Control Plane tự động quét bối cảnh (Context Assembly).

### 3.1 Metadata cho `intake_brief.md`
```yaml
---
id: PM-CTX-[PROJECT]-INTAKE
title: Tóm tắt yêu cầu thô ban đầu
phase: "00"
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
version: X.Y.Z
owner: pm_agent
created_by: pm_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
intake_decision: PROCEED | REJECT | NEED_MORE_INFO
tags: []
---
```

### 3.2 Metadata cho `feasibility.md`
```yaml
---
id: PM-FSB-[PROJECT]-[NUMBER]
title: Đánh giá khả thi dự án
phase: "00"
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
version: X.Y.Z
owner: pm_agent
created_by: pm_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
verdict: GO | NO_GO | CONDITIONAL_GO
technical_feasibility: HIGH | MEDIUM | LOW
financial_feasibility: HIGH | MEDIUM | LOW
schedule_feasibility: HIGH | MEDIUM | LOW
conditions: []           # Điều kiện ràng buộc nếu CONDITIONAL_GO
estimated_budget: ""
estimated_timeline: ""
tags: []
---
```

### 3.3 Metadata cho `project_brief.md`
```yaml
---
id: PM-CTX-[PROJECT]-BRIEF
title: Hồ sơ dự án và Phân bổ Nhân sự
phase: "01"
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
version: X.Y.Z
owner: pm_agent
created_by: pm_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
workflow_mode: strict_waterfall | hybrid_agile | fast_iteration
tags: []
---
```

### 3.4 Metadata cho `business_context.md`
```yaml
---
id: BA-CTX-[PROJECT]-BUSINESS
title: Bối cảnh nghiệp vụ và ROI dự án
phase: "01"
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
version: X.Y.Z
owner: ba_agent
created_by: ba_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: []
---
```

### 3.5 Metadata cho `constraints.md`
```yaml
---
id: ARCH-CTX-[PROJECT]-CONSTRAINTS
title: Ràng buộc Kỹ thuật và Vận hành Tối cao
phase: "01"
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
version: X.Y.Z
owner: arch_agent
created_by: arch_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tech_stack: []           # Danh sách công nghệ bắt buộc
sla_uptime: ""           # Ví dụ: "99.9%"
budget_monthly_usd: 0
compliance: []           # Ví dụ: ["GDPR", "PCI-DSS"]
tags: []
---
```

---

## 4. Quy tắc Kiểm duyệt & Cưỡng chế (Governance Rules)

*   **Rule 1 — Cổng Khởi động Dự án (Project Inception Gate)**:
    Không một luồng phát triển nào (BA/ARCH/BE/FE/QA/DEVOPS) được phép kích hoạt khi chưa có đủ:
    1. `feasibility.md` ở trạng thái `APPROVED` với `verdict: GO` hoặc `CONDITIONAL_GO`.
    2. Bộ ba `project_brief.md`, `business_context.md`, `constraints.md` cùng ở trạng thái `APPROVED` bởi Con người.

*   **Rule 2 — Kiểm tra Chênh lệch Ràng buộc (Constraint Drift Validation)**:
    Bất kỳ thay đổi nào trong `constraints.md` đều bị coi là **Thay đổi Trọng yếu (Major Change)**. Khi `constraints.md` thay đổi:
    1. Kích hoạt tự động quét đối soát toàn bộ: `ADR`, `NFR`, `API` để phát hiện vi phạm ràng buộc mới.
    2. Dừng pipeline tự động và gửi cảnh báo đỏ (Critical Warning) đến Con người.
    3. Mọi Agent bị cấm tạo artifact mới cho đến khi Con người xác nhận lại trạng thái.

*   **Rule 3 — Ranh giới Sở hữu Tài liệu (Ownership Boundary)**:
    *   PM Agent sở hữu và duy trì `intake_brief.md`, `feasibility.md`, `project_brief.md`.
    *   BA Agent sở hữu và duy trì `business_context.md`.
    *   ARCH Agent sở hữu và duy trì `constraints.md`.
    *   ORCH Agent (Orchestrator) chỉ có quyền đọc (Read-only) tất cả tài liệu CTX để pack context.
    *   KC Agent (Knowledge Curator) có quyền gắn tag và cập nhật metadata `last_synchronized`.

*   **Rule 4 — Đồng bộ `workflow_mode` (Mode Consistency)**:
    Giá trị `workflow_mode` khai báo trong `project_brief.md` là giá trị duy nhất và bắt buộc áp dụng nhất quán cho toàn bộ vòng đời dự án. Thay đổi `workflow_mode` sau khi dự án đã qua Phase 02 bị coi là **Major Change** và yêu cầu phê duyệt của Con người.

*   **Rule 5 — NFR Seeds phải được Phát triển (NFR Propagation)**:
    Mọi ràng buộc phi chức năng cứng khai báo trong `constraints.md` (ví dụ: SLA uptime, latency baseline) phải được SA phát triển thành ít nhất 1 tài liệu `NFR-XXX.md` tương ứng trước khi kết thúc Phase 02. Không `API` hay `DB` nào được `APPROVED` nếu thiếu liên kết `NFR`.