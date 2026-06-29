# MDS vNext — Lược Đồ Vòng Đời Dự Án (Lifecycle Schema)

Định nghĩa vòng đời 6 giai đoạn phát triển phần mềm chuẩn tắc và các điểm kiểm soát chất lượng (Quality Gates).

## 6 Giai Đoạn Vòng Đời

1.  **Giai Đoạn 1: Discovery (Khai Phá)**:
    *   *Mục tiêu*: Làm rõ Customer Intent, biên bản họp và yêu cầu thô.
    *   *Quality Gate*: Phê duyệt `PROJECT_BRIEF.md`.
2.  **Giai Đoạn 2: Analysis (Phân Tích)**:
    *   *Mục tiêu*: Đặc tả quy trình Business Flows và các luật nghiệp vụ Business Rules.
    *   *Quality Gate*: Phê duyệt đặc tả yêu cầu `REQ`.
3.  **Giai Đoạn 3: Design (Thiết Kế)**:
    *   *Mục tiêu*: Thiết kế cấu trúc cơ sở dữ liệu (DDL), Hợp đồng API, quyết định ADR và giao diện UI.
    *   *Quality Gate*: Phê duyệt database schema `DB` và api contract `API`.
4.  **Giai Đoạn 4: Implementation (Xây Dựng)**:
    *   *Mục tiêu*: Backend và Frontend Agent đồng thời sinh code từ API/DB contract đã duyệt.
    *   *Quality Gate*: Code review và build thành công.
5.  **Giai Đoạn 5: Testing (Kiểm Thử)**:
    *   *Mục tiêu*: QA Agent viết và chạy các test cases để tìm BUG.
    *   *Quality Gate*: 100% Critical Test Cases pass, không còn blocking bugs.
6.  **Giai Đoạn 6: Deployment (Triển Khi)**:
    *   *Mục tiêu*: Deploy code lên Production, cấu hình Dashboard giám sát, Alert Rules và SLOs.
    *   *Quality Gate*: Hệ thống hoạt động ổn định trên môi trường thực tế, check list giám sát hoàn tất.