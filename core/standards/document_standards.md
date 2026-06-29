# MDS vNext — Tiêu Chuẩn Tài Liệu Cốt Lõi (Document Standards)

> **MDS — Master Documentation System**
> *The 5 Canonical Rules for Human-AI Engineering Collaboration*

Tài liệu này định nghĩa chi tiết 5 quy tắc chuẩn tắc bắt buộc (Machine-Enforceable Specification) nhằm đảm bảo tính nhất quán của tri thức toàn dự án.

---

## RULE 1: Naming Convention (Quy ước đặt tên file)
Mọi file tài liệu thực thể (không bao gồm các file cấu trúc meta) bắt buộc phải tuân theo cấu trúc cú pháp sau:
```text
[STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension
```
*   `STATUS`: `[DRAFT|REVIEW|APPROVED|IN_PROGRESS|DEPRECATED|ARCHIVED|BLOCKED|NOT_APPLICABLE]`.
*   `ROLE`: `[PM|BA|SA|ARCH|BE|FE|QA|DEVOPS|AI]`.
*   `TYPE`: Mã thực thể 3-4 ký tự (ví dụ: `REQ`, `API`, `DB`, `ADR`, `QA`, `INC`, `FIN`).
*   `ID`: ID của cấu phần hoặc phân hệ kèm số đếm 3 chữ số (ví dụ: `ATT-001`).
*   `NAME`: Tên ngắn gọn viết hoa không dấu, ngăn cách bằng dấu gạch dưới (ví dụ: `USER_LOGIN`).
*   `VERSION`: Định dạng SemVer 3 chỉ số `v[MAJOR].[MINOR].[PATCH]` (ví dụ: `v1.0.0`).
*   *Ví dụ hợp lệ*: `[APPROVED]_BE-API-001_JOIN_SESSION_v1.0.0.md`.

---

## RULE 2: ID Convention (Quy chuẩn định dạng ID thực thể)
ID là khóa định danh độc nhất toàn cầu của mỗi thực thể trong Đồ thị Tri thức. Định dạng bắt buộc:
```text
[TYPE]-[COMPONENT]-[NUMBER]
```
*   `TYPE`: Viết hoa mã thực thể (ví dụ: `REQ`, `API`, `DB`, `DEC`, `QA`, `INC`, `FIN`, `AST`).
*   `COMPONENT`: Tên phân hệ viết tắt 3-10 ký tự (ví dụ: `AUTH`, `MEET`, `BILL`).
*   `NUMBER`: 3 chữ số tăng dần (ví dụ: `001`, `002`).
*   *Ví dụ hợp lệ*: `REQ-AUTH-001`, `API-MEET-002`.

---

## RULE 3: Document Lifecycle (Vòng đời tài liệu)
Trạng thái tài liệu trong YAML Frontmatter phải khớp với trạng thái trong tên file và tuân theo ma trận chuyển đổi hợp lệ:
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

## RULE 4: Relationship Rules (Quy định liên kết đồ thị)
Để thực hiện phân tích tác động (Change Impact Analysis), mọi thực thể phải khai báo liên kết hướng không vòng lặp (DAG) qua trường `links` trong YAML Frontmatter:
*   `depends_on`: Outbound link trỏ đến thực thể cấp cao hoặc phụ thuộc trực tiếp.
*   `implements`: Outbound link trỏ đến yêu cầu/thiết kế được thực hiện bởi file này.
*   `tested_by`: Inbound link trỏ đến test case xác thực cho thực thể này.
*   `broken_by`: Inbound link trỏ đến BUG/Incident làm hỏng thực thể.
*   `impacts_cost`: Outbound link trỏ đến thực thể chi phí tài chính (`FIN`).

---

## RULE 5: Template-Guide Separation (Phân tách Biểu mẫu & Hướng dẫn)
Tách biệt tri thức để tăng hiệu năng làm việc:
*   **Template (Structure)**: Biểu mẫu sạch, chỉ chứa tiêu đề đề mục chuẩn để điền dữ liệu.
*   **Guide (Knowledge)**: Sách hướng dẫn chi tiết cách viết, triết lý và tiêu chuẩn kỹ nghệ.
*   **Example (Gold Standard)**: Dự án mẫu thực tế hoàn chỉnh (lưu tại `PROJECTS/ARCHIVED/`) để AI học few-shot.
