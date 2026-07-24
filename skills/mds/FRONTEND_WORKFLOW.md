# Frontend skill workflow

Use the five frontend skills in this order:

```text
frontend-design
→ react-best-practices
→ web-design-guidelines
→ agent-browser
→ webapp-testing
```

## 1. Design direction

Read `../vendor/anthropics/frontend-design/SKILL.md` before implementing or substantially restyling UI. Commit to a deliberate visual direction instead of default dashboard aesthetics.

## 2. React implementation

Read `../vendor/vercel-labs/react-best-practices/SKILL.md` while planning and reviewing React code. Its frontmatter name is `vercel-react-best-practices`.

## 3. UI audit

Read `../vendor/vercel-labs/web-design-guidelines/SKILL.md` after implementation to review accessibility, responsive behavior, interaction, forms, focus states and UX details.

## 4. Interactive verification

Read `../vendor/vercel-labs/agent-browser/SKILL.md` for browser or Electron interaction. The skill requires the external `agent-browser` CLI; importing the skill does not install that CLI globally.

## 5. Playwright verification

Read `../vendor/anthropics/webapp-testing/SKILL.md` for Playwright flows and screenshots. The upstream helper scripts use Python Playwright, so a Python runtime is required to execute them.

Human review remains mandatory before approving a design or release.
