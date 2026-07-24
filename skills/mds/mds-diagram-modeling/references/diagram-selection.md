# Diagram and engine selection

Choose the diagram from the question being answered, then choose the engine from the required semantics and delivery format.

| Question or input | Diagram | Default engine |
| --- | --- | --- |
| Who uses the system and what goals do they have? | Use case | PlantUML |
| What classes, responsibilities, and multiplicities exist? | Class | PlantUML |
| What happens between participants over time? | Sequence | PlantUML for formal UML; Mermaid for concise docs |
| What decisions and parallel steps form a workflow? | Activity | PlantUML |
| How does an object move between states? | State machine | PlantUML; Mermaid for concise docs |
| Which modules expose or require interfaces? | Component | PlantUML |
| Where do processes and artifacts run? | Deployment | PlantUML |
| Which entities, keys, and cardinalities form the schema? | ERD | Mermaid for text source; Draw.io for approved presentation |
| Who exchanges data with the system? | Context/data flow | Draw.io teacher profile |
| What systems, containers, and components form the architecture? | C4 | Mermaid C4 |
| Does a stakeholder need exact manual placement or editing? | Presentation view | Draw.io |

## Conflict resolution

Apply these rules in order:

1. If strict UML notation is required, select PlantUML.
2. If the artifact must be embedded and reviewed in Markdown, select Mermaid unless rule 1 applies.
3. If C4 levels are explicitly requested, select Mermaid C4.
4. If the output must match the approved teacher samples or requires exact placement, select Draw.io as the delivery engine.
5. If both text review and exact presentation are required, maintain a text-based canonical model and a Draw.io delivery view with the same diagram ID and `derived_from` list.

Do not use a flowchart to imitate a formal use-case diagram. Do not use an ERD to describe runtime interaction. Do not use a sequence diagram when the primary subject is state transition rather than participant exchange.
