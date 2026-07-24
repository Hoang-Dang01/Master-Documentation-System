#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..", "..");
const templatesRoot = path.join(repositoryRoot, "mds-core", "templates");

function listTemplates(directoryPath) {
  const files = [];
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTemplates(entryPath));
    } else if (entry.isFile() && entry.name.endsWith("_template.md")) {
      files.push(entryPath);
    }
  }
  return files;
}

function humanizeTitle(value) {
  return value
    .replace(/^"?(?:ADR|API|BRD|BR|DB|DEP|FLOW|HLD|INC|INT|NFR|REQ|SEC|SRV|UC):\s*/i, '"')
    .replace(/\s+Integration"$/, '"');
}

let changedFiles = 0;

for (const filePath of listTemplates(templatesRoot)) {
  const original = fs.readFileSync(filePath, "utf8");
  const frontmatterMatch = original.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) continue;

  let frontmatter = frontmatterMatch[1];
  if (!/^title:/m.test(frontmatter) && /^name:/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(/^name:/m, "title:");
  }

  frontmatter = frontmatter.replace(/^title:\s*(.+)$/m, (_match, value) => {
    return `title: ${humanizeTitle(value)}`;
  });

  if (!/^project:/m.test(frontmatter) && /^title:/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(
      /^(title:.*)$/m,
      '$1\nproject: "[project-id]"',
    );
  }

  if (!/^lifecycle_state:/m.test(frontmatter) && /^status:/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(/^status:/m, "lifecycle_state:");
  }

  const updated = original.replace(frontmatterMatch[1], frontmatter);
  if (updated === original) continue;

  fs.writeFileSync(filePath, updated, "utf8");
  changedFiles += 1;
  console.log(
    `[HUMAN-FIRST] ${path.relative(repositoryRoot, filePath).replaceAll("\\", "/")}`,
  );
}

console.log(`[HUMAN-FIRST] Updated ${changedFiles} template file(s).`);
