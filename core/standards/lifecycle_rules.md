# MDS vNext — Quy Tắc Vòng Đời Tài Liệu (Lifecycle Rules)

> **MDS — Master Documentation System**
> *Quick Lookup & Reference Summary*

> ⚠️ **Mật mã Bản quyền (Authority)**: Tài liệu này chỉ là tóm tắt nhanh để hỗ trợ tra cứu nhanh và onboarding.
> Nguồn gốc duy nhất và chuẩn xác nhất cho state machine, transition logic và quy tắc cưỡng chế trạng thái nằm tại:
> 👉 **[`DOCUMENT_STANDARDS.md — RULE 3: Document Lifecycle`](DOCUMENT_STANDARDS.md#rule-3-document-lifecycle-hybrid-layered-state-model)**

---

## 1. Mô Hình Trạng Thái Lai Hai Lớp (Hybrid Layered State Model)

MDS tách biệt trạng thái của một tài liệu (artifact) thành 2 lớp độc lập trong YAML Frontmatter để tối ưu hóa việc theo dõi của AI Agent và Con người:

1. **Lifecycle State** (Độ trưởng thành nội dung): Đo lường mức độ hoàn thiện, phê duyệt pháp lý của tài liệu.
2. **Execution State** (Trạng thái vận hành): Đo lường tiến độ xử lý thực tế của tài liệu trong pipeline.

```text
  ┌──────────────────────────────────────────────────────────┐
  │                   Life Cycle (Maturity)                  │
  │ DRAFT ──► REVIEW ──► APPROVED ──► DEPRECATED ──► ARCHIVED│
  └──────────────────────────┬───────────────────────────────┘
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │                   Execution (Operational)                │
  │  NOT_STARTED ──► IN_PROGRESS ──► COMPLETED / BLOCKED     │
  └──────────────────────────────────────────────────────────┘
```

---

## 2. Tóm Tắt 2 Lớp Trạng Thái

### Layer 1: Lifecycle State (`lifecycle_state`)

Quản lý độ chín chắn của tri thức. Cấm sửa trực tiếp khi đã ở trạng thái `APPROVED` (phải nâng version).

*   `DRAFT`: Đang phác thảo, tự do chỉnh sửa bởi Agent sở hữu.
*   `REVIEW`: Chờ thẩm định chéo, cấm chỉnh sửa ngoại trừ sửa lỗi được chỉ định.
*   `APPROVED`: Nguồn chân lý duy nhất (Single Source of Truth) đã duyệt bởi Con người/SA.
*   `DEPRECATED`: Lỗi thời, bị thay thế bởi phiên bản mới (Read-only).
*   `ARCHIVED`: Đóng băng lưu trữ lịch sử vĩnh viễn (Read-only).

### Layer 2: Execution State (`execution_state`)

Quản lý tiến trình triển khai của tài liệu kỹ thuật hoặc task.

*   `NOT_STARTED`: Chưa bắt đầu triển khai/kiểm thử.
*   `IN_PROGRESS`: Đang được thực hiện (ví dụ: BE đang code cho API, QA đang chạy Test Case).
*   `BLOCKED`: Bị chặn bởi một dependency khác (ví dụ: Task code bị chặn vì API schema chưa approved).
*   `COMPLETED`: Đã hoàn thành xử lý (ví dụ: Task đã merge code, Test case đã pass).
*   `NOT_APPLICABLE`: Không áp dụng trạng thái vận hành cho tài liệu này (mặc định đối với tài liệu bối cảnh như `CTX`, `FSB`).

---

## 3. Ví Dụ Cấu Hình YAML Frontmatter

```yaml
---
id: PM-TSK-AUTH-014
title: Triển khai đăng nhập bằng OTP
phase: 05

# Layer 1 — Độ trưởng thành: Đã được PM duyệt nội dung task
lifecycle_state: APPROVED

# Layer 2 — Vận hành: Bị chặn do dependency
execution_state: BLOCKED
blocked_reason: "Đang chờ API-AUTH-002 chuyển sang trạng thái APPROVED"

version: 1.0.0
owner: pm_agent
---
```