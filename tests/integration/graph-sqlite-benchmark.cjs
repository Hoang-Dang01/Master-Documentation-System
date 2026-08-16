const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const { SqliteGraphIndexRepository } = require("../../packages/infrastructure/persistence/dist/index.js");

async function main() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "mds-sqlite-bench-"));
  const databasePath = path.join(root, "mds.sqlite");
  const nodes = Array.from({ length: 10000 }, (_, index) => ({
    id: `PM-TSK-BEN-CORE-${String(index).padStart(5, "0")}`,
    projectId: "benchmark", artifactType: "TSK", title: `Task ${index}`,
    sourcePath: `tasks/${index}.md`, contentHash: String(index).padStart(64, "0"), metadata: {},
  }));
  const edges = Array.from({ length: 50000 }, (_, index) => ({
    id: `edge-${index}`, projectId: "benchmark",
    sourceId: nodes[index % nodes.length].id,
    targetId: nodes[(index + 1) % nodes.length].id,
    relationshipType: `depends_on_${Math.floor(index / nodes.length)}`,
    direction: "outbound", status: "confirmed", origin: "parsed",
    evidence: [{ artifactPath: `tasks/${index % nodes.length}.md`, fieldPath: "links[].target", origin: "frontmatter" }],
  }));
  const graph = {
    projectId: "benchmark", runId: "benchmark-run", scannedFiles: nodes.length,
    indexedNodes: nodes.length, indexedEdges: edges.length,
    completedAt: "2026-07-29T00:00:00.000Z", nodes, edges, issues: [],
  };
  const repository = new SqliteGraphIndexRepository(databasePath);
  try {
    repository.migrate();
    const writeStart = performance.now();
    repository.replaceProject(graph);
    const writeMs = performance.now() - writeStart;
    const readStart = performance.now();
    const loaded = repository.readProject("benchmark");
    const readMs = performance.now() - readStart;
    if (loaded.nodes.length !== 10000 || loaded.edges.length !== 50000) throw new Error("Benchmark row count mismatch.");
    console.log(JSON.stringify({ nodes: 10000, edges: 50000, writeMs: Math.round(writeMs), readMs: Math.round(readMs) }, null, 2));
  } finally {
    repository.close();
    await fs.rm(root, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
