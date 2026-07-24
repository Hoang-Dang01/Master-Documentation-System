---
id: BE-SRV-[PROJECT]-[COMPONENT]-[NUMBER]
# For mds-core/global services: CORE-BE-SRV-[NAME]-V[VERSION]
title: "SRV: [Tên Dịch Vụ / Component]"
phase: "05"                          # Phase 05: Backend API & Service Design

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Must be non-empty iff execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW

# Inheritance Contract
schema_version: MDS-BE-SRV-1.0
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# Service Metadata
service_name: "[Physical/Logical Service Name, e.g. billing-service]"
service_type: DOMAIN_SERVICE | APPLICATION_SERVICE | INFRASTRUCTURE_SERVICE | UTILITY
domain: "[E.g. BILLING, LEARNING, AUTH]"
bounded_context: "[E.g. BillingContext, UserContext]"
runtime: "[E.g. NodeJS 18, Go 1.20, JVM 17]"
language: "[E.g. TypeScript, Golang, Java]"
framework: "[E.g. NestJS, Spring Boot, Gin]"
container: "[E.g. Docker, K8s Pod]"
service_owner: "dev_agent | arch_agent"
business_owner: ""                # Vai trò chịu trách nhiệm nghiệp vụ (ví dụ: product_owner, domain_lead)
technical_owner: ""               # Vai trò chịu trách nhiệm kỹ thuật (ví dụ: tech_lead, arch_agent)
criticality: CRITICAL | HIGH | MEDIUM | LOW
availability_target: "99.9% | 99.95% | 99.99%"
sla: "[E.g. Max latency < 200ms for 95% requests]"
scaling_strategy: STATIC | HORIZONTAL | VERTICAL
deployment_unit: "Docker Image / K8s Deployment / Serverless Function"
stateless: true | false
supports_horizontal_scaling: true | false

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
tags: [be, service, logic]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: implements             # Hiện thực hóa Functional Requirement tương ứng
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: adheres_to             # Tuân thủ Business Rule nghiệp vụ liên quan
    target: BA-BR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: adheres_to             # Tuân thủ quyết định kiến trúc auth/error/rate limit
    target: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc API Contract tầng trên gọi vào service này
    target: BE-API-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc logic/schema sang DB entity liên quan
    target: BE-DB-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc integration với hệ thống bên ngoài (nếu có)
    target: BE-INT-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: tested_by              # Được xác thực bởi Service Test Case nào
    target: QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: SRV_TEMPLATE_V1.3
> **Compatibility**: MDS >= 1.0
>
> **MDS BE Service Traceability**:
> ```text
> BA-REQ
>   │ adheres_to
>   ▼
> BA-BR
>   │ adheres_to
>   ▼
> BE-API ── calls ──► BE-SRV
>                        │
>                   ┌────┴────┐
>                   ▼         ▼
>                 BE-DB    BE-INT
>                        │
>                   ▼
>                 QA-TC
> ```

# Service Design Specification: [Tên Dịch Vụ]

## 0. Tổng Quan Dịch Vụ (Service Overview)

*   **Tên dịch vụ**: `billing-service`
*   **Loại dịch vụ**: DOMAIN_SERVICE | APPLICATION_SERVICE | INFRASTRUCTURE_SERVICE | UTILITY
*   **Runtime & Framework**: Node.js 18 (NestJS) | Go 1.20 (Gin)
*   **Trách nhiệm chính (Core Responsibility)**: [Mô tả ngắn gọn vai trò của dịch vụ, ví dụ: Tính toán hóa đơn, xử lý giao dịch thanh toán và đối soát số dư học viên].

---

## 1. Phân Định Trách Nhiệm (Service Responsibilities)

Bảng phân định trách nhiệm để tránh tình trạng phình to tính năng (Scope Creep):

| Loại Trách Nhiệm (Responsibility) | Mô Tả Chi Tiết (Description) |
| :--- | :--- |
| **Trách nhiệm chính (Primary)** | - Xử lý tính toán số dư ví học viên.<br>- Thực hiện trừ tiền giao dịch khóa học. |
| **Trách nhiệm phụ (Secondary)** | - Gửi email thông báo biên nhận thanh toán (thông qua Notification Service).<br>- Đồng bộ trạng thái đơn hàng sang Event Bus. |
| **Không thuộc trách nhiệm (Not Responsible)** | - Xử lý UI/giao diện trang thanh toán trực tiếp.<br>- Lưu trữ chi tiết thẻ ngân hàng của học viên (giao cho Stripe Integration). |

