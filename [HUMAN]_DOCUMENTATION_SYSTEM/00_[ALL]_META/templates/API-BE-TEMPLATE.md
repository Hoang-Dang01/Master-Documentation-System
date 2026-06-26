---
id: API-[MODULE]-[NUM]
name: [API Name]
owner: BE
status: DRAFT
version: 1.0.0
api_type: REST
api_version: v1
service_owner: [service-name]
consumers:
  - [consumer-name]
authentication: JWT
idempotent: false
idempotency_key_required: false
deprecation_policy: NONE
runtime_dependencies:
  - [dependency-name]
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  - relation: depends_on
    id: REQ-ATT-001
---

# API Contract: [METHOD] [PATH]

## 1. General Info

| Field          | Value                                |
| -------------- | ------------------------------------ |
| Method         | GET / POST / PUT / PATCH / DELETE    |
| Path           | `/api/v1/resource`                   |
| Authentication | None / JWT / API Key / Session       |
| Content-Type   | application/json                     |
| API Type       | REST / GraphQL / WebSocket / Webhook |
| Version        | v1 |

---

## 2. Business Purpose
[Mô tả mục đích nghiệp vụ của API. Trả lời rõ: API này tồn tại để làm gì?]

---

## 3. Request Specifications

### Headers
```http
Content-Type: application/json
Authorization: Bearer <token>
```

### Path Parameters
| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id    | uuid | Yes      | Resource ID |

### Query Parameters
| Field | Type   | Required | Validation | Description |
| ----- | ------ | -------- | ---------- | ----------- |
| page  | number | No       | min:1      | Page number |

### Request Body Schema
| Field      | Type   | Required | Nullable | Validation | Description |
| ---------- | ------ | -------- | -------- | ---------- | ----------- |
| field_name | string | Yes      | No       | max:255    | Description |

Example:
```json
{
  "field_name": "value"
}
```

---

## 4. Response Specifications

### Success Response (200 OK / 201 Created / 204 No Content)
| Field    | Type    | Nullable | Description             |
| -------- | ------- | -------- | ----------------------- |
| success  | boolean | No       | Operation result        |
| data     | object  | No       | Payload                 |
| metadata | object  | Yes      | Pagination / extra info |

Example:
```json
{
  "success": true,
  "data": {},
  "metadata": {}
}
```

### Error Response
| HTTP Code | Error Code     | Meaning               |
| --------- | -------------- | --------------------- |
| 400       | BAD_REQUEST    | Invalid request       |
| 401       | UNAUTHORIZED   | Auth failed           |
| 403       | FORBIDDEN      | Access denied         |
| 404       | NOT_FOUND      | Resource missing      |
| 409       | CONFLICT       | Resource conflict     |
| 429       | RATE_LIMITED   | Too many requests     |
| 500       | INTERNAL_ERROR | Internal server error |

Example:
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed"
  }
}
```

---

## 5. Business Rules
* [Rule 1: Ví dụ người dùng phải xác thực trước khi thực hiện hành động.]
* [Rule 2: Điều kiện biên kiểm tra logic nghiệp vụ.]

---

## 6. Operational Constraints
| Metric       | Target      | Ghi chú (Notes) |
| ------------ | ----------- | :--- |
| Rate Limit   | 100 req/min | |
| Timeout      | 5000 ms     | |
| P95 Latency  | < 300 ms    | |
| Availability | 99.9%       | |

---

## 7. Security Considerations
* [Input validation required]
* [Authorization required]
* [Sensitive data must be masked]
* [Prevent injection attacks]
* [Apply rate limiting if needed]

---

## 8. Runtime Dependencies
[Các tài nguyên phụ thuộc cần thiết để API chạy thành công, ví dụ: PostgreSQL, Redis, LiveKit, S3]
- [Dependency 1]
- [Dependency 2]

---

## 9. Observability

### Metrics
Theo dõi các chỉ số:
* request_count
* error_rate
* p95_latency
* throughput

### Logs
Bắt buộc ghi nhật ký các trường:
* request_id
* user_id
* status_code
* execution_time

### Traces
Yêu cầu mã hóa distributed tracing đối với các cuộc gọi liên dịch vụ (multi-service calls).

---

## 10. Change Impact Analysis
[Phân tích ảnh hưởng khi thay đổi API này tới các hệ thống liên quan: Frontend, Mobile apps, Mocks, Test suites]
* [Impact 1]

---

## 11. AI Agent Usage
### Write
Backend Agent + Human Review

### Read
Frontend Agent, QA Agent, DevOps Agent, Site Reliability Engineer (SRE) Agent

### Validation
Consistency Engine + API Contract Validator
