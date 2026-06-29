# MDS vNext — Quy Tắc Quản Lý Phiên Bản (Versioning Rules)

Quy chuẩn phiên bản SemVer 3 chỉ số (`MAJOR.MINOR.PATCH`) giúp kiểm soát sự biến đổi của tri thức và thiết kế hệ thống.

## Quy Tắc Tăng Phiên Bản

### 1. BUMP MAJOR (Ví dụ: 1.0.0 -> 2.0.0)
Tăng chữ số đầu tiên khi có thay đổi lớn gây phá vỡ tính tương thích (Breaking Change) trong thiết kế hệ thống.
*   **Ví dụ**: Thay đổi hoàn toàn cơ chế xác thực từ JWT sang OAuth2, cấu trúc bảng dữ liệu cốt lõi bị restructure hoàn toàn.

### 2. BUMP MINOR (Ví dụ: 1.0.0 -> 1.1.0)
Tăng chữ số ở giữa khi bổ sung tính năng mới, trường dữ liệu mới hoặc phần đặc tả mới nhưng vẫn tương thích ngược.
*   **Ví dụ**: Thêm column mới vào database schema, thêm endpoint API mới, thêm một business rule mới.

### 3. BUMP PATCH (Ví dụ: 1.0.0 -> 1.0.1)
Tăng chữ số cuối cùng khi sửa các lỗi nhỏ, lỗi chính tả, hoặc làm rõ câu từ mà không làm thay đổi logic thiết kế.
*   **Ví dụ**: Sửa lỗi typo mô tả API, bổ sung ví dụ minh họa JSON response.