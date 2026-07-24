# MDS — Quy ước đặt tên Human-first

> Nguồn chuẩn đầy đủ:
> [`document_standards.md — RULE 1`](document_standards.md)

## Nguyên tắc

> **Tên hiển thị dành cho con người. ID và metadata dành cho hệ thống.
> Tên file chỉ là chi tiết lưu trữ.**

Mỗi artifact có ba lớp tên độc lập:

| Lớp | Trường | Mục đích | Ví dụ |
|---|---|---|---|
| Hiển thị | `title` | Người dùng đọc trong app và tài liệu | `Đào tạo mô hình phát hiện URL` |
| Định danh | `id` | Liên kết, traceability và automation | `BE-SRV-EDU-AI-001` |
| Lưu trữ | filename | Đường dẫn ổn định, dễ đọc | `dao-tao-mo-hinh-phat-hien-url.md` |

## Quy tắc filename

Filename của artifact:

```text
<human-readable-slug>.<extension>
```

Slug bắt buộc:

- viết thường;
- chỉ dùng ký tự ASCII `a-z`, số `0-9` và dấu gạch ngang `-`;
- bắt đầu và kết thúc bằng chữ hoặc số;
- không có hai dấu gạch ngang liên tiếp;
- tối đa 80 ký tự, không tính extension;
- mô tả nội dung, không mô tả trạng thái lưu trữ.

Ví dụ tốt:

```text
dao-tao-mo-hinh-phat-hien-url.md
thiet-ke-api-chi-tiet-phieu.md
phan-quyen-tai-xe.md
kiem-thu-chuc-nang-qr.md
```

Không đưa những thông tin sau vào filename:

```text
[APPROVED]  DRAFT  REVIEW  FINAL  LATEST  UPDATED
v1.0.0      BE     BA      QA     DEVOPS
```

Các file hệ thống có tên ổn định như `project_brief.md`,
`business_context.md`, `constraints.md` và `status.md` là ngoại lệ được
validator nhận biết. Template files và generated files không phải project
artifact nên không chịu quy tắc slug này.

## Metadata bắt buộc

```yaml
---
id: BE-SRV-EDU-AI-001
title: Đào tạo mô hình phát hiện URL
project: edumeet
lifecycle_state: APPROVED
version: 1.0.0
owner: dev_agent
---
```

- `id` là khóa ổn định; đổi filename không được làm đổi ID.
- `title` là tên hiển thị tự nhiên, không thêm tiền tố như `REQ:`, `SRV:` hay ID.
- `project` dùng project id trong `workspace/projects/index.yaml`.
- `lifecycle_state`, `version` và `owner` chỉ nằm trong metadata.
- Liên kết `implements`, `depends_on`, `tested_by` và các quan hệ khác dùng ID,
  không dùng filename.

## Quy tắc hiển thị trong desktop app

Chế độ mặc định chỉ hiển thị:

```text
Đào tạo mô hình phát hiện URL
Đã duyệt · Phiên bản 1.0.0 · Backend
```

Chế độ kỹ thuật mới hiển thị thêm:

```text
BE-SRV-EDU-AI-001
dao-tao-mo-hinh-phat-hien-url.md
```

Đổi filename là thao tác lưu trữ. Đổi `title` là thay đổi nội dung hiển thị.
Đổi `id` là migration định danh và phải cập nhật toàn bộ quan hệ.
