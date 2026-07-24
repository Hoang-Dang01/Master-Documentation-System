#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..", "..", "..");
const outputRelativePath = "docs/STRUCTURE.generated.md";
const outputPath = path.join(repositoryRoot, outputRelativePath);
const checkOnly = process.argv.includes("--check");

const excludedDirectoryNames = new Set([".git", "node_modules"]);
const collapsedDirectoryNames = new Set([
  ".turbo",
  ".vite",
  "build",
  "coverage",
  "dist",
  "dist-electron",
  "out",
]);

function compareEntries(left, right) {
  if (left.isDirectory() !== right.isDirectory()) {
    return left.isDirectory() ? -1 : 1;
  }
  return left.name.localeCompare(right.name, "en", {
    numeric: true,
    sensitivity: "base",
  });
}

function shouldExclude(relativePath, entry) {
  if (relativePath.replaceAll("\\", "/") === outputRelativePath) {
    return true;
  }
  return entry.isDirectory() && excludedDirectoryNames.has(entry.name);
}

function renderDirectory(directoryPath, prefix = "") {
  const entries = fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => {
      const relativePath = path.relative(
        repositoryRoot,
        path.join(directoryPath, entry.name),
      );
      return !shouldExclude(relativePath, entry);
    })
    .sort(compareEntries);

  const lines = [];

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childPrefix = `${prefix}${isLast ? "    " : "│   "}`;
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      const collapsed = collapsedDirectoryNames.has(entry.name);
      lines.push(
        `${prefix}${connector}${entry.name}/${collapsed ? "  [generated contents omitted]" : ""}`,
      );
      if (!collapsed) {
        lines.push(...renderDirectory(entryPath, childPrefix));
      }
    } else if (entry.isSymbolicLink()) {
      lines.push(`${prefix}${connector}${entry.name}  [symlink]`);
    } else {
      lines.push(`${prefix}${connector}${entry.name}`);
    }
  });

  return lines;
}

function buildDocument() {
  const tree = ["Master-Documentation-System/", ...renderDirectory(repositoryRoot)];
  return `<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: repository filesystem -->
<!-- COMMAND: npm run docs:structure -->

# MDS physical repository tree

This file is generated from the current filesystem. Use
\`docs/STRUCTURE.md\` for boundary explanations, \`docs/MIGRATION_MAP.md\` for
AS-IS/TO-BE decisions, and \`docs/CANONICAL_SOURCES.md\` for source-of-truth
ownership.

Excluded directories: \`.git/\`, \`node_modules/\`.
Generated build directories are shown but their contents are collapsed.
The generated file itself is omitted to keep output deterministic.

\`\`\`text
${tree.join("\n")}
\`\`\`
`;
}

const expected = buildDocument();

if (checkOnly) {
  if (!fs.existsSync(outputPath)) {
    console.error(
      `[STRUCTURE] Missing ${outputRelativePath}. Run: npm run docs:structure`,
    );
    process.exit(1);
  }

  const actual = fs.readFileSync(outputPath, "utf8");
  if (actual !== expected) {
    console.error(
      `[STRUCTURE] Drift detected in ${outputRelativePath}. Run: npm run docs:structure`,
    );
    process.exit(1);
  }

  console.log(`[STRUCTURE] ${outputRelativePath} is current.`);
  process.exit(0);
}

fs.writeFileSync(outputPath, expected, "utf8");
console.log(`[STRUCTURE] Generated ${outputRelativePath}.`);
