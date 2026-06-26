# MDS (Master Documentation System) — AI-Native Engineering OS

> **MDS — Master Documentation System**
> *Canonical Standard & Design Philosophy for AI-Assisted Solo Engineering (Level 2)*

Chào mừng bạn đến với **MDS v7.0.0 — Canonical Standard Edition**. Đây không đơn thuần là một bộ thư mục chứa tài liệu, mà là một **Hệ thống Quản trị Tri thức Kỹ thuật (Engineering Knowledge Operating System)**. MDS đóng vai trò là "bộ não thứ hai" (Second Brain) và không gian điều khiển (Control Plane) cho sự hợp tác tối ưu giữa Con người (Human Orchestrator) và Trí tuệ nhân tạo (AI Agents).

---

## 1. Mục Tiêu Cốt Lõi của MDS

MDS được thiết kế để giải quyết triệt để 3 mục tiêu lớn trong kỹ nghệ phần mềm:

### 🎯 Goal 1 — Giảm phụ thuộc vào trí nhớ con người
Trong các dự án phức tạp, một cá nhân hoặc đội ngũ không thể duy trì và ghi nhớ toàn bộ thông tin về:
*   Yêu cầu nghiệp vụ (Business Requirements)
*   Quyết định kiến trúc (Architecture Decisions - ADR)
*   Sơ đồ cơ sở dữ liệu (Database Schemas)
*   Hợp đồng API (API Contracts)
*   Sự cố vận hành (Incidents & RCA)
*   Lịch sử thay đổi hệ thống (Historical Changes)

MDS đóng vai trò là kho lưu trữ tri thức có cấu trúc, giúp giải phóng băng thông não bộ của con người.

### 🎯 Goal 2 — Tăng chất lượng cộng tác Human + AI
AI chỉ thực sự mạnh mẽ và chính xác khi được cung cấp ngữ cảnh (Context) chất lượng cao. Nếu thông tin đầu vào rời rạc, thiếu nhất quán, mơ hồ hoặc thiếu chuẩn hóa, AI sẽ rơi vào hiện tượng ảo giác (Hallucination), hiểu sai nghiệp vụ và tạo ra nợ kỹ thuật (Technical Debt). MDS chuẩn hóa thông tin để cung cấp context sạch và chuẩn tắc cho AI.

### 🎯 Goal 3 — Giảm thiểu việc "quên những thứ đáng lẽ phải nhớ"
MDS không hướng tới việc loại bỏ 100% mọi sai sót phát sinh trong tương lai. Mục tiêu tối thượng của MDS là đảm bảo chúng ta không bao giờ bỏ quên các khía cạnh trọng yêu của hệ thống:
*   An ninh bảo mật (Security)
*   Giám sát và đo lường (Monitoring & Observability)
*   Kế hoạch khôi phục (Rollback Plans)
*   Thiết kế cơ sở dữ liệu (DB Design)
*   Kịch bản kiểm thử (Test Cases)

---

## 2. Tư Duy Thiết Kế Cốt Lõi

### ⚖️ Rule Zero — Every new abstraction must solve a real pain
Mỗi thư mục, biểu mẫu (Template), lược đồ (Schema), quy tắc (Rule) hay động cơ (Engine) được đưa vào MDS bắt buộc phải giải quyết một nỗi đau thực tế (Real Pain Point) trong quá trình phát triển hoặc vận hành. Nếu không chứng minh được giá trị giải quyết nỗi đau thực tế, tuyệt đối không thêm vào để tránh bẫy Over-Engineering.

### 🔍 Phân loại 2 nhóm vấn đề trong dự án:
1.  **Type A — Predictable Problems (Vấn đề có thể dự đoán trước)**: Thiếu tài liệu nghiệp vụ, thiếu sơ đồ DB, sai lệch hợp đồng API, thiếu kịch bản QA, thiếu hệ thống giám sát. Đây là lỗi thiết kế và MDS có nhiệm vụ **triệt tiêu tối đa** nhóm này.
2.  **Type B — Runtime Discovery Problems (Vấn đề chỉ phát hiện khi vận hành)**: Trải nghiệm người dùng (UX) chưa tối ưu, quy tắc nghiệp vụ phát sinh theo thị trường, hành vi khách hàng thay đổi, quá tải hệ thống đột ngột. Đây là các vấn đề vận hành bình thường, MDS không thể xóa bỏ hoàn toàn nhưng giúp hệ thống **thích ứng nhanh nhất**.

---

## 3. Kiến Trúc 3 Core Engines

Hệ thống vận hành dựa trên 3 phân vùng động cơ cốt lõi:

```text
                     ┌────────────────────────────────────────┐
                     │     MDS Engineering Operating System   │
                     └───────────────────┬────────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
┌──────────────────┐           ┌──────────────────┐            ┌──────────────────┐
│   Human Layer    │           │   System Layer   │            │     AI Layer     │
│  (Engine 1: Doc) │           │ (Engine 2: Graph)│            │(Engine 3:Context)│
└────────┬─────────┘           └────────┬─────────┘            └────────┬─────────┘
         │                              │                               │
         ▼                              ▼                               ▼
- Giúp Human hiểu hệ thống.    - Giúp System hiểu mối liên kết. - Cung cấp Context cho AI.
- Discovery, BA docs,          - Đăng ký thực thể (Registries). - Hộp ngữ cảnh (Capsules).
  Workflows, Architecture,     - Đồ thị phụ thuộc (Dependencies)- Nhiệm vụ hàng ngày,
  QA & Operations.             - Phân tích tác động (Impact).   - Nhật ký kiểm toán.
```

1.  **Engine 1 — Documentation System (Human Layer)**: Dành cho con người đọc và làm chủ hệ thống. Chứa toàn bộ tài liệu từ BA, thiết kế kiến trúc, kịch bản QA đến cẩm nang vận hành.
2.  **Engine 2 — Knowledge Graph (System Layer)**: Dành cho máy tính suy luận nghiệp vụ. Quản lý danh mục đăng ký (Registries) và sơ đồ liên kết vết (Traceability Graph) giữa các thực thể: `Requirement -> API -> Database -> Test Case -> Bug`.
3.  **Engine 3 — Context Engine (AI Layer)**: Dành cho AI thực thi công việc. Đóng gói các hộp ngữ cảnh (Context Capsules), lập lịch nhiệm vụ hàng ngày (Daily Missions) và lưu vết nhật ký kiểm toán (AI Worklogs).

---

## 4. Triết Lý Chuẩn Tắc Toàn Cầu (Canonical Standard)

MDS được thiết kế như một **Universal Superset Standard (Chuẩn siêu tập hợp vạn năng)**. Cấu trúc thư mục chứa đựng tất cả các miền tri thức có thể có trong mọi dự án công nghệ (từ AI, Tài chính, Bảo mật đến SRE).

### 🚫 Never Delete Folders Rule (Quy tắc Không bao giờ xóa thư mục)
Nếu một dự án cụ thể không sử dụng đến một phân vùng nghiệp vụ nào đó (ví dụ: không có cấu phần AI hoặc không sử dụng tài chính):
*   **KHÔNG ĐƯỢC XÓA** thư mục đó khỏi cấu trúc chuẩn.
*   Tiến hành đánh dấu trạng thái tài liệu hoặc mô-đun đó là: `status: NOT_APPLICABLE` đi kèm lý do cụ thể (`reason: <why>`).

> **Triết lý**: Một thư mục bị biến mất tạo ra sự mơ hồ (Ambiguity). Một thư mục tồn tại nhưng được đánh dấu không áp dụng rõ ràng đại diện cho tri thức hiển ngôn (Explicit Knowledge). AI xử lý tri thức hiển ngôn tốt hơn rất nhiều so với sự mơ hồ.

---

## 5. Kiến Trúc Thư Mục Gốc & 4 File Cốt Lõi

Hệ thống được tổ chức thành cấu trúc 2 cấp tinh gọn với **4 Super-Folders** và **4 Root Files**:

### 📂 4 Super-Folders:
*   [[HUMAN]_DOCUMENTATION_SYSTEM]([HUMAN]_DOCUMENTATION_SYSTEM/): Phân vùng tài liệu nghiệp vụ dành cho con người đọc và viết (`00` đến `22`).
*   [[SYSTEM]_KNOWLEDGE_GRAPH]([SYSTEM]_KNOWLEDGE_GRAPH/): Phân vùng liên kết đồ thị thực thể dành cho hệ thống phân tích (`23` đến `27`).
*   [[AI]_CONTEXT_ENGINE]([AI]_CONTEXT_ENGINE/): Phân vùng không gian làm việc và nạp bối cảnh cho AI Agents (`28` đến `90`).
*   [[ARCHIVE]]([ARCHIVE]/): Phân vùng đóng băng và lưu trữ lịch sử hệ thống (`99`).

### 📄 4 Root Files ("Core Quartet"):
1.  [README.md](README.md): Tài liệu này - Bản hiến pháp và triết lý thiết kế tối cao của MDS.
2.  [STRUCTURE.md](STRUCTURE.md): Bản đồ cây thư mục ASCII chi tiết toàn bộ hệ thống.
3.  [TEMPLATES.md](TEMPLATES.md): Chỉ mục tổng hợp các biểu mẫu tài liệu chuẩn hóa trong dự án.
4.  [ENTITY_SCHEMA.md](ENTITY_SCHEMA.md): Phân loại và sơ đồ định nghĩa các thực thể tri thức chuẩn tắc.

---

## 6. 4 Quy Tắc Hiến Pháp (4 Canonical Rules)

Mọi hoạt động cập nhật tri thức trên MDS bắt buộc phải tuân thủ tuyệt đối 4 quy tắc được đặc tả chi tiết tại [DOCUMENT_STANDARDS.md]([HUMAN]_DOCUMENTATION_SYSTEM/00_[ALL]_META/DOCUMENT_STANDARDS.md):

