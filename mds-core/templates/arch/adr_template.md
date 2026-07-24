---
id: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
# COMPONENT conventions: SYS (System-wide) | AUTH | MEDIA | DATA | INFRA | BILL | ...
title: "[Tên Quyết Định Kiến Trúc]"
project: "[project-id]"
phase: "03"

# Layer 1 — Lifecycle State (độ trưởng thành nội dung)
lifecycle_state: DRAFT | REVIEW | APPROVED | DEPRECATED | ARCHIVED

# Layer 2 — Execution State (trạng thái vận hành thực tế)
execution_state: NOT_STARTED | IN_PROGRESS | BLOCKED | COMPLETED | NOT_APPLICABLE
blocked_reason: ""               # Điền chi tiết nếu execution_state = BLOCKED

# Trạng thái quyết định kỹ thuật
decision_status: PROPOSED | ACCEPTED | REJECTED | SUPERSEDED
supersedes: ""                   # ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER] (ADR bị thay thế nếu có)
superseded_by: ""                # ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER] (ADR mới thay thế nếu có)

version: X.Y.Z
owner: arch_agent
created_by: arch_agent
created_at: YYYY-MM-DD
last_updated: YYYY-MM-DD
last_synchronized: YYYY-MM-DD
tags: [adr, architecture]

# Mối quan hệ liên kết đồ thị tri thức (Outbound Links)
links:
  - type: implements             # Hiện thực hóa yêu cầu nghiệp vụ
    target: BA-REQ-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: adheres_to             # Tuân thủ ràng buộc cứng trong constraints.md
    target: ARCH-CTX-[PROJECT]-CONSTRAINTS
  - type: adheres_to             # Tuân thủ yêu cầu phi chức năng (NFR)
    target: SA-NFR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: mitigates              # Giảm thiểu rủi ro trong Risk Register
    target: PM-RSK-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: depends_on             # Phụ thuộc vào ADR khác (nếu có)
    target: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
  - type: supersedes             # Link explicit tới ADR cũ bị thay thế (nếu có)
    target: ARCH-ADR-[PROJECT]-[COMPONENT]-[NUMBER]
---

# Architectural Decision Record: [Tên Quyết Định Kiến Trúc]

## 0. Tóm Tắt Quyết Định (Decision Summary)

*   **Quyết định cuối cùng (Decision)**: [Ví dụ: Sử dụng WebRTC kết hợp LiveKit thay vì Zoom Web SDK]
*   **Trạng thái (Status)**: PROPOSED | ACCEPTED | REJECTED | SUPERSEDED (Khớp với `decision_status`)
*   **Phạm vi ảnh hưởng (Impact Scope)**: System-wide (Toàn hệ thống) | Component-specific (Đặc thù phân hệ)
*   **Chủ sở hữu (Owner)**: arch_agent

---

## 1. Bối cảnh & Bài toán (Context & Problem Statement)

[Mô tả chi tiết bối cảnh nghiệp vụ và vấn đề kỹ thuật cần giải quyết. Tại sao quyết định này cần được đưa ra ở thời điểm hiện tại? Ảnh hưởng của nó tới hệ thống ra sao?]

---

## 2. Ràng buộc & Tiêu chí Lựa chọn (Constraints & Decision Drivers)

Các yếu tố và giới hạn bắt buộc phải tuân thủ khi đánh giá phương án:

1.  **Ràng buộc cứng (Constraints)**: [Tham chiếu từ `constraints.md`, ví dụ: ngân sách hạ tầng < $300/tháng, Tech Stack bắt buộc]
2.  **Yêu cầu phi chức năng (NFRs)**: [Tham chiếu từ các `NFR` liên quan, ví dụ: độ trễ API < 200ms, Uptime > 99.9%]
3.  **Tiêu chí đánh giá (Decision Drivers)**:
    - [Tiêu chí 1: Dễ bảo trì / phát triển nhanh]
    - [Tiêu chí 2: Chi phí hạ tầng tối ưu]
    - [Tiêu chí 3: Độ an toàn bảo mật dữ liệu]

---

## 3. Các Phương Án Đánh Giá (Options Analysis)

### 3.1 Mô tả các phương án

*   **Phương án A**: [Mô tả giải pháp, cách triển khai]
*   **Phương án B**: [Mô tả giải pháp, cách triển khai]

### 3.2 Ma trận chấm điểm quyết định (Decision Scoring Matrix)

Chấm điểm theo thang điểm 1-10 cho các tiêu chí (Weighted Score = Điểm số × Trọng số):

| Tiêu chí đánh giá | Trọng số | Phương án A | Điểm A (Weighted) | Phương án B | Điểm B (Weighted) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Tiêu chí 1 (Hiệu năng) | 30% | 8 | 2.4 | 9 | 2.7 |
| Tiêu chí 2 (Chi phí) | 30% | 9 | 2.7 | 6 | 1.8 |
| Tiêu chí 3 (Độ phức tạp) | 20% | 7 | 1.4 | 5 | 1.0 |
| Tiêu chí 4 (Khả năng scale) | 20% | 8 | 1.6 | 10 | 2.0 |
| **TỔNG ĐIỂM (Weighted Score)**| **100%** | | **8.1** | | **7.5** |

---

## 4. Quyết Định & Lý Do Lựa Chọn (Decision & Rationale)

Quyết định lựa chọn phương án: **[Phương án A | Phương án B]**

### Lý do lựa chọn (Rationale):
[Giải thích chi tiết tại sao phương án này được chọn dựa trên kết quả Ma trận chấm điểm quyết định ở Mục 3. Đưa ra lập luận cụ thể về sự đánh đổi (trade-offs) đã được chấp nhận].

---

## 5. Hệ Quả & Rủi Ro Phát Sinh (Consequences & Risks)

### 5.1 Hệ quả Tích cực (Positive Consequences)
*   [Hệ quả 1: Ví dụ: Tăng hiệu năng xử lý song song]
*   [Hệ quả 2]

### 5.2 Hệ quả Tiêu cực / Ràng buộc Mới (Negative Consequences)
*   [Hệ quả 1: Ví dụ: Tăng độ phức tạp của mã nguồn]
*   [Hệ quả 2]

### 5.3 Rủi ro & Phương án Giảm thiểu (Risks & Mitigations)
*   **Rủi ro**: [Mô tả rủi ro kỹ thuật mới xuất hiện sau quyết định này]
*   **Kế hoạch giảm thiểu**: [Liên kết tới `RSK` tương ứng để theo dõi rủi ro]

---

## 6. Tác Động Triển Khai (Implementation Impact)

Quyết định này yêu cầu sửa đổi hoặc tạo mới các cấu phần tri thức sau:

*   **Tài liệu bị ảnh hưởng (Affected Artifacts)**:
    - [ ] DB Schema (`DB`): [Ví dụ: `BE-DB-EDU-AUTH-001`]
    - [ ] API Contract (`API`): [Ví dụ: `BE-API-EDU-AUTH-003`]
    - [ ] Component Spec (`SRV`): [Ví dụ: `ARCH-SRV-EDU-MEDIA-002`]
    - [ ] Runbook vận hành (`RUN`): [Ví dụ: `DEVOPS-RUN-EDU-INFRA-002`]
*   **Tác động Code (Code Changes)**: [Mô tả các module backend/frontend cần refactor]

---

## 7. Kế Hoạch Xác Thực Kiến Trúc (Architecture Validation Plan)

Quyết định này được kiểm chứng và đo lường thông qua các Test Cases (`TC`) cụ thể:

*   **Kiểm thử chức năng (Functional Verification)**:
    - Target Test Case: `QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]`
    - *Mục tiêu*: Xác thực luồng logic nghiệp vụ hoạt động đúng cam kết.
*   **Kiểm thử phi chức năng (NFR Verification)**:
    - Target Test Case: `QA-TC-[PROJECT]-[COMPONENT]-[NUMBER]`
    - *Mục tiêu*: Đo lường và kiểm chứng độ trễ / throughput đáp ứng đúng ngưỡng của `NFR`.

---

## 8. Bảng Tự Kiểm Tra Chất Lượng (ADR Quality Checklist)

*Trước khi submit review, `arch_agent` bắt buộc phải tự tích đạt 100% các tiêu chí sau:*

- [ ] Có ít nhất 2 phương án kỹ thuật được đưa ra và phân tích trade-offs chi tiết.
- [ ] Ma trận chấm điểm (Decision Scoring Matrix) đã được tính toán đầy đủ trọng số.
- [ ] Mọi liên kết hướng lên (`implements`, `adheres_to`, `mitigates`) đều đã khai báo đúng ID.
- [ ] Không có liên kết nào bị Orphan hoặc Broken Reference.
- [ ] Xác định rõ các thực thể bị ảnh hưởng trong mục Tác động triển khai (Section 6).
- [ ] Có kế hoạch và mã ID kiểm thử cụ thể trong Validation Plan (Section 7).