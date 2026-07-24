---
name: mds-diagram-modeling
description: Route, create, validate, style, and trace MDS software diagrams using PlantUML, Mermaid, C4, or Draw.io. Use for use-case, class, sequence, activity, state, component, deployment, package, context, data-flow, architecture, ERD/database, and C4 diagrams; for converting requirements or code into diagrams; or when outputs must preserve the approved teacher-directed presentation style and remain traceable to MDS artifacts.
---

# MDS Diagram Modeling

Create semantically correct, versionable diagrams and preserve the approved teaching style when it is the delivery profile.

## Workflow

1. Inspect the source artifacts and retain their IDs.
2. Read [`references/diagram-selection.md`](references/diagram-selection.md) and choose the diagram type and engine.
3. Read the engine rules:
   - strict UML: [`references/uml-rules.md`](references/uml-rules.md);
   - Mermaid or C4: [`references/mermaid-c4-rules.md`](references/mermaid-c4-rules.md);
   - teacher-approved Draw.io delivery: [`references/style-guide.md`](references/style-guide.md).
4. Copy the closest file from `assets/templates/`; never edit a template or reference asset in place.
5. Model only facts supported by the source artifacts. Mark unresolved semantics instead of inventing them.
6. Create a `.diagram.yaml` sidecar from `assets/templates/traceability/diagram.meta.yaml` and follow [`references/traceability.md`](references/traceability.md).
7. Validate the source:
   - PlantUML/Mermaid/C4: `node scripts/validate-text-diagram.mjs <source> --type <type>`;
   - Draw.io: `node scripts/check_drawio_style.mjs <source.drawio> --type <type>`;
   - metadata: `node scripts/check-traceability.mjs <source.diagram.yaml>`.
8. Render with the matching engine when its runtime is available and inspect the complete output.
9. Deliver the editable source, metadata sidecar, and rendered SVG/PNG/PDF requested by the user.

## Engine policy

| Need | Canonical engine |
| --- | --- |
| Strict use case, class, activity, state, component, deployment, or formal sequence UML | PlantUML |
| Markdown-native flow, simple sequence, ERD, state, class, journey, or data flow | Mermaid |
| System context, container, or component architecture | Mermaid C4 |
| Teacher-style submission, exact placement, swimlane, or manually editable presentation | Draw.io |

When both Git review and teacher-style delivery matter, keep PlantUML/Mermaid as the canonical semantic source and generate a Draw.io delivery view from the same metadata.

## Hard constraints

- Treat requirements, approved models, code, and MDS artifacts as the semantic source of truth.
- Give every diagram a stable ID and at least one `derived_from` artifact.
- Keep one principal question per diagram; split overcrowded views.
- Preserve UML/C4 semantics even when applying presentation styling.
- Prefer editable text or Draw.io source over bitmap generation.
- Never use generative bitmap output as the authoritative source for exact text, cardinality, messages, or arrow direction.
- Preserve the approved teacher style for academic delivery. Do not modernize it unless explicitly requested.
- Create a new output version instead of overwriting an approved artifact.

## Output gate

Deliver only after syntax, traceability, and applicable style validators pass. If a renderer is unavailable, report that the source passed static validation but rendered visual QA remains pending.
