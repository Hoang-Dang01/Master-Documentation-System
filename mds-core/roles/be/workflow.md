# Vai Trò BE — Quy Trình Làm Việc

1. Xác nhận upstream requirement và architecture authority.
2. Tải Current Project Truth, lineage và graph relationships liên quan.
3. Phân tích contract/behavior/data impact; giữ evidence path.
4. Đề xuất validity consequence cho artifact hiện có.
5. Nếu specification phải đổi, tạo version `DRAFT` mới; không sửa approved
   version.
6. Viết specification bằng template canonical và chạy validation.
7. Trình human/technical review; không tự approve.
8. Sau approval, tạo context package để handoff sang Codex/Claude
   Code/developer.
9. Khi nhận implementation evidence, thực hiện read-only conformance review và
   ghi drift/verification result; không tự sửa implementation.
