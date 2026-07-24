#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const input = args.find((value) => !value.startsWith("--"));
const typeIndex = args.indexOf("--type");
const type = typeIndex >= 0 ? args[typeIndex + 1] : "";

const supportedTypes = new Set([
  "context",
  "use-case",
  "architecture",
  "package",
  "erd",
  "database",
  "sequence",
]);

if (!input || !supportedTypes.has(type)) {
  console.error(
    "Usage: node check_drawio_style.mjs <file.drawio> --type context|use-case|architecture|package|erd|database|sequence",
  );
  process.exit(2);
}

const filePath = path.resolve(input);
const xml = fs.readFileSync(filePath, "utf8");
const errors = [];
const warnings = [];

function requirePattern(pattern, message) {
  if (!pattern.test(xml)) errors.push(message);
}

function warnPattern(pattern, message) {
  if (!pattern.test(xml)) warnings.push(message);
}

requirePattern(/<mxfile\b/, "Missing <mxfile> root.");
requirePattern(/<mxGraphModel\b/, "Missing <mxGraphModel>.");
requirePattern(/grid="1"|data:image\/svg\+xml;base64/i, "Missing approved grid treatment.");

if (/gradientColor=(?!none)/i.test(xml)) {
  errors.push("Gradients are not allowed.");
}
if (/shadow=1/i.test(xml)) {
  errors.push("Shadows are not allowed.");
}
warnPattern(/fontFamily=Arial/i, "Arial is not explicitly declared.");

const rules = {
  context: {
    required: [
      [/#4CAF50/i, "Missing green system node #4CAF50."],
      [/#2196F3/i, "Missing blue third-party node #2196F3."],
      [/#FF9800/i, "Missing orange staff node #FF9800."],
      [/#F44336/i, "Missing red manager node #F44336."],
      [/#9E9E9E/i, "Missing gray admin node #9E9E9E."],
      [/ellipse/i, "Missing central circular system node."],
      [/orthogonalEdgeStyle/i, "Context connectors must be orthogonal."],
    ],
  },
  "use-case": {
    required: [
      [/ellipse/i, "Use cases must use oval/ellipse nodes."],
      [/#FFF9C4|#E1BEE7|#C8E6C9|#FFCCBC/i, "Missing approved pastel use-case palette."],
    ],
  },
  architecture: {
    required: [
      [/#E51400/i, "Missing approved red layer treatment #E51400."],
      [/#B1DDF0/i, "Missing approved API blue #B1DDF0."],
      [/#D5E8D4/i, "Missing approved service green #D5E8D4."],
    ],
  },
  package: {
    required: [
      [/shape=folder|folder/i, "Package diagrams must use folder/package shapes."],
      [/orthogonalEdgeStyle/i, "Package connectors must be orthogonal."],
    ],
  },
  erd: {
    required: [
      [/PK/i, "ERD must mark primary keys."],
      [/FK/i, "ERD must mark foreign keys."],
    ],
  },
  database: {
    required: [
      [/PK/i, "Database diagram must mark primary keys."],
      [/FK/i, "Database diagram must mark foreign keys."],
    ],
  },
  sequence: {
    required: [
      [/dashed=1/i, "Sequence diagram must contain dashed lifelines."],
      [/endArrow=(block|classic)/i, "Sequence messages need directional arrowheads."],
    ],
  },
};

for (const [pattern, message] of rules[type].required) {
  requirePattern(pattern, message);
}

if (/rounded=1/i.test(xml) && !["use-case", "sequence"].includes(type)) {
  warnings.push("Rounded shapes differ from the approved square-corner style.");
}

console.log(`MDS Draw.io style check: ${path.basename(filePath)} (${type})`);
for (const warning of warnings) console.log(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`PASSED: 0 errors, ${warnings.length} warning(s).`);
