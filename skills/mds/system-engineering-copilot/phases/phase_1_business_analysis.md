# Phase 1: Business Analysis (P1)

## Objective
Translate raw intake fields into formal product logic specifications (functional, non-functional requirements, stories, and process diagrams).

## Deliverables
- **Functional Requirements (FR):** Clear statements of what the system must do.
- **Non-Functional Requirements (NFR):** Quantified limits for latency, uptime, security, and throughput.
- **User Stories:** Structured as: `As a [role], I want to [action] so that [benefit]`. Include Acceptance Criteria (AC).
- **Process Maps:** Mermaid BPMN, User Journeys, Use Case diagrams.

## Heuristics
- Verify that every User Story maps back to at least one Functional Requirement.
- Every NFR must be testable (e.g., "fast load time" is an anti-pattern; "page load time under 1.5 seconds" is correct).

## Diagrams to Select
- Use Case: Map all actors to system use boundaries.
- BPMN/Process: Sequence of operations for core workflows.
