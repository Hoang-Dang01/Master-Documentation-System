# MDS vNext — Tiêu Chuẩn Tài Liệu Cốt Lõi (Document Standards)

> **MDS — Master Documentation System**
> *The 5 Canonical Rules for Human-AI Engineering Collaboration*

Tài liệu này định nghĩa chi tiết 5 quy tắc chuẩn tắc bắt buộc (Machine-Enforceable Specification) nhằm đảm bảo tính nhất quán của tri thức toàn dự án.

> **Authority**: Đây là tài liệu **meta-governance** cấp cao nhất của MDS. Mọi schema khác (`workflow_schema`, `entity_schema`, `role_schema`) tham chiếu và tuân thủ các quy tắc được định nghĩa tại đây.

---

## RULE 1: Naming Convention (Quy ước đặt tên file)

Mọi file tài liệu thực thể (không bao gồm các file cấu trúc meta) bắt buộc phải tuân theo cấu trúc cú pháp sau để đảm bảo không bị lẫn lộn giữa các dự án trong môi trường multi-project:

```text
[LIFECYCLE_STATE]_ROLE-TYPE-PROJECT-COMPONENT-NUMBER_NAME_vVERSION.extension
```

*   `LIFECYCLE_STATE`: Trạng thái trưởng thành của tài liệu (xem RULE 3):
    `[DRAFT|REVIEW|APPROVED|DEPRECATED|ARCHIVED]`
*   `ROLE`: Vai trò sở hữu tài liệu:
    `[PM|BA|SA|ARCH|BE|FE|QA|DEVOPS|ORCH|KC]`
    > *Lưu ý*: `ORCH` = Orchestrator Agent, `KC` = Knowledge Curator Agent.
*   `TYPE`: Mã thực thể 2-4 ký tự viết hoa:
    `[CTX|FSB|BRD|FLOW|UC|REQ|BR|NFR|ADR|HLD|SEC|API|DB|SRV|UI|DEC|TSK|TC|BUG|REL|INC|RUN|FIN|RSK]`
*   `PROJECT`: Mã dự án viết tắt 3-5 ký tự viết hoa (ví dụ: `EDU` - EduMeet, `MED` - Medstand, `MDS` - MDS Core).
*   `COMPONENT`: Tên phân hệ viết tắt 3-10 ký tự viết hoa (ví dụ: `AUTH`, `MEET`, `BILL`).
*   `NUMBER`: 3 chữ số đếm tăng dần (ví dụ: `001`, `002`).
*   `NAME`: Tên ngắn gọn viết hoa không dấu, ngăn cách bằng dấu gạch dưới (ví dụ: `USER_LOGIN`).
*   `VERSION`: Định dạng SemVer 3 chỉ số `v[MAJOR].[MINOR].[PATCH]` (ví dụ: `v1.0.0`).

*Ví dụ hợp lệ*:
```text
[APPROVED]_BE-API-EDU-AUTH-001_LOGIN_ENDPOINT_v1.0.0.md
[DRAFT]_SA-NFR-MED-SYS-002_LATENCY_BUDGET_v0.1.0.md
[REVIEW]_PM-RSK-MDS-PROJ-001_INFRA_COST_RISK_v1.0.0.md
```

---

## RULE 2: ID Convention (Quy chuẩn định dạng ID thực thể)

ID là khóa định danh độc nhất toàn cầu của mỗi thực thể trong Đồ thị Tri thức. Định dạng bắt buộc:

```text
ROLE-TYPE-PROJECT-COMPONENT-NUMBER
```

*   `ROLE`: Prefix vai trò sở hữu (ví dụ: `PM`, `BA`, `SA`, `ARCH`, `BE`, `FE`, `QA`, `OPS`).
*   `TYPE`: Mã thực thể viết hoa đầy đủ danh sách 24 loại:

