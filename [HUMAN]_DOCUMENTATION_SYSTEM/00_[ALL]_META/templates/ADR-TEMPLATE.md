---
id: DEC-[COMPONENT]-[NUMBER]
name: [Tên Quyết Định]
owner: ARC
status: DRAFT
version: 1.0.0
decision_type: ARCHITECTURE
impact_scope: HIGH
approval_by:
  - Human-Chief-Architect
created_at: [YYYY-MM-DD]
updated_at: [YYYY-MM-DD]
links:
  - relation: depends_on
    id: REQ-ATT-001
---

# Architectural Decision Record: [Tên Quyết Định]

## 1. Vấn đề cần giải quyết (Problem Statement)
[Mô tả chi tiết vấn đề kỹ thuật hoặc nghiệp vụ phát sinh yêu cầu cần đưa ra quyết định, các ràng buộc và tiêu chuẩn kỹ thuật liên quan.]

---

## 2. Bối cảnh & Ràng buộc (Context & Constraints)
[Mô tả bối cảnh hiện tại của hệ thống, giới hạn về tài nguyên, thời gian, ngân sách hoặc các tiêu chuẩn bảo mật bắt buộc.]

---

## 3. Các Giả định (Assumptions)
- [Giả định 1: Ví dụ về tải hệ thống, băng thông, năng lực vận hành của đội ngũ.]
- [Giả định 2: Điều kiện tiên quyết để quyết định này có hiệu lực.]

---

## 4. Phân tích các Phương án (Options Analysis)

### Phương án A: [Tên Phương Án A]
[Mô tả chi tiết cách thức triển khai phương án A.]

*   **Ưu điểm (Pros):**
    *   [Ưu điểm 1]
*   **Nhược điểm & Đánh đổi (Cons & Trade-offs):**
    *   [Nhược điểm 1]

| Tiêu chí đánh giá (Criteria) | Điểm số (Score: 1-10) | Ghi chú (Notes) |
| :--- | :--- | :--- |
| Chi phí (Cost) | | |
| Độ phức tạp (Complexity) | | |
| Khả năng mở rộng (Scalability)| | |
| Khả năng bảo trì (Maintainability)| | |

---

### Phương án B: [Tên Phương Án B]
[Mô tả chi tiết cách thức triển khai phương án B.]

*   **Ưu điểm (Pros):**
    *   [Ưu điểm 1]
*   **Nhược điểm & Đánh đổi (Cons & Trade-offs):**
    *   [Nhược điểm 1]

| Tiêu chí đánh giá (Criteria) | Điểm số (Score: 1-10) | Ghi chú (Notes) |
| :--- | :--- | :--- |
| Chi phí (Cost) | | |
| Độ phức tạp (Complexity) | | |
| Khả năng mở rộng (Scalability)| | |
| Khả năng bảo trì (Maintainability)| | |

---

## 5. Quyết định Cuối cùng (Final Decision)
[Công bố phương án được lựa chọn và trình bày lập luận logic, lý do chọn dựa trên phân tích đánh đổi ở trên.]

---

## 6. Hệ quả của Quyết định (Decision Consequences)

### Hệ quả Tích cực (Positive)
*   [Hệ quả tích cực 1: Ví dụ giảm latency, tăng bảo mật, dễ mở rộng.]

### Hệ quả Tiêu cực & Rủi ro (Negative & Risks)
*   [Hệ quả tiêu cực 1: Ví dụ tăng chi phí hạ tầng, tăng độ phức tạp vận hành.]

---

## 7. Các Phương án bị Loại bỏ (Rejected Alternatives)
*   **[Tên phương án bị loại]**: [Lý do cụ thể từ chối không lựa chọn để tránh tranh luận lại trong tương lai.]

---

## 8. Điều kiện xem xét lại (Future Revisit Conditions)
*   [Điều kiện 1: Ví dụ chi phí hạ tầng vượt quá mức X USD/tháng.]
*   [Điều kiện 2: Số lượng người dùng đồng thời vượt quá mức Y.]

---

## 9. Phân bổ và Vận hành AI (AI Agent Usage)
*   **Write (Soạn thảo):** Architect Agent + Human
*   **Read (Đọc hiểu):** All Engineering Agents (BE, FE, DevOps, QA)
*   **Validation (Đối soát):** Consistency Engine
