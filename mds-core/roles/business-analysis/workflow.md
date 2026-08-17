# Business Analysis — Workflow

1. Xác nhận project runtime root, authority, source và checksum.
2. Đọc approved context, Current Project Truth và lineage liên quan.
3. Trích xuất customer statements; tách assumption/AI inference.
4. Phân tích mơ hồ, mâu thuẫn, scope impact và câu hỏi cần làm rõ.
5. Nếu chưa có artifact, tạo `DRAFT`; nếu đã có approved head, tạo version
   `DRAFT` mới với `supersedes`, không sửa bản cũ.
6. Áp dụng template/schema và chạy deterministic validation.
7. Đưa artifact vào `REVIEW` và dừng tại human requirement gate.
8. Khi có human decision, giữ approval/rejection evidence.
9. Chỉ artifact được duyệt mới làm upstream authority cho impact analysis;
   draft vẫn là reference có nhãn.
