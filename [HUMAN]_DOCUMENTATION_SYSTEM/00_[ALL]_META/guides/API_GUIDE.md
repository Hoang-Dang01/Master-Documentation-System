# Hướng Dẫn Thiết Kế API Contract (API Design Guide)

> **MDS — Master Documentation System**
> *Cẩm nang chuẩn hóa thiết kế giao diện kết nối Backend API Contract*

Tài liệu này định nghĩa triết lý, tiêu chuẩn và hướng dẫn chi tiết cách viết **Hợp đồng kết nối API Backend (Backend API Contract)** trong hệ thống MDS. Đây là tài liệu tham chiếu cốt lõi cho cả Con người (Chief Architect) và các AI Agents.

---

## 1. Mục đích của API Contract (Purpose)

**Backend API Contract** là tài liệu định nghĩa **giao diện kết nối chuẩn tắc (canonical interface contract)** giữa một Backend API Endpoint và các hệ thống tiêu thụ (Consumers) như Frontend Web, Mobile App, hay dịch vụ thứ ba.

Mục tiêu:
*   Đồng bộ hóa 100% cách hiểu giữa Backend, Frontend, QA và DevOps.
*   Triệt tiêu sự mơ hồ (Ambiguity) trong cấu trúc Request / Response.
*   Cung cấp context cực kỳ chi tiết cho AI Agents tự động sinh mã nguồn (BE code), giao diện (FE interface), kịch bản kiểm thử (QA tests) và cấu hình giám sát (DevOps/SRE configs).
*   Hỗ trợ phân tích tác động thay đổi (Change Impact) và liên kết đồ thị tri thức (Knowledge Graph) của MDS.

> **Quy tắc**: Mỗi API Endpoint duy nhất bắt buộc phải được đặc tả bằng một file contract riêng biệt để tránh nhiễu thông tin.

---

## 2. 5 Lỗ hổng của API truyền thống & Giải pháp MDS

Các đặc tả API thông thường (như Swagger/OpenAPI) thường chỉ tập trung vào cấu trúc dữ liệu tĩnh (Data Types). MDS nâng tầm API Contract lên mức **Decision & Operational Intelligence** bằng cách giải quyết triệt để 5 lỗ hổng lớn sau:

### A. Chiến lược Phiên bản (Versioning Strategy)
API thực tế luôn biến đổi. MDS yêu cầu khai báo rõ `api_version` (v1, v2) và chiến lược loại bỏ `deprecation_policy` (ví dụ: `180_days_notice`) trong metadata để AI Backend biết khi nào được phép refactor/xóa mã nguồn cũ và thông báo cho các bên tiêu thụ.

### B. Cơ chế Kháng trùng (Idempotency)
Đối với các giao dịch nhạy cảm (Thanh toán, Đặt phòng, Tạo đơn hàng), việc Client gửi trùng request (do lag mạng) có thể gây ra thảm họa (trừ tiền 2 lần). API Contract bắt buộc phải định nghĩa rõ thuộc tính `idempotent` và `idempotency_key_required` để AI Backend tự động sinh cơ chế khóa (locking mechanism) và phòng thủ trùng lặp.

### C. Hợp đồng Phụ thuộc Vận hành (Dependency Contract)
Một API không chạy độc lập. Nó phụ thuộc vào Database (Postgres), Cache (Redis), dịch vụ ngoài (LiveKit, S3), hay Message Queue. Khai báo `runtime_dependencies` giúp AI và DevOps lập tức khoanh vùng được nguyên nhân khi xảy ra sự cố lỗi hệ thống dây chuyền (distributed debugging).

### D. Giám sát & Quan sát (Observability)
MDS đưa tiêu chuẩn SRE vào trực tiếp thiết kế API. API Contract yêu cầu định nghĩa các chỉ số đo lường (Metrics: request count, error rate, p95 latency), nội dung nhật ký bắt buộc (Logs: request_id, user_id) và cơ chế vết (Traces) để AI DevOps tự động cấu hình các bộ dashboard giám sát (Prometheus/Grafana) ngay khi API được triển khai.

