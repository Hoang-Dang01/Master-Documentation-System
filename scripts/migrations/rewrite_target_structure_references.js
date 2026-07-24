#!/usr/bin/env node

// One-time compatibility migration for the 2026-07-24 target-structure move.
// It is intentionally idempotent and skips itself so the historical source
// paths remain available as migration evidence.

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..", "..");
const excludedDirectories = new Set([
  ".git",
  "node_modules",
  "dist",
  "dist-electron",
  "build",
  "coverage",
  "out",
]);
const excludedFiles = new Set([
  "docs/STRUCTURE.generated.md",
  "scripts/migrations/rewrite_target_structure_references.js",
]);
const textExtensions = new Set([
  ".cjs", ".css", ".drawio", ".html", ".js", ".json", ".md", ".mjs",
  ".mmd", ".puml", ".py", ".sh", ".sql", ".ts", ".tsx", ".txt",
  ".yaml", ".yml",
]);

const replacements = [
  ["mds-core/guides/roles", "mds-core/roles"],
  ["mds-core/skills/project/mds-diagram-modeling", "skills/mds/mds-diagram-modeling"],
  ["mds-core/skills/project/mds-project-management", "skills/mds/mds-project-management"],
  ["mds-core/skills/system-engineering-copilot", "skills/mds/system-engineering-copilot"],
  ["mds-core/skills/FRONTEND_WORKFLOW.md", "skills/mds/FRONTEND_WORKFLOW.md"],
  ["mds-core/skills/PM_WORKFLOW.md", "skills/mds/PM_WORKFLOW.md"],
  ["mds-core/skills/community/anthropics", "skills/vendor/anthropics"],
  ["mds-core/skills/community/vercel-labs", "skills/vendor/vercel-labs"],
  ["mds-core/skills/community/mattpocock-skills", "skills/vendor/mattpocock"],
  ["mds-core/skills/community/deanpeters-product-manager", "skills/vendor/deanpeters-product-manager"],
  ["mds-core/skills/community/obra-superpowers", "skills/vendor/obra-superpowers"],
  ["packages/document-ingestion", "packages/application/ingestion"],
  ["packages/requirement-analysis", "packages/application/requirements"],
  ["packages/impact-analysis", "packages/application/impact"],
  ["packages/system-design", "packages/application/design"],
  ["packages/knowledge-base", "packages/application/knowledge-base"],
  ["packages/ai-providers", "packages/infrastructure/ai"],
  ["packages/persistence", "packages/infrastructure/persistence"],
  ["packages/integrations", "packages/infrastructure/integrations"],
  ["packages/automation-registry", "packages/workflow-engine/automation-registry"],
  ["packages/domain", "packages/core/domain"],
  ["packages/validation", "packages/core/validation"],
  ["packages/approval", "packages/core/approval"],
  ["packages/audit", "packages/core/audit"],
];

function listTextFiles(directoryPath) {
  const files = [];
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTextFiles(entryPath));
      continue;
    }
    const relativePath = path.relative(repositoryRoot, entryPath).replaceAll("\\", "/");
    if (
      entry.isFile()
      && textExtensions.has(path.extname(entry.name).toLowerCase())
      && !excludedFiles.has(relativePath)
    ) {
      files.push({ entryPath, relativePath });
    }
  }
  return files;
}

let changedFiles = 0;
let replacementCount = 0;

for (const { entryPath, relativePath } of listTextFiles(repositoryRoot)) {
  const original = fs.readFileSync(entryPath, "utf8");
  let updated = original;

  for (const [before, after] of replacements) {
    if (!updated.includes(before)) continue;
    const parts = updated.split(before);
    replacementCount += parts.length - 1;
    updated = parts.join(after);
  }

  if (updated === original) continue;
  fs.writeFileSync(entryPath, updated, "utf8");
  changedFiles += 1;
  console.log(`[MIGRATED] ${relativePath}`);
}

console.log(
  `[MIGRATION] Updated ${replacementCount} reference(s) in ${changedFiles} file(s).`,
);
