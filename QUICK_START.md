# MDS vNext — Hướng Dẫn Bắt Đầu Nhanh (Quick Start)

> **MDS — Master Documentation System**
> *Personal Engineering OS Setup Guide*

Hướng dẫn này giúp bạn thiết lập dự án mới và tích hợp AI Agents vào hệ điều hành kỹ nghệ MDS vNext chỉ trong vài phút.

---

## Bước 1: Khởi Tạo Dự Án Mới (Define Project Context)

Di chuyển vào thư mục `30_PROJECTS/ACTIVE/` và soạn thảo 4 file ngữ cảnh nền tảng:
1.  **`PROJECT_BRIEF.md`**: Ghi nhận mô tả tổng quan nhất về dự án, mục tiêu, khách hàng.
2.  **`BUSINESS_CONTEXT.md`**: Bối cảnh kinh doanh, các đối thủ cạnh tranh và giá trị mang lại.
3.  **`CONSTRAINTS.md`**: Các giới hạn về công nghệ, ngân sách, thời gian bàn giao và tiêu chuẩn bảo mật.
4.  **`STATUS.md`**: Báo cáo hiện trạng dự án.

---

## Bước 2: Lựa Chọn Góc Nhìn (Select Your View)

Đừng mở toàn bộ thư mục cùng lúc. Hãy truy cập vào **[90_VIEWS/SOLO_VIEW.md](90_VIEWS/SOLO_VIEW.md)**:
*   Nếu bạn đang muốn code/kiểm tra, chọn **View A (By Role)** -> Click vào vai trò tương ứng để xem danh sách tài liệu liên quan.
*   Nếu bạn đang muốn theo dõi tiến độ chung, chọn **View B (By Workflow)** -> Kiểm tra checklist của giai đoạn hiện tại.

---

## Bước 3: Nạp Tri Thức Cho AI Agents (AI Onboarding)

Khi làm việc với các AI chuyên biệt (ví dụ: BE Agent, QA Agent):
1.  Mở thư mục **[40_AI_SKILLS/AGENTS/](40_AI_SKILLS/AGENTS/)** và tìm System Prompt tương ứng cho Agent đó.
2.  Cung cấp file System Prompt này cho AI Agent của bạn. Nó sẽ tự động hiểu cách đọc/ghi các tài liệu theo đúng chuẩn tắc của MDS vNext.
3.  Nạp các file yêu cầu tương ứng tại **`30_PROJECTS/ACTIVE/REQUIREMENTS/`** làm ngữ cảnh đầu vào cho Agent.

---

## Bước 4: Kiểm Tra Tự Động Hóa (Automation Run)

Để đảm bảo hệ thống không bị lệch pha tri thức (drift) và các liên kết chéo hoạt động chính xác:
1.  Mở terminal tại thư mục gốc của dự án.
2.  Chạy script đối soát tự động:
    ```bash
    node 50_AUTOMATION/scripts/detect_drift.js
    ```
3.  Nếu có lỗi (lệch tên file, ID trùng lặp, liên kết mồ côi), linter sẽ báo cụ thể file và lỗi cần sửa.
