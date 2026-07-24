---
id: BA-UC-[PROJECT]-[COMPONENT]-[NUMBER]
# COMPONENT conventions: SYS (System-wide) | AUTH | MEDIA | DATA | BILL | API | ...
title: "[Tên Use Case]"
project: "[project-id]"
phase: "02"

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Điền chi tiết nếu execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW  # Độ ưu tiên xử lý tài liệu (Business Urgency)

# Use Case Metadata
use_case_type: CORE | SUPPORTING | EXCEPTION
preconditions: [user_logged_in, cart_not_empty]
postconditions: [order_created, payment_pending]

# Operational Volume
estimated_frequency:
  daily_invocations: 5000
  peak_concurrent_users: 300

# Approval Chain
reviewed_by: ""                  # Ghi nhận role review (ví dụ: arch_agent)
approved_by: ""                  # Ghi nhận role approve (ví dụ: product_owner)
approved_at: YYYY-MM-DD          # Ngày phê duyệt chính thức

version: X.Y.Z
owner: ba_agent
created_by: ba_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: [ba, usecase, interaction, requirements]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: implements             # Hiện thực hóa kịch bản use case từ tài liệu BRD vĩ mô
    target: BA-BRD-[PROJECT]-[NUMBER]
  - type: adheres_to             # Tuân thủ ràng buộc cứng trong constraints.md
    target: ARCH-CTX-[PROJECT]-CONSTRAINTS
  - type: adheres_to             # Tuân thủ luật nghiệp vụ bắt buộc (Chỉ sử dụng khi có BR thực tế liên quan)
    target: BA-BR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: tested_by              # Được kiểm chứng bởi Test Case nào
    target: QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: elaborates             # Làm rõ và chi tiết hóa cho yêu cầu chức năng nào (Không dùng produces)
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Chỉ dùng cho use cases tiên quyết bắt buộc (Prerequisite use cases)
    target: BA-UC-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: includes               # Nhúng hành vi của Use Case con bắt buộc (Quan hệ UML Include)
    target: BA-UC-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: extends                # Mở rộng hành vi của Use Case cơ sở dưới điều kiện (Quan hệ UML Extend)
    target: BA-UC-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: references             # Tham chiếu tài liệu bên ngoài
    target: EXT-REF-[NAME]
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: UC_TEMPLATE_V1.1
> **Compatibility**: MDS >= 1.0
>
> **BA Layer Traceability**:
> `BRD ── produces ──► {REQ, BR, FLOW, UC}`
> `REQ ── adheres_to ─► BR`
> `FLOW ─ elaborates ─► REQ`
> `UC ─── elaborates ─► REQ`
> `TC ─── verifies ──► {REQ, BR, FLOW, UC}`

# Use Case Specification: [Tên Use Case]

## 0. Tóm Tắt Use Case (Use Case Summary)

*   **Mục tiêu (Goal)**: [Ví dụ: Giúp người dùng hoàn thành quy trình đặt mua gói dịch vụ và thanh toán].
*   **Phân loại (Use Case Type)**: CORE (Cốt lõi) | SUPPORTING (Hỗ trợ) | EXCEPTION (Ngoại lệ)
*   **Tác nhân chính (Primary Actor)**: Giáo viên (User)
*   **Tác nhân phụ (Secondary Actor)**: Cổng thanh toán (Payment Gateway)
*   **Điều kiện kích hoạt (Trigger)**: [Ví dụ: Người dùng chọn gói dịch vụ VIP và nhấn nút "Thanh toán"].
*   **Tiền điều kiện (Preconditions)**: [Ví dụ: Tài khoản giáo viên đã đăng nhập thành công và giỏ hàng không trống].
*   **Hậu điều kiện (Postconditions)**: [Ví dụ: Giao dịch nháp được tạo trên hệ thống, màn hình chuyển sang giao diện thanh toán bảo mật].
*   **Success Guarantee (Success End State)**: [Ví dụ: Hóa đơn được thanh toán thành công, tài khoản nâng cấp lên VIP, gửi email thông báo kèm hóa đơn PDF].
*   **Failure End State**: [Ví dụ: Giao dịch bị hủy/thất bại, hóa đơn nháp được giữ nguyên, tài khoản giữ nguyên hạng FREE].
*   **Chủ sở hữu**: ba_agent

