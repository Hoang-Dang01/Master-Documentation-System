#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const [input] = process.argv.slice(2);
if (!input) {
  console.error("Usage: node check-traceability.mjs <diagram.diagram.yaml>");
  process.exit(2);
}

const filePath = path.resolve(input);
const yaml = fs.readFileSync(filePath, "utf8");
const errors = [];
const warnings = [];

function scalar(name) {
  return yaml.match(new RegExp(`^\\s{2}${name}:\\s*([^\\r\\n#]+)`, "m"))?.[1]?.trim();
}

function list(name) {
  const block = yaml.match(
    new RegExp(`^\\s{2}${name}:\\s*\\r?\\n((?:\\s{4}-[^\\r\\n]*\\r?\\n?)+)`, "m"),
  )?.[1];
  return block
    ? [...block.matchAll(/^\s{4}-\s*(.+)$/gm)].map((match) => match[1].trim())
    : [];
}

if (!/^diagram:\s*$/m.test(yaml)) errors.push("Missing top-level diagram mapping.");

const id = scalar("id");
const type = scalar("type");
const engine = scalar("engine");
const styleProfile = scalar("style_profile");
const status = scalar("status");
const sourceFile = scalar("source_file");
const derivedFrom = list("derived_from");

if (!id) errors.push("Missing diagram.id.");
else if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(id)) {
  errors.push("diagram.id must be an uppercase hyphenated artifact ID.");
}

const allowedTypes = new Set([
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
if (!allowedTypes.has(type)) errors.push(`Unsupported diagram.type: ${type ?? "(missing)"}.`);

const allowedEngines = new Set(["plantuml", "mermaid", "drawio"]);
if (!allowedEngines.has(engine)) errors.push(`Unsupported diagram.engine: ${engine ?? "(missing)"}.`);

if (!["teacher-approved", "standard"].includes(styleProfile)) {
  errors.push(`Unsupported diagram.style_profile: ${styleProfile ?? "(missing)"}.`);
}

if (!["draft", "review", "approved"].includes(status)) {
  errors.push(`Unsupported diagram.status: ${status ?? "(missing)"}.`);
}

if (!sourceFile) errors.push("Missing diagram.source_file.");
if (derivedFrom.length === 0) errors.push("diagram.derived_from must contain at least one artifact ID.");
for (const artifactId of derivedFrom) {
  if (!/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(artifactId)) {
    errors.push(`Invalid derived_from artifact ID: ${artifactId}.`);
  }
}

if (sourceFile) {
  const resolvedSource = path.resolve(path.dirname(filePath), sourceFile);
  if (!fs.existsSync(resolvedSource)) warnings.push(`Source file does not exist yet: ${resolvedSource}`);
}

console.log(`Traceability check: ${path.basename(filePath)}`);
for (const warning of warnings) console.log(`WARN: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} error(s), ${warnings.length} warning(s).`);
  process.exit(1);
}

console.log(`PASSED: 0 errors, ${warnings.length} warning(s).`);
