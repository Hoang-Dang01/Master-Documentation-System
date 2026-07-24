# Diagram traceability

Create one `<source-name>.diagram.yaml` sidecar for every diagram. Copy `assets/templates/traceability/diagram.meta.yaml`.

## Required fields

- `id`: stable MDS artifact ID.
- `type`: diagram type.
- `engine`: `plantuml`, `mermaid`, or `drawio`.
- `style_profile`: normally `teacher-approved` or `standard`.
- `status`: `draft`, `review`, or `approved`.
- `source_file`: path to the editable diagram source.
- `derived_from`: one or more source artifact IDs.
- `related_artifacts`: downstream or peer artifacts when known.

## Rules

- Never silently replace a diagram ID when redrawing.
- Increment the artifact version in MDS governance instead of encoding dates into the ID.
- Keep the same ID across canonical text source and Draw.io delivery variants; distinguish variants through `engine`, `style_profile`, and filename.
- Mark a diagram stale when a `derived_from` artifact changes.
- Do not approve generated diagrams automatically.

## Example

```yaml
diagram:
  id: SA-DGM-OMNICHAT-CONTEXT-001
  type: context
  engine: drawio
  style_profile: teacher-approved
  status: draft
  source_file: ./omnichat-context.drawio
  derived_from:
    - BA-REQ-OMNICHAT-001
  related_artifacts:
    - SA-ARC-OMNICHAT-001
```

Run:

```text
node scripts/check-traceability.mjs path/to/diagram.diagram.yaml
```
