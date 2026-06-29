const fs = require('fs');
const path = require('path');

const FILE_ARTIFACT_IDS = {
    '01_core_terms.yaml': 'AST-GLOSSARY-CORE-FILE',
    '02_relations.yaml': 'AST-GLOSSARY-REL-FILE',
    '03_artifact_types.yaml': 'AST-GLOSSARY-TYPES-FILE',
    '04_backend_terms.yaml': 'AST-GLOSSARY-BE-FILE',
    '05_database_terms.yaml': 'AST-GLOSSARY-DB-FILE',
    '06_frontend_terms.yaml': 'AST-GLOSSARY-FE-FILE',
    '07_devops_terms.yaml': 'AST-GLOSSARY-DEVOPS-FILE',
    '08_acronyms.yaml': 'AST-GLOSSARY-ACR-FILE'
};

function renderMarkdown(fileName, terms, targetBase) {
    const fileArtifactId = FILE_ARTIFACT_IDS[fileName] || 'AST-GLOSSARY-UNKNOWN-FILE';
    const categoryTitle = fileName.replace('.yaml', '').split('_').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    let content = `<!-- AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY -->
<!-- SOURCE: core/glossary/data/${fileName} -->
---
id: ${fileArtifactId}
name: ${categoryTitle} Glossary
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
change_summary: Auto-compiled glossary markdown
links:
  depends_on: []
---

# ${categoryTitle} Glossary

`;

    for (const term of terms) {
        content += `## ${term.term}\n\n`;
        content += `*   **Artifact ID**: \`${term.artifact_id}\`\n`;
        content += `*   **Canonical Name**: \`${term.canonical_name}\`\n`;
        content += `*   **Category**: \`${term.category}\`\n`;
        content += `*   **Namespace**: \`${term.namespace}\`\n`;
        content += `*   **Domain**: \`${term.domain}\`\n`;
        if (term.lifecycle_phase && term.lifecycle_phase.length > 0) {
            content += `*   **Lifecycle Phase**: ${term.lifecycle_phase.map(p => `\`${p}\``).join(', ')}\n`;
        }
        content += `*   **Version**: \`${term.version}\`\n`;
        content += `*   **Status**: \`${term.status}\`\n`;
        content += `*   **Owner**: \`${term.owner}\`\n`;
        content += `*   **Definition**: ${term.definition}\n`;
        
        if (term.aliases && term.aliases.length > 0) {
            content += `*   **Aliases**: ${term.aliases.map(a => `\`${a}\``).join(', ')}\n`;
        }
        if (term.examples && term.examples.length > 0) {
            content += `*   **Examples**:\n`;
            for (const ex of term.examples) {
                content += `    * ${ex}\n`;
            }
        }
        if (term.notes && term.notes.length > 0) {
            content += `*   **Notes**:\n`;
            for (const n of term.notes) {
                content += `    * ${n}\n`;
            }
        }
        if (term.inverse_relation) {
            content += `*   **Inverse Relation**: \`${term.inverse_relation}\`\n`;
        }
        if (term.edge_direction) {
            content += `*   **Edge Direction**: \`${term.edge_direction}\`\n`;
        }
        if (typeof term.transitive === 'boolean') {
            content += `*   **Transitive**: \`${term.transitive}\`\n`;
        }
        if (term.related_terms && term.related_terms.length > 0) {
            content += `*   **Related Terms**: ${term.related_terms.map(t => `[${t}](#${t.toLowerCase()})`).join(', ')}\n`;
        }
        content += `\n---\n\n`;
    }

    const outName = 'glossary_' + fileName.replace('.yaml', '').toLowerCase() + '.md';
    const outPath = path.join(targetBase, 'core', 'glossary', outName);
    fs.writeFileSync(outPath, content.trim() + '\n', 'utf8');
    console.log(`Rendered markdown: ${outName}`);
    return outName;
}

module.exports = { renderMarkdown };
