---
id: BE-DB-[PROJECT]-[COMPONENT]-[NUMBER]
# For mds-core/global DB schemas: CORE-BE-DB-[NAME]-V[VERSION]
title: "DB: [Tên Bảng Vật Lý]"
phase: "04"                          # Phase 04: Database & Schema Design

# Layer 1 — Lifecycle State (Độ chín muồi của tài liệu - Documentation Maturity)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (Trạng thái vận hành thực tế của công việc viết tài liệu)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Must be non-empty iff execution_state = BLOCKED

# Criticality & Priority
document_priority: CRITICAL | HIGH | MEDIUM | LOW

# Inheritance Contract
schema_version: MDS-BE-DB-1.0
inherits_from: CORE-BASE-TEMPLATE-GUIDE-V1.1

# Database Metadata
db_engine: POSTGRESQL | MYSQL | SQLITE | MSSQL
compliance_tags: [GDPR, PCI_DSS, HIPAA] # Standard compliance tags

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
tags: [be, database, ddl, schema]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  # Add only applicable outbound edges
  - type: implements             # Hiện thực hóa Functional Requirement lưu trữ tương ứng
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: adheres_to             # Tuân thủ quyết định kiến trúc chọn DB / phân vùng
    target: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc logic/schema sang DB entity khác (FK, partition parent, view dependency...)
    target: BE-DB-[PROJECT]-[COMPONENT]-[NUMBER]
---

> **Status**: CANONICAL_TEMPLATE
> **Version**: DB_DDL_TEMPLATE_V1.1
> **Compatibility**: MDS >= 1.0
>
> **MDS BE Database Traceability**:
> `BA-REQ ── implemented_by ─► BE-DB`
> `BE-DB ─── adheres_to ─────► ARCH-ADR`
> `BE-DB ─── depends_on ─────► BE-DB (Foreign Key Target)`

# Database Schema Specification: [Tên Bảng Vật Lý]

## 0. Tổng Quan Bảng Dữ Liệu (Table Overview)

*   **Tên bảng vật lý (Physical Table Name)**: `tbl_orders`
*   **Hệ quản trị CSDL (DB Engine)**: PostgreSQL 15 | MySQL 8.0 | SQLite 3 | MSSQL 2022
*   **Tầng lưu trữ (Storage Tier)**: HOT | WARM | COLD
*   **Chiến lược phân vùng (Partition Strategy)**: NONE | RANGE | HASH | LIST
*   **Phân loại bảng (Table Classification)**: Transactional (Giao dịch) | Master Data (Danh mục) | Log (Nhật ký) | Audit Trail
*   **Chức năng chính (Function)**: [Ví dụ: Lưu trữ thông tin chi tiết đơn hàng thanh toán học phí của học viên].

### 0.1 Từ điển Tầng Lưu Trữ (Storage Tier Glossary)
| Tier | Meaning (Ý nghĩa / SLA truy cập) |
| :---: | :--- |
| `HOT` | Dữ liệu truy cập thường xuyên, độ trễ thấp (Real-time read/write). |
| `WARM` | Dữ liệu ít truy cập hơn (ví dụ: đối soát tháng / báo cáo định kỳ). |
| `COLD` | Dữ liệu lưu trữ lịch sử, chỉ đọc phục vụ kiểm toán / tra cứu cũ. |

---

## 1. Định Nghĩa Cột & Ràng Buộc (Columns & Constraints Specification)

Đặc tả chi tiết cấu trúc cột, kiểu dữ liệu vật lý và chính sách bảo vệ PII (Storage & Display Level):

| Tên Cột (Column Name) | Kiểu Dữ Liệu (Data Type) | Nullable | Mặc Định | PK/FK | PII | Bảo Vệ Lưu Trữ (Storage Protection) | Bảo Vệ Hiển Thị (Display Protection) | Mô Tả (Description) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| `order_id` | `UUID` | No | `gen_random_uuid()` | PK | No | Plaintext | Plaintext | Khóa chính đơn hàng. |
| `student_id` | `UUID` | No | None | FK | No | Plaintext | Plaintext | Khóa ngoại tham chiếu đến học viên (`tbl_students`). |
| `payment_token` | `VARCHAR(255)` | Yes | None | No | Yes | Application Encrypted (AES-256) | Hidden (Ẩn hoàn toàn) | Token thẻ tín dụng nhận từ Cổng thanh toán. |
| `student_email` | `VARCHAR(150)` | No | None | No | Yes | Plaintext | Masked (`*@*`) | Email học viên (Plaintext ở DB, che khi hiển thị UI/logs). |
| `amount` | `NUMERIC(12,2)` | No | `0.00` | No | No | Plaintext | Plaintext | Giá trị đơn hàng thanh toán. |
| `created_at` | `TIMESTAMPTZ` | No | `CURRENT_TIMESTAMP` | No | No | Plaintext | Plaintext | Thời gian tạo đơn hàng. |

---

## 2. Chỉ Mục & Khóa Ngoại (Indexes & Foreign Keys)

