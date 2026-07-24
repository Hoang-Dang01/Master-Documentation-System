# Approved teacher presentation profile

The reference images were extracted from an owner-provided teaching artifact before its source was archived. A matching per-type reference outranks general rules below.

## Global language

- Canvas: white with a faint square grid; use a 10 px grid with `#E8E8E8` lines when reproducible.
- Typeface: Arial or a metrically similar sans serif.
- Labels: black, compact, sentence case, normally 10–12 px.
- Node labels: centered; use bold text for actors, systems, layers, packages, and entities.
- Connectors: black or dark gray, approximately 1 px, with compact classic/block arrowheads.
- Routing: orthogonal for context, architecture, and package diagrams; crow's-foot for ERD; straight lifelines and horizontal messages for sequence diagrams.
- Styling: flat fills, square corners, no gradients, no shadows, no decorative polish.
- Density: compact but readable. Preserve generous whitespace between unrelated groups.
- Naming: use English followed by Vietnamese in parentheses when the reference or assignment requires bilingual actor names.

## Context diagram

Use a large central system circle with external actors arranged around it.

| Role | Fill | Stroke | Text |
| --- | --- | --- | --- |
| System | `#4CAF50` | `#2E7D32` | white, bold |
| Third-party | `#2196F3` | `#1565C0` | black, bold |
| Staff | `#FF9800` | `#EF6C00` | white, bold |
| Manager | `#F44336` | `#C62828` | white, bold |
| Admin | `#9E9E9E` | `#616161` | white, bold |

- Use a true circle for the system and square-corner rectangles for actors.
- Route data flows orthogonally.
- Put the data name directly on the connector with a white label background.
- Show direction with one arrowhead per flow; use two separate flows for request/response.

## Use-case diagram

- Use UML actor figures outside grouped use-case regions.
- Use flat pastel ovals grouped by actor or subsystem.
- Approved fills include staff/manager `#FFF9C4`, system `#E1BEE7`, another actor group `#C8E6C9`, and admin `#FFCCBC`.
- Keep association lines thin and dark. Use dashed arrows only for explicit include/extend semantics.
- Avoid oversized system boundaries and avoid decorative actor icons.

## Architecture diagram

- Organize layers vertically: client, server, third-party services, and database.
- Use red layer containers or headers (`#E51400`), a light-blue API box (`#B1DDF0`), and light-green service boxes (`#D5E8D4`).
- Keep the server boundary light gray (`#F5F5F5`) with square corners.
- Use short connector labels such as REST API, webhook, deploy, and read/write.

## Package diagram

- Use monochrome folder/package shapes with white fill and black borders.
- Place the diagram title in a small tab at the upper-left of the outer frame.
- Use orthogonal arrows and short dependency labels.
- Keep filenames inside their owning package instead of adding decorative file icons.

## ERD and database diagram

- Use monochrome entity tables: white fill, black/gray borders, bold entity header.
- List one attribute per row; show `PK` and `FK` in a narrow key column.
- Use crow's-foot cardinality and route relationships to avoid crossing entity text.
- Do not colorize entities unless a newer approved reference explicitly does so.

## Sequence diagram

- Arrange participants left to right and keep lifelines vertical.
- Use small pastel participant headers; preserve participant colors consistently from top to bottom.
- Draw messages horizontally with compact labels above the line.
- Use thin activation bars and framed `alt`/`loop` fragments where required.
- Do not replace sequence semantics with illustrative arrows or freeform flowchart shapes.

## Visual QA checklist

- Matching diagram type and matching reference selected.
- Grid, node geometry, palette, font, and connector style preserved.
- No gradient, shadow, rounded card, or unapproved color.
- No label overlaps, ambiguous crossings, clipped text, or microscopic export.
- Every arrow direction agrees with the described flow.
- Editable `.drawio` and rendered output represent the same version.
