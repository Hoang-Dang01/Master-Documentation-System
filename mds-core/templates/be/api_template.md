---
id: BE-API-[PROJECT]-[COMPONENT]-[NUMBER]
# For mds-core/global API contracts: CORE-BE-API-[NAME]-V[VERSION]
title: "API: [HTTP_METHOD] [HTTP_PATH]"
phase: "05"                          # Phase 05: Backend API Design

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Must be non-empty iff execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW

# Inheritance Contract
schema_version: MDS-BE-API-1.0
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# API Architecture Metadata
api_style: REST | GRAPHQL | RPC | WEBHOOK
versioning_strategy: URI_PATH | HEADER | NONE

# Approval Chain
reviewed_by: ""                  # Ghi nhận role review (ví dụ: arch_agent)
approved_by: ""                  # Ghi nhận role approve (ví dụ: product_owner)
approved_at: YYYY-MM-DD          # Ngày phê duyệt chính thức

version: X.Y.Z
owner: dev_agent                     # Allowed: dev_agent | arch_agent
created_by: dev_agent                # Allowed: dev_agent | arch_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: [be, api, contract]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  # Add only applicable outbound edges
  - type: implements             # Hiện thực hóa Functional Requirement tương ứng
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: adheres_to             # Tuân thủ quyết định kiến trúc auth/error/rate limit
    target: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: tested_by              # Được xác thực bởi API Test Case nào
    target: QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: API_TEMPLATE_V1.1
> **Compatibility**: MDS >= 1.0
>
> **MDS BE Layer Traceability**:
> `BA-REQ ── implemented_by ─► BE-API`
> `BE-API ── adheres_to ─────► ARCH-ADR`
> `QA-TC  ── verifies ───────► BE-API`

# API Contract Specification: [HTTP_METHOD] [HTTP_PATH]

## 0. Tổng Quan Giao Diện Kết Nối (API Overview)

*   **Endpoint URL**: `/api/v1/orders`
*   **Phương thức (Method)**: `POST` | `GET` | `PUT` | `DELETE` | `PATCH`
*   **Kiểu dữ liệu (Content-Type)**: `application/json`
*   **Cơ chế xác thực (Authentication)**: Bearer JWT | API Key | None
*   **Rate Limiting**: 100 requests / minute / IP
*   **Hỗ trợ Kháng trùng (Idempotency)**: Yes (Bắt buộc Header `X-Idempotency-Key`)

---

## 1. Đặc Tả Tham Số Yêu Cầu (HTTP Request Specifications)

### 1.1 Tham số đường dẫn (Path Parameters)
*(Bỏ qua nếu không áp dụng)*

| Tham số (Parameter) | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :---: | :---: | :--- |
| `order_id` | string (uuid) | Yes | Mã định danh duy nhất của đơn hàng cần truy vấn. |

### 1.2 Tham số truy vấn (Query Parameters)
*(Bỏ qua nếu không áp dụng)*

| Tham số (Parameter) | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :---: | :---: | :---: | :--- |
| `include_details` | boolean | No | `false` | Có hiển thị kèm danh sách sản phẩm hay không. |

### 1.3 Tiêu đề HTTP (Request Headers)
| Header | Kiểu dữ liệu | Bắt buộc | Giá trị mẫu | Mô tả |
| :--- | :---: | :---: | :--- | :--- |
| `Authorization` | string | Yes | `Bearer eyJhbGci...` | JSON Web Token xác thực người dùng. |
| `X-Idempotency-Key` | string (uuid) | Yes | `9b1deb4d-3b7d...` | Khóa kháng trùng để ngăn chặn thực thi đơn hàng lặp lại. |

### 1.4 Cấu trúc dữ liệu yêu cầu (Request Body Schema)
*(Bỏ qua nếu không áp dụng)*

| Trường (Field) | Kiểu dữ liệu | Bắt buộc | Mô tả |
| :--- | :---: | :---: | :--- |
| `package_id` | string (uuid) | Yes | Mã định danh của gói học phí học viên đăng ký mua. |
| `coupon_code` | string | No | Mã giảm giá áp dụng vào hóa đơn (nếu có). |

---

## 2. Đặc Tả Cấu Trúc Phản Hồi (HTTP Response Specifications)

Hệ thống quy định chuẩn hóa cấu trúc đóng gói Response (Response Envelope) thống nhất toàn Backend Layer:

### 2.1 Thành công (Standard Success Envelope - 200 OK / 201 Created)
```json
{
  "success": true,
  "data": {
    "order_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "status": "CREATED",
    "amount": 250.00,
    "created_at": "2026-07-03T15:45:00Z"
  }
}
```

### 2.2 Thất bại (Standard Error Envelope - 4xx Client / 5xx Server Errors)
```json
{
  "success": false,
  "error": {
    "code": "BILLING_INSUFFICIENT_FUNDS",
    "message": "Tài khoản của học viên không đủ số dư để thanh toán.",
    "trace_id": "err_5f3b7c8e2a1d4c89"
  }
}
```

*Danh sách HTTP Status & Error Codes:*
| HTTP Status | Error Code | Mô tả |
| :--- | :--- | :--- |
| `400 Bad Request` | `VALIDATION_FAILED` | Định dạng Request Body không hợp lệ hoặc thiếu thuộc tính bắt buộc. |
| `401 Unauthorized` | `AUTH_TOKEN_EXPIRED` | Access Token hết hạn hoặc không hợp lệ. |
| `409 Conflict` | `IDEMPOTENCY_CONFLICT` | Giao dịch đang được xử lý song song với cùng một Idempotency Key. |
| `429 Too Many Requests`| `RATE_LIMIT_EXCEEDED` | Vượt quá số lượng request cho phép trong 1 phút. |
| `500 Internal Server Error`| `INTERNAL_SERVER_ERROR`| Lỗi hệ thống ngoài ý muốn, cần đối soát logs qua `trace_id`. |
| `503 Service Unavailable`| `EXTERNAL_SERVICE_DOWN`| Cổng thanh toán đối tác thứ ba mất kết nối hoặc quá tải. |

---

## 3. Quy Định Kháng Trùng & Bảo Mật (Idempotency & Security)

### 3.1 Quy tắc Idempotency Key
*   **Header Name**: `X-Idempotency-Key`
*   **Kiểu dữ liệu**: UUID v4
*   **Thời gian hiệu lực (TTL)**: 86400 seconds (24 Hours)
*   **Hành vi khi trùng lặp khóa**: Trả về trực tiếp Response Body gốc được lưu trong bộ nhớ đệm (Cache), kèm theo header `X-Cache-Lookup: HIT`.

### 3.2 Đặc tả bảo mật & Chống Lạm dụng (Security & Abuse Protection)
*   **Yêu cầu mã hóa**: TLS 1.3 bắt buộc trên toàn bộ đường truyền.
*   **Giới hạn Payload size**: Tối đa 10 MB đối với Request Body.
*   **Cơ chế CORS Policy**: `SAME_ORIGIN` | `ALLOWLIST` | `PUBLIC`
*   **Chống tấn công lặp (Replay Attack)**: Sử dụng timestamp và signatures nếu API kết nối qua webhook ngoài.

---

## 4. Khối Mã API Contract YAML (Machine-Readable Contract Schema)

Khối YAML OpenAPI-like dùng cho AI Agents sinh mã nguồn, routes và Axios clients tự động:

```yaml
api_contract:
  schema_version: MDS-BE-API-1.0
  id: BE-API-[PROJECT]-[COMPONENT]-[NUMBER]
  style: REST
  endpoint:
    method: POST
    path: /api/v1/orders
  security:
    auth_type: bearer_jwt
    rate_limit: 100/min
    max_payload_mb: 10
    cors_policy: SAME_ORIGIN
  idempotency:
    enabled: true
    header: X-Idempotency-Key
    ttl_seconds: 86400
    conflict_behavior: return_original_response
  request:
    headers:
      - name: Authorization
        type: string
        required: true
      - name: X-Idempotency-Key
        type: string
        required: true
    body:
      type: object
      required:
        - package_id
      properties:
        package_id:
          type: string
          format: uuid
        coupon_code:
          type: string
  responses:
    201:
      description: Đơn hàng được khởi tạo thành công.
      schema:
        type: object
        properties:
          success:
            type: boolean
          data:
            type: object
            properties:
              order_id:
                type: string
              status:
                type: string
    400:
      description: Lỗi dữ liệu đầu vào.
      schema:
        type: object
        properties:
          success:
            type: boolean
          error:
            type: object
            properties:
              code:
                type: string
              message:
                type: string
              trace_id:
                type: string
```

---

## 5. Bảng Tự Kiểm Tra Chất Lượng API (API Validation Checklist)

- [ ] ID thực thể đúng chuẩn `BE-API-[PROJECT]-[COMPONENT]-[NUMBER]` hoặc `CORE-BE-API-[NAME]-V[VERSION]`.
- [ ] Khai báo thuộc tính `api_style` và `versioning_strategy` đầy đủ ở Frontmatter.
- [ ] Link `implements` trỏ chính xác về Functional Requirement (`BA-REQ`) tương ứng.
- [ ] Link `adheres_to` trỏ về quyết định kiến trúc (`ARCH-ADR`) và `tested_by` trỏ về API test case (`QA-TC`).
- [ ] Đường dẫn Endpoint bắt đầu bằng dấu gạch chéo `/`.
- [ ] HTTP Methods sử dụng chính xác các verbs chuẩn RESTful viết hoa.
- [ ] Thiết kế bảng `1.4 Request Body Schema` thủ công rõ ràng để con người dễ đọc.
- [ ] Định nghĩa đầy đủ Response Envelope chuẩn cho cả TH thành công (Standard Success) và thất bại (Standard Error có kèm `trace_id`).
- [ ] Đầy đủ các ví dụ phản hồi lỗi client (4xx) và lỗi hệ thống (5xx).
- [ ] Khai báo cụ thể cơ chế kháng trùng (Idempotency Key) và TTL nếu API làm thay đổi trạng thái (POST/PUT/PATCH).
- [ ] Khối YAML `api_contract` máy đọc được biên dịch hợp lệ không chứa Tab, cấu trúc trường `required` nằm ngoài `properties` theo OpenAPI-style.
- [ ] **Controlled Tech Leakage Check**: Tài liệu mô tả đầy đủ các tham số HTTP kỹ thuật nhưng tuyệt đối cấm rò rỉ cơ sở dữ liệu vật lý cụ thể (DB server host, K8s cluster IP, PostgreSQL table schemas).