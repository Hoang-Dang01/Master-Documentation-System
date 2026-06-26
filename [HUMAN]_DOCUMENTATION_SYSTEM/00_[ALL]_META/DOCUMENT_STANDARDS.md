# MDS v7.0 - The 4 Canonical Rules (Hardened v1.0)

> **MDS — Master Documentation System**
> *The Hardened Constitutional & Syntactic Specification for Human-AI Collaboration*

Tài liệu này định nghĩa chi tiết ngữ pháp, quy tắc cú pháp và sơ đồ đối soát máy (Machine-Enforceable Specification) của **4 Quy tắc chuẩn tắc (4 Canonical Rules)**. Tất cả thành viên dự án và các AI Agents bắt buộc phải tuân thủ tuyệt đối. Mọi sai lệch sẽ bị pipeline CI/CD tự động từ chối và báo lỗi.

---

## RULE 1: Naming Convention (Quy ước Đặt tên Tập tin)

Mọi tập tin tài liệu trong MDS bắt buộc phải tuân theo cấu trúc cú pháp nghiêm ngặt sau:

```text
[STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension
```

### 1. Bộ từ vựng cho phép (Allowed Enums)
Để máy tính có thể phân tích tự động, các thành phần cấu thành tên file bắt buộc phải nằm trong các danh sách được định nghĩa sẵn sau:

#### A. Trạng thái cho phép (Allowed Statuses):
*   `DRAFT` (Đang soạn thảo)
*   `REVIEW` (Đang thẩm định)
*   `APPROVED` (Đã phê duyệt làm SOT)
*   `IN_PROGRESS` (Đang chỉnh sửa)
*   `DEPRECATED` (Lỗi thời/Lịch sử)
*   `ARCHIVED` (Đã lưu trữ)
*   `BLOCKED` (Tắc nghẽn)
*   `NOT_APPLICABLE` (Không áp dụng cho dự án này - Viết tắt: `N/A`)

#### B. Vai trò cho phép (Allowed Roles):
*   `ALL` (Toàn dự án / Dùng chung)
*   `PM` (Project/Product Manager)
*   `BA` (Business Analyst)
*   `SA` (System Analyst)
*   `ARC` (Solution/Enterprise Architect)
*   `DBA` (Database Administrator / DB Architect)
*   `BE` (Backend Developer)
*   `FE` (Frontend Developer)
*   `QA` (Quality Assurance / Tester)
*   `DEVOPS` (DevOps Engineer)
*   `SEC` (Security Engineer)
*   `SRE` (Site Reliability Engineer)
*   `OPS` (System Operations)
*   `AI` (AI/Data Engineer)

#### C. Phân loại tài liệu cho phép (Allowed Document Types):
*   **Business**: `BRD` (Business Requirement), `BR` (Business Rule), `KPI` (Key Metric), `STK` (Stakeholder Profile), `CTX` (Business Context).
*   **System Analysis**: `SRS` (Software Spec), `UC` (Use Case), `WF` (Workflow), `EDGE` (Edge Cases), `FSM` (State Machine), `SEQ` (Sequence Diagram), `DFD` (Data Flow Diagram).
*   **Architecture**: `SAD` (Solution Architecture), `ADR` (Architecture Decision), `MOD` (Module Design).
*   **Data**: `ERD` (Entity Relation Diagram), `DDL` (Database Schema), `MAP` (Data Mapping), `DICT` (Data Dictionary).
*   **Engineering**: `API` (API Contract), `EVT` (Event Contract), `INT` (Integration Doc).
*   **QA**: `TC` (Test Case), `UAT` (User Acceptance Test), `PERF` (Performance Test), `SEC` (Security Test).
*   **Ops**: `RUN` (Runbook/SOP), `INC` (Incident Report), `RCA` (Root Cause Analysis), `ALT` (Alert Rule), `SLO` (Service Level Objective).
*   **Delivery**: `ROAD` (Roadmap), `REL` (Release Plan), `SPR` (Sprint Plan), `OWN` (Ownership Matrix), `TSK` (Task), `BUG` (Bug Report).
*   **Intelligence**: `LOG` (AI Session Log), `CTX` (Context Capsule), `RPT` (Consistency Report).
*   **Governance**: `POL` (Governance Policy).

### 2. Định dạng Phiên bản Chuẩn tắc (Semantic Versioning - SemVer)
Hệ thống MDS và tất cả các tài liệu thực thể bắt buộc phải áp dụng quy chuẩn đặt phiên bản **SemVer (Semantic Versioning 2.0.0)** theo định dạng ba con số `v[MAJOR].[MINOR].[PATCH]` (ví dụ: `v7.0.0`, `v1.0.0`). 

Quy tắc tăng chỉ số phiên bản được tóm gọn: **"Major breaks, Minor adds, Patch fixes"**
*   **MAJOR** (Số đầu tiên - ví dụ: `1.0.0 -> 2.0.0`): Tăng khi có thay đổi lớn gây phá vỡ tính tương thích (Breaking Change). Ví dụ: Đổi cấu trúc thư mục gốc, đổi cơ chế liên kết đồ thị.
*   **MINOR** (Số ở giữa - ví dụ: `1.0.0 -> 1.1.0`): Tăng khi thêm mới tính năng, biểu mẫu (Template) hoặc tài liệu thực thể nhưng vẫn tương thích ngược (Backward-Compatible).
*   **PATCH** (Số cuối cùng - ví dụ: `1.0.0 -> 1.0.1`): Tăng khi sửa các lỗi nhỏ, typo, tinh chỉnh biểu mẫu hoặc bộ lọc regex mà không làm thay đổi thiết kế hệ thống.

*   *Hợp lệ*: `v1.0.0`, `v2.4.1`, `v7.0.0`
*   *Không hợp lệ*: `v1.0` (thiếu PATCH), `v1` (thiếu MINOR/PATCH), `V1.0.0` (chữ V viết hoa).

### 3. Biểu thức Chính quy Đối soát Tên File (Regex)
Các bộ máy CI/CD hoặc Scripts đối soát sẽ sử dụng biểu thức chính quy (PCRE Regex) sau để kiểm tra tính hợp lệ của tên file tài liệu (yêu cầu định dạng SemVer 3 chữ số bắt buộc):

```regex
^\[(DRAFT|REVIEW|APPROVED|IN_PROGRESS|DEPRECATED|ARCHIVED|BLOCKED|NOT_APPLICABLE)\]_(ALL|PM|BA|SA|ARC|DBA|BE|FE|QA|DEVOPS|SEC|SRE|OPS|AI)-[A-Z]{2,4}-\d{3}_[A-Z0-9_]+_v\d+\.\d+\.\d+\.(md|sql|yaml|json|tf|drawio|fig|png|jpg)$
```

---

## RULE 2: ID Convention (Quy chuẩn Định dạng ID Thực thể)

ID là khóa định danh độc nhất của mỗi thực thể trong Đồ thị Tri thức. Cấu trúc ID bắt buộc phải là:

```text
[TYPE]-[COMPONENT]-[NUMBER]
```
Trong đó:
*   `TYPE`: Viết hoa 3-4 ký tự tương ứng với mã thực thể (ví dụ: `REQ`, `API`, `DB`, `DEC`, `QA`, `INC`, `FIN`, `AST`, `ORG`, `ORC`, `POL`).
*   `COMPONENT`: Viết hoa 3-10 ký tự tương ứng với tên phân hệ viết tắt (ví dụ: `ATT` - Attendance, `AUTH` - Authentication, `PAY` - Payment).
*   `NUMBER`: 3 chữ số tăng dần tự động (ví dụ: `001`, `002`).

### 1. Regex Đối soát ID
Mọi ID thực thể khi khai báo trong YAML Frontmatter phải khớp với Regex sau:
```regex
^[A-Z]{3,4}-[A-Z0-9_]{3,10}-\d{3}$
```
*Ví dụ*: `REQ-ATT-001` (Hợp lệ), `API-AUTH-021` (Hợp lệ), `REQ-1` (Không hợp lệ).

### 2. Phạm vi và Xung đột ID (Counter Scope & Collision)
*   **MDS Level 2 (AI-Assisted Solo Platform)**: Bộ đếm số thứ tự ID (`NUMBER`) được áp dụng độc lập theo từng Phân hệ (`COMPONENT`). Ví dụ: `REQ-AUTH-001` và `REQ-ATT-001` có thể tồn tại song song vì chúng thuộc 2 phân hệ khác nhau. Điều này giúp lập trình viên solo và AI dễ dàng quản lý theo mô-đun mà không sợ trùng lặp số.
*   **MDS Level 3 (Enterprise Productize)**: Khi tích hợp nhiều dự án, bộ đếm ID sẽ được quản trị tập trung thông qua **System Registry (phân vùng 23)** để ngăn chặn xung đột ID chéo.

---

## RULE 3: Document Lifecycle (Vòng đời & Ma trận Trạng thái)

Vòng đời của tài liệu được quản trị nghiêm ngặt thông qua ma trận chuyển đổi trạng thái (State Transition Matrix). Tài liệu không được phép chuyển trạng thái tùy ý mà phải tuân theo quy trình được định nghĩa dưới đây.

### 1. Bảng Ma trận Chuyển đổi Trạng thái Hợp lệ
Dưới đây là ma trận quy định các trạng thái tiếp theo cho phép của một tài liệu dựa trên trạng thái hiện tại:

