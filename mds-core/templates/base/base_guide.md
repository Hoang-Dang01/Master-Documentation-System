---
id: CORE-BASE-GUIDE-QUICKREF-V1
title: "MDS Base Guide Quick Reference"
phase: "00"

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: APPROVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: COMPLETED
blocked_reason: ""

# Criticality & Priority
document_priority: HIGH

# Inheritance Contract
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# Approval Chain
reviewed_by: "arch_agent"
approved_by: "product_owner"
approved_at: 2026-07-03

version: 1.1.0
owner: arch_agent
created_by: arch_agent
created_at: 2026-07-03
last_updated: 2026-07-03
last_synchronized: 2026-07-03
tags: [core, base, guide, metadata]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: adheres_to             # Tuân thủ tài liệu hiến pháp tối cao của MDS
    target: CORE-BASE-TEMPLATE-GUIDE-V1.1
  - type: references             # Tham chiếu tới Glossary SSoT trung tâm
    target: CORE-GLOSSARY-V1
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: BASE_GUIDE_QUICKREF_V1.1
> **Compatibility**: MDS >= 1.0

# BASE_GUIDE - Cẩm Nang Siêu Dữ Liệu Quick Reference

Tài liệu này đóng vai trò là bản hướng dẫn nhanh (Cheat Sheet) cho cấu trúc siêu dữ liệu Frontmatter và quan hệ liên kết đồ thị tri thức của MDS vNext.

---

## 1. Bản Đồ Siêu Dữ Liệu Frontmatter (Full Metadata Schema Map)

| Khóa Frontmatter (Key) | Kiểu dữ liệu | Phạm vi giá trị (Allowed Values) | Ý nghĩa nghiệp vụ / Mô tả |
| :--- | :---: | :--- | :--- |
| **`id`** | string | ROLE-TYPE-PROJECT-COMPONENT-NUMBER | Mã định danh duy nhất toàn cầu của thực thể. |
| **`title`** | string | Tự do | Tiêu đề của tài liệu đặc tả. |
| **`phase`** | string | `"00"` đến `"10"` | Phase hiện tại của tài liệu trong Workflow (dưới dạng chuỗi 2 chữ số). |
| **`lifecycle_state`** | string | `DRAFT`, `REVIEW`, `APPROVED`, `DEPRECATED`, `ARCHIVED` | Độ chín muồi của tài liệu (Documentation Maturity). |
| **`execution_state`** | string | `NOT_STARTED`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`, `NOT_APPLICABLE` | Trạng thái thực thi công việc thực tế của tài liệu. |
| **`blocked_reason`** | string | Tự do | Lý do bị chặn nếu `execution_state` là `BLOCKED`. |
| **`document_priority`** | string | `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` | Độ khẩn cấp xử lý tài liệu (Business Urgency). |
| **`inherits_from`** | string \| object | `CORE-BASE-TEMPLATE-GUIDE-V1.1` hoặc cấu trúc phân rã object | Định danh tài liệu Master mà thực thể này kế thừa (hỗ trợ kiểm tra tương thích ngược). |
| **`reviewed_by`** | string | Tên vai trò Agent review (ví dụ: `arch_agent`). | Người kiểm duyệt tài liệu. |
| **`approved_by`** | string | Tên vai trò quản lý (ví dụ: `product_owner`). | Người ký duyệt xuất bản tài liệu. |
| **`approved_at`** | date | YYYY-MM-DD | Ngày phê duyệt chính thức. |
| **`version`** | string | X.Y.Z (SemVer) | Số phiên bản của tài liệu. |
| **`owner`** | string | Tên vai trò chịu trách nhiệm (ví dụ: `arch_agent`, `ba_agent`). | Vai trò chịu trách nhiệm chính về mặt nghiệp vụ. |
| **`created_by`** | string | Tên vai trò Agent tạo | Vai trò khởi tạo tài liệu ban đầu. |
| **`created_at`** | date | YYYY-MM-DD | Ngày khởi tạo tài liệu. |
| **`last_updated`** | date | YYYY-MM-DD | Ngày cập nhật tài liệu gần nhất. |
| **`last_synchronized`** | date | YYYY-MM-DD | Ngày đồng bộ hóa dữ liệu gần nhất. |
| **`tags`** | list | Danh sách tags viết thường (ví dụ: `[ba, requirement]`). | Nhãn phân loại tài nguyên. |
| **`links`** | list | Khối YAML cấu trúc liên kết hướng ra | Khai báo liên kết hướng ra (Outbound Links) trỏ đến các tài liệu khác. |

> [!TIP]
> **inherits_from** trong tương lai có thể được cấu hình dạng Object-based để tự động phân tích độ tương thích (Compatibility Check):
> ```yaml
> inherits_from:
>   target: CORE-BASE-TEMPLATE-GUIDE
>   compatibility: ^1.1
> ```

---

## 1.1 Đặc Tả Liên Kết Đồ Thị (Link Schema)

Mọi cạnh liên kết khai báo trong Frontmatter thuộc trường `links` phải sử dụng cấu trúc:
```yaml
links:
  - type: [LOẠI_LIÊN_KẾT]
    target: [ID_THỰC_THỂ_ĐÍCH]
```

### Các mối quan hệ cho phép (Allowed Outbound Edges):
*   **`implements`**: Hiện thực hóa yêu cầu hoặc thiết kế từ tài liệu cấp trên (ví dụ: `REQ ➔ implements ➔ BRD`).
*   **`adheres_to`**: Tuân thủ luật nghiệp vụ, ràng buộc cứng hoặc quyết định kiến trúc (ví dụ: `REQ ➔ adheres_to ➔ BR`).
*   **`elaborates`**: Chi tiết hóa và giải nghĩa sâu cho một thực thể khác (ví dụ: `FLOW ➔ elaborates ➔ REQ`).
*   **`tested_by`**: Được kiểm thử hoặc xác thực bởi Test Case nào (ví dụ: `REQ ➔ tested_by ➔ TC`).
*   **`depends_on`**: Phụ thuộc vào một thực thể khác cùng cấp.
*   **`references`**: Tham chiếu ngoài hoặc tài liệu tiêu chuẩn không thuộc đồ thị tri thức MDS (ví dụ: `REQ ➔ references ➔ EXT-REF-OWASP-ASVS`).
*   **`supersedes`**: Thay thế hoàn toàn cho một tài liệu cũ đã lỗi thời.

---

## 2. Chi Tiết Hướng Dẫn Toàn Diện

> [!IMPORTANT]
> Toàn bộ quy tắc cốt lõi về Đồ thị tri thức (Graph Semantics), quy chuẩn Markdown chống mơ hồ (Zero Ambiguity), và Đường ống thẩm định tự động (Validation Pipeline) đã được hợp nhất và đóng băng chính thức tại:
> 👉 [`mds-core/standards/base_template_guide.md`](../../standards/base_template_guide.md) (Hiến Pháp MDS).

---

## 3. Các Lỗi Xác Thực Thường Gặp (Common Validation Errors)

Dưới đây là cẩm nang sửa lỗi nhanh khi Validation Pipeline phát hiện lỗi sai:

### 3.1 Định dạng Phase nghiệp vụ
*   ❌ **Sai**: `phase: 2` (Kiểu số) hoặc `phase: "02..10"` (Khoảng phase mơ hồ).
*   ✅ **Đúng**: `phase: "02"` (Phải là chuỗi ký tự 2 chữ số cố định).

### 3.2 Định dạng Lifecycle State
*   ❌ **Sai**: `lifecycle_state: DONE` (Sai enum) hoặc `lifecycle_state: "APPROVED"` (Thừa dấu ngoáy kép).
*   ✅ **Đúng**: `lifecycle_state: APPROVED` (Sử dụng chính xác enum viết hoa không dấu ngoặc).

### 3.3 Khai báo Liên kết tuần hoàn (Cyclic Loop Dependency)
*   ❌ **Sai**: `A` trỏ `implements` ➔ `B`, `B` trỏ `elaborates` ➔ `A` (Tạo chu kỳ vô tận).
*   ✅ **Đúng**: Chỉ trỏ theo chiều **Outbound** được quy định chính thức tại [`mds-core/standards/relationship_rules.md`](../../standards/relationship_rules.md) để đảm bảo đồ thị là DAG.

### 3.4 Quy tắc rò rỉ công nghệ (Tech Leakage in BA Layer)
*   ❌ **Sai**: Mô tả nghiệp vụ thanh toán ghi nhận: "Sử dụng API Stripe SDK v3 và DB Postgres bảng `orders`".
*   ✅ **Đúng**: "Giao thức thanh toán tương tác với Cổng thanh toán (Payment Gateway) và lưu trữ dữ liệu tại Kho dữ liệu hóa đơn (Persistent Billing Storage)".
