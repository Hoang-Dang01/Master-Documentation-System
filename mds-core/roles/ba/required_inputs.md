# Vai Trò BA — Đầu Vào Cần Thiết

## Bắt buộc

- Approved project context và constraints từ
  `MDS_DATA_DIR/projects/active/<project-id>/`.
- Source document/change request đã bảo toàn cùng checksum, thời gian và source
  reference.
- `mds-core/standards/document_standards.md`.
- `mds-core/standards/artifact_truth.md`.
- Template BA phù hợp trong `mds-core/templates/ba/`.
- Current Project Truth và lineage head hiện tại nếu artifact đã tồn tại.

## Khi phân tích thay đổi

- Graph relationships và evidence path hiện có.
- Prior versions, approval record và change rationale.
- Scope/priority decision đã được duyệt nếu thay đổi ảnh hưởng commitment.

Thiếu nguồn hoặc authority phải được ghi thành câu hỏi/blocker, không được tự
điền bằng suy luận.
