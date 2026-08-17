---
ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
actor_type: customer-stakeholder
classification: external_actor
model_ref: ./actor-model.md
registry_ref: ./actor-registry.yaml
update_strategy: extend only through an approved governed workflow
---

# Customer / Stakeholder

## 1. Mục đích

`Customer / Stakeholder` là External Actor Type chuẩn hiện tại của MDS.

Actor type này đại diện cho một con người hoặc tổ chức nằm ngoài professional responsibility model của MDS nhưng có quan hệ thực tế với project thông qua:

* nhu cầu;
* mục tiêu;
* vấn đề;
* kiến thức nghiệp vụ;
* ràng buộc;
* xác nhận;
* phản hồi;
* yêu cầu thay đổi.

`Customer / Stakeholder` phải tuân theo toàn bộ semantics và invariants được định nghĩa trong `actor-model.md`.

File này chỉ định nghĩa những đặc điểm riêng của Actor Type `customer-stakeholder`.

---

# 2. Phạm vi của Actor Type

MDS sử dụng `Customer / Stakeholder` như một classification cấp cao để biểu diễn các bên bên ngoài có liên quan đến project.

Một project thực tế có thể có nhiều dạng stakeholder khác nhau, chẳng hạn:

* khách hàng;
* người sử dụng;
* người sở hữu nghiệp vụ;
* chuyên gia nghiệp vụ;
* đơn vị vận hành;
* đơn vị tài trợ;
* đối tác;
* bên chịu ảnh hưởng.

Các khác biệt này không tự động tạo Actor Type canonical mới.

Trong đa số trường hợp, chúng nên được biểu diễn bằng metadata của Actor Instance trong project data.

Nguyên tắc:

> MDS chỉ tách Actor Type mới khi sự khác biệt đó làm thay đổi semantic hoặc cách hệ thống xử lý knowledge.

---

# 3. Vai trò của Customer / Stakeholder đối với project

Customer / Stakeholder là một trong những nguồn kết nối quan trọng giữa:

```text
THẾ GIỚI THỰC
      │
      ▼
Customer / Stakeholder
      │
      ▼
Source Information
      │
      ▼
MDS Professional Responsibilities
```

Actor này không có nhiệm vụ tạo specification kỹ thuật.

Vai trò chính là cung cấp thông tin về:

* điều đang xảy ra trong thực tế;
* điều cần thay đổi;
* điều được mong muốn;
* điều đang gây vấn đề;
* điều cần được giữ lại;
* điều chưa đáp ứng;
* điều đã thay đổi so với trước.

---

# 4. Các loại thông tin có thể cung cấp

## 4.1. Intent

Mục tiêu hoặc kết quả mà actor muốn đạt được.

Intent mô tả:

> Actor muốn điều gì thay đổi trong thế giới thực?

Intent chưa phải Requirement.

---

## 4.2. Problem

Vấn đề, khó khăn hoặc kết quả không mong muốn hiện đang tồn tại.

MDS phải giữ rõ sự khác biệt:

```text
Problem
≠
Proposed Solution
```

Customer / Stakeholder có thể đề xuất giải pháp, nhưng giải pháp đó phải tiếp tục được đánh giá bởi professional responsibilities phù hợp.

---

## 4.3. Need

Khả năng hoặc kết quả mà actor cần để giải quyết một vấn đề hoặc đạt một mục tiêu.

Need thường nằm giữa:

```text
Problem
   ↓
Need
   ↓
Requirement
```

Việc chuyển Need thành Requirement thuộc professional analysis.

---

## 4.4. Process Knowledge

Thông tin về cách nghiệp vụ hoặc công việc thực tế đang diễn ra.

Có thể bao gồm:

* ai tham gia;
* công việc diễn ra theo trình tự nào;
* điều kiện để chuyển bước;
* trường hợp ngoại lệ;
* quy tắc đang được áp dụng;
* cách xử lý thủ công;
* vấn đề trong quy trình hiện tại.

Process Knowledge là source input.

Nó chưa phải System Specification.

---

## 4.5. Constraint

Ràng buộc thực tế mà project cần biết.

Ví dụ về loại constraint:

* nghiệp vụ;
* tổ chức;
* pháp lý;
* vận hành;
* thời gian;
* dữ liệu;
* chính sách.

Constraint mô tả điều project phải xem xét.

Nó không tự quyết định cách kỹ thuật sẽ đáp ứng constraint đó.

---

## 4.6. Clarification

Thông tin bổ sung được cung cấp để làm rõ một điểm chưa xác định.

Clarification có thể xuất hiện khi một professional role phát hiện:

* ambiguity;
* missing information;
* conflict;
* assumption cần kiểm chứng.

---

## 4.7. Confirmation

Customer / Stakeholder có thể xác nhận rằng một mô tả hoặc interpretation phản ánh đúng hiểu biết của họ.

Confirmation chỉ có giá trị trong context và phạm vi phù hợp.

Việc confirmation có trở thành approval hay authoritative decision hay không được quyết định bởi governance và authority model.

---

## 4.8. Feedback

Feedback có thể liên quan đến:

* proposal;
* requirement;
* prototype;
* thiết kế;
* implementation;
* trải nghiệm sử dụng;
* hệ thống đang vận hành;
* kết quả thực tế.

Feedback là source information mới và có thể kích hoạt phân tích tiếp theo.

---

## 4.9. Change Request

Change Request cho biết một phần của nhu cầu, mục tiêu, quy trình, rule hoặc mong muốn đã thay đổi.

Ví dụ conceptual:

```text
Current understanding
        │
        ▼
New stakeholder information
        │
        ▼
Potential Change
        │
        ▼
Governed Change Analysis
```

Change Request không trực tiếp sửa Project Truth.

---

# 5. Customer và Stakeholder

MDS hiện gom hai khái niệm này vào cùng một Actor Type.

## Customer

Thường có quan hệ trực tiếp với nhu cầu hoặc kết quả mà product/project phải tạo ra.

Có thể:

* yêu cầu sản phẩm;
* tài trợ sản phẩm;
* đại diện cho nhu cầu business;
* nhận kết quả từ project.

## Stakeholder

Là khái niệm rộng hơn.

Một Stakeholder có thể:

* có kiến thức quan trọng;
* chịu ảnh hưởng;
* ảnh hưởng đến quyết định;
* cần được tham vấn;
* cung cấp feedback;
* tham gia xác nhận.

MDS không mặc định:

```text
Customer
=
Stakeholder có authority cao nhất
```

hoặc:

```text
Stakeholder
=
Customer
```

Chi tiết quan hệ phải được biểu diễn ở Actor Instance hoặc authority model tương ứng.

---

# 6. Quan hệ với Quản lý sản phẩm

Các input như:

* problem;
* need;
* intent;
* product feedback;
* feature request;
* product-level change request;

thường được chuyển tới trách nhiệm `product-management`.

Mục tiêu của bước này là đánh giá:

* vấn đề có thuộc sản phẩm không;
* vấn đề có đáng giải quyết không;
* giá trị kỳ vọng là gì;
* mức độ ưu tiên;
* phạm vi sơ bộ.

Luồng khái niệm:

```text
Customer / Stakeholder
        │
        │ problem / intent / need
        ▼
Product Management
```

Customer / Stakeholder không tự quyết định Product Boundary hoặc priority chỉ bằng việc đưa ra yêu cầu.

---

# 7. Quan hệ với Phân tích nghiệp vụ

Các input như:

* process knowledge;
* business information;
* rule description;
* clarification;
* exception;
* business feedback;

thường được chuyển tới `business-analysis`.

BA chịu trách nhiệm:

* làm rõ;
* cấu trúc hóa;
* phát hiện ambiguity;
* phát hiện conflict;
* xác định business rule;
* tạo requirement proposal.

Luồng khái niệm:

```text
Customer / Stakeholder
        │
        │ process knowledge
        │ business information
        ▼
Business Analysis
```

Customer / Stakeholder không phải Requirement Author.

---

# 8. Yêu cầu kỹ thuật do Stakeholder đề xuất

Customer / Stakeholder có thể đề xuất một giải pháp kỹ thuật.

MDS phải giữ đề xuất đó như một source statement hoặc constraint candidate.

Ví dụ conceptual:

```text
Stakeholder says:
"Use technology X."
        │
        ▼
Preserved Source
        │
        ▼
Relevant Technical Analysis
        │
        ▼
Technical Decision
```

Không được chuyển trực tiếp:

```text
Stakeholder suggestion
        ↓
Architecture Truth
```

trừ khi governance model xác định rõ actor đó đồng thời giữ authority phù hợp.

---

# 9. Tương tác hai chiều

Customer / Stakeholder không chỉ là nguồn input một chiều.

Professional responsibilities có thể quay lại actor để:

* hỏi thêm thông tin;
* xác minh interpretation;
* giải quyết ambiguity;
* làm rõ conflict;
* yêu cầu phản hồi;
* xác nhận outcome.

```text
Customer / Stakeholder
        ↓
       MDS
        ↓
Professional Analysis
        ↓
Question / Clarification Request
        ↓
Customer / Stakeholder
```

MDS phải hỗ trợ việc giữ liên kết giữa câu hỏi và câu trả lời tương ứng.

---

# 10. Mâu thuẫn giữa Stakeholder

Nhiều Customer / Stakeholder có thể cung cấp thông tin khác nhau về cùng một chủ đề.

Trong trường hợp đó, MDS phải áp dụng conflict semantics từ `actor-model.md`.

Riêng đối với Customer / Stakeholder, professional analysis nên xác định khi có thể:

* chủ đề đang mâu thuẫn;
* stakeholder nào cung cấp từng statement;
* knowledge context của từng stakeholder;
* authority reference nếu tồn tại;
* câu hỏi cần làm rõ;
* quyết định nào đang bị block.

Không được suy luận rằng stakeholder có chức danh cao hơn luôn đúng.

Authority phải được xác định riêng.

---

# 11. Feedback và Change Loop

Customer / Stakeholder có thể tạo ra vòng lặp thay đổi trong suốt vòng đời project.

```text
Need / Problem
     ↓
Product & Business Analysis
     ↓
Project Truth
     ↓
Implementation
     ↓
Runtime / Usage
     ↓
Feedback
     ↓
Customer / Stakeholder
     ↓
New Change Input
     ↺
```

Vì vậy `Customer / Stakeholder` không chỉ thuộc giai đoạn khởi đầu của project.

Actor type này có thể tiếp tục tương tác trong toàn bộ vòng đời.

---

# 12. Customer / Stakeholder không sở hữu các concern sau

File này không trao cho Customer / Stakeholder quyền sở hữu mặc định đối với:

```text
Product priority
→ product-management/

Business requirement analysis
→ business-analysis/

System behaviour
→ system-analysis/

Architecture
→ architecture-tech-lead/

Implementation
→ implementation-plane/

Approval authority
→ authorities/

Runtime evidence
→ runtime/
```

Một Actor Instance có thể đồng thời giữ professional responsibility hoặc approval authority khác, nhưng các classification phải được mô hình hóa độc lập.

---

# 13. Type-specific invariants

Các invariant chung của External Actor được kế thừa từ `actor-model.md`.

`Customer / Stakeholder` bổ sung các invariant đặc thù sau.

### CUSTOMER-STAKEHOLDER-INV-001

Một yêu cầu hoặc đề xuất từ Customer / Stakeholder không tự động trở thành Product Decision.

### CUSTOMER-STAKEHOLDER-INV-002

Một phát biểu về nghiệp vụ không tự động trở thành Requirement.

### CUSTOMER-STAKEHOLDER-INV-003

Một đề xuất kỹ thuật từ Customer / Stakeholder không tự động trở thành Technical Decision.

### CUSTOMER-STAKEHOLDER-INV-004

Customer / Stakeholder phải có thể tham gia clarification và feedback loop sau lần cung cấp input ban đầu.

### CUSTOMER-STAKEHOLDER-INV-005

Sự khác biệt giữa các loại stakeholder trong một project nên được biểu diễn bằng project metadata trước khi tạo thêm Actor Type canonical.

---

# 14. Ownership Boundary

File này sở hữu semantic đặc thù của Actor Type:

```text
customer-stakeholder
```

Nó kế thừa External Actor semantics từ:

```text
actor-model.md
```

Nó không sở hữu:

```text
External Actor general invariants
→ actor-model.md

Canonical Actor Type list
→ actor-registry.yaml

Professional responsibilities
→ roles/

Approval authority
→ authorities/

Actor data schema
→ schemas/

Governance rules
→ standards/

Workflow behaviour
→ workflows/

Implementation
→ implementation-plane/

Runtime evidence
→ runtime/
```

Nguyên tắc:

> Type definition chỉ định nghĩa điều làm Actor Type đó khác biệt; luật chung phải được kế thừa từ Actor Model thay vì sao chép lại.

---

# 15. Nguyên tắc mở rộng

Không chia `Customer / Stakeholder` thành nhiều Actor Type canonical chỉ vì ngoài đời tồn tại nhiều chức danh hoặc bộ phận khác nhau.

Ưu tiên:

```text
Một Actor Type
+
Project-specific metadata
```

trước:

```text
Nhiều Actor Type canonical
```

Chỉ mở rộng khi semantic thực sự khác và thay đổi đó đã đi qua governed workflow.