### 0.1 Tần suất & Chỉ số Vận hành (Operational Frequency)

| Chỉ số vận hành (Metric) | Giá trị dự kiến (Value) | Mô tả chi tiết |
| :--- | :---: | :--- |
| **Daily Invocations** | 5,000 | Tần suất kích hoạt trung bình mỗi ngày. |
| **Peak Concurrent Users** | 300 | Số lượng người dùng đồng thời cao điểm. |

---

## 1. Luồng xử lý chính (Happy Path / Basic Flow)

Mô tả sự tương tác song hành từng bước giữa Tác nhân (Actor) và Hệ thống (System) không phụ thuộc công nghệ (No Tech Leakage):

| Bước ID | Hành động của Tác Nhân (Actor Action) | Phản hồi của Hệ Thống (System Response) | Luật nghiệp vụ / Yêu cầu áp dụng |
| :--- | :--- | :--- | :--- |
| **Step 1** | Người dùng chọn gói dịch vụ VIP và nhấn nút "Thanh toán". | Hệ thống kiểm tra tính hợp lệ của gói dịch vụ và thông tin tài khoản người dùng. | `BA-BR-[PROJ]-BILL-002` |
| **Step 2** | [N/A] | Hệ thống tính toán tổng số tiền thanh toán (sau khi áp dụng chiết khấu/ưu đãi tự động) và tạo hóa đơn nháp. | `BA-BR-[PROJ]-BILL-005` |
| **Step 3** | [N/A] | Hệ thống khởi tạo phiên làm việc với Cổng thanh toán và hiển thị giao diện nhập thông tin thanh toán bảo mật cho người dùng. | `BA-REQ-[PROJ]-BILL-001` |
| **Step 4** | Người dùng nhập thông tin thanh toán hợp lệ và nhấn nút "Xác nhận". | Hệ thống chuyển thông tin bảo mật sang Cổng thanh toán để xử lý xác thực. | [N/A] |
| **Step 5** | [N/A] | Hệ thống nhận xác nhận thanh toán thành công từ Cổng thanh toán, cập nhật trạng thái hóa đơn thành PAID, nâng cấp tài khoản người dùng lên VIP và hiển thị thông báo thành công. | `BA-BR-[PROJ]-AUTH-012` |

---

## 2. Các luồng rẽ nhánh & Ngoại lệ (Alternative & Exception Flows)

### 2.1 Luồng rẽ nhánh 2a: Áp dụng mã giảm giá (Coupon Code Input)
*   **Tại bước**: Step 2 trong Happy Path.
*   **Mô tả**:
    1.  Người dùng nhập mã giảm giá trước khi thanh toán.
    2.  Hệ thống kiểm tra tính hợp lệ của mã giảm giá.
    3.  Hệ thống tính lại tổng số tiền và cập nhật hiển thị.
    4.  Quay lại Step 3 trong Happy Path.

### 2.2 Luồng ngoại lệ 4a: Thanh toán bị từ chối (Payment Declined)
*   **Tại bước**: Step 4 trong Happy Path.
*   **Mô tả**:
    1.  Cổng thanh toán phản hồi thông báo từ chối (do thẻ hết hạn, không đủ số dư...).
    2.  Hệ thống ghi nhận trạng thái lỗi, trả về mã lỗi `ERR-BR-BILL-003`.
    3.  Hệ thống hiển thị thông báo lỗi trực quan cho người dùng và yêu cầu chọn phương thức thanh toán khác.
    4.  Hành vi Fallback: Giữ nguyên trạng thái hóa đơn nháp, không nâng cấp tài khoản (Chuyển sang Failure End State).

```yaml
exception_flows:
  - step_id: step_4
    error_code: ERR-BR-BILL-003
    severity: HIGH
    fallback_action: reject_and_retry
```

---

## 3. Quy tắc nghiệp vụ áp dụng (Associated Business Rules)

Các quy tắc nghiệp vụ `BA-BR` chi tiết chi phối trực tiếp logic hoạt động của Use Case này:

