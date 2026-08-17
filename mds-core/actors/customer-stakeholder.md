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
------------------------------------------------------------------

# Customer / Stakeholder

## 1. Mục đích

`Customer / Stakeholder` là External Actor chuẩn hiện tại của MDS.

Actor type này đại diện cho một con người hoặc tổ chức nằm ngoài professional responsibility model của MDS nhưng có quan hệ thực tế với project thông qua một hoặc nhiều hình thức:

* có nhu cầu hoặc mục tiêu liên quan đến sản phẩm;
* có kiến thức về nghiệp vụ hoặc quy trình thực tế;
* chịu ảnh hưởng bởi sản phẩm hoặc thay đổi của sản phẩm;
* cung cấp phản hồi;
* cung cấp yêu cầu thay đổi;
* tham gia làm rõ hoặc xác nhận thông tin;
* có thể đồng thời giữ một approval authority nếu được governance model gán riêng.

`Customer / Stakeholder` không phải một professional role và không phải một AI agent.

---

# 2. Phạm vi của actor type

`Customer / Stakeholder` là một classification cấp cao.

MDS không yêu cầu ngay từ đầu phải chia External Actor thành nhiều loại nhỏ như:

* customer;
* end user;
* business owner;
* domain expert;
* sponsor;
* partner;
* operator.

Những khác biệt này có thể được biểu diễn ở project data khi cần.

Chỉ tạo Actor Type canonical mới nếu classification hiện tại không còn đủ để biểu diễn semantic cần thiết của MDS.

Nguyên tắc:

> Không mô hình hóa cơ cấu tổ chức chi tiết hơn mức cần thiết để MDS hiểu project.

---

# 3. Customer và Stakeholder

Trong actor type này:

## Customer

Là người hoặc tổ chức có nhu cầu trực tiếp đối với sản phẩm, dịch vụ hoặc kết quả của project.

Customer có thể là bên:

* yêu cầu sản phẩm;
* tài trợ;
* sử dụng kết quả;
* đại diện cho nhu cầu business.

## Stakeholder

Là khái niệm rộng hơn.

Stakeholder có thể là bất kỳ người hoặc tổ chức nào:

* có kiến thức quan trọng đối với project;
* ảnh hưởng đến project;
* bị project ảnh hưởng;
* cần được tham vấn;
* cung cấp feedback;
* có trách nhiệm xác nhận một số thông tin;
* hoặc có lợi ích liên quan đến kết quả project.

MDS sử dụng `Customer / Stakeholder` như một actor type chung để tránh tạo taxonomy quá sớm.

---

# 4. Customer / Stakeholder có thể cung cấp gì?

Một Customer / Stakeholder có thể cung cấp các loại source input sau.

## 4.1. Intent

Ý định, mục tiêu hoặc kết quả mà actor muốn đạt được.

Intent trả lời những câu hỏi như:

* actor muốn thay đổi điều gì;
* actor đang cố đạt kết quả nào;
* tại sao project hoặc thay đổi này cần tồn tại.

Intent không tự động trở thành requirement.

---

## 4.2. Problem

Vấn đề hoặc khó khăn thực tế mà actor đang gặp.

MDS phải phân biệt:

```text
Problem
≠
Proposed Solution
```

Một actor có thể đề xuất một giải pháp, nhưng MDS không được mặc định coi giải pháp đó là requirement cuối cùng.

---

## 4.3. Process Knowledge

Kiến thức về cách công việc, nghiệp vụ hoặc quy trình thực tế đang diễn ra.

Process Knowledge có thể bao gồm:

* actor tham gia nào;
* trình tự công việc;
* quyết định nghiệp vụ;
* ngoại lệ;
* quy tắc hiện tại;
* các bước thủ công;
* điểm gây khó khăn.

Kiến thức này là source input để professional roles tiếp tục phân tích.

---

## 4.4. Constraint

Ràng buộc từ thực tế mà project cần xem xét.

Constraint có thể liên quan đến:

* nghiệp vụ;
* tổ chức;
* pháp lý;
* vận hành;
* thời gian;
* dữ liệu;
* chính sách.

Một constraint từ actor không tự động quyết định technical implementation.

---

## 4.5. Confirmation

Actor có thể xác nhận rằng một interpretation, mô tả quy trình hoặc thông tin nghiệp vụ phản ánh đúng hiểu biết của họ.

Confirmation phải được hiểu trong phạm vi:

* knowledge của actor;
* context;
* authority nếu có.

Confirmation không đồng nghĩa với universal approval authority.

---

## 4.6. Feedback

Actor có thể phản hồi về:

* proposal;
* requirement;
* thiết kế;
* prototype;
* implementation;
* sản phẩm đang vận hành;
* trải nghiệm sử dụng;
* kết quả đạt được.

Feedback là source input mới và phải giữ provenance.

---

## 4.7. Change Request

Actor có thể cho biết rằng:

* nhu cầu đã thay đổi;
* quy trình đã thay đổi;
* rule đã thay đổi;
* sản phẩm hiện tại chưa đáp ứng;
* cần bổ sung hoặc loại bỏ capability.

Change Request không trực tiếp sửa Project Truth.

Nó phải đi qua workflow phân tích và governance phù hợp.

---

# 5. Customer / Stakeholder có thể nhận gì từ MDS?

MDS và các professional roles có thể quay lại External Actor để yêu cầu:

* clarification;
* confirmation;
* missing information;
* conflict resolution input;
* phản hồi về proposal;
* phản hồi về outcome;
* thông tin bổ sung sau khi phát hiện impact hoặc ambiguity.

MDS không nên xem External Actor như một nguồn input một chiều.

Quan hệ đúng là:

```text
External Actor
      │
      ▼
     MDS
      │
      ▼
Analysis
      │
      └─────────────► Clarification / Confirmation
                           │
                           ▼
                     External Actor
```

---

# 6. Customer / Stakeholder không phải Requirement

Một Customer / Stakeholder có thể phát biểu:

```text
Statement
```

Nhưng statement đó không tự động trở thành:

```text
Requirement
```

Luồng chuẩn là:

```text
Actor Statement
      ↓
Preserved Source
      ↓
Professional Analysis
      ↓
Clarification if required
      ↓
Structured Proposal
      ↓
Governed confirmation / approval
      ↓
Project Truth
```

Nguyên tắc:

> MDS phải bảo tồn điều actor thực sự nói trước khi lưu cách MDS hoặc AI diễn giải điều đó.

---

# 7. Customer / Stakeholder không phải Product Decision

Actor có thể yêu cầu một capability hoặc đưa ra một ý tưởng.

Điều đó không tự động quyết định:

* feature có thuộc Product Boundary hay không;
* feature có được ưu tiên hay không;
* feature có được triển khai ở milestone hiện tại hay không;
* giải pháp được đề xuất có phải giải pháp phù hợp hay không.

Những quyết định này thuộc professional responsibility và approval authority phù hợp.

```text
Actor
"I want X."
      ↓
Product responsibility
"Should the product solve this?"
      ↓
Business analysis
"What does this actually mean?"
```

---

# 8. Customer / Stakeholder không phải Technical Authority

Việc một actor đề xuất một công nghệ, kiến trúc hoặc cách triển khai không tự động biến đề xuất đó thành technical decision.

External Actor có thể cung cấp:

```text
Need
Constraint
Expected Outcome
```

Professional roles chịu trách nhiệm chuyển các đầu vào đó thành technical decisions phù hợp.

Ví dụ khái niệm:

```text
Actor Constraint
      ↓
System / Architecture Analysis
      ↓
Technical Decision
```

Không được:

```text
Actor Technical Suggestion
      ↓
Automatic Architecture Truth
```

---

# 9. Customer / Stakeholder và Approval Authority

`Customer / Stakeholder` không tự động có quyền approval.

Một Actor Instance có thể đồng thời được gán một Approval Authority.

Hai classification phải được giữ độc lập:

```text
Actor Instance
      │
      ├── actor type
      │      Customer / Stakeholder
      │
      └── authority reference
             Business Approval Authority
```

Việc gán authority phải được định nghĩa và kiểm soát trong `authorities/`.

Nguyên tắc:

> Actor identity không quyết định approval rights.

---

# 10. Customer / Stakeholder và Professional Role

Một con người thật có thể đồng thời:

* được model như Customer / Stakeholder;
* đảm nhiệm một professional responsibility;
* giữ một approval authority.

MDS không được gộp ba chiều này thành một.

```text
Person / Organisation
│
├── Actor relationship
├── Professional responsibility
└── Approval authority
```

Điều MDS quan tâm là **ngữ cảnh và trách nhiệm**, không phải chỉ chức danh của con người.

---

# 11. Knowledge và Authority

Customer / Stakeholder có thể có kiến thức rất sâu về một chủ đề nhưng không có quyền quyết định chủ đề đó.

Ngược lại, một actor có authority cao có thể không phải người hiểu chi tiết vận hành nhất.

MDS phải giữ độc lập ít nhất các chiều:

```text
Knowledge
Influence
Impact
Authority
```

Không được suy luận:

```text
High Knowledge
→ High Authority
```

hoặc:

```text
High Impact
→ Approval Rights
```

---

# 12. Mâu thuẫn giữa các Stakeholder

Các stakeholder có thể cung cấp thông tin khác nhau hoặc mâu thuẫn trực tiếp.

Ví dụ khái niệm:

```text
Stakeholder A
→ Statement X

Stakeholder B
→ Statement Y

X conflicts with Y
```

MDS phải:

1. giữ nguyên cả hai nguồn;
2. giữ provenance;
3. xác định conflict;
4. xác định chủ đề conflict;
5. xác định actor knowledge và authority liên quan nếu biết;
6. yêu cầu clarification hoặc decision khi cần.

MDS không được:

* chọn nguồn có vẻ hợp lý hơn;
* lấy majority làm truth nếu governance không quy định;
* để AI tự hòa giải bằng assumption;
* xóa nguồn cũ khi có nguồn mới.

Conflict chưa được giải quyết phải được biểu diễn là unresolved.

---

# 13. Thông tin chưa chắc chắn

Không phải mọi thông tin từ Stakeholder đều có cùng độ chắc chắn.

Professional analysis có thể xác định thông tin là:

* explicit statement;
* confirmed information;
* observation;
* assumption;
* unclear;
* conflicting.

MDS phải tránh biến:

```text
"có lẽ"
"thường"
"đa số"
"tùy trường hợp"
```

thành rule chính thức nếu chưa được làm rõ.

---

# 14. Provenance

Mọi source contribution quan trọng từ Customer / Stakeholder phải có khả năng truy ngược.

MDS phải có khả năng trả lời:

```text
Ai cung cấp?

Khi nào?

Trong ngữ cảnh nào?

Qua nguồn nào?

Nội dung gốc là gì?

Nội dung đó đã được phân tích thành gì?

Có quyết định nào dựa trên nó?
```

Source contribution phải được bảo tồn độc lập với interpretation.

---

# 15. Customer / Stakeholder trong vòng đời project

Customer / Stakeholder có thể tương tác với project xuyên suốt vòng đời.

```text
Khám phá
→ cung cấp problem / intent

Product analysis
→ làm rõ value / scope

Business analysis
→ cung cấp process knowledge

Clarification
→ trả lời câu hỏi

Confirmation
→ xác nhận business understanding

Evaluation
→ phản hồi proposal

Acceptance
→ phản hồi kết quả

Runtime
→ feedback / incident context

Change
→ change request
```

Actor không phải một bước tuyến tính chỉ xuất hiện ở đầu project.

---

# 16. Handoff vào Professional Responsibility Model

Thông tin từ External Actor được professional roles tiếp nhận tùy loại.

Ví dụ ở mức khái niệm:

```text
Intent / Problem / Product Feedback
            ↓
    Product Management

Process Knowledge / Business Rule
            ↓
     Business Analysis

Clarification Request
            ↓
    Relevant Professional Role
```

MDS không yêu cầu mọi input từ actor phải đi qua cùng một role.

Routing cụ thể thuộc workflow và responsibility model tương ứng.

---

# 17. External Actor không được thực hiện implementation

Customer / Stakeholder classification không thuộc Implementation Plane.

Actor type này không tạo quyền:

* sửa source code;
* commit;
* merge;
* deploy;
* chạy CI/CD với tư cách implementation authority;
* thay đổi implementation evidence.

Implementation thuộc `implementation-plane/`.

---

# 18. External Actor không phải Runtime Environment

Customer / Stakeholder có thể cung cấp feedback về hệ thống đang chạy.

Nhưng actor không đại diện cho Production.

```text
Stakeholder Feedback
≠
Runtime Evidence
```

Ví dụ:

```text
Actor says:
"Hệ thống đang chậm."
```

là feedback.

Telemetry cho thấy latency cụ thể là runtime evidence.

Hai nguồn có thể liên kết với nhau nhưng không được đồng nhất.

---

# 19. Vai trò của AI

AI trong MDS có thể hỗ trợ xử lý actor input bằng cách:

* trích xuất statement;
* phân loại thông tin;
* phát hiện ambiguity;
* phát hiện conflict;
* tìm missing information;
* đề xuất clarification questions;
* liên kết source với artifact liên quan;
* so sánh thông tin mới với Project Truth hiện tại.

AI không được:

* giả lập actor rồi coi output là source;
* tạo confirmation thay actor;
* tạo approval authority;
* tự giải quyết conflict bằng assumption;
* biến statement trực tiếp thành authoritative truth.

---

# 20. Các nguyên tắc bất biến

### CUSTOMER-STAKEHOLDER-INV-001

Customer / Stakeholder là External Actor, không phải Professional Role.

### CUSTOMER-STAKEHOLDER-INV-002

Customer / Stakeholder không tự tạo AI agent.

### CUSTOMER-STAKEHOLDER-INV-003

Customer / Stakeholder không tự động có Approval Authority.

### CUSTOMER-STAKEHOLDER-INV-004

Customer / Stakeholder không tự động có Technical hoặc Implementation Authority.

### CUSTOMER-STAKEHOLDER-INV-005

Actor Statement không tự động trở thành Requirement hoặc Project Truth.

### CUSTOMER-STAKEHOLDER-INV-006

Source contribution phải giữ provenance.

### CUSTOMER-STAKEHOLDER-INV-007

Source và interpretation phải được giữ riêng.

### CUSTOMER-STAKEHOLDER-INV-008

Conflicting stakeholder statements phải được giữ lại cho đến khi được giải quyết theo governance phù hợp.

### CUSTOMER-STAKEHOLDER-INV-009

Knowledge, Influence, Impact và Authority là các chiều độc lập.

### CUSTOMER-STAKEHOLDER-INV-010

Actor Instance là project data và không được lưu như canonical actor knowledge trong `mds-core`.

---

# 21. Ownership Boundary

File này sở hữu semantic definition của Actor Type:

```text
customer-stakeholder
```

Nó không sở hữu:

```text
Actor schema
→ schemas/

Approval rights
→ authorities/

Professional responsibilities
→ roles/

Implementation behavior
→ implementation-plane/

Runtime evidence semantics
→ runtime/

AI prompt behavior
→ prompts/

Workflow routing
→ governed workflows

Usage examples
→ examples/
```

Không được sao chép canonical rules của các vùng trên vào file này.

---

# 22. Nguyên tắc mở rộng

Không tách `Customer / Stakeholder` thành nhiều Actor Type canonical chỉ vì project thực tế có nhiều chức danh khác nhau.

Chỉ xem xét Actor Type mới khi:

1. semantic hiện tại không thể biểu diễn đúng loại tương tác;
2. sự khác biệt ảnh hưởng trực tiếp đến cách MDS xử lý knowledge;
3. project-level metadata không đủ để biểu diễn khác biệt;
4. thay đổi được phê duyệt qua governed workflow.

Nguyên tắc:

> MDS mô hình hóa external reality đủ để hiểu project, không mô phỏng toàn bộ cơ cấu tổ chức.