| TYPE | Mô tả | Owner Prefix |
| :--- | :--- | :--- |
| `CTX` | Project Context | `PM-`, `BA-`, `ARCH-` |
| `FSB` | Feasibility Study | `PM-` |
| `BRD` | Business Requirements Document | `BA-` |
| `FLOW` | Process Flow | `BA-` |
| `UC` | Use Case | `BA-` |
| `REQ` | Requirement | `BA-` |
| `BR` | Business Rule | `BA-` |
| `NFR` | Non-Functional Requirement | `SA-` |
| `ADR` | Architecture Decision | `ARCH-` |
| `HLD` | High-Level Design | `ARCH-` |
| `SEC` | Security Specification | `ARCH-` |
| `API` | API Contract | `SA-` / `BE-` |
| `DB` | Database Schema | `SA-` / `BE-` |
| `SRV` | Service/Component | `ARCH-` |
| `UI` | UI Spec/Wireframe | `FE-` |
| `DEC` | Decision Log | `ARCH-` |
| `TSK` | Task | `PM-` |
| `TC` | Test Case | `QA-` |
| `BUG` | Bug Report | `QA-` |
| `REL` | Release | `PM-` |
| `INC` | Incident Report | `DEVOPS-` |
| `RUN` | Runbook | `DEVOPS-` |
| `FIN` | Financial Cost | `PM-` |
| `RSK` | Risk Register | `PM-` |

*   `PROJECT`: Mã dự án viết tắt 3-5 ký tự viết hoa (ví dụ: `EDU`, `MED`, `MDS`).
*   `COMPONENT`: Tên phân hệ viết tắt 3-10 ký tự viết hoa (ví dụ: `AUTH`, `MEET`, `BILL`).
*   `NUMBER`: 3 chữ số tăng dần (ví dụ: `001`, `002`).

*Ví dụ hợp lệ*:
```text
BA-REQ-EDU-AUTH-001    →  Requirement #1 của module Authentication trong dự án EduMeet
SA-NFR-MED-SYS-002     →  Non-Functional Req #2 của phân hệ System trong dự án Medstand
ARCH-ADR-MDS-INFRA-003 →  Architecture Decision #3 về Infrastructure trong dự án MDS Core
QA-TC-EDU-AUTH-044     →  Test Case #44 của module Auth trong dự án EduMeet
PM-RSK-MDS-PROJ-001    →  Risk #1 của toàn dự án MDS Core
```

---

## RULE 3: Document Lifecycle — Hybrid Layered State Model

MDS áp dụng mô hình **2 lớp trạng thái** tách biệt để phân biệt rõ **độ trưởng thành** và **trạng thái vận hành** của một artifact. Cả hai phải được khai báo trong YAML Frontmatter.

### 3.1 Layer 1 — Lifecycle State (Trạng thái Trưởng thành)

Đo lường mức độ hoàn chỉnh và phê duyệt của nội dung tài liệu:

```yaml
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED
```

```yaml
lifecycle_state_machine:
  transitions:
    DRAFT:      [REVIEW]
    REVIEW:     [APPROVED, DRAFT]   # Reject quay về DRAFT
    APPROVED:   [DEPRECATED]        # Thay đổi nội dung → tạo version mới, không edit trực tiếp
    DEPRECATED: [ARCHIVED]
    ARCHIVED:   []                  # Terminal state
```

| State | Ý nghĩa | Quyền chỉnh sửa |
| :--- | :--- | :--- |
| `DRAFT` | Đang soạn thảo | Agent tự do chỉnh sửa |
| `REVIEW` | Đang chờ phê duyệt | Cấm thay đổi nội dung |
| `APPROVED` | Có hiệu lực pháp lý | Chỉ được tạo version mới |
| `DEPRECATED` | Lỗi thời, bị thay thế | Read-only |
| `ARCHIVED` | Lưu trữ lịch sử | Read-only, không dùng ra quyết định |

### 3.2 Layer 2 — Execution State (Trạng thái Vận hành)

Đo lường trạng thái hoạt động thực tế của artifact trong pipeline:

```yaml
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
```

```yaml
execution_state_machine:
  transitions:
    NOT_STARTED:    [IN_PROGRESS, NOT_APPLICABLE]
    IN_PROGRESS:    [COMPLETED, BLOCKED]
    BLOCKED:        [IN_PROGRESS]           # Sau khi unblock
    COMPLETED:      [IN_PROGRESS]           # Nếu cần rework
    NOT_APPLICABLE: []                      # Terminal state
```

| State | Ý nghĩa | Dùng cho |
| :--- | :--- | :--- |
| `NOT_STARTED` | Chưa bắt đầu xử lý | TSK, TC, INC mới tạo |
| `IN_PROGRESS` | Đang thực hiện | TSK đang code, TC đang chạy |
| `BLOCKED` | Bị chặn bởi dependency | TSK chờ decision, ADR chờ stakeholder |
| `COMPLETED` | Đã hoàn tất xử lý | TSK merged, TC passed |
| `NOT_APPLICABLE` | Không áp dụng cho loại artifact này | CTX, FSB (dùng lifecycle_state là đủ) |

### 3.3 Ví dụ kết hợp 2 lớp

```yaml
# Task đang bị kẹt dependency
lifecycle_state: APPROVED        # Nội dung TSK đã được PM duyệt
execution_state: BLOCKED         # Nhưng đang chờ ARCH decision
blocked_reason: "Waiting for ARCH-ADR-INFRA-003 to be APPROVED"

# API đang được implement
lifecycle_state: APPROVED        # Contract đã được SA phê duyệt
execution_state: IN_PROGRESS     # BE Agent đang viết code

# Risk không còn liên quan
lifecycle_state: DEPRECATED      # Đã có RSK mới thay thế
execution_state: NOT_APPLICABLE
```

---

## RULE 4: Relationship Rules (Quy định liên kết đồ thị)

Để thực hiện phân tích tác động (Change Impact Analysis) và duy trì chuỗi truy vết toàn diện (End-to-End Traceability):
1. **Chuỗi truy vết cốt lõi (Primary Forward Traceability Chain)** bắt buộc phải là đồ thị hướng không vòng lặp (DAG). 
2. Các liên kết chẩn đoán phụ trợ (như `broken_by`, `resolves`, v.v.) có thể tạo ra các cạnh phản hồi (feedback edges / loops) để phục vụ cho việc vận hành nhưng tuyệt đối không được phá vỡ tính phân cấp cốt lõi của chuỗi lineage.

Mọi loại link khai báo trực tiếp trong YAML Frontmatter đều tuân theo hướng đi từ nguồn (Outbound).

| Loại link | Hướng khai báo | Ý nghĩa | Ví dụ |
| :--- | :--- | :--- | :--- |
| `depends_on` | Outbound | Phụ thuộc vào thực thể khác cùng cấp | `PM-TSK-EDU-AUTH-015` trỏ tới `PM-TSK-EDU-AUTH-014` |
| `implements` | Outbound | Hiện thực hóa yêu cầu/thiết kế cấp trên | `BE-API-EDU-AUTH-001` trỏ tới `BA-REQ-EDU-AUTH-001` |
| `adheres_to` | Outbound | Tuân thủ quyết định kiến trúc/ràng buộc | `BE-API-EDU-AUTH-001` trỏ tới `ARCH-ADR-EDU-INFRA-001` |
| `verifies` | Outbound | Xác thực/kiểm thử thực thể khác | `QA-TC-EDU-AUTH-044` trỏ tới `BA-REQ-EDU-AUTH-001` |
| `validates_nfr` | Outbound | Kiểm thử và xác thực phi chức năng | `QA-TC-EDU-SYS-010` trỏ tới `SA-NFR-EDU-SYS-001` |
| `tested_by` | Outbound | Được kiểm chứng/test bởi TC nào | `SA-NFR-EDU-SYS-001` trỏ tới `QA-TC-EDU-SYS-010` |
| `broken_by` | Outbound | Bị lỗi bởi BUG/INC nào | `BE-API-EDU-AUTH-001` trỏ tới `QA-BUG-EDU-AUTH-002` |
| `impacts_cost` | Outbound | Ảnh hưởng đến chi phí tài chính | `ARCH-SRV-MDS-CORE-002` trỏ tới `PM-FIN-MDS-INFRA-001` |
| `resolves` | Outbound | Giải quyết lỗi/sự cố | `commit` hoặc `PR` trỏ tới `QA-BUG-EDU-AUTH-002` |
| `linked_tsk` | Outbound | Code/PR liên kết với Task | `commit` trỏ tới `PM-TSK-EDU-AUTH-014` |
| `produces` | Outbound | Sinh ra tài liệu thiết kế/task con | `ARCH-HLD-EDU-SYS-001` trỏ tới `BE-API-EDU-AUTH-001` |
| `synthesizes` | Outbound | Tổng hợp các quyết định kiến trúc đơn lẻ | `ARCH-HLD-EDU-SYS-001` trỏ tới `ARCH-ADR-EDU-INFRA-001` |
| `references` | Outbound | Tham chiếu tài liệu/tiêu chuẩn bên ngoài | `ARCH-SEC-EDU-AUTH-001` trỏ tới `EXT-REF-OWASP-ASVS` |
| `supersedes` | Outbound | Thay thế quyết định/tài liệu cũ hơn | `ARCH-ADR-EDU-AUTH-002` trỏ tới `ARCH-ADR-EDU-AUTH-001` |
| `elaborates` | Outbound | Chi tiết hóa / làm rõ cho yêu cầu khác | `BA-FLOW-EDU-AUTH-001` trỏ tới `BA-REQ-EDU-AUTH-001` |
| `includes` | Outbound | Nhúng hành vi của Use Case con bắt buộc | `BA-UC-EDU-BILL-001` trỏ tới `BA-UC-EDU-AUTH-001` |
| `extends` | Outbound | Mở rộng hành vi của Use Case cơ sở dưới điều kiện | `BA-UC-EDU-BILL-002` trỏ tới `BA-UC-EDU-BILL-001` |

**Orphan Rule (Định nghĩa mạnh mẽ)**: Một thực thể bị coi là **Orphan Entity (Mồ côi)** khi thỏa mãn bất kỳ điều kiện nào sau đây:
- **Trường hợp A (Missing Link)**: Thiếu liên kết ngược (upstream link) bắt buộc hướng tới thực thể cấp trên (ví dụ: `API` không có `implements` hoặc `adheres_to`).
- **Trường hợp B (Broken Reference)**: Link trỏ tới một thực thể không tồn tại hoặc viết sai ID.
- **Trường hợp C (Invalid Target)**: Upstream link trỏ tới thực thể có trạng thái `lifecycle_state` không hợp lệ:
  - Trỏ tới target đã bị `DEPRECATED`.
  - *Lưu ý về `ARCHIVED`*: Cho phép liên kết với target `ARCHIVED` cho mục đích truy vết lịch sử (historical traceability), nhưng cấm dùng làm cơ sở cho chuỗi lineage phát triển/vận hành active mới.

KC Agent (Knowledge Curator) chạy quét đồ thị định kỳ, phát hiện và **block** không cho phép duyệt `APPROVED` đối với bất kỳ thực thể mồ côi nào.

---

## RULE 5: Template-Guide Separation (Phân tách Biểu mẫu & Hướng dẫn)

Tách biệt tri thức để tối ưu hóa hiệu năng làm việc của cả Con người và AI Agent:

*   **Template (Structure)**: Biểu mẫu sạch, chỉ chứa tiêu đề đề mục chuẩn và YAML Frontmatter để điền dữ liệu. Agent nhận Template không cần đọc Guide.
*   **Guide (Knowledge)**: Sách hướng dẫn chi tiết cách viết, triết lý và tiêu chuẩn kỹ nghệ. Dùng để onboard người mới và train AI.
*   **Example (Gold Standard)**: Dự án mẫu thực tế hoàn chỉnh (lưu tại `projects/archived/`) để AI học few-shot. Đây là nguồn dữ liệu huấn luyện quan trọng nhất.

**Nguyên tắc tách**:

| Loại | Nằm ở | Độ dài tối đa | Cập nhật khi nào |
| :--- | :--- | :--- | :--- |
| Template | `core/templates/` | < 50 dòng | Khi thay đổi cấu trúc |
| Guide | `core/guides/` | Không giới hạn | Khi có best practice mới |
| Example | `projects/archived/` | Toàn bộ project | Sau mỗi dự án hoàn thành |
