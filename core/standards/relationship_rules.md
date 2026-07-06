# MDS vNext — Quy Tắc Liên Kết Đồ Thị (Relationship Rules)

> **MDS — Master Documentation System**
> *Quick Lookup & Reference Summary*

> ⚠️ **Source of Truth (Canonical Authority)**: Tài liệu này chỉ là tóm tắt nhanh để hỗ trợ tra cứu nhanh và onboarding.
> Nguồn gốc duy nhất và chuẩn xác nhất cho ma trận liên kết đồ thị, chuỗi truy vết DAG và Orphan Rule nằm tại:
> 👉 **[`DOCUMENT_STANDARDS.md — RULE 4: Relationship Rules`](DOCUMENT_STANDARDS.md#rule-4-relationship-rules-quy-dinh-lien-ket-do-thi)**

---

## 1. Chuỗi Truy Vết Đồ Thị Tri Thức (Traceability Graph DAG)

Để thực hiện phân tích tác động thay đổi (Change Impact Analysis), MDS quản lý các liên kết giữa các tài liệu. Mọi liên kết được định nghĩa trực tiếp trong YAML Frontmatter đều tuân theo hướng đi từ nguồn (Outbound).

### 1.1 Chuỗi Truy Vết Cốt Lõi (Primary Lineage)
Chuỗi lineage chính đi từ định hướng vĩ mô đến code và kiểm thử bắt buộc phải là **Đồ thị Hướng không Vòng lặp (DAG)**:

```text
CTX (Bối cảnh) ──► BRD (Tài liệu nghiệp vụ BRD) ──► FLOW/UC (Quy trình/Kịch bản UC) ──► REQ/NFR (Yêu cầu chi tiết) ──► ADR/DEC (Quyết định) ──► HLD/SEC (Thiết kế tổng thể) ──► API/DB/UI (Thiết kế chi tiết) ──► TSK (Task) ──► CODE/PR ──► TC (Test Cases)
```

### 1.2 Cạnh Phản Hồi (Feedback Edges)
Các mối quan hệ vận hành hoặc chẩn đoán phụ trợ (như `broken_by` hay `resolves` khi có BUG/INC) được phép tạo ra các cạnh phản hồi (feedback edges / loops) để phản ánh thực tế sự cố, nhưng tuyệt đối không được phá vỡ tính phân cấp cốt lõi của chuỗi lineage chính.

---

## 2. Các Loại Liên Kết Cho Phép (Allowed Edges)

> *Nguyên tắc đồ thị*: Mọi loại link khai báo trong YAML Frontmatter đều được lưu ở dạng **Outbound** (từ tài liệu hiện tại trỏ ra ngoài). Graph Engine sẽ tự động tính toán các liên kết ngược (Inbound) khi phân tích.

| Loại link | Hướng khai báo | Ý nghĩa | Ví dụ thực tế |
| :--- | :--- | :--- | :--- |
| `depends_on` | Outbound | Phụ thuộc trực tiếp vào thực thể khác cùng cấp | `PM-TSK-EDU-AUTH-015` trỏ tới `PM-TSK-EDU-AUTH-014` |
| `implements` | Outbound | Hiện thực hóa yêu cầu hoặc thiết kế cấp trên | `BA-REQ-EDU-AUTH-001` trỏ tới `BA-BRD-EDU-001` |
| `adheres_to` | Outbound | Tuân thủ quyết định kiến trúc / ràng buộc cứng / quy tắc | `BA-REQ-EDU-AUTH-001` trỏ tới `BA-BR-EDU-AUTH-005` |
| `verifies` | Outbound | Kiểm chứng yêu cầu nghiệp vụ / thiết kế kỹ thuật | `QA-TC-EDU-AUTH-044` trỏ tới `BA-REQ-EDU-AUTH-001` |
| `validates_nfr` | Outbound | Kiểm chứng yêu cầu phi chức năng (NFR) | `QA-TC-EDU-SYS-010` trỏ tới `SA-NFR-EDU-SYS-001` |
| `tested_by` | Outbound | Được kiểm chứng/test bởi TC nào | `SA-NFR-EDU-SYS-001` trỏ tới `QA-TC-EDU-SYS-010` |
| `mitigates` | Outbound | Giảm thiểu rủi ro trong Risk Register | `ARCH-ADR-MDS-INFRA-003` trỏ tới `PM-RSK-MDS-PROJ-001` |
| `broken_by` | Outbound | Bị phá hỏng hoặc phát hiện lỗi bởi | `BE-API-EDU-AUTH-001` trỏ tới `QA-BUG-EDU-AUTH-002` |
| `resolves` | Outbound | Giải quyết triệt để lỗi hoặc sự cố | `commit` hoặc `PR` trỏ tới `QA-BUG-EDU-AUTH-002` |
| `linked_tsk` | Outbound | Code/PR liên kết với Task thực thi | `commit` trỏ tới `PM-TSK-EDU-AUTH-014` |
| `impacts_cost` | Outbound | Ảnh hưởng đến chi phí tài chính | `ARCH-SRV-MDS-CORE-002` trỏ tới `PM-FIN-MDS-INFRA-001` |
| `produces` | Outbound | Sinh ra các tài liệu thiết kế hoặc task con | `ARCH-HLD-EDU-SYS-001` trỏ tới `BE-API-EDU-AUTH-001` |
| `synthesizes` | Outbound | Tổng hợp các quyết định kiến trúc đơn lẻ | `ARCH-HLD-EDU-SYS-001` trỏ tới `ARCH-ADR-EDU-INFRA-001` |
| `references` | Outbound | Tham chiếu tài liệu/tiêu chuẩn bên ngoài | `ARCH-SEC-EDU-AUTH-001` trỏ tới `EXT-REF-OWASP-ASVS` |
| `supersedes` | Outbound | Thay thế quyết định/tài liệu cũ hơn | `ARCH-ADR-EDU-AUTH-002` trỏ tới `ARCH-ADR-EDU-AUTH-001` |
| `elaborates` | Outbound | Chi tiết hóa / làm rõ cho yêu cầu khác | `BA-FLOW-EDU-AUTH-001` trỏ tới `BA-REQ-EDU-AUTH-001` |
| `includes` | Outbound | Nhúng hành vi của Use Case con bắt buộc | `BA-UC-EDU-BILL-001` trỏ tới `BA-UC-EDU-AUTH-001` |
| `extends` | Outbound | Mở rộng hành vi của Use Case cơ sở | `BA-UC-EDU-BILL-002` trỏ tới `BA-UC-EDU-BILL-001` |

---

## 3. Orphan Entity Rule (Thực Thể Mồ Côi - Định Nghĩa Mạnh Mẽ)

Một thực thể bị coi là **Orphan Entity (Mồ côi)** khi thỏa mãn bất kỳ điều kiện nào sau đây:

1. **Trường hợp A (Missing Link)**: Thiếu liên kết ngược (upstream link) bắt buộc hướng tới thực thể cấp trên (ví dụ: một API contract không có `implements` hoặc `adheres_to` trỏ về REQ/ADR nào).
2. **Trường hợp B (Broken Reference)**: Link khai báo trỏ tới một thực thể không tồn tại hoặc viết sai ID.
3. **Trường hợp C (Invalid Target)**: Upstream link trỏ tới một thực thể có trạng thái không hợp lệ:
   - Trỏ tới target đã bị `DEPRECATED`.
   - *Lưu ý về `ARCHIVED`*: Target đã bị `ARCHIVED` được phép liên kết cho mục đích truy vết lịch sử (historical traceability), nhưng cấm dùng làm cơ sở cho chuỗi lineage phát triển/vận hành active mới.

**Cưỡng chế chất lượng**: KC Agent (Knowledge Curator) chạy quét đồ thị định kỳ, phát hiện và **block** không cho phép chuyển trạng thái `lifecycle_state` sang `APPROVED` đối với các thực thể mồ côi.