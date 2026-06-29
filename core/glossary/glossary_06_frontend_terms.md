<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/06_frontend_terms.yaml -->
---
id: AST-GLOSSARY-FE-FILE
name: Frontend Terms Glossary
artifact_type: REG
domain: META
owner: MDS_CORE
status: APPROVED
version: 1.1.0
tags:
  - glossary
  - core
created_at: 2026-06-29
updated_at: 2026-06-29
last_updated_by: build_glossary.js
change_summary: Auto-compiled glossary markdown
links:
  depends_on: []
---

# Frontend Terms Glossary

## state_management

*   **Artifact ID**: `AST-GLOSSARY-FE-001`
*   **Canonical Name**: `Client State Management`
*   **Category**: `frontend`
*   **Namespace**: `frontend`
*   **Domain**: `architecture`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: An architectural approach for storing, updating, and synchronizing application state across UI components to ensure predictable rendering and user interactions.
*   **Examples**:
    * Redux, Zustand, Pinia state stores.
*   **Notes**:
    * Essential for single-page applications.
*   **Related Terms**: [client_side_routing](#client_side_routing), [hydration](#hydration)

---

## hydration

*   **Artifact ID**: `AST-GLOSSARY-FE-002`
*   **Canonical Name**: `Client-Side Hydration`
*   **Category**: `frontend`
*   **Namespace**: `frontend`
*   **Domain**: `architecture`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: The process of client-side JavaScript taking over static HTML rendered by the server and attaching event listeners to make it interactive.
*   **Examples**:
    * Next.js attaching React state to server-rendered HTML.
*   **Notes**:
    * Critical for fast First Contentful Paint.
*   **Related Terms**: [state_management](#state_management)

---

## client_side_routing

*   **Artifact ID**: `AST-GLOSSARY-FE-003`
*   **Canonical Name**: `Client-Side Routing`
*   **Category**: `frontend`
*   **Namespace**: `frontend`
*   **Domain**: `architecture`
*   **Version**: `1.1.0`
*   **Status**: `APPROVED`
*   **Owner**: `MDS_CORE`
*   **Definition**: An architectural approach where routing and page transitions are handled dynamically by JavaScript on the client side without requesting a full page reload from the server.
*   **Examples**:
    * React Router page transitions.
*   **Notes**:
    * Enables smooth SPA transitions.
*   **Related Terms**: [state_management](#state_management)

---
