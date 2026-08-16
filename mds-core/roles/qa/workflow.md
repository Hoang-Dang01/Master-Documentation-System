# Vai Trò QA — Quy Trình Làm Việc

1. Xác nhận expected behavior chỉ từ Current Project Truth.
2. Map requirement/contracts sang test criteria và traceability links.
3. Tạo hoặc version test artifacts ở `DRAFT`.
4. Khi upstream change được approved, đọc graph impact và đề xuất validity cho
   affected tests.
5. Trình test artifacts qua review/approval gate phù hợp.
6. Nhận evidence từ CI/developer/coding agent; kiểm tra version, thời gian và
   provenance.
7. Ghi `PASS`, `FAIL` hoặc `UNVERIFIED`; không suy diễn evidence thiếu.
8. Báo cáo DoD gaps, risk và recommendation; human sở hữu release decision.
