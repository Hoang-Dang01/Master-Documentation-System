# Hướng Dẫn Quyết Định Kiến Trúc (ADR Guide)

> **MDS — Master Documentation System**
> *Cẩm nang thiết kế và vận hành Architectural Decision Records (ADR)*

Tài liệu này định nghĩa triết lý, tiêu chuẩn và hướng dẫn chi tiết cách viết **Quyết định Kiến trúc (Architectural Decision Record - ADR)** trong hệ thống MDS. Đây là tài liệu tham chiếu cốt lõi cho cả Con người (Chief Architect) và các AI Agents.

---

## 1. Mục đích của ADR (Purpose)

**ADR (Architectural Decision Record)** là tài liệu dùng để ghi lại **các quyết định kiến trúc quan trọng** trong hệ thống. ADR không chỉ ghi lại:
> “Chúng ta chọn giải pháp gì?”

mà quan trọng hơn là ghi lại:
*   Tại sao chúng ta lại lựa chọn giải pháp đó?
*   Chúng ta đã cân nhắc những phương án thay thế nào?
*   Đánh đổi (Trade-off) kỹ thuật và tài chính là gì?
*   Các giả định ban đầu và điều kiện nào khiến quyết định này không còn đúng trong tương lai?

---

## 2. Vì sao ADR quan trọng?

Trong các dự án phần mềm, sau một thời gian vận hành, đội ngũ thường gặp các vấn đề lớn:
*   Không nhớ nổi vì sao ngày xưa lại lựa chọn công nghệ hoặc mô hình kiến trúc này.
*   Không rõ ai đã phê duyệt quyết định đó và bối cảnh lúc đó ra sao.
*   Không biết các giả định ban đầu (assumptions) là gì để đánh giá lại khi hệ thống mở rộng.
*   Lặp lại các cuộc tranh luận cũ về công nghệ do thiếu tài liệu lịch sử.

Điều này dẫn tới hiện tượng lệch pha kiến trúc (Architecture Drift), quyết định thiếu nhất quán, nợ kỹ thuật (Technical Debt) tăng cao. ADR tồn tại để giải quyết triệt để vấn đề này, đóng vai trò là **Knowledge Artifact** cấp cao thuộc nhóm **Decision Intelligence & System Governance**.

---

## 3. Khi nào bắt buộc phải tạo ADR?

Bắt buộc phải tạo và thẩm định ADR khi có quyết định liên quan đến các khía cạnh sau:

### A. Lựa chọn Công nghệ (Technology Selection)
*   *Ví dụ*: Chọn PostgreSQL vs MongoDB, LiveKit vs Jitsi Meet, Redis vs RabbitMQ, v.v.

### B. Mô hình Kiến trúc (Architecture Pattern)
*   *Ví dụ*: Monolith vs Microservices, Event-driven vs Request-response, Polling vs WebSockets.

### C. Cơ chế Bảo mật (Security Strategy)
*   *Ví dụ*: Lựa chọn chiến lược JWT, mô hình phân quyền RBAC/ABAC, thuật toán mã hóa dữ liệu.

### D. Thiết kế Cơ sở dữ liệu (Database Design)
*   *Ví dụ*: Chuẩn hóa vs Phi chuẩn hóa (Normalize vs Denormalize), chiến lược phân mảnh (Partition/Sharding), thiết kế chỉ mục nâng cao.

### E. Hạ tầng & Vận hành (Infrastructure & Ops)
*   *Ví dụ*: Kubernetes vs Docker Compose, Cloud Managed vs Self-hosted, chiến lược CDN.

---

## 4. Hướng dẫn Siêu dữ liệu & Liên kết Đồ thị (Metadata & Graph Links)

Mỗi tài liệu ADR bắt buộc phải kế thừa cấu trúc metadata từ [ADR-TEMPLATE.md](../templates/ADR-TEMPLATE.md):

### A. Thuộc tính Quản trị lõi:
*   `id`: Mã thực thể duy nhất dạng `DEC-[COMPONENT]-[NUMBER]` (Ví dụ: `DEC-ATT-001`).
*   `decision_type`: Phân loại quyết định (`TECHNOLOGY`, `ARCHITECTURE`, `SECURITY`, `INFRASTRUCTURE`, `DATABASE`, `BUSINESS_RULE`).
*   `impact_scope`: Phạm vi ảnh hưởng đối với hệ thống (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
*   `status`: Trạng thái vòng đời (`DRAFT`, `REVIEW`, `APPROVED`, `DEPRECATED`, `ARCHIVED`).

### B. Mạng lưới liên kết chéo (Traceability Graph Links):
*   `depends_on`: Chỉ định ADR phụ thuộc vào yêu cầu nghiệp vụ (`REQ`) hoặc quyết định kiến trúc (`DEC`) nào trước đó.
*   `implements`: Chỉ định quyết định này ảnh hưởng trực tiếp đến API (`API`), cơ sở dữ liệu (`DB`) hoặc dịch vụ (`SRV`) nào.
*   `tested_by`: Chỉ định kịch bản kiểm thử hiệu năng hoặc benchmark (`QA-TC`) dùng để xác thực quyết định.
*   `broken_by`: Liên kết tới sự cố vận hành (`INC`) xảy ra do quyết định này bị quá tải hoặc sai lệch thực tế.
*   `impacts_cost`: Liên kết tới dự toán chi phí tài chính (`FIN`) phát sinh từ quyết định hạ tầng này.

---

## 5. Cấu trúc 9 Mục Tiêu chuẩn của một ADR

Một ADR tiêu chuẩn bắt buộc phải điền đầy đủ 9 phần sau để đảm bảo chất lượng tri thức:

1.  **Problem Statement (Vấn đề cần giải quyết)**: Mô tả rõ ràng bài toán nghiệp vụ hoặc kỹ thuật đang gặp phải và các ràng buộc liên quan.
2.  **Context & Constraints (Bối cảnh & Ràng buộc)**: Bối cảnh hiện tại của hệ thống, thời hạn bàn giao, giới hạn ngân sách và năng lực vận hành.
3.  **Assumptions (Các Giả định)**: Các điều kiện giả định (ví dụ: lượng người dùng < 10,000, đội ngũ đã nắm vững WebRTC, v.v.). Đây là nền tảng của quyết định; nếu giả định sai, quyết định sẽ mất hiệu lực.
4.  **Options Analysis (Phân tích các Phương án)**: Liệt kê ít nhất 2 phương án so sánh. Mỗi phương án phải ghi rõ ưu điểm (Pros), nhược điểm (Cons), sự đánh đổi (Trade-offs) và bảng chấm điểm (Score 1-10) để AI có thể phân tích định lượng.
5.  **Final Decision (Quyết định Cuối cùng)**: Công bố rõ ràng giải pháp được lựa chọn và lập luận logic tại sao giải pháp đó tối ưu nhất trong bối cảnh hiện tại.
6.  **Decision Consequences (Hệ quả của Quyết định)**: Phân tích cả hệ quả tích cực (Positive) và tiêu cực (Negative) sau khi áp dụng giải pháp.
7.  **Rejected Alternatives (Các Phương án bị Loại bỏ)**: Ghi lại các phương án bị từ chối kèm lý do cụ thể để ngăn chặn việc lặp lại các tranh luận cũ trong tương lai.
8.  **Future Revisit Conditions (Điều kiện xem xét lại)**: Các chỉ số đo lường được (measurable metrics) dùng làm điểm kích hoạt đánh giá lại quyết định (Ví dụ: Chi phí hạ tầng vượt quá 5,000 USD/tháng, tỷ lệ mất gói tin > 15%).
9.  **AI Agent Usage (Phân bổ vận hành AI)**: Xác định rõ AI Agent nào có quyền soạn thảo (Write), đọc hiểu (Read) và đối soát (Validation) tài liệu này.
