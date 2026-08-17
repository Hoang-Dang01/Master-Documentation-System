# MDS UI Foundation v1

The desktop renderer uses **Professional Soft Neobrutalism** for shell,
interactive surfaces, and status communication. Data-heavy views (graph,
tables, editor, diff, and inspectors) use the same semantic tokens but keep
their borders, backgrounds, and shadows deliberately quieter.

## Rules

- Use semantic tones (`action`, `approved`, `review`, `conflict`, `info`, and
  `neutral`), never an arbitrary colour class in JSX.
- `StatusBadge` always renders text and a visible mark; colour is supporting
  information, not the sole status signal.
- Reserve hard shadows for buttons, raised/selected surfaces, and dialogs.
  Do not apply them to each table row, graph node, or diff line.
- The default border is 2px. Use the 3px selected border only for an explicit
  active or high-emphasis surface.
- Animation is limited to short hover, press, and focus feedback. Reduced
  motion disables these transitions.

## Primitives

`foundation.tsx` exports the first renderer-local primitives:

- `Button`, `IconButton`
- `Surface`
- `StatusBadge`, `CountBadge`
- `SectionHeading`, `EmptyState`
- `Field`, `DataRow`, `Kbd`

They are presentational only: state, access control, artifact authority, and
workflow behaviour remain in the domain/application layers and typed desktop
bridge.
