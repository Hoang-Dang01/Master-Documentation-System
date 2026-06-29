const fs = require('fs');

function parseYamlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseYamlString(content);
}

function parseYamlString(content) {
    const items = [];
    let currentItem = null;
    let currentKey = null;
    let inBlock = false;
    let blockIndent = 0;
    let blockLines = [];

    const lines = content.split(/\r?\n/);
    for (let line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        // Check if starting a new item
        if (line.startsWith('-')) {
            if (currentItem) {
                items.push(currentItem);
            }
            currentItem = {};
            inBlock = false;
            // Process the rest of the line as a key-value
            line = line.substring(1).trim();
        }

        if (!currentItem) continue;

        // Handle block strings (multi-line)
        if (inBlock) {
            const indent = line.search(/\S/);
            if (indent > blockIndent) {
                blockLines.push(line.substring(blockIndent));
                continue;
            } else {
                currentItem[currentKey] = blockLines.join('\n').trim();
                inBlock = false;
                blockLines = [];
            }
        }

        if (line.includes(':')) {
            const colonIndex = line.indexOf(':');
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();

            currentKey = key;

            if (value === '>' || value === '|') {
                inBlock = true;
                blockIndent = line.search(/\S/) + 2; // expect indented block
                blockLines = [];
            } else if (value === '[]') {
                currentItem[key] = [];
            } else if (value.startsWith('[') && value.endsWith(']')) {
                // Parse simple inline array: [a, b, c]
                currentItem[key] = value.substring(1, value.length - 1)
                    .split(',')
                    .map(s => s.trim().replace(/^["']|["']$/g, ''))
                    .filter(Boolean);
            } else {
                currentItem[key] = value.replace(/^["']|["']$/g, '');
            }
        } else if (line.trim().startsWith('-')) {
            // Indented list item for the current key
            const val = line.trim().substring(1).trim().replace(/^["']|["']$/g, '');
            if (currentItem[currentKey] && Array.isArray(currentItem[currentKey])) {
                currentItem[currentKey].push(val);
            } else {
                currentItem[currentKey] = [val];
            }
        }
    }

    if (currentItem) {
        items.push(currentItem);
    }

    // Ensure array fields default to empty arrays
    for (let item of items) {
        if (!item.aliases) item.aliases = [];
        if (!item.examples) item.examples = [];
        if (!item.notes) item.notes = [];
        if (!item.related_terms) item.related_terms = [];
        if (!item.lifecycle_phase) item.lifecycle_phase = [];
        
        // Ensure aliases/examples/related_terms/notes/lifecycle_phase are arrays
        if (typeof item.aliases === 'string') item.aliases = [item.aliases];
        if (typeof item.examples === 'string') item.examples = [item.examples];
        if (typeof item.notes === 'string') item.notes = [item.notes];
        if (typeof item.related_terms === 'string') item.related_terms = [item.related_terms];
        if (typeof item.lifecycle_phase === 'string') item.lifecycle_phase = [item.lifecycle_phase];
    }

    return items;
}

module.exports = { parseYamlFile, parseYamlString };