### E. Phân tích Tác động Thay đổi (Change Impact Analysis)
Khi sửa đổi một API, AI cần biết chính xác những cấu phần nào bị ảnh hưởng. Mục `change_impact` định nghĩa rõ các bên liên đới (Frontend, Mobile, Third-party, Test suites) giúp đồ thị tri thức của MDS tự động gửi thông báo điều chỉnh hoặc chạy lại bộ test tương ứng (regression testing).

---

## 3. Hướng dẫn các Mục Tiêu chuẩn trong API Contract

Mỗi tài liệu API Contract bắt buộc phải tuân thủ cấu trúc từ [API-BE-TEMPLATE.md](../templates/API-BE-TEMPLATE.md):

1.  **General Info (Thông tin chung)**: Định nghĩa các thuộc tính kết nối vật lý bao gồm Method, Path, Authentication, Content-Type và API Type.
2.  **Business Purpose (Mục đích Nghiệp vụ)**: Giải thích bằng ngôn ngữ tự nhiên về lý do tồn tại của API và giá trị nghiệp vụ nó mang lại.
3.  **Request Specifications (Đặc tả Yêu cầu)**:
    *   *Headers*: Các header bắt buộc (Authentication, Content-Type).
    *   *Parameters*: Chi tiết các tham số truyền qua Path (Path Params) và Query String (Query Params) kèm kiểu dữ liệu và thuộc tính bắt buộc (Required).
    *   *Request Body Schema*: Bảng định nghĩa kiểu dữ liệu, thuộc tính nullable, các quy tắc ràng buộc validation (ví dụ: `max:255`, `email`, `positive`) và ví dụ JSON minh họa.
4.  **Response Specifications (Đặc tả Phản hồi)**:
    *   *Success Response*: Định nghĩa cấu trúc chuẩn của phản hồi thành công (HTTP 200, 201, 204) với schema bọc ngoài cố định (`success`, `data`, `metadata`).
    *   *Error Response*: Định nghĩa danh mục mã lỗi nghiệp vụ (HTTP 400, 401, 403, 404, 409, 429, 500) và cấu trúc lỗi chuẩn để Frontend hiển thị thông báo.
5.  **Business Rules (Quy tắc Nghiệp vụ)**: Liệt kê các điều kiện logic bắt buộc (ví dụ: Người dùng phải là chủ phòng mới được kích hoạt LiveKit, phòng họp phải đang ở trạng thái ACTIVE).
6.  **Operational Constraints (Ràng buộc Vận hành)**: Các chỉ số cam kết SLA (Rate Limit, Timeout, P95 Latency, Availability) phục vụ DevOps kiểm thử tải (Load Test) và SRE giám sát Production.
7.  **Security Considerations (Lưu ý Bảo mật)**: Hướng dẫn phòng thủ bảo mật cụ thể cho endpoint (Mã hóa nhạy cảm, ngăn chặn SQL/NoSQL Injection, giới hạn tần suất gọi).
8.  **Runtime Dependencies (Phụ thuộc Vận hành)**: Danh sách các dịch vụ nền tảng bắt buộc phải hoạt động để API thực thi thành công.
9.  **Observability (Khả năng Quan sát)**: Đặc tả chi tiết các Metrics cần đo, Logs cần ghi và cơ chế Tracing.
10. **Change Impact Analysis (Phân tích Ảnh hưởng)**: Liệt kê các cấu phần Frontend/Mobile/Integrations bị ảnh hưởng trực tiếp khi API này thay đổi cấu trúc.
11. **AI Agent Usage (Phân bổ vận hành AI)**: Phân định rõ quyền soạn thảo, đọc hiểu và đối soát tự động của các AI chuyên môn hóa đối với hợp đồng này.