| Trạng thái hiện tại | Trạng thái tiếp theo hợp lệ | Mô tả |
| :--- | :--- | :--- |
| **`DRAFT`** | `REVIEW`, `NOT_APPLICABLE` | Soạn thảo xong đưa ra thẩm định hoặc đánh dấu N/A |
| **`REVIEW`** | `APPROVED`, `DRAFT`, `BLOCKED` | Phê duyệt làm SOT, hoặc từ chối về nháp, hoặc báo bế tắc |
| **`APPROVED`** | `IN_PROGRESS`, `DEPRECATED`, `ARCHIVED` | Bắt đầu sửa đổi phiên bản mới, hoặc lỗi thời, hoặc lưu trữ |
| **`IN_PROGRESS`** | `REVIEW`, `BLOCKED` | Chỉnh sửa xong đưa ra thẩm định lại, hoặc báo bế tắc |
| **`BLOCKED`** | `REVIEW`, `DRAFT` | Sau khi gỡ tắc nghẽn, đưa ra thẩm định lại hoặc trả về nháp |
| **`DEPRECATED`** | `ARCHIVED` | Đóng băng vĩnh viễn và đưa vào kho lưu trữ lịch sử |
| **`NOT_APPLICABLE`**| `DRAFT` | Kích hoạt lại tài liệu khi dự án phát sinh nhu cầu sử dụng |
| **`ARCHIVED`** | *Không có (Đầu mút cuối)* | Lưu trữ lịch sử vĩnh viễn, không thể chuyển trạng thái khác |

### 2. Khai báo YAML mẫu cho Động cơ Đối soát (Consistency Engine)
```yaml
state_machine:
  transitions:
    DRAFT: [REVIEW, NOT_APPLICABLE]
    REVIEW: [APPROVED, DRAFT, BLOCKED]
    APPROVED: [IN_PROGRESS, DEPRECATED, ARCHIVED]
    IN_PROGRESS: [REVIEW, BLOCKED]
    BLOCKED: [REVIEW, DRAFT]
    DEPRECATED: [ARCHIVED]
    NOT_APPLICABLE: [DRAFT]
    ARCHIVED: []
```

---

## RULE 4: Relationship Rules (Ma trận Liên kết Đồ thị Tri thức)

Để ngăn ngừa việc AI liên kết sai lệch các thực thể (ví dụ: tạo liên kết vòng lặp hoặc trỏ sai phân hệ), các liên kết chéo thông qua khóa `links` trong YAML Frontmatter phải tuân thủ nghiêm ngặt Ma trận Quan hệ dưới đây.

### 1. Ma trận Quan hệ Thực thể Cho phép (Entity Relationship Matrix)

| Thực thể gốc (From) | Mối quan hệ (Edge) | Thực thể đích (To) | Ràng buộc nghiệp vụ |
| :--- | :--- | :--- | :--- |
| **`REQ`** (Requirement) | `depends_on` | `REQ` | Yêu cầu nghiệp vụ phụ thuộc yêu cầu nghiệp vụ |
| **`REQ`** (Requirement) | `implements` | `API`, `DB`, `EVT` | Yêu cầu nghiệp vụ được hiện thực hóa qua API, DB, Event |
| **`REQ`** (Requirement) | `tested_by` | `QA-TC` | Yêu cầu được kiểm chứng bởi kịch bản Test Case |
| **`BR`** (Business Rule) | `depends_on` | `REQ` | Quy tắc nghiệp vụ bổ trợ cho Yêu cầu nghiệp vụ |
| **`API`** (API Contract) | `depends_on` | `REQ`, `API` | API phụ thuộc yêu cầu nghiệp vụ hoặc API khác (Gateway) |
| **`DB`** (Database Schema) | `depends_on` | `REQ`, `DB` | DB Schema phụ thuộc yêu cầu hoặc DB khác (Foreign Key) |
| **`QA-TC`** (Test Case) | `depends_on` | `REQ`, `API`, `DB` | Test Case xác thực cho Yêu cầu, API hoặc DB |
| **`BUG`** (Bug Report) | `broken_by` | `QA-TC`, `REQ`, `API`, `DB` | Lỗi phát hiện làm hỏng Test Case, Yêu cầu, API hoặc DB |
| **`INC`** (Incident) | `broken_by` | `API`, `DB`, `SRV` | Sự cố vận hành làm hỏng API, DB hoặc Dịch vụ hệ thống |
| **`FIN`** (Financial Cost) | `impacts_cost` | `DB`, `AST`, `SRV` | Chi phí phát sinh từ DB, Tài sản (Asset) hoặc Dịch vụ |
| **`DEC`** (ADR Decision) | `depends_on` | `REQ`, `DEC` | Quyết định dựa trên Yêu cầu hoặc Quyết định trước đó |

### 2. Ràng buộc Hướng của Đồ thị (Directed Acyclic Graph - DAG Constraints)
*   **Quy tắc Một chiều (One-Way Link)**: Hướng liên kết luôn đi từ Thực thể bậc cao xuống Thực thể bậc thấp (`REQ` -> `implements` -> `API`). Nghiêm cấm API khai báo ngược lại (`API` -> `implements` -> `REQ`). Việc này giúp đồ thị tri thức luôn là đồ thị có hướng không vòng lặp (DAG), giúp thuật toán truy vết tác động (Change Impact Analysis) chạy chính xác tuyệt đối.
*   **Phát hiện liên kết mồ côi (Orphan Link)**: Nếu trường `links` khai báo một ID thực thể không tồn tại trong **Master Registry (phân vùng 23)**, pipeline CI/CD sẽ lập tức đánh lỗi build.