### 2.1 Danh sách chỉ mục (Indexes)
| Tên Chỉ Mục (Index Name) | Kiểu Chỉ Mục (Type) | Cột Áp Dụng (Columns) | Unique (Y/N) | Độ Chọn Lọc (Selectivity) | Mục Đích / Giải thích |
| :--- | :---: | :--- | :---: | :---: | :--- |
| `idx_orders_student_id` | B-Tree | `student_id` | No | HIGH | Tối ưu hóa câu lệnh query tìm đơn hàng theo học viên. |
| `idx_orders_created_at` | B-Tree | `created_at DESC` | No | MEDIUM | Tối ưu hóa truy vấn sắp xếp đơn hàng mới nhất. |

### 2.2 Ràng buộc khóa ngoại (Foreign Keys)
| Tên Khóa Ngoại (FK Constraint) | Cột Cục Bộ | Bảng Tham Chiếu | Cột Tham Chiếu | On Delete | On Update |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `fk_orders_student` | `student_id` | `tbl_students` | `student_id` | RESTRICT | CASCADE |

---

## 3. Bảo Mật, PII & Vòng Đời Dữ Liệu (Security, PII & Retention Policy)

### 3.1 Chính sách bảo vệ dữ liệu nhạy cảm (PII Treatment)
*   **Danh sách cột chứa dữ liệu PII**: `payment_token`, `student_email`.
*   **Quy chuẩn tuân thủ (Compliance Tags)**: Được quy định cụ thể tại Frontmatter (ví dụ: GDPR | PCI_DSS | HIPAA).
*   **Cơ chế mã hóa**:
    - `payment_token`: Bắt buộc mã hóa mức ứng dụng (Application-level encryption) bằng khóa đối xứng AES-256 trước khi insert vào database.
    - `student_email`: Được lưu ở dạng plaintext nhưng khi xuất logs hoặc hiển thị UI mặc định phải chạy qua hàm che thông tin (Masking).

### 3.2 Vòng đời dữ liệu & Lưu trữ (Data Retention & Archiving)
*   **Thời gian lưu trữ dữ liệu nóng (Hot Storage Retention)**: 5 năm kể từ ngày giao dịch thành công.
*   **Quy trình kết thúc vòng đời (EOL Procedure)**:
    - Sau 5 năm, thực hiện chuyển đổi dữ liệu lịch sử sang kho lưu trữ lạnh (Cold Storage Archive) phục vụ đối soát thuế/kiểm toán.
    - Thực hiện xóa vĩnh viễn (Hard Delete) thông tin thẻ `payment_token` để đảm bảo tuân thủ tiêu chuẩn PCI-DSS.

---

## 4. Khối SQL DDL Machine-Readable (SQL Code Block)

Khối SQL DDL chuẩn hóa giúp các AI Agents tự động sinh migration script hoặc thiết lập cấu trúc database tự động:

```sql
-- DDL Script Example (Shown for PostgreSQL engine only)
-- DB Engine: PostgreSQL 15

CREATE TABLE tbl_orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    payment_token VARCHAR(255),
    student_email VARCHAR(150) NOT NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_orders_student 
        FOREIGN KEY (student_id) 
        REFERENCES tbl_students (student_id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Index Definitions
CREATE INDEX idx_orders_student_id ON tbl_orders(student_id);
CREATE INDEX idx_orders_created_at ON tbl_orders(created_at DESC);
```

---

## 5. Bảng Tự Kiểm Tra Chất Lượng Schema (DB DDL Validation Checklist)

- [ ] ID thực thể đúng chuẩn `BE-DB-[PROJECT]-[COMPONENT]-[NUMBER]` hoặc `CORE-BE-DB-[NAME]-V[VERSION]`.
- [ ] Khai báo thuộc tính `db_engine` đầy đủ ở Frontmatter (giới hạn các SQL Relational Database engines: PostgreSQL, MySQL, SQLite, MSSQL).
- [ ] Khai báo link `implements` trỏ chính xác về Functional Requirement (`BA-REQ`) liên quan.
- [ ] Khai báo link `depends_on` đầy đủ trỏ tới các bảng ngoại (`BE-DB`) liên quan.
- [ ] Tên bảng và cột tuân thủ naming convention của project (khuyến nghị snake_case cho cross-engine consistency).
- [ ] Xác định rõ ràng Khóa chính (Primary Key) và các Khóa ngoại (Foreign Keys) có quy định rõ hành vi khi xóa (On Delete/Update).
- [ ] Phân biệt rõ hai cột bảo vệ dữ liệu nhạy cảm PII: `Bảo Vệ Lưu Trữ (Storage)` vs `Bảo Vệ Hiển Thị (Display)`.
- [ ] Quy định cụ thể thời gian lưu trữ (Retention Period), chính sách tuân thủ (GDPR, PCI_DSS, HIPAA) ở Frontmatter và phương án xử lý dữ liệu hết hạn (Archiving/Deletion).
- [ ] Khối SQL DDL ở Mục 4 hợp lệ, chạy độc lập được, tương thích hoàn toàn với `db_engine` đã khai báo ở Frontmatter.
- [ ] **Controlled Tech Leakage Check**: Cho phép rò rỉ kiểu dữ liệu, index, constraints và cú pháp SQL nhưng tuyệt đối cấm rò rỉ thông tin hạ tầng vật lý cụ thể (DB Host, Port, Credentials, connection strings).