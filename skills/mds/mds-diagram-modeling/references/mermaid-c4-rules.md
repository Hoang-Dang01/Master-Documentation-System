# Mermaid and C4 rules

Use Mermaid templates under `assets/templates/mermaid/`.

## Mermaid

- Use Mermaid for Markdown-native diagrams that benefit from small text diffs.
- Keep node identifiers stable and human-readable labels separate.
- Use `sequenceDiagram` for concise interactions, `erDiagram` for relational structure, `stateDiagram-v2` for lifecycles, `classDiagram` for lightweight models, and `flowchart` for processes or data flow.
- Keep syntax comments beginning with `%% diagram-id:` and `%% derived-from:` at the top.
- Prefer several focused diagrams over one dense graph.
- Do not use Mermaid flowcharts as a substitute for strict UML use-case notation.

## ERD

- Mark primary, foreign, and unique keys where supported.
- Add cardinality and a relationship verb.
- Keep logical names consistent with the glossary.
- Separate conceptual relationships from implementation-specific join tables when the audience needs both views.

## C4

- Context: show people, the system of interest, and external systems.
- Container: show deployable/runnable units, data stores, responsibilities, and technology.
- Component: show major components inside one container and their dependencies.
- Do not create a code-level view unless the source code and audience justify it.
- Use one abstraction level per diagram.
- Label relationships with purpose and protocol where known.

Mermaid C4 support may vary by renderer. If the target renderer cannot render C4 syntax, retain the source and produce an equivalent Draw.io delivery view without changing the model semantics.
