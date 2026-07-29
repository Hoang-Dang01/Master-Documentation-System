const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "../..");
const domain = require(path.join(repositoryRoot, "packages/core/domain/dist/index.js"));
const {
  buildGraphIndex,
  loadCanonicalRelationshipTypes,
  parseArtifactFrontmatter,
} = require(path.join(repositoryRoot, "packages/application/requirements/dist/index.js"));

const standardsPath = path.join(repositoryRoot, "mds-core/standards/document_standards.md");
const fixturesPath = path.join(repositoryRoot, "tests/fixtures/graph");
const mode = process.argv[2] || "--all";

function relevantProjection(result) {
  return {
    projectId: result.projectId,
    scannedFiles: result.scannedFiles,
    indexedNodes: result.indexedNodes,
    indexedEdges: result.indexedEdges,
    nodes: result.nodes,
    edges: result.edges,
    issues: result.issues,
  };
}

async function sha256Files(root) {
  const hashes = {};
  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        hashes[path.relative(root, full).replaceAll("\\", "/")] = crypto
          .createHash("sha256")
          .update(await fs.readFile(full))
          .digest("hex");
      }
    }
  }
  await walk(root);
  return hashes;
}

async function parserTests(types) {
  const scalar = parseArtifactFrontmatter(
    await fs.readFile(path.join(fixturesPath, "scalar.md"), "utf8"),
    "scalar.md",
    types,
  );
  assert.deepEqual(scalar.relationships.map(({ type, targetId }) => ({ type, targetId })), [
    { type: "implements", targetId: "BA-BRD-TST-CORE-001" },
  ]);

  const list = parseArtifactFrontmatter(
    await fs.readFile(path.join(fixturesPath, "list.md"), "utf8"),
    "list.md",
    types,
  );
  assert.equal(list.relationships[0].targetId, "PM-TSK-TST-CORE-002");

  const nested = parseArtifactFrontmatter(
    await fs.readFile(path.join(fixturesPath, "nested-map.md"), "utf8"),
    "nested-map.md",
    types,
  );
  assert.deepEqual(nested.relationships.map(({ type, targetId }) => ({ type, targetId })), [
    { type: "implements", targetId: "BA-REQ-TST-CORE-001" },
    { type: "depends_on", targetId: "BE-DB-TST-CORE-001" },
  ]);

  const listObject = parseArtifactFrontmatter(
    await fs.readFile(path.join(fixturesPath, "list-object.md"), "utf8"),
    "list-object.md",
    types,
  );
  assert.equal(listObject.relationships[0].type, "verifies");
  assert.equal(listObject.relationships[0].evidence.fieldPath, "links[].target");

  assert.throws(
    () => parseArtifactFrontmatter("---\nid: X\n\tbad: true\n---\n", "bad.md", types),
    /Tab indentation/,
  );
}

