# Phase 2: Domain & Data Modeling (P2)

## Objective
Establish the logical structure of domain concepts and define database architectures.

## Deliverables
- **Domain Model:** Business domain entities, relationships, attributes.
- **Data Dictionary:** Schema detail including field names, types, constraints, descriptions.
- **Entity Relationship Diagram (ERD):** Fully qualified Mermaid ER diagram showing keys, relationship cardinalities, and associations.
- **CRUD Matrix:** Table mapping roles/actors to entity access permissions (Create, Read, Update, Delete).

## Design Rules
- Avoid cyclic entity relationships unless absolutely required by design pattern.
- Explicitly define cardinalities (e.g., `||--o{` instead of `--`).
- Use standardized naming casing (camelCase, snake_case) consistently across the database.
