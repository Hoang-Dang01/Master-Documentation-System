#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..", "..", "..");
const vendorRoot = path.join(repositoryRoot, "skills", "vendor");
const registryPath = path.join(vendorRoot, "registry.yaml");

if (!fs.existsSync(registryPath)) {
  console.error("[SKILL REGISTRY] Missing skills/vendor/registry.yaml.");
  process.exit(1);
}

const content = fs.readFileSync(registryPath, "utf8");
const lines = content.split(/\r?\n/);
const enabledNames = new Set();
const enabledPaths = [];
let section = "";
let pendingName = "";

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed === "enabled_skills:") {
    section = "enabled";
    continue;
  }
  if (/^[a-z_]+:$/.test(trimmed) && trimmed !== "enabled_skills:") {
    section = trimmed.slice(0, -1);
    continue;
  }
  if (section !== "enabled") continue;

  const nameMatch = trimmed.match(/^-\s+name:\s+(.+)$/);
  if (nameMatch) {
    pendingName = nameMatch[1].trim();
    if (enabledNames.has(pendingName)) {
      console.error(`[SKILL REGISTRY] Duplicate enabled skill: ${pendingName}`);
      process.exitCode = 1;
    }
    enabledNames.add(pendingName);
    continue;
  }

  const pathMatch = trimmed.match(/^path:\s+(.+)$/);
  if (pathMatch) {
    enabledPaths.push({ name: pendingName, relativePath: pathMatch[1].trim() });
    pendingName = "";
  }
}

if (enabledPaths.length === 0) {
  console.error("[SKILL REGISTRY] No enabled skills found.");
  process.exit(1);
}

for (const entry of enabledPaths) {
  const resolved = path.resolve(vendorRoot, entry.relativePath);
  const staysInsideVendor =
    resolved === vendorRoot || resolved.startsWith(`${vendorRoot}${path.sep}`);

  if (!staysInsideVendor) {
    console.error(`[SKILL REGISTRY] Path escapes vendor root: ${entry.relativePath}`);
    process.exitCode = 1;
  } else if (!fs.existsSync(resolved)) {
    console.error(
      `[SKILL REGISTRY] Missing path for ${entry.name}: ${entry.relativePath}`,
    );
    process.exitCode = 1;
  }
}

if (!process.exitCode) {
  console.log(
    `[SKILL REGISTRY] ${enabledPaths.length} enabled vendor skill(s) validated.`,
  );
}