| Bước ID | Mã quy tắc nghiệp vụ (BR ID) | Tên quy tắc nghiệp vụ | Mô tả ràng buộc |
| :--- | :--- | :--- | :--- |
| **Step 1** | `BA-BR-[PROJ]-BILL-002` | Luật định giá gói dịch vụ | Quy định giá cước niêm yết cho từng phân hệ VIP học tập. |
| **Step 2** | `BA-BR-[PROJ]-BILL-005` | Luật chiết khấu tự động | Quy tắc áp dụng coupon giảm giá và tính toán VAT. |
| **Step 5** | `BA-BR-[PROJ]-AUTH-012` | Luật phân quyền VIP | Quy tắc tự động nâng cấp quyền hạn của người dùng VIP sau khi đóng phí thành công. |

---

## 4. Ma trận Tham số Dữ liệu (Use Case Data Parameters YAML)

Khối YAML machine-readable định nghĩa các tham số dữ liệu đầu vào và kết quả đầu ra dự kiến của Use Case:

```yaml
use_case_data:
  use_case_id: BA-UC-[PROJECT]-[COMPONENT]-[NUMBER]
  parameters:
    inputs:
      - name: package_id
        type: string
        required: true
      - name: user_id
        type: string
        required: true
      - name: coupon_code
        type: string
        required: false
    expected_outputs:
      - name: invoice_status
        type: string
        allowed_values: [DRAFT, PENDING, PAID, FAILED]
      - name: account_tier
        type: string
        allowed_values: [FREE, VIP]
```

---

## 5. Bảng Tự Kiểm Tra Chất Lượng UC (Use Case Quality Checklist)

- [ ] Quy định cụ thể mục tiêu, phân loại (Use Case Type), tác nhân chính/phụ, trigger và outcome ở Mục 0.
- [ ] Xác định rõ ràng Success Guarantee (Success End State) và Failure End State ở Mục 0.
- [ ] Định nghĩa đầy đủ các thông số tần suất hoạt động (Operational Frequency) ở Mục 0.1.
- [ ] Đặc tả rõ ràng điều kiện đầu vào (Preconditions) và đầu ra (Postconditions) trong Frontmatter và Mục 0.
- [ ] Điền đầy đủ thông tin chuỗi phê duyệt (reviewed_by, approved_by, approved_at) ở Frontmatter.
- [ ] Tách biệt rõ ràng tương tác của Actor (cột trái) và phản hồi của System (cột phải) tại Mục 1.
- [ ] Đặc tả đầy đủ các luồng rẽ nhánh (Alternative) và luồng ngoại lệ (Exception Flows) kèm YAML exception ở Mục 2.
- [ ] Ánh xạ đầy đủ các luật nghiệp vụ `BA-BR` chi tiết chi phối các bước tương tác ở Mục 3.
- [ ] Cấu hình khối YAML `use_case_data` machine-readable ở Mục 4.
- [ ] Đã liên kết đầy đủ các links `implements` trỏ về `BRD`, `adheres_to` trỏ về `CONSTRAINTS` & `BR`, và `tested_by` trỏ về `TC` tương ứng.
- [ ] Chỉ sử dụng mối quan hệ `adheres_to` trỏ tới `BA-BR` khi thực sự tồn tại quy tắc nghiệp vụ liên quan.
- [ ] Khai báo liên kết `includes` và `extends` để biểu diễn quan hệ UML Use Case chính xác khi có phân rã luồng (Frontmatter).
- [ ] Đã khai báo liên kết `elaborates` trỏ về `REQ` thay cho link `produces` cũ (Mục tiêu: Đảm bảo duy nhất parent `produces` từ BRD).
- [ ] Không có liên kết nào bị Orphan hoặc Broken Reference.
- [ ] **Anti-Pattern Check**: Kịch bản Use Case độc lập hoàn toàn với các cấu phần cài đặt hạ tầng/công nghệ cụ thể (không ghi nhận PostgreSQL, Stripe API Library - No Tech Leakage).
- [ ] **Anti-Pattern Check**: Mọi bước tương tác đều được mô tả mạch lạc, không có bước nào bị lặp lại hoặc kết thúc cụt (no dead ends).
- [ ] **Anti-Pattern Check**: Đảm bảo các use case phụ thuộc (`depends_on`) không tạo thành vòng lặp đồ thị (Cyclic Graph DAG).