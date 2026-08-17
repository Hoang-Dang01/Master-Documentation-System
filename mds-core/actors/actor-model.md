---

ownership: mds
status: canonical
source: internal
safe_to_modify: scoped
update_strategy: extend only through an approved governed workflow
------------------------------------------------------------------

# External Actor Model

## 1. Mục đích

Tài liệu này định nghĩa mô hình khái niệm chuẩn cho **External Actor** trong MDS.

External Actor đại diện cho một con người hoặc tổ chức nằm ngoài tập hợp các trách nhiệm chuyên môn nội bộ của MDS nhưng có tương tác với dự án bằng cách:

* cung cấp nhu cầu hoặc mục tiêu;
* cung cấp kiến thức về nghiệp vụ hoặc quy trình thực tế;
* cung cấp phản hồi;
* đưa ra yêu cầu thay đổi;
* trả lời câu hỏi làm rõ;
* cung cấp xác nhận trong phạm vi phù hợp.

Tài liệu này định nghĩa **ý nghĩa và ranh giới của External Actor**.

Nó không định nghĩa:

* runtime feature;
* AI agent;
* professional role;
* approval authority;
* implementation authority;
* actor instance cụ thể của một project;
* cấu trúc lưu trữ vật lý hoặc database schema.

Các cấu trúc dữ liệu cụ thể phải được định nghĩa trong `schemas/`.

---

# 2. Định nghĩa

Một **External Actor** là:

> Một con người hoặc tổ chức tồn tại bên ngoài professional responsibility model của MDS và có quan hệ với project thông qua nhu cầu, kiến thức, phản hồi, xác nhận hoặc ảnh hưởng nghiệp vụ.

External Actor là một phần của **thế giới thực mà MDS đang cố gắng hiểu**.

```text
THẾ GIỚI THỰC
      │
      ▼
External Actor
      │
      │ intent
      │ process knowledge
      │ feedback
      │ confirmation
      │ change request
      ▼
     MDS
```

External Actor không phải là một bộ phận chuyên môn do MDS mô hình hóa trong `roles/`.

---

# 3. External Actor không phải Professional Role

MDS phân biệt rõ:

```text
External Actor
≠
Professional Role
```

Professional Role đại diện cho một trách nhiệm chuyên môn trong quá trình xây dựng và vận hành software project.

External Actor đại diện cho một thực thể bên ngoài cung cấp hoặc nhận thông tin liên quan đến project.

Ví dụ về loại quan hệ:

```text
External Actor
      ↓
cung cấp nhu cầu
      ↓
Professional Role
      ↓
phân tích / cấu trúc / xử lý
```

Một External Actor không được đưa vào `roles/` chỉ vì họ tham gia vào project.

---

# 4. External Actor không phải AI Agent

Việc một actor được mô hình hóa trong MDS không tạo ra một AI agent tương ứng.

Không được suy luận:

```text
actor type
→ AI actor
```

Ví dụ:

```text
Customer / Stakeholder
```

không đồng nghĩa với:

```text
Customer Agent
Stakeholder Agent
```

MDS không được giả lập một External Actor rồi sử dụng kết quả giả lập đó như nguồn nghiệp vụ thật hoặc authority thật.

AI có thể:

* phân tích thông tin do actor cung cấp;
* phát hiện điểm chưa rõ;
* phát hiện mâu thuẫn;
* đề xuất câu hỏi;
* tổ chức lại knowledge.

AI không được tự tạo ra lời xác nhận thay cho External Actor thật.

---

# 5. Actor Type và Actor Instance

MDS phải phân biệt:

## Actor Type

Là loại actor được định nghĩa ở cấp MDS Core.

Ví dụ:

```text
Customer / Stakeholder
```

Actor Type thuộc knowledge model của MDS.

---

## Actor Instance

Là một con người hoặc tổ chức cụ thể trong một project cụ thể.

Ví dụ khái niệm:

```text
Stakeholder A
Stakeholder B
Organisation C
```

Actor Instance là **project data**.

Actor Instance không được lưu như canonical knowledge trong `mds-core/actors/`.

```text
MDS CORE
Actor Type
     │
     │ instantiated inside a project
     ▼
PROJECT DATA
Actor Instance
```

---

# 6. Các chiều thông tin MDS cần biết về một Actor

MDS không cần sao chép toàn bộ hồ sơ của một con người hoặc tổ chức.

MDS chỉ nên giữ những thông tin cần thiết để hiểu quan hệ của actor với project.

Ở mức khái niệm, một actor có thể được mô tả theo các chiều sau.

## 6.1. Danh tính trong project

Cho biết actor là ai trong phạm vi project.

Mục tiêu là phân biệt nguồn thông tin, không phải xây hệ thống quản lý nhân sự.

---

## 6.2. Bối cảnh tổ chức

Cho biết actor thuộc tổ chức, đơn vị hoặc bối cảnh nghiệp vụ nào nếu thông tin đó cần thiết cho việc hiểu project.

---

## 6.3. Quan hệ với project

Cho biết actor liên quan đến project theo cách nào.

Ví dụ về quan hệ khái niệm:

* cung cấp nhu cầu;
* sử dụng kết quả;
* chịu ảnh hưởng;
* cung cấp kiến thức;
* cung cấp phản hồi;
* tham gia xác nhận.

---

## 6.4. Phạm vi kiến thức

Cho biết actor có kiến thức đáng tin cậy về lĩnh vực hoặc quy trình nào.

MDS phải phân biệt:

```text
Biết về một vấn đề
≠
Có quyền quyết định vấn đề đó
```

---

## 6.5. Mức độ ảnh hưởng

Cho biết actor có khả năng ảnh hưởng đến quyết định hoặc hướng đi của project ở mức nào.

Influence không đồng nghĩa với approval authority.

---

## 6.6. Mức độ bị ảnh hưởng

Cho biết actor bị sản phẩm, thay đổi hoặc quyết định của project tác động ở mức nào.

Một actor có thể:

```text
Knowledge: cao
Influence: thấp
Impact: cao
```

hoặc một tổ hợp khác.

MDS không được suy luận authority chỉ từ influence hoặc impact.

---

## 6.7. Phạm vi cần xác nhận

Cho biết những chủ đề nào có thể cần quay lại actor để làm rõ hoặc xác nhận.

Phạm vi này không tự tạo approval authority.

Approval authority phải được mô hình hóa riêng trong `authorities/`.

---

## 6.8. Nguồn thông tin đã đóng góp

Actor có thể liên kết với các nguồn như:

* cuộc họp;
* phỏng vấn;
* tài liệu;
* email;
* phản hồi;
* quyết định;
* yêu cầu thay đổi.

MDS phải có khả năng truy ngược:

```text
Knowledge
   ↓
Source
   ↓
Actor
```

---

# 7. Knowledge, Influence, Impact và Authority là các khái niệm độc lập

MDS phải tránh nhập các khái niệm sau thành một:

```text
Knowledge
Influence
Impact
Authority
```

## Knowledge

Actor hiểu vấn đề gì.

## Influence

Actor có khả năng tác động tới project ở mức nào.

## Impact

Actor bị project ảnh hưởng ở mức nào.

## Authority

Actor có quyền chính thức quyết định hoặc phê duyệt điều gì.

Authority thuộc mô hình riêng trong `authorities/`.

Một actor có thể có authority, nhưng việc là External Actor không tự động cấp authority.

```text
External Actor
      │
      ├── knowledge
      ├── influence
      ├── impact
      │
      └── authority_ref ─────► authorities/
```

---

# 8. External Actor và Approval Authority

MDS phải phân biệt:

```text
WHO THE ACTOR IS
≠
WHAT THE ACTOR MAY APPROVE
```

Một External Actor có thể đồng thời được gán một hoặc nhiều Approval Authority.

Ví dụ khái niệm:

```text
Actor Instance
      │
      └── authority reference
              ↓
       Approval Authority
```

Nhưng actor model không được tự định nghĩa quyền phê duyệt.

Các gate, authority scope và approval rules thuộc `authorities/` và các governance standard tương ứng.

---

# 9. External Actor và Professional Role

Một con người ngoài đời có thể đồng thời:

* là một External Actor trong một ngữ cảnh;
* đảm nhiệm một Professional Role trong một ngữ cảnh khác;
* giữ một Approval Authority tại một gate cụ thể.

MDS phải mô hình hóa các trách nhiệm này độc lập.

Không được đồng nhất danh tính con người với classification.

```text
Một con người
│
├── Actor relationship
├── Professional responsibility
└── Approval authority
```

Ba chiều này có thể cùng tồn tại nhưng không thay thế nhau.

---

# 10. External Actor cung cấp thông tin gì cho MDS?

External Actor có thể cung cấp:

## Intent

Điều họ muốn đạt được hoặc vấn đề họ muốn giải quyết.

## Process Knowledge

Kiến thức về cách công việc hoặc nghiệp vụ thực tế đang diễn ra.

## Constraint

Ràng buộc từ thế giới thực mà project phải xem xét.

## Confirmation

Xác nhận thông tin trong phạm vi phù hợp.

## Feedback

Phản hồi về proposal, thiết kế, implementation hoặc hệ thống đang vận hành.

## Change Request

Thông tin cho thấy nhu cầu, quy trình hoặc mong muốn đã thay đổi.

Những thông tin trên là **source input**.

Chúng không tự động trở thành Project Truth.

---

# 11. Actor Statement không phải Project Truth

Một phát biểu của actor phải được bảo tồn như nguồn.

```text
ACTOR STATEMENT
      ↓
Analysis
      ↓
Proposal
      ↓
Governed confirmation / approval
      ↓
PROJECT TRUTH
```

Không được:

```text
Actor says X
      ↓
X automatically becomes truth
```

Trừ khi governance model xác định rõ loại thông tin đó có authority trực tiếp và đủ điều kiện trở thành authoritative decision.

---

# 12. Provenance là bắt buộc

Thông tin do External Actor cung cấp phải có khả năng truy ngược về nguồn.

Ở mức khái niệm, MDS phải có khả năng trả lời:

```text
Ai cung cấp thông tin này?

Trong ngữ cảnh nào?

Khi nào?

Qua nguồn nào?

Nội dung nguyên bản là gì?

Thông tin sau đó được diễn giải như thế nào?
```

Interpretation không được ghi đè source.

```text
SOURCE
≠
INTERPRETATION
```

---

# 13. Mâu thuẫn giữa các Actor

Hai actor có thể cung cấp thông tin khác nhau.

MDS không được tự chọn một nguồn chỉ vì nguồn đó có vẻ hợp lý hơn.

Ví dụ khái niệm:

```text
Actor A → Statement X
Actor B → Statement Y

X conflicts with Y
```

MDS phải giữ:

```text
CONFLICT
status: unresolved
```

cho đến khi:

* có thêm evidence;
* có clarification;
* hoặc authority phù hợp đưa ra quyết định.

AI có thể phát hiện và giải thích conflict.

AI không được tự giải quyết conflict bằng assumption.

---

# 14. External Actor trong vòng đời project

External Actor không chỉ xuất hiện ở đầu project.

Actor có thể tham gia ở nhiều thời điểm:

```text
Khám phá
→ cung cấp nhu cầu

Phân tích
→ trả lời câu hỏi

Xác nhận
→ xác nhận nghiệp vụ

Đánh giá
→ phản hồi proposal

Vận hành
→ cung cấp feedback

Thay đổi
→ tạo change request
```

Vì vậy External Actor là một boundary tương tác liên tục với project, không phải một bước tuyến tính trong workflow.

---

# 15. Những điều External Actor không mặc định có quyền làm

Việc được phân loại là External Actor không tự động cấp quyền:

* quyết định kiến trúc kỹ thuật;
* quyết định implementation;
* thay đổi source code;
* quyết định database design;
* quyết định API contract;
* quyết định testing strategy;
* approve mọi loại artifact;
* thay đổi Project Truth trực tiếp.

Các quyền này phải đến từ responsibility hoặc authority model tương ứng.

---

# 16. Các nguyên tắc bất biến

External Actor Model phải tuân theo các invariant sau.

### ACTOR-INV-001

`roles/` chỉ chứa professional responsibilities.

External Actor không được đăng ký như professional role.

### ACTOR-INV-002

External Actor không tự tạo AI agent.

### ACTOR-INV-003

External Actor không tự động có Approval Authority.

### ACTOR-INV-004

External Actor không tự động có Implementation Authority.

### ACTOR-INV-005

Actor Type thuộc MDS Core; Actor Instance thuộc project data.

### ACTOR-INV-006

Thông tin do actor cung cấp phải giữ provenance.

### ACTOR-INV-007

Source information và analyzed interpretation phải được phân biệt.

### ACTOR-INV-008

Conflicting actor statements không được tự động hòa giải bằng AI assumption.

### ACTOR-INV-009

Knowledge, Influence, Impact và Authority phải được mô hình hóa như các chiều độc lập.

### ACTOR-INV-010

Việc thêm Actor Type mới phải đi qua governed workflow và cập nhật canonical registry.

---

# 17. Quan hệ với các vùng khác của MDS Core

```text
actors/
    │
    ├── professional responsibility ──► roles/
    │
    ├── approval rights ──────────────► authorities/
    │
    ├── data structure ───────────────► schemas/
    │
    ├── governance rules ─────────────► standards/
    │
    ├── interaction templates ────────► templates/
    │
    ├── AI processing instructions ───► prompts/
    │
    └── usage guidance ───────────────► guides/
```

`actors/` chỉ sở hữu **actor semantics và actor classification boundary**.

Nó không được sao chép trách nhiệm canonical của các vùng khác.

---

# 18. Canonical Actor Types

Danh sách Actor Type được MDS công nhận phải được quản lý trong canonical actor registry.

Tài liệu này chỉ định nghĩa **mô hình chung**.

Nó không phải registry.

Việc một Actor Type xuất hiện trong ví dụ hoặc tài liệu khác không làm Actor Type đó trở thành canonical.

---

# 19. Nguyên tắc mở rộng

MDS ưu tiên mô hình actor tối thiểu.

Không tạo Actor Type mới chỉ vì ngoài đời tồn tại một chức danh hoặc nhóm người khác.

Chỉ mở rộng actor classification khi:

1. loại actor mới có semantic khác thực sự;
2. sự khác biệt đó ảnh hưởng đến cách MDS xử lý knowledge hoặc interaction;
3. classification hiện tại không thể biểu diễn đúng;
4. thay đổi đã đi qua governed workflow.

Nguyên tắc:

> **Không mô hình hóa cơ cấu tổ chức nhiều hơn mức MDS thực sự cần để hiểu project.**
