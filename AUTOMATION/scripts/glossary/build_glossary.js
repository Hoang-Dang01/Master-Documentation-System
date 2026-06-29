const fs = require('fs');
const path = require('path');
const { parseYamlFile } = require('./load_terms');
const { validateTerms } = require('./validate_terms');
const { renderMarkdown } = require('./render_markdown');
const { generateIndex } = require('./generate_index');

const scriptDir = __dirname;
const workspaceRoot = path.resolve(scriptDir, "..", "..", "..");

function main() {
    console.log("[GLOSSARY BUILDER] Loading glossary data...");
    const dataDir = path.join(workspaceRoot, "core", "glossary", "data");
    const manifestPath = path.join(workspaceRoot, "core", "glossary", "MANIFEST.yaml");

    if (!fs.existsSync(manifestPath)) {
        console.error(`[FATAL] Manifest file not found at: ${manifestPath}`);
        process.exit(1);
    }

    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const files = [];
    let inFilesSection = false;
    for (const line of manifestContent.split('\n')) {
        if (line.trim().startsWith('files:')) {
            inFilesSection = true;
            continue;
        }
        if (inFilesSection) {
            if (line.trim().startsWith('-')) {
                files.push(line.replace('-', '').trim());
            } else if (line.trim() !== '' && line.includes(':')) {
                break;
            }
        }
    }
    
    let allTerms = [];
    const termFilesMap = new Map();

    for (const file of files) {
        const filePath = path.join(dataDir, file);
        if (!fs.existsSync(filePath)) continue;
        const terms = parseYamlFile(filePath);
        for (let t of terms) {
            t._file = file;
        }
        allTerms = allTerms.concat(terms);
        termFilesMap.set(file, terms);
    }

    console.log(`[GLOSSARY BUILDER] Loaded ${allTerms.length} terms across ${files.length} categories.`);

    // Run Validations
    console.log("[GLOSSARY BUILDER] Running validation pipeline...");
    const errors = validateTerms(allTerms);
    if (errors.length > 0) {
        console.error(`\n[FATAL] Glossary validation failed with ${errors.length} errors:`);
        errors.forEach(e => console.error(` - ${e}`));
        process.exit(1);
    }
    console.log("[GLOSSARY BUILDER] Validation passed successfully!");

    // Render Markdown
    console.log("[GLOSSARY BUILDER] Compiling Markdown files...");
    const renderedFilesMap = new Map();
    for (const [file, terms] of termFilesMap.entries()) {
        const outName = renderMarkdown(file, terms, workspaceRoot);
        renderedFilesMap.set(file, outName);
    }

    // Generate Index
    console.log("[GLOSSARY BUILDER] Compiling index...");
    generateIndex(allTerms, renderedFilesMap, workspaceRoot);

    console.log("\n[SUCCESS] Glossary build completed successfully!");
}

if (require.main === module) {
    main();
}

module.exports = { main };
