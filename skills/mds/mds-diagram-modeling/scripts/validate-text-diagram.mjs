#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const input = args.find((value) => !value.startsWith("--"));
const typeIndex = args.indexOf("--type");
const type = typeIndex >= 0 ? args[typeIndex + 1] : "";
const supportedTypes = new Set([
  "use-case",
  "class",
  "sequence",
  "activity",
  "state",
  "component",
  "deployment",
  "package",
  "flowchart",
  "erd",
  "context",
  "container",
  "c4-component",
]);

if (!input || !supportedTypes.has(type)) {
  console.error(
    "Usage: node validate-text-diagram.mjs <file.puml|file.mmd> --type <diagram-type>",
  );
  process.exit(2);
}

const filePath = path.resolve(input);
const source = fs.readFileSync(filePath, "utf8");
const extension = path.extname(filePath).toLowerCase();
const errors = [];
const warnings = [];

function requirePattern(pattern, message) {
  if (!pattern.test(source)) errors.push(message);
}

function warnPattern(pattern, message) {
  if (!pattern.test(source)) warnings.push(message);
}

if (![".puml", ".plantuml", ".mmd", ".mermaid"].includes(extension)) {
  errors.push(`Unsupported source extension: ${extension || "(none)"}.`);
}

warnPattern(/diagram-id:/i, "Missing diagram-id comment.");
warnPattern(/derived-from:/i, "Missing derived-from comment.");

if ([".puml", ".plantuml"].includes(extension)) {
  requirePattern(/@startuml/i, "PlantUML source must start with @startuml.");
  requirePattern(/@enduml/i, "PlantUML source must end with @enduml.");

  const rules = {
    "use-case": [
      [/\bactor\b/i, "Use-case diagram must declare an actor."],
      [/\busecase\b|\([^)\r\n]+\)/i, "Use-case diagram must declare a use case."],
      [/\brectangle\b/i, "Use-case diagram should define a system boundary."],
    ],
    class: [[/\bclass\b|\binterface\b/i, "Class diagram must declare a class or interface."]],
    sequence: [
      [/\b(actor|participant|boundary|control|entity|database)\b/i, "Sequence diagram must declare participants."],
      [/(->>|-->>|->|-->)/, "Sequence diagram must contain messages."],
    ],
    activity: [
      [/\bstart\b/i, "Activity diagram must contain a start node."],
      [/\b(stop|end)\b/i, "Activity diagram must contain an end node."],
    ],
    state: [
      [/\[\*\]/, "State diagram must contain an initial or terminal pseudo-state."],
      [/-->/, "State diagram must contain transitions."],
    ],
    component: [[/\bcomponent\b|\[[^\]]+\]/i, "Component diagram must declare a component."]],
    deployment: [[/\b(node|cloud|database|artifact)\b/i, "Deployment diagram must declare a deployment node or artifact."]],
    package: [[/\bpackage\b/i, "Package diagram must declare a package."]],
  };

  if (!rules[type]) errors.push(`Type '${type}' is not supported by PlantUML validation.`);
  else for (const [pattern, message] of rules[type]) requirePattern(pattern, message);
}

if ([".mmd", ".mermaid"].includes(extension)) {
  const starts = {
    class: /^\s*(?:%%[^\n]*\n\s*)*classDiagram\b/im,
    sequence: /^\s*(?:%%[^\n]*\n\s*)*sequenceDiagram\b/im,
    state: /^\s*(?:%%[^\n]*\n\s*)*stateDiagram-v2\b/im,
    flowchart: /^\s*(?:%%[^\n]*\n\s*)*flowchart\b/im,
    erd: /^\s*(?:%%[^\n]*\n\s*)*erDiagram\b/im,
    context: /^\s*(?:%%[^\n]*\n\s*)*C4Context\b/im,
    container: /^\s*(?:%%[^\n]*\n\s*)*C4Container\b/im,
    "c4-component": /^\s*(?:%%[^\n]*\n\s*)*C4Component\b/im,
  };

  if (!starts[type]) errors.push(`Type '${type}' is not supported by Mermaid validation.`);
  else requirePattern(starts[type], `Mermaid source does not start with the expected ${type} declaration.`);

  if (["class", "flowchart"].includes(type)) {
    const openBraces = (source.match(/\{/g) ?? []).length;
    const closeBraces = (source.match(/\}/g) ?? []).length;
    if (openBraces !== closeBraces) errors.push("Unbalanced curly braces.");
  }
}

console.log(`Text diagram check: ${path.basename(filePath)} (${type})`);
for (const warning of warnings) console.log(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`PASSED: 0 errors, ${warnings.length} warning(s).`);
