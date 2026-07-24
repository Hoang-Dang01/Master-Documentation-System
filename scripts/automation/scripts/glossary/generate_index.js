const fs = require('fs');
const path = require('path');

function generateIndex(allTerms, renderedFilesMap, targetBase) {
    // Sort terms alphabetically
    const sortedTerms = [...allTerms].sort((a, b) => a.term.localeCompare(b.term));

    let content = `<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/ -->
---
id: AST-GLOSSARY-INDEX-FILE
name: Glossary Cross-Reference Index
artifact_type: REG
domain: META
owner: MDS_CORE
status: APPROVED
version: 1.1.0
tags:
  - glossary
  - core
created_at: 2026-06-29
updated_at: 2026-06-29
last_updated_by: build_glossary.js
change_summary: Auto-compiled glossary index
links:
  depends_on: []
---

# Glossary Index

Alphabetical index of all terms in the Master Documentation System (MDS).

| Term | Canonical Name | Category | Source File |
| ---- | -------------- | -------- | ----------- |
`;

    for (const term of sortedTerms) {
        const outName = renderedFilesMap.get(term._file);
        const link = `./${outName}#${term.term.toLowerCase()}`;
        content += `| [${term.term}](${link}) | ${term.canonical_name} | \`${term.category}\` | [${term._file}](./data/${term._file}) |\n`;
    }

    const indexPath = path.join(targetBase, 'core', 'glossary', 'glossary_index.md');
    fs.writeFileSync(indexPath, content.trim() + '\n', 'utf8');
    console.log(`Generated index: glossary_index.md`);
}

module.exports = { generateIndex };