---

## 2. Các Thành Phần Phụ Thuộc (Dependencies)

Mô tả các phụ thuộc nội bộ (mã nguồn) và hệ thống bên ngoài:

### 2.1 Phụ thuộc nội bộ (Internal Source Dependencies)
*   `UserRepository`: Cung cấp các thao tác đọc/ghi thông tin người dùng trong DB.
*   `OrderRepository`: Truy vấn và cập nhật trạng thái đơn hàng.
*   `RedisService`: Thao tác với cache Redis tập trung.
*   `PaymentClient`: Client giao tiếp với hệ thống thanh toán Stripe.

### 2.2 Phụ thuộc hệ thống bên ngoài (External Infrastructure Dependencies)
*   **Database (PostgreSQL)**: Lưu trữ các bảng `tbl_orders`, `tbl_billing_accounts`.
*   **Message Broker (RabbitMQ / Kafka)**: Lắng nghe sự kiện `OrderCreated` và publish sự kiện `PaymentSucceeded`.
*   **Cache Engine (Redis)**: Lưu trữ thông tin cache session ví và khóa kháng trùng.
*   **External Integration**: Stripe API Gateway (thông qua `BE-INT-Stripe` integration).

---

## 3. Giao Diện Dịch Vụ (Service Interfaces)

Đặc tả các cổng giao tiếp Inbound (nhận yêu cầu) và Outbound (gửi yêu cầu) của Service:

### 3.1 Giao diện đầu vào (Inbound Interfaces)
*   **REST Controller**: Các HTTP endpoints tiếp nhận yêu cầu thanh toán từ Client (Ví dụ: `POST /api/v1/payments`).
*   **gRPC Service**: Điểm cuối tiếp nhận yêu cầu kiểm tra số dư đồng bộ từ các services nội bộ khác.
*   **MQ Consumer**: Lắng nghe queue `order_billing_queue` từ Message Broker để xử lý thanh toán bất đồng bộ.
*   **Scheduler**: Cron Job chạy định kỳ lúc 00:00 hàng ngày để đối soát giao dịch nghi vấn.

### 3.2 Giao diện đầu ra (Outbound Interfaces)
*   **Database Repository**: Giao tiếp trực tiếp với DB PostgreSQL để cập nhật số dư ví học viên.
*   **HTTP External Client**: Gửi yêu cầu HTTPS REST đến cổng Stripe.
*   **MQ Publisher**: Phát sự kiện `PaymentSucceeded` lên Topic Exchange `billing_events`.
*   **In-Memory/Cache Provider**: Giao tiếp qua giao thức TCP Redis để ghi đè khóa khóa kháng trùng.

---

## 4. Cấu Hình Runtime & Tham Số (Service Configuration)

Khai báo các biến môi trường, Feature Flags, tham số cấu hình và cơ chế quản lý Secrets:

### 4.1 Biến môi trường & Feature Flags (Env & Flags)
| Tên Biến / Khóa | Kiểu dữ liệu | Giá trị mẫu | Bắt buộc | Mô tả |
| :--- | :---: | :--- | :---: | :--- |
| `DATABASE_URL` | string | `postgresql://user:pwd@host:5432/db` | Yes | Chuỗi kết nối Database chính. |
| `REDIS_URL` | string | `redis://:pwd@host:6379/0` | Yes | Chuỗi kết nối Cache Redis. |
| `FEATURE_AUTO_RECLAIM` | boolean | `true` | No | Bật/tắt tính năng tự động hoàn tiền khi giao dịch lỗi. |
| `MAX_RETRY_ATTEMPTS` | integer | `3` | Yes | Số lần thử lại tối đa cho các công việc nền. |

### 4.2 Cơ chế quản lý Secrets
*   Các biến nhạy cảm như `DATABASE_URL`, `JWT_SECRET`, và `STRIPE_API_KEY` tuyệt đối **không được hardcode** hoặc lưu vào repository.
*   Được quản lý thông qua: AWS Secrets Manager | HashiCorp Vault | Kubernetes Secrets.

---

## 5. Cấu Trúc Mô-đun Mã Nguồn (Service Directory Structure)

Mô tả cây thư mục chuẩn của dịch vụ và vai trò của từng thư mục con:

```text
billing-service/
├── src/
│   ├── controllers/      # Tiếp nhận HTTP requests, điều hướng luồng, không chứa logic nghiệp vụ.
│   ├── dto/              # Data Transfer Objects định nghĩa cấu trúc dữ liệu Input/Output.
│   ├── services/         # Nơi chứa logic nghiệp vụ cốt lõi, điều phối transaction (Service layer).
│   ├── repositories/     # Thao tác với Database (Database Access Layer).
│   ├── events/           # Định nghĩa cấu trúc sự kiện (Event contracts) publish/subscribe.
│   │   ├── consumers/    # Nhận và xử lý tin nhắn từ Queue.
│   │   └── publishers/   # Đóng gói và phát tin nhắn lên Exchange.
│   ├── validators/       # Chứa logic xác thực dữ liệu đầu vào.
│   └── workflows/        # Điều phối các quy trình nghiệp vụ phức tạp (State machine, Sagas).
```

### 5.1 Bảng Phân Tầng Mô-đun (Module Layer Mapping)

| Thư Mục (Folder) | Tầng Kiến Trúc (Layer) | Mục Đích (Purpose) | Quy Tắc Cốt Lõi (Core Rule) |
| :--- | :--- | :--- | :--- |
| `controllers/` | Presentation Layer | Tiếp nhận và chuyển đổi request HTTP thành lệnh gọi Service. | **Cấm** chứa business logic hoặc truy vấn DB trực tiếp. |
| `dto/` | Presentation Layer | Định nghĩa schema Input/Output, validation constraints. | Chỉ là data container, không chứa logic. |
| `services/` | Application / Domain Layer | Điều phối nghiệp vụ, quản lý transaction, gọi Repository. | Là trung tâm; cấm gọi `controllers` hoặc truy vấn DB raw. |
| `repositories/` | Infrastructure / Persistence Layer | Trừu tượng hóa toàn bộ thao tác đọc/ghi Database. | Chỉ nhận/trả Entity. **Cấm** chứa business rules. |
| `events/consumers/` | Infrastructure Layer | Xử lý tin nhắn đến từ Message Broker. | Chuyển message thành command rồi gọi Service. |
| `events/publishers/` | Infrastructure Layer | Đóng gói sự kiện và phát lên Exchange/Topic. | Không publish trực tiếp từ Controller hay Repository. |
| `validators/` | Application Layer | Xác thực dữ liệu đầu vào theo Domain Rules. | Dùng lại logic validation, không duplicate ở Controller. |
| `workflows/` | Domain Layer | Quản lý State Machine, Saga Orchestration. | Điều phối chuỗi bước nghiệp vụ phức tạp, không gọi DB raw. |

---

## 6. Công Việc Nền & Message Queue Consumers (Background Workers & MQ)

Đặc tả các xử lý bất đồng bộ, lập lịch và tiêu thụ tin nhắn từ Queue:

| Tên Worker / Queue | Trigger Source | Payload Schema | Retry Policy | Dead Letter Queue (DLQ) | Idempotency | Ordering | Mô tả chi tiết |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| `payment_consumer` | Queue: `order_billing_queue` | `{"order_id": "uuid", "amount": 250.00}` | Exponential backoff (Max 5 attempts, initial delay 1s) | `payment_dlq` | Yes (via `order_id` in Cache) | Yes (via Partition Key: `order_id`) | Tiêu thụ sự kiện đơn hàng mới để tiến hành trừ tiền ví học viên. |
| `billing_audit_cron` | Cron: `0 0 * * *` | None | Retry 3 times, delay 5m | None (Alert on Slack) | Yes (via run date checking) | No | Quét các giao dịch trạng thái `PENDING` quá 24 giờ để tự động hoàn tiền. |

---

## 7. Khế Ước Sự Kiện Bất Đồng Bộ (Event Contract)

Registry lưu giữ chi tiết các cấu trúc sự kiện (Message Payload) mà Service phát đi (Publish) hoặc tiêu thụ (Consume):

### 7.1 Sự kiện phát đi (Published Events)
*   **Event Name**: `OrderPaymentSucceeded`
*   **Event Version**: `v1`
*   **Schema ID**: `billing.payment.succeeded.v1`
*   **Compatibility Strategy**: `BACKWARD` (Consumers cũ vẫn có thể đọc schema mới)
*   **Routing Key / Topic**: `events.billing.payment.succeeded`
*   **Payload Schema**:
```json
{
  "event_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "event_type": "OrderPaymentSucceeded",
  "event_version": "v1",
  "schema_id": "billing.payment.succeeded.v1",
  "timestamp": "2026-07-06T03:54:00Z",
  "data": {
    "order_id": "001a2b3c-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
    "amount": 250000,
    "currency": "VND",
    "payment_method": "WALLET"
  }
}
```

### 7.2 Sự kiện tiêu thụ (Consumed Events)
*   **Event Name**: `OrderCreated`
*   **Event Version**: `v1`
*   **Schema ID**: `order.created.v1`
*   **Compatibility Strategy**: `FORWARD` (Service này đọc được schema cũ lẫn schema mới của producer)
*   **Trigger Source**: Exchange `order_events` (Routing key: `events.order.created`)
*   **Payload Schema**:
```json
{
  "event_id": "c10d2e3f-4a5b-6c7d-8e9f-0a1b2c3d4e5f",
  "event_type": "OrderCreated",
  "event_version": "v1",
  "schema_id": "order.created.v1",
  "timestamp": "2026-07-06T03:53:50Z",
  "data": {
    "order_id": "001a2b3c-4d5e-6f7g-8h9i-0j1k2l3m4n5o",
    "student_id": "std_998877",
    "total_amount": 250000
  }
}
```

---

## 8. Chiến Lược Lưu Trữ Bộ Nhớ Đệm (Caching Strategy)

Quy định cấu trúc cache để giảm tải cho Database và tối ưu hóa thời gian phản hồi:

| Cache Name | Key Pattern | TTL (Seconds) | Refresh Strategy | Eviction Policy | Invalidation Trigger | Mô tả mục đích |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| `user_wallet_cache` | `wallet:{student_id}` | `300` | Read-through | Least Recently Used (LRU) | Sự kiện: `WalletUpdated`, `PaymentSucceeded` | Lưu trữ số dư ví của học viên để kiểm tra nhanh. |
| `idempotency_cache` | `idempotency:{key}` | `86400` (24h) | Write-only on set | volatile-lru | Tự động hết hạn (TTL) | Lưu kết quả giao dịch chống lặp request. |

---

## 9. Thiết Kế Giao Dịch & Khóa (Transaction Design)

Quy định ranh giới transaction và cơ chế đảm bảo tính nhất quán (ACID/Eventual Consistency):

| Tên Nghiệp Vụ (Transaction) | Isolation Level | Lock Strategy | Rollback Conditions | Retry Limits | Compensating Action | Mô tả luồng xử lý |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| `DeductWalletBalance` | `READ_COMMITTED` | Pessimistic Write Lock trên dòng `tbl_billing_accounts` | - Số dư không đủ.<br>- Bất kỳ ngoại lệ SQL runtime nào. | None (Fail fast) | Phát sự kiện `PaymentFailed` để khôi phục trạng thái đơn hàng về `CANCELLED`. | Thực hiện trừ số dư ví học viên trong Database. Bắt buộc lock dòng tài khoản để tránh tranh chấp (Race Condition). |

---

## 10. Sơ Đồ Trạng Thái (State Machine)

Đặc tả các trạng thái vòng đời của thực thể chính do Service quản lý:

```mermaid
stateDiagram-v2
    [*] --> CREATED: Khởi tạo giao dịch
    CREATED --> VALIDATED: Xác thực số dư thành công
    VALIDATED --> PROCESSING: Gửi yêu cầu trừ tiền ví
    
    PROCESSING --> SUCCESS: Trừ tiền thành công
    PROCESSING --> FAILED: Trừ tiền thất bại (Lỗi hệ thống / Không đủ số dư)
    
    VALIDATED --> FAILED: Xác thực thất bại
    
    SUCCESS --> [*]
    FAILED --> [*]
```

*   **Các bước chuyển đổi trạng thái chính**:
    - `CREATED ➔ VALIDATED`: Hệ thống gọi kiểm tra tính hợp lệ của ví và số dư khả dụng.
    - `VALIDATED ➔ PROCESSING`: Lock số dư ví tạm thời để chuẩn bị giao dịch.
    - `PROCESSING ➔ SUCCESS`: Hoàn tất trừ tiền vật lý, cập nhật lịch sử giao dịch.
    - `PROCESSING ➔ FAILED`: Rollback số dư tạm khóa, ghi nhận lịch sử lỗi.

---

## 11. Sơ Đồ Luồng & Thuật Toán Nội Bộ (Internal Algorithms)

### 11.1 Sơ đồ tuần tự xử lý nội bộ (Internal Sequence Diagram)
```mermaid
sequenceDiagram
    autonumber
    participant Controller as REST Controller
    participant Service as BillingService
    participant Repo as WalletRepository
    participant Broker as EventPublisher

    Controller->>Service: deductWallet(studentId, amount, idempotencyKey)
    Service->>Service: Kiểm tra idempotencyKey trong Cache
    Service->>Repo: Bắt đầu Transaction & Lock account (Pessimistic)
    Repo-->>Service: Trả về tài khoản và số dư hiện tại
    alt Số dư < amount
        Service-->>Controller: Trả về lỗi WALLET_INSUFFICIENT_FUNDS
        Service: Rollback Transaction
    else Số dư >= amount
        Service->>Repo: Giảm số dư & ghi log giao dịch
        Repo-->>Service: Xác nhận thành công
        Service->>Broker: Publish event OrderPaymentSucceeded
        Service: Commit Transaction
        Service-->>Controller: Trả về kết quả giao dịch (Success)
    end
```

### 11.2 Đặc tả thuật toán (Algorithm Specification)
*   **Tên thuật toán**: `deductWalletBalance`
*   **Đầu vào (Input)**: `student_id: UUID`, `amount: Decimal`, `idempotency_key: String`
*   **Đầu ra (Output)**: `TransactionResult { success: Boolean, transaction_id: UUID }`
*   **Độ phức tạp thời gian (Time Complexity)**: `O(1)` — Mọi thao tác đều là lookup theo khóa duy nhất (PK/Cache key), không có vòng lặp tuyến tính theo dữ liệu.
*   **Độ phức tạp không gian (Space Complexity)**: `O(1)` — Không tạo thêm cấu trúc dữ liệu tăng theo input.
*   **Pseudo Code**:
```text
FUNCTION deductWalletBalance(student_id, amount, idempotency_key):
    // 1. Kiểm tra chống trùng lặp
    IF cache.exists(idempotency_key) THEN
        RETURN cache.get(idempotency_key)
    ENDIF

    // 2. Bắt đầu transaction
    START_TRANSACTION
    TRY
        // 3. Pessimistic Write Lock
        wallet = walletRepository.findAndLockByStudentId(student_id)
        IF wallet IS NULL THEN
            THROW WalletNotFoundError
        ENDIF

        // 4. Validate nghiệp vụ
        IF wallet.balance < amount THEN
            THROW InsufficientFundsError
        ENDIF

        // 5. Tính toán
        wallet.balance = wallet.balance - amount
        walletRepository.save(wallet)
        
        tx_log = transactionRepository.createLog(student_id, amount, "DEBIT")
        
        COMMIT_TRANSACTION
        
        // 6. Phát sự kiện bất đồng bộ
        eventPublisher.publish("OrderPaymentSucceeded", {student_id, amount, tx_log.id})
        
        result = { success: true, transaction_id: tx_log.id }
        cache.set(idempotency_key, result, TTL=86400)
        
        RETURN result
    CATCH Exception e
        ROLLBACK_TRANSACTION
        RETURN { success: false, error: e.message }
    ENDTRY
```

---

## 12. Luật Nghiệp Vụ Tầng Dịch Vụ (Domain Rules)

Các quy tắc nghiệp vụ bất biến (Invariants) được thực thi nghiêm ngặt tại tầng dịch vụ. Mỗi Rule phải có ID truy vết ngược về nguồn yêu cầu nghiệp vụ (BA-REQ / BA-BR):

| ID Luật | Tên Luật | Mô Tả | Nguồn Yêu Cầu (Source REQ/BR) | Mức Nghiêm Trọng (Severity) | Ưu Tiên (Priority) |
| :--- | :--- | :--- | :--- | :---: | :---: |
| `RULE-001` | Ví Không Âm | Số dư khả dụng của ví học viên không bao giờ được phép âm (`wallet.balance >= 0.00`). | `BA-BR-[PROJECT]-BILL-001` | CRITICAL | P0 |
| `RULE-002` | Giới Hạn Giao Dịch | Giá trị thanh toán qua ví không vượt quá `50,000,000 VND` để phòng ngừa rủi ro gian lận. | `BA-BR-[PROJECT]-BILL-002` | HIGH | P1 |
| `RULE-003` | Khóa Đơn Hàng Đã Đóng | Cấm trừ tiền đối với đơn hàng có trạng thái `COMPLETED` hoặc `CANCELLED`. | `BA-REQ-[PROJECT]-BILL-005` | HIGH | P1 |

---

## 13. Đặc Tả Lỗi Hệ Thống (Error Handling Matrix)

Đặc tả danh sách mã lỗi, nguyên nhân và phản hồi tương ứng:

| Mã Lỗi (Error Code) | Nguyên Nhân Gốc (Root Cause) | Chiến Lược Thử Lại (Retry Policy) | Thông Điệp Cho Người Dùng (User Message) | Cấp Độ Ghi Log (Log Level) |
| :--- | :--- | :---: | :--- | :---: |
| `WALLET_INSUFFICIENT_FUNDS` | Số dư tài khoản ví học viên thấp hơn giá trị cần thanh toán. | No Retry (Fail Fast) | Số dư ví của bạn không đủ để thực hiện thanh toán này. | `INFO` |
| `LOCK_ACQUISITION_TIMEOUT` | Không thể lấy lock tài khoản ví do xung đột giao dịch song song khác quá lâu (>3s). | Retry max 3 times (Backoff 200ms) | Hệ thống đang bận xử lý giao dịch khác, vui lòng thử lại sau giây lát. | `WARN` |
| `EXTERNAL_GATEWAY_TIMEOUT` | Kết nối cổng Stripe bị đứt hoặc không phản hồi sau 10s. | Retry via MQ DLQ flow | Cổng thanh toán tạm thời không phản hồi. Giao dịch sẽ được xử lý ngầm. | `ERROR` |

---

## 14. Chiến Lược Phục Hồi Lỗi & Kháng Tải (Failure Recovery & Resiliency)

*   **Cơ chế Fallback (Fallback Mechanism)**: Khi Stripe API bị sập, hệ thống chuyển sang trạng thái thanh toán tạm hoãn (Pending Settlement), gửi email thông báo cho học viên và tạo task đối soát thủ công trên CMS.
*   **Ngắt mạch (Circuit Breaker)**: Áp dụng cho các outbound client gọi Stripe. Khi tỷ lệ lỗi kết nối Stripe vượt quá `50%` trong 20 requests, ngắt mạch chuyển sang `OPEN`, từ chối ngay lập tức các yêu cầu thanh toán thẻ và hiển thị thông báo bảo trì cổng.
*   **Cơ chế bù trừ giao dịch (Compensating Transactions - Sagas)**: Nếu luồng thanh toán thành công nhưng luồng kích hoạt khóa học bị lỗi, service sẽ chạy workflow bù trừ: hoàn lại tiền vào ví học viên và ghi nhận log giao dịch hoàn trả.

---

## 15. Giám Sát Vận Hành (Observability Strategy)

*   **Metrics Thu Thập (Prometheus)**:
    - `wallet_deductions_total`: Đếm số giao dịch trừ tiền (phân loại theo `status: SUCCESS | FAILED`).
    - `wallet_deduction_latency_seconds`: Đo lường latency của hàm trừ tiền ví (bucket: 0.05s, 0.1s, 0.25s, 0.5s, 1s).
*   **Structured Logs (JSON)**: Toàn bộ logs xuất ra dạng JSON chứa các metadata bắt buộc: `trace_id`, `span_id`, `student_id`, `order_id`, `execution_time_ms`, `log_level`.
*   **Distributed Tracing (OpenTelemetry)**:
    - **Trace Context propagation**: Mọi inbound request (REST, gRPC, MQ) bắt buộc đọc và forward `traceparent` / `tracestate` headers để duy trì trace liên tục qua ranh giới service.
    - **Span bắt buộc tạo mới**: `deductWallet`, `checkIdempotency`, `acquireLock`, `publishEvent`.
    - **Correlation ID**: Trường `correlation_id` được ghi vào mọi log entry và MQ message header để đối soát sự cố chéo dịch vụ.
    - **Trace Context Fields**: `trace_id` (UUID của chuỗi request gốc), `span_id` (ID của bước xử lý hiện tại), `parent_span_id` (ID của bước gọi vào service này).
*   **Health & Lifecycle Endpoints**:
    - **Liveness probe**: `GET /health/liveness` (Trả về `200 OK` để xác nhận container còn sống).
    - **Readiness probe**: `GET /health/readiness` (Kiểm tra kết nối Database & Redis. Trả về `503 Service Unavailable` nếu mất kết nối datastores).

---

## 16. Định Mức Hiệu Năng & Tài Nguyên (Performance Budget)

*   **Ngân sách thời gian phản hồi (Latency Budget)**:
    - **P95 Latency**: `< 150 ms` cho giao dịch trừ ví nội bộ.
    - **P99 Latency**: `< 500 ms` dưới điều kiện tải đỉnh.
*   **Định mức thông lượng (Throughput Budget)**:
    - **Expected TPS (Transactions Per Second)**: `50 TPS` trong điều kiện tải bình thường.
    - **Peak TPS**: `200 TPS` trong giờ cao điểm (đầu tuần, cuối kỳ thanh toán).
    - **Burst TPS**: `500 TPS` trong tối đa `30 giây` khi xảy ra flash sale — sau đó áp dụng rate limiting.
*   **Hạn ngạch truy vấn Database (Database Query Budget)**: Không vượt quá **5 queries** SQL cho một giao dịch thanh toán ví đơn lẻ.
*   **Định mức tài nguyên (Resource Budget)**:
    - **Memory limits**: Max `512 MB` trên mỗi instance.
    - **CPU limits**: Tối đa `0.5 Core` CPU vCPU.
*   **Connection Pool Configuration**:
    - **Database Pool Size**: `10` connections / instance.
    - **Redis Pool Size**: `20` connections / instance.
    - **Worker concurrency limit**: Tối đa `5` workers chạy song song.

---

## 17. Đặc Tả An Ninh & Bảo Mật (Security Design)

*   **Phân Quyền & Kiểm Soát (Authorization)**: Chỉ cho phép các API Request mang token có scope `write:payments` được quyền gọi hàm trừ tiền ví.
*   **Xác thực dữ liệu (Input Validation)**: Dữ liệu payload truyền vào schema được validate thông qua Class-Validator/Joi ở tầng Controller để ngăn chặn SQL Injection.
*   **Bảo vệ dữ liệu PII**: Số dư ví và lịch sử giao dịch được coi là dữ liệu nhạy cảm tài chính. Toàn bộ logs hệ thống tuyệt đối cấm in số dư ví ở dạng plaintext mà phải che (masking).
*   **Audit Trail (Lịch sử kiểm toán)**: Mọi thao tác thay đổi số dư ví học viên bắt buộc ghi nhận vào bảng `tbl_audit_logs` gồm các trường: `operator_id`, `action_type`, `old_value`, `new_value`, `timestamp` để phục vụ thanh tra.

### 17.1 Mô Hình Mối Đe Dọa (Threat Model)

| Mối Đe Dọa (Threat) | Kỹ Thuật Tấn Công (Attack Vector) | Biện Pháp Giảm Thiểu (Mitigation) | Rủi Ro Còn Lại (Residual Risk) |
| :--- | :--- | :--- | :--- |
| **Race Condition trên ví** | Gửi đồng thời nhiều request trừ tiền trùng `student_id`. | Pessimistic Write Lock ở DB; Idempotency Key trong Redis. | Thấp (Low) — Còn nguy cơ nếu Redis bị sập trước khi lock DB. |
| **Replay Attack (gửi lại request cũ)** | Kẻ tấn công bắt được request cũ và gửi lại để trừ tiền lần 2. | `X-Idempotency-Key` bắt buộc, lưu TTL=24h trong Redis. | Rất Thấp (Very Low) — Chỉ còn rủi ro nếu attacker tạo được key hợp lệ mới. |
| **Privilege Escalation** | Token với scope thấp cố tình gọi API trừ tiền. | Kiểm tra scope `write:payments` tại middleware trước khi vào Controller. | Rất Thấp (Very Low) — Phụ thuộc vào độ tin cậy của Identity Provider. |

---

## 18. Khối Cấu Hình Dịch Vụ Máy Đọc (Machine-Readable Service Contract)

Khối YAML mô tả kiến trúc runtime, MQ, Cache và Transaction của Service giúp AI agent tự động sinh boilerplate code, cấu hình K8s Helm values và CI/CD:

```yaml
service_contract:
  schema_version: MDS-BE-SRV-1.0
  id: BE-SRV-[PROJECT]-[COMPONENT]-[NUMBER]
  service:
    name: billing-service
    type: domain_service
    runtime: nodejs18
    framework: nestjs
    stateless: true
    scaling:
      strategy: horizontal
      min_replicas: 2
      max_replicas: 5
      triggers:
        cpu_percent: 70
        memory_percent: 80
  interfaces:
    inbound:
      - protocol: rest
        port: 3000
      - protocol: grpc
        port: 50051
      - protocol: amqp
        queue: order_billing_queue
        concurrency: 5
    outbound:
      - target: database
        type: postgresql
      - target: cache
        type: redis
      - target: exchange
        name: billing_events
        type: topic
  dependencies:
    databases:
      - target: BE-DB-[PROJECT]-[COMPONENT]-[NUMBER]
    integrations:
      - target: BE-INT-[PROJECT]-[COMPONENT]-[NUMBER]
  caching:
    providers:
      - name: redis
        pools:
          max_connections: 20
    keys:
      - pattern: "wallet:{student_id}"
        ttl_seconds: 300
        invalidation_events:
          - WalletUpdated
  transactions:
    - name: DeductWalletBalance
      isolation_level: READ_COMMITTED
      lock: pessimistic_write
      timeout_ms: 3000
      rollback_on:
        - InsufficientFundsException
        - DatabaseException
  state_machine:
    states:
      - name: CREATED
      - name: VALIDATED
      - name: PROCESSING
      - name: SUCCESS
      - name: FAILED
    transitions:
      - from: CREATED
        to: VALIDATED
      - from: VALIDATED
        to: PROCESSING
      - from: PROCESSING
        to: SUCCESS
      - from: PROCESSING
        to: FAILED
```

---

## 19. Bảng Tự Kiểm Tra Chất Lượng Dịch Vụ (Service Quality Checklist)

- [ ] ID thực thể đúng chuẩn `BE-SRV-[PROJECT]-[COMPONENT]-[NUMBER]` hoặc `CORE-BE-SRV-[NAME]-V[VERSION]`.
- [ ] Khai báo đầy đủ các thuộc tính Service Metadata đặc thù ở Frontmatter (`service_type`, `runtime`, `stateless`, `availability_target`, `business_owner`, `technical_owner`).
- [ ] Link `implements` trỏ chính xác về Functional Requirement (`BA-REQ`) và `adheres_to` trỏ về Business Rule (`BA-BR`) liên quan.
- [ ] Graph Traceability đầy đủ: `BA-REQ → BA-BR → BE-API → BE-SRV → BE-DB / BE-INT → QA-TC`.
- [ ] Xác định rõ ràng ranh giới nghiệp vụ (Section 1: Responsibilities) tránh scope creep.
- [ ] Đặc tả đầy đủ danh sách cổng giao tiếp Inbound và Outbound ở Section 3 (Service Interfaces).
- [ ] Định nghĩa đầy đủ danh sách cấu hình và cách thức quản lý Secrets bảo mật (Section 4). Không có secret nào được hardcode.
- [ ] Sơ đồ cây thư mục (Directory Structure) khớp với mô hình kiến trúc và bảng phân tầng module (Section 5.1) phải đầy đủ.
- [ ] Service xác nhận là Stateless — không lưu trạng thái session cục bộ trên instance.
- [ ] Không có Circular Dependencies giữa các modules nội bộ của service.
- [ ] Khai báo chi tiết các background jobs, retry policy, DLQ, Idempotency và Message ordering ở Section 6.
- [ ] Khế ước Event Contract (Section 7) đăng ký chính xác cả Published và Consumed Events kèm `event_version`, `schema_id`, `compatibility` và payload json mẫu.
- [ ] Xác định rõ cơ chế invalidation trigger của từng loại cache (Section 8).
- [ ] Khai báo Transaction boundaries, isolation levels, và compensating actions ở Section 9.
- [ ] Vẽ sơ đồ Mermaid biểu diễn State Machine (Section 10) và Sequence Diagram xử lý nội bộ (Section 11).
- [ ] Thuật toán ở mục 11.2 trình bày bằng Pseudo Code dễ hiểu, chỉ ra rõ Input, Output, Time Complexity và Space Complexity.
- [ ] Danh sách Domain Rules (Section 12) có cột `Source REQ/BR`, `Severity`, và `Priority` để đảm bảo truy vết.
- [ ] Xây dựng ma trận mã lỗi chi tiết (Section 13) và kế hoạch phòng vệ, ngắt mạch, phục vụ kháng tải (Section 14).
- [ ] Distributed Tracing đầy đủ: `trace_id`, `span_id`, `parent_span_id`, `correlation_id` khai báo ở Observability (Section 15).
- [ ] Khai báo đủ ba mức TPS (Expected, Peak, Burst) và Connection Pool cho DB, Redis, Workers ở Section 16.
- [ ] Hoàn thành Threat Model (Section 17.1) với ít nhất 3 mối đe dọa và biện pháp giảm thiểu tương ứng.
- [ ] Khối YAML `service_contract` máy đọc được biên dịch hợp lệ không chứa Tab và đúng cấu trúc.
- [ ] **Controlled Tech Leakage Check**: Cho phép rò rỉ ngôn ngữ lập trình, framework, thư viện và tên queues/event schemas nhưng cấm tuyệt đối rò rỉ thông tin hạ tầng vật lý cụ thể (DB Production URL, API Tokens, AWS Secrets Manager Access Keys, Server IP Addresses).