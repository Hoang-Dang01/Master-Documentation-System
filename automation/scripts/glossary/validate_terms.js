const ID_REGEX = /^AST-GLOSSARY-[A-Z_]+-\d{3}$/;
const VERSION_REGEX = /^\d+\.\d+\.\d+$/;
const ALLOWED_STATUSES = new Set(["DRAFT", "REVIEW", "APPROVED", "DEPRECATED"]);

function validateTerms(allTerms) {
    const errors = [];
    const termMap = new Map(); // normalized term -> term object
    const idMap = new Map();   // id -> term object
    const aliasMap = new Map(); // normalized alias -> term object

    // Phase 1: Structural and Duplicate Checks
    for (const item of allTerms) {
        const fileContext = item._file || "unknown file";

        // Required fields check
        const required = ["artifact_id", "term", "canonical_name", "category", "namespace", "domain", "version", "status", "owner", "definition"];
        for (const req of required) {
            if (!item[req]) {
                errors.push(`[SCHEMA ERROR] File ${fileContext}: Term '${item.term || "unknown"}' is missing required field '${req}'`);
            }
        }

        if (item.artifact_id) {
            if (!ID_REGEX.test(item.artifact_id)) {
                errors.push(`[SCHEMA ERROR] File ${fileContext}: Invalid artifact_id format '${item.artifact_id}'`);
            }
            if (idMap.has(item.artifact_id)) {
                errors.push(`[DUPLICATE ID] File ${fileContext}: Duplicate artifact_id '${item.artifact_id}' already defined by term '${idMap.get(item.artifact_id).term}'`);
            } else {
                idMap.set(item.artifact_id, item);
            }
        }

        if (item.version && !VERSION_REGEX.test(item.version)) {
            errors.push(`[SCHEMA ERROR] File ${fileContext}: Invalid version format '${item.version}'`);
        }

        if (item.status && !ALLOWED_STATUSES.has(item.status)) {
            errors.push(`[SCHEMA ERROR] File ${fileContext}: Invalid status '${item.status}'`);
        }

        if (item.term) {
            const normalizedTerm = item.term.toLowerCase();
            if (termMap.has(normalizedTerm)) {
                errors.push(`[DUPLICATE TERM] File ${fileContext}: Duplicate term name '${item.term}' already defined`);
            } else {
                termMap.set(normalizedTerm, item);
            }
        }
    }

    // Phase 2: Alias Collision Checks
    for (const item of allTerms) {
        if (!item.term) continue;
        const normalizedTerm = item.term.toLowerCase();

        if (item.aliases) {
            for (const alias of item.aliases) {
                const normalizedAlias = alias.toLowerCase();
                if (termMap.has(normalizedAlias)) {
                    errors.push(`[ALIAS COLLISION] Term '${item.term}' has alias '${alias}' which is already a defined term`);
                }
                if (aliasMap.has(normalizedAlias) && aliasMap.get(normalizedAlias).term !== item.term) {
                    errors.push(`[ALIAS COLLISION] Duplicate alias '${alias}' shared between term '${item.term}' and term '${aliasMap.get(normalizedAlias).term}'`);
                } else {
                    aliasMap.set(normalizedAlias, item);
                }
            }
        }
    }

    // Phase 3: Dangling Reference Checks for related_terms
    for (const item of allTerms) {
        if (item.related_terms) {
            for (const rel of item.related_terms) {
                const normalizedRel = rel.toLowerCase();
                if (!termMap.has(normalizedRel)) {
                    errors.push(`[DANGLING REFERENCE] Term '${item.term}' references non-existent related term '${rel}'`);
                }
            }
        }
    }

    return errors;
}

module.exports = { validateTerms };
