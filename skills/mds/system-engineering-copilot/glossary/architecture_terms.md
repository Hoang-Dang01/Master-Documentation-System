# Software Architecture Glossary

- **ACID:** Atomicity, Consistency, Isolation, Durability. Set of properties of database transactions intended to guarantee validity even in the event of errors, power failures, etc.
- **CQRS:** Command Query Responsibility Segregation. A pattern that segregates the operations that read data from the operations that update data.
- **Saga Pattern:** A sequence of local transactions where each transaction updates data within a single service and triggers the next transaction.
- **SPOF:** Single Point of Failure. A part of a system that, if it fails, will stop the entire system from working.
- **Modular Monolith:** A software design pattern where a monolith is developed with distinct modules, making it easier to migrate to microservices later.
