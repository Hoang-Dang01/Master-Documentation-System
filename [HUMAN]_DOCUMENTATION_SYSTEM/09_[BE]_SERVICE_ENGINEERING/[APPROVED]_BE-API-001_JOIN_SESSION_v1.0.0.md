---
id: API-SES-001
name: Join Session
owner: BE
status: APPROVED
version: 1.0.0
api_type: REST
api_version: v1
service_owner: attendance-service
consumers:
  - web-frontend
  - mobile-app
authentication: JWT
idempotent: true
idempotency_key_required: true
deprecation_policy: NONE
runtime_dependencies:
  - postgresql
  - redis
  - livekit
created_at: 2026-06-26
updated_at: 2026-06-26
links:
  - relation: depends_on
    id: REQ-ATT-001
---

# API Contract: POST /api/v1/sessions/join

## 1. General Info

| Field          | Value                                |
| -------------- | ------------------------------------ |
| Method         | POST                                 |
| Path           | `/api/v1/sessions/join`              |
| Authentication | JWT                                  |
| Content-Type   | application/json                     |
| API Type       | REST                                 |
| Version        | v1                                   |

---

## 2. Business Purpose
Cho phép học viên tham gia vào một phiên điểm danh trực tuyến thông qua mã phòng họp (Session Code). API này sẽ xác thực quyền tham gia, kiểm tra trạng thái phòng họp, và trả về token WebRTC để thiết lập kết nối video.

---

## 3. Request Specifications

### Headers
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Idempotency-Key: idemp-key-uuid-12345
```

### Path Parameters
*Không áp dụng (None)*

### Query Parameters
*Không áp dụng (None)*

### Request Body Schema
| Field        | Type   | Required | Nullable | Validation | Description |
| ------------ | ------ | -------- | -------- | ---------- | ----------- |
| session_code | string | Yes      | No       | pattern:^[A-Z0-9]{6}$ | Mã phiên điểm danh gồm 6 ký tự chữ và số. |
| device_type  | string | Yes      | No       | enum:[WEB, MOBILE]     | Thiết bị học viên sử dụng để tham gia.    |

Example:
```json
{
  "session_code": "ATT890",
  "device_type": "WEB"
}
```

---

## 4. Response Specifications

### Success Response (201 Created)
| Field    | Type    | Nullable | Description             |
| -------- | ------- | -------- | ----------------------- |
| success  | boolean | No       | Trạng thái xử lý thành công (luôn là true). |
| data     | object  | No       | Dữ liệu kết nối LiveKit và thông tin phòng họp. |
| metadata | object  | Yes      | Thời gian phản hồi và thông tin định tuyến. |

Example:
```json
{
  "success": true,
  "data": {
    "connection_token": "token-webrtc-livekit-jwt-string",
    "server_url": "wss://livekit.attendance.edu.vn",
    "room_name": "room_ATT890",
    "participant_identity": "std_10029"
  },
  "metadata": {
    "server_timestamp": 1782462271,
    "request_id": "req-908123-abc"
  }
}
```

### Error Response
| HTTP Code | Error Code     | Meaning |
| --------- | -------------- | ------- |
| 400       | INVALID_CODE   | Mã phiên điểm danh không hợp lệ hoặc sai định dạng. |
| 401       | UNAUTHORIZED   | Token JWT hết hạn hoặc không hợp lệ. |
| 404       | ROOM_NOT_FOUND | Không tìm thấy phiên điểm danh tương ứng với mã cung cấp. |
| 409       | ALREADY_JOINED | Học viên đã tham gia vào phiên điểm danh này từ trước. |
| 429       | RATE_LIMITED   | Vượt quá giới hạn tần suất yêu cầu (10 req/min). |
| 500       | INTERNAL_ERROR | Lỗi máy chủ khi kết nối tới LiveKit Server. |

Example:
```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "Không tìm thấy phiên điểm danh với mã ATT890"
  }
}
```

---

## 5. Business Rules
*   Học viên chỉ được phép tham gia các phiên điểm danh đang ở trạng thái `ACTIVE`.
*   Token JWT của học viên phải chứa `student_id` hợp lệ và khớp với danh sách lớp.
*   Yêu cầu phải có `X-Idempotency-Key` trong Header để tránh việc học viên click đúp tạo nhiều kết nối WebRTC trùng lặp trên server LiveKit.

---

## 6. Operational Constraints
| Metric       | Target      | Ghi chú (Notes) |
| ------------ | ----------- | :--- |
| Rate Limit   | 10 req/min  | Giới hạn chặt để tránh spam kết nối WebRTC. |
| Timeout      | 3000 ms     | Giới hạn thời gian kết nối tới LiveKit. |
| P95 Latency  | < 150 ms    | Yêu cầu độ trễ thấp để học viên vào phòng nhanh. |
| Availability | 99.95%      | Endpoint quan trọng ảnh hưởng trực tiếp đến lớp học. |

---

## 7. Security Considerations
*   Bắt buộc xác thực chữ ký JWT ở tầng Gateway.
*   Kiểm tra tính hợp lệ của idempotency key trong Redis cache trước khi xử lý nghiệp vụ.
*   Mã hóa token LiveKit bằng thuật toán HS256 với secret key được quản lý tập trung.

---

## 8. Runtime Dependencies
*   **postgresql**: Để kiểm tra danh sách lớp học và trạng thái học viên.
*   **redis**: Lưu trữ và đối soát idempotency key (TTL 60s).
*   **livekit**: Gọi API tạo token kết nối WebRTC phòng họp.

---

## 9. Observability

### Metrics
*   `webrtc_session_join_total` (labels: status, device_type)
*   `livekit_token_generation_latency_seconds`

### Logs
Ghi nhật ký tập trung các trường:
*   `request_id`, `student_id`, `session_code`, `device_type`, `latency_ms`

### Traces
Distributed tracing ghi nhận chặng đi: `API-Gateway -> Attendance-Service -> Redis -> LiveKit-Client`.

---

## 10. Change Impact Analysis
*   **Frontend web / Mobile app**: Sẽ bị ảnh hưởng nếu cấu trúc payload trả về của `data` (như cấu trúc token LiveKit) thay đổi.
*   **SRE / DevOps**: Cần cập nhật cấu hình Prometheus nếu đổi tên metrics quan trọng.

---

## 11. AI Agent Usage
### Write
Backend Agent + Human Review

### Read
Frontend Agent (để sinh component kết nối WebRTC), QA Agent (để sinh kịch bản kiểm thử tải kết nối), DevOps Agent (để thiết lập dashboard giám sát LiveKit)

### Validation
Consistency Engine + API Contract Validator
