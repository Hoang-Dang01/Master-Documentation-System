# Phase 0: Requirement Intake (P0)

## Objective
Standardize and normalize raw input data (meeting transcripts, quick messages, screenshots, legacy code templates) into a clean, parsed metadata record.

## Process
1. Parse raw text and images to isolate the domain description.
2. Populate the intake schema fields:
   * **Project Name**
   * **Primary Domain**
   * **Core Business Goals**
   * **List of Identified Actors**
   * **Key Features (In-scope)**
   * **Excluded Features (Out-of-scope)**
   * **Technical Constraints**
3. Run the Confidence Score evaluation based on `rules/clarification_engine.yaml`.
4. If score < 0.75, compile the missing data questionnaire.

## Anti-Patterns
- Assuming hidden constraints (e.g., assuming database type without asking or consulting stack limits).
- Skipping the confidence score gate and starting downstream code design.
