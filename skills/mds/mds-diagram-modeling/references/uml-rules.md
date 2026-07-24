# UML modeling rules

Use PlantUML templates under `assets/templates/plantuml/`.

## Use case

- Model actors as external roles, not individual people or UI screens.
- Name use cases with goal-oriented verb phrases.
- Draw a system boundary and keep actors outside it.
- Use `include` only for mandatory reused behavior.
- Use `extend` only for optional or conditional behavior.
- Trace each use case to requirement or use-case artifact IDs.

## Class

- State whether the view is conceptual/domain-level or implementation-level.
- Show responsibilities and domain-relevant attributes before incidental framework fields.
- Add multiplicity to every non-trivial association.
- Distinguish association, aggregation, composition, inheritance, and dependency.
- Avoid database-only foreign-key fields in a conceptual domain class diagram.

## Sequence

- Order participants left to right by responsibility.
- Use concrete messages with direction and intent.
- Use return arrows only when the returned information matters.
- Use `alt`, `opt`, `loop`, and `par` fragments for real control flow.
- Include failure and authorization branches when required by the source.
- Keep one scenario or closely related scenario family per diagram.

## Activity and swimlane

- Start with one initial node and end with explicit final outcomes.
- Label decisions as questions and label outgoing guards.
- Use partitions/swimlanes for role ownership.
- Show parallel work with fork/join semantics rather than duplicated arrows.

## State machine

- Model stable states, not actions or screens.
- Label transitions with event, optional guard, and optional effect.
- Include initial and terminal pseudo-states when the lifecycle has them.
- Check that every reachable non-terminal state has a valid exit or intentional wait.

## Component, package, and deployment

- Component diagrams show provided/required interfaces and dependencies.
- Package diagrams show ownership and compile-time/module dependencies.
- Deployment diagrams show nodes, execution environments, deployed artifacts, and protocols.
- Keep logical components separate from physical deployment nodes.