1.  **Rule 1 — Naming Convention**: Đặt tên file theo cú pháp nghiêm ngặt để máy tính có thể phân tích tự động: `[STATUS]_ROLE-TYPE-ID_NAME_vVERSION.extension` (ví dụ: `[APPROVED]_BA-REQ-001_ATTENDANCE_v1.0.md`).
2.  **Rule 2 — ID Convention**: Mọi thực thể phải được gắn một ID độc nhất toàn cầu theo định dạng `[TYPE]-[COMPONENT]-[NUMBER]` (ví dụ: `REQ-ATT-001`). ID này hoạt động như các nút (Nodes) trong Đồ thị Tri thức.
3.  **Rule 3 — Document Lifecycle**: Trạng thái tài liệu phải tuân thủ nghiêm ngặt ma trận chuyển đổi trạng thái: `DRAFT -> REVIEW -> APPROVED -> IN_PROGRESS -> DEPRECATED -> ARCHIVED`.
4.  **Rule 4 — Relationship Rules**: Các liên kết chéo giữa các thực thể phải tuân thủ ma trận quan hệ cho phép và tuân theo cấu trúc đồ thị hướng không vòng lặp (DAG - Directed Acyclic Graph) để phục vụ phân tích tác động thay đổi (Change Impact Analysis).

---

## 7. Khái Niệm Phân Biệt: Structure vs Template vs Entity

Để tránh nhầm lẫn trong quá trình thiết kế hệ thống tri thức:
*   **Structure (Cấu trúc)**: Trả lời câu hỏi *"Thông tin nằm ở đâu?"* (Ví dụ: Yêu cầu nghiệp vụ nằm trong thư mục `01_REQUIREMENTS`).
*   **Template (Biểu mẫu)**: Trả lời câu hỏi *"Thông tin được viết như thế nào?"* (Ví dụ: File yêu cầu nghiệp vụ phải có mục Tóm tắt, Quy tắc nghiệp vụ và Tiêu chí nghiệm thu).
*   **Entity Schema (Lược đồ thực thể)**: Trả lời câu hỏi *"Thông tin này bản chất là gì trong đồ thị hệ thống?"* (Ví dụ: Một `Requirement` là một thực thể nghiệp vụ có các mối quan hệ `implements` tới `API` và `tested_by` tới `Test Case`).

---

## 8. Tầm Nhìn Phát Triển Lộ Trình (Level Progression)

*   **Level 1 — Personal Knowledge System**: Hệ thống quản lý tri thức cá nhân đơn thuần, phục vụ cho một kỹ sư ghi nhớ dự án.
*   **Level 2 — AI-Assisted Solo Engineering Platform**: Hệ thống hợp tác 1 Con người + Đội ngũ AI chuyên biệt (Target hiện tại của MDS).
    *   *Human Role*: Kiến trúc sư trưởng (Chief Architect) & Người ra quyết định cuối cùng (Final Decision Maker).
    *   *Strategic AI Partner*: Đối tác đồng thiết kế hệ thống (Design Partner) & Người thẩm định tri thức (Reviewer).
    *   *Execution AI Workers*: Các AI Agents chuyên môn hóa thực thi các nhiệm vụ cụ thể (BA, Architect, Backend, Frontend, QA, DevOps).
*   **Level 3 — Product Platform (SaaS)**: Chuyển hóa MDS thành một sản phẩm phần mềm thương mại tích hợp Cổng thông tin (Web Portal), Đồ thị cơ sở dữ liệu tri thức (Graph Database) và Công cụ điều phối AI tự động (Multi-tenant AI Orchestrator).

---

## 9. Nguyên Lý Hành Động Cuối Cùng (Final Principle)

> **Information Architecture solves AI better than Prompt Engineering.**
> *(Kiến trúc thông tin giải quyết bài toán AI tốt hơn kỹ nghệ viết prompt).*

Một prompt xuất sắc không bao giờ có thể cứu vãn được một tập ngữ cảnh tồi tệ, rời rạc và nhiễu loạn. Ngược lại, một cấu trúc thông tin hoàn hảo giúp các prompt đơn giản nhất cũng mang lại hiệu năng thực thi mã nguồn cực kỳ chính xác và đồng nhất.

MDS không cần phải đạt tới sự hoàn hảo tuyệt đối trước khi đưa vào sử dụng. Quy trình phát triển chuẩn tắc là:
```text
Design (Thiết kế) -> Use (Sử dụng) -> Detect Pain (Phát hiện nỗi đau) -> Refine (Cải tiến) -> Harden (Đóng băng/Hóa đá)
```

MDS là một **Mô hình Vận hành Kỹ nghệ AI-Native (AI-Native Engineering Operating Model)** tối hậu. Hãy luôn vận hành theo đúng chu trình:
1.  Con người tư duy sâu sắc (Human thinks deeply).
2.  MDS cấu trúc hóa tri thức (MDS structures knowledge).
3.  AI thực thi mã nguồn và kiểm thử (AI executes tasks).
4.  Con người thẩm định kết quả (Human validates output).
5.  MDS lưu trữ và kế thừa bài học kinh nghiệm (MDS preserves learning).