async function syntheticGraphTests(tempRoot) {
  const activeRoot = path.join(tempRoot, "active");
  const project = path.join(activeRoot, "synthetic");
  await fs.mkdir(project, { recursive: true });
  const write = (name, value) => fs.writeFile(path.join(project, name), value, "utf8");
  await write("a.md", `---
id: PM-TSK-SYN-CORE-001
title: A
project: synthetic
lifecycle_state: DRAFT
version: 0.1.0
owner: pm_agent
links:
  - type: depends_on
    target: PM-TSK-SYN-CORE-002
  - type: made_up
    target: BA-REQ-SYN-CORE-999
---
`);
  await write("b.md", `---
id: PM-TSK-SYN-CORE-002
title: B
project: synthetic
lifecycle_state: DRAFT
version: 0.1.0
owner: pm_agent
links:
  - type: depends_on
    target: PM-TSK-SYN-CORE-001
---
`);
  await write("duplicate.md", `---
id: PM-TSK-SYN-CORE-002
title: Duplicate B
project: synthetic
lifecycle_state: DRAFT
version: 0.1.0
owner: pm_agent
---
`);
  await write("broken.md", `---
id: BE-API-SYN-CORE-001
title: Broken target
project: synthetic
lifecycle_state: DRAFT
version: 0.1.0
owner: dev_agent
links:
  - type: implements
    target: BA-REQ-SYN-CORE-404
---
`);
  await write("reference-a.md", `---
id: ARCH-ADR-SYN-CORE-001
title: Reference A
project: synthetic
lifecycle_state: DRAFT
version: 0.1.0
owner: arch_agent
links:
  - type: references
    target: ARCH-ADR-SYN-CORE-002
---
`);
  await write("reference-b.md", `---
id: ARCH-ADR-SYN-CORE-002
title: Reference B
project: synthetic
lifecycle_state: DRAFT
version: 0.1.0
owner: arch_agent
links:
  - type: references
    target: ARCH-ADR-SYN-CORE-001
---
`);

  const options = { projectPath: project, activeProjectsRoot: activeRoot, documentStandardsPath: standardsPath, completedAt: "2026-07-27T00:00:00.000Z" };
  const first = await buildGraphIndex(options);
  const second = await buildGraphIndex(options);
  assert.deepEqual(relevantProjection(first), relevantProjection(second));
  assert(first.issues.some((issue) => issue.type === "duplicate_artifact_id"));
  assert(first.issues.some((issue) => issue.type === "broken_reference"));
  assert(first.issues.some((issue) => issue.type === "invalid_relationship"));
  assert.equal(first.issues.filter((issue) => issue.type === "cycle_detected").length, 1);
  assert(first.nodes.some((node) => node.id === "BE-API-SYN-CORE-001"));
  assert(first.edges.every((edge) => edge.evidence.length > 0));
  assert(first.edges.every((edge) => edge.direction === "outbound"));
}

async function edumeetTest(tempRoot) {
  const source = path.join(repositoryRoot, "workspace/projects/active/edumeet");
  const before = await sha256Files(source);
  const activeRoot = path.join(tempRoot, "edumeet-active");
  const project = path.join(activeRoot, "edumeet");
  await fs.mkdir(activeRoot, { recursive: true });
  await fs.cp(source, project, { recursive: true });
  const result = await buildGraphIndex({
    projectPath: project,
    activeProjectsRoot: activeRoot,
    documentStandardsPath: standardsPath,
    completedAt: "2026-07-27T00:00:00.000Z",
  });
  const known = result.issues.find(
    (issue) => issue.type === "broken_reference" && issue.message.includes("BA-REQ-EDU-AI-001"),
  );
  assert(known, "Expected known EduMeet broken reference");
  assert.equal(known.evidence.artifactPath, "design/backend/dao-tao-mo-hinh-phat-hien-url.md");
  assert.deepEqual(await sha256Files(source), before);
  console.log(JSON.stringify({
    projectId: result.projectId,
    scannedFiles: result.scannedFiles,
    indexedNodes: result.indexedNodes,
    indexedEdges: result.indexedEdges,
    issueCounts: Object.fromEntries(
      [...new Set(result.issues.map((issue) => issue.type))].sort().map((type) => [type, result.issues.filter((issue) => issue.type === type).length]),
    ),
  }, null, 2));
}

async function main() {
  assert(domain.GraphProjection === undefined, "Domain graph contracts must remain type-only at runtime");
  const types = await loadCanonicalRelationshipTypes(standardsPath);
  assert(types.has("implements"));
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-graph-"));
  try {
    if (["--all", "--parser-only", "--normalization-only", "--evidence"].includes(mode)) await parserTests(types);
    if (["--all", "--determinism", "--integrity", "--policy", "--evidence"].includes(mode)) await syntheticGraphTests(tempRoot);
    if (mode === "--all") await edumeetTest(tempRoot);
    console.log(`Graph index verification passed (${mode}).`);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
