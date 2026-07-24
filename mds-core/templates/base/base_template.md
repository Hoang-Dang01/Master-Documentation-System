---
id: ROLE-TYPE-[PROJECT]-[COMPONENT]-[NUMBER]
# For mds-core/global docs use: CORE-[NAME]-V[VERSION] (e.g. CORE-BASE-TEMPLATE-GUIDE-V1.1)
# COMPONENT conventions: SYS (System-wide) | AUTH | MEDIA | DATA | BILL | API | ...
title: "[Tên Tài Liệu Đặc Tả]"
phase: "01"                          # Allowed values: "00".."10" (dưới dạng chuỗi 2 chữ số)

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Must be non-empty iff execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW  # Độ ưu tiên xử lý tài liệu (Business Urgency)

# Inheritance Contract
schema_version: MDS-BASE-1.2
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# Approval Chain
reviewed_by: ""                  # Ghi nhận role review (ví dụ: arch_agent)
approved_by: ""                  # Ghi nhận role approve (ví dụ: product_owner)
approved_at: YYYY-MM-DD          # Ngày phê duyệt chính thức

version: X.Y.Z
owner: role_agent                    # Allowed: pm_agent | ba_agent | arch_agent | dev_agent | qa_agent
created_by: role_agent               # Allowed: pm_agent | ba_agent | arch_agent | dev_agent | qa_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: [tag1, tag2]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  # Add only applicable outbound edges
  # Allowed types: implements | adheres_to | tested_by | elaborates | depends_on | references | supersedes
  - type: implements
    target: TARGET-ID
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: BASE_TEMPLATE_V1.3
> **Compatibility**: MDS >= 1.0

# [Tên Tài Liệu Đặc Tả]

> [!NOTE]
> Xem hướng dẫn chi tiết về siêu dữ liệu Frontmatter, quy tắc định dạng Markdown và quan hệ đồ thị tri thức tại:
> 👉 [`base_template_guide.md`](../../standards/base_template_guide.md) (Hiến Pháp MDS)

---

## 1. Nội dung đặc tả (Specification Content)

[Bắt đầu viết nội dung đặc tả chi tiết của thực thể tại đây theo các đề mục được kế thừa từ child template].

---

## 2. Machine-Readable Data Blocks (Optional YAML)

Chèn các khối dữ liệu cấu hình hoặc đặc tả nghiệp vụ dạng YAML để AI Agents / Linter tự động phân tích và sinh code:

```yaml
# Cấu hình dữ liệu nghiệp vụ bổ trợ (Ví dụ cấu hình DTO hoặc schema)
data_spec:
  entity_id: ROLE-TYPE-[PROJECT]-[COMPONENT]-[NUMBER]
  attributes:
    - name: example_key
      type: string
      required: true
```

---

## 3. Tự Kiểm Tra Chất Lượng Tài Liệu (Self Validation Checklist)

Trước khi gửi tài liệu lên hệ thống phê duyệt, Product Owner / Agent bắt buộc phải kiểm tra thông qua checklist sau:

- [ ] ID thực thể khai báo chính xác theo định dạng quy chuẩn.
- [ ] Tham số `phase` khai báo đúng giá trị chuỗi cố định (`"00"` đến `"10"`).
- [ ] Trạng thái Lifecycle State và Execution State ăn khớp với tiến trình thực tế.
- [ ] Trường `blocked_reason` được điền đầy đủ thông tin khi và chỉ khi `execution_state` = `BLOCKED`.
- [ ] Trường `inherits_from` và `schema_version` chỉ đúng phiên bản hiến pháp và schema kế thừa.
- [ ] Toàn bộ các liên kết Outbound khai báo đúng loại quan hệ cho phép trong `relationship_rules.md`.
- [ ] Không chứa liên kết tuần hoàn gây lỗi (Cyclic Dependency Check).
- [ ] Không có liên kết mồ côi (Orphan Entity Check).
- [ ] Trình bày Markdown tuần tự, headings đúng cấu trúc (không nhảy cóc cấp độ).
- [ ] YAML blocks máy đọc được biên dịch hợp lệ không chứa tab.
- [ ] Sơ đồ Mermaid.js render thành công không bị syntax error.
- [ ] **Anti-Pattern Check**: Tuyệt đối không chứa giải pháp công nghệ cụ thể (Tech Leakage) nếu tài liệu thuộc phân lớp Nghiệp vụ (BA Layer). Nghiêm cấm DB table names, ORM queries, API endpoint paths (ví dụ: `POST /api/payment`), SDK versions, Redis/Prisma. Phải viết dạng trừu tượng nghiệp vụ (ví dụ: `Payment request`, `Persistent storage`).
