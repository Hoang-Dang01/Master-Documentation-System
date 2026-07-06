# MDS vNext — Quy Tắc Quản Lý Phiên Bản (Versioning Rules)

> **MDS — Master Documentation System**
> *Quick Lookup & Reference Summary*

> ⚠️ **Source of Truth (Canonical Authority)**: Tài liệu này chỉ là tóm tắt nhanh để hỗ trợ tra cứu nhanh và onboarding.
> Nguồn gốc duy nhất và chuẩn xác nhất cho quy ước phiên bản và tương tác trạng thái vòng đời nằm tại:
> 👉 **[`DOCUMENT_STANDARDS.md — RULE 1 (SemVer) & RULE 3 (Lifecycle)`](DOCUMENT_STANDARDS.md#rule-1-naming-convention-quy-uoc-dat-ten-file)**

---

## 1. Mối Liên Kết Giữa Phiên Bản và Vòng Đời (Lifecycle-Driven Versioning)

MDS áp dụng nguyên tắc quản lý phiên bản nghiêm ngặt dựa trên trạng thái của tài liệu để tránh trôi dạt tri thức (Knowledge Drift):

*   **Tài liệu `DRAFT` / `REVIEW`**: Phiên bản có thể chứa các tag nháp (ví dụ: `v0.1.0-draft`, `v1.0.0-rc1`) hoặc tăng patch nhỏ tự do trong quá trình soạn thảo.
*   **Tài liệu `APPROVED`**: Đóng băng phiên bản chính thức (ví dụ: `v1.0.0`). Tài liệu lúc này là **Read-only**.
*   **Chỉnh sửa tài liệu đã `APPROVED`**: Cấm sửa trực tiếp. Để thay đổi, bắt buộc phải:
    1. Nhân bản tài liệu thành một file mới.
    2. Thiết lập trạng thái `lifecycle_state: DRAFT` và `execution_state: IN_PROGRESS`.
    3. Tăng số phiên bản (Bump version) dựa theo mức độ thay đổi (SemVer) dưới đây trước khi gửi review lại.
    4. Khi file mới được `APPROVED`, file cũ sẽ tự động chuyển sang trạng thái `DEPRECATED`.

> ### 🧩 Canonical Version Invariant
> Tại bất kỳ thời điểm nào, đối với mỗi dòng lịch sử tài liệu (lineage) của một thực thể, bắt buộc phải thỏa mãn điều kiện bất biến sau:
> ```pseudo
> count(
>   artifact_versions
>   where lifecycle_state == APPROVED
> ) == 1
> ```
> Chỉ duy nhất một phiên bản được giữ trạng thái `APPROVED`. Quyết định `APPROVED` phiên bản mới đồng nghĩa với việc chuyển trạng thái của phiên bản cũ sang `DEPRECATED`.


---

## 2. Quy Tắc Tăng Phiên Bản (SemVer Bump Rules)

Cú pháp SemVer áp dụng cho tài liệu tri thức có định dạng: `v[MAJOR].[MINOR].[PATCH]`

### 2.1 BUMP MAJOR (Ví dụ: v1.0.0 ──► v2.0.0)
Tăng chữ số đầu tiên khi có thay đổi lớn gây phá vỡ tính tương thích ngược (Breaking Change) của tài liệu thiết kế hoặc kiến trúc.
*   **Về mặt nghiệp vụ**: Thay đổi toàn bộ mục tiêu của `CTX`, thay đổi lớn trong luồng nghiệp vụ cốt lõi `REQ`.
*   **Về mặt kỹ thuật**: Thay đổi hoàn toàn cơ chế của API (đổi URL, đổi cấu trúc payload bắt buộc), restructure hoàn toàn bảng dữ liệu trong `DB` schema.
*   *Ví dụ*: Đổi cơ chế auth từ Session sang OAuth2 trên `BE-API-EDU-AUTH-001` làm đứt gãy code Frontend hiện tại.

### 2.2 BUMP MINOR (Ví dụ: v1.0.0 ──► v1.1.0)
Tăng chữ số ở giữa khi bổ sung thông tin mới, tính năng mới hoặc đặc tả mới nhưng vẫn đảm bảo tương thích ngược (Backward Compatible).
*   **Về mặt nghiệp vụ**: Bổ sung một tính năng hoặc rule phụ trợ vào `REQ` / `BR` hiện có.
*   **Về mặt kỹ thuật**: Thêm endpoint API mới, thêm một trường dữ liệu (nullable/optional column) vào database schema `DB` mà không ảnh hưởng code cũ.
*   *Ví dụ*: Thêm trường `last_login_at` vào bảng User trong `BE-DB-EDU-AUTH-001`.

### 2.3 BUMP PATCH (Ví dụ: v1.0.0 ──► v1.0.1)
Tăng chữ số cuối cùng khi chỉ sửa lỗi nhỏ, lỗi chính tả, hoặc làm rõ nghĩa câu từ mà tuyệt đối không làm thay đổi logic thiết kế hay nghiệp vụ gốc.
*   **Mô tả**: Sửa lỗi typo, bổ sung ví dụ minh họa JSON response, cập nhật link tham chiếu bị hỏng, làm rõ mô tả tham số.
*   *Ví dụ*: Sửa lỗi chính tả trong phần mô tả của `BA-REQ-EDU-AUTH-001`.