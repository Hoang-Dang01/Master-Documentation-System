# MDS vNext — Quy Tắc Vòng Đời Tài Liệu (Lifecycle Rules)

Vòng đời của tài liệu được quản lý thông qua ma trận trạng thái để đảm bảo con người và AI luôn biết tài liệu nào đã sẵn sàng hoạt động.

## Các Trạng Thái & Ý Nghĩa

1.  **DRAFT**: Tài liệu đang trong giai đoạn phác thảo ban đầu, chưa được review.
2.  **REVIEW**: Đã hoàn thành phác thảo sơ bộ, đang chờ thẩm định chéo hoặc kiểm tra tính đúng đắn.
3.  **APPROVED**: Tài liệu đã được duyệt, hoạt động như là "Nguồn Truth duy nhất" (Single Source of Truth) để triển khai code/test cases.
4.  **IN_PROGRESS**: Đang trong quá trình chỉnh sửa, bổ sung để chuẩn bị tăng phiên bản.
5.  **BLOCKED**: Bị tắc nghẽn, không thể duyệt do thiếu thông tin hoặc phụ thuộc bị lỗi.
6.  **DEPRECATED**: Đã lỗi thời, không còn giá trị áp dụng trực tiếp cho dự án hiện tại nhưng được lưu giữ để tham chiếu.
7.  **ARCHIVED**: Đóng băng và chuyển vào lưu trữ lịch sử vĩnh viễn.
8.  **NOT_APPLICABLE**: Được đánh dấu là không áp dụng cho dự án hiện tại kèm theo lý do cụ thể.