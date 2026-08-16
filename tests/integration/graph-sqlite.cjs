const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "../..");
const {
  buildGraphIndex,
} = require(path.join(repositoryRoot, "packages/application/requirements/dist/index.js"));
const { SqliteGraphIndexRepository } = require(path.join(repositoryRoot, "packages/infrastructure/persistence/dist/index.js"));

function comparable(result) {
  return {
    projectId: result.projectId,
    runId: result.runId,
    scannedFiles: result.scannedFiles,
    indexedNodes: result.indexedNodes,
    indexedEdges: result.indexedEdges,
    completedAt: result.completedAt,
    nodes: result.nodes,
    edges: result.edges,
    issues: result.issues,
  };
}

async function main() {
  const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "mds-sqlite-"));
  const activeRoot = path.join(temporaryRoot, "active");
  const projectPath = path.join(activeRoot, "edumeet");
  const databasePath = path.join(temporaryRoot, "mds.sqlite");
  await fs.mkdir(activeRoot, { recursive: true });
  await fs.cp(path.join(repositoryRoot, "workspace/projects/active/edumeet"), projectPath, { recursive: true });
  const graph = await buildGraphIndex({
    projectPath,
    activeProjectsRoot: activeRoot,
    documentStandardsPath: path.join(repositoryRoot, "mds-core/standards/document_standards.md"),
    completedAt: "2026-07-29T00:00:00.000Z",
  });
  try {
    let repository = new SqliteGraphIndexRepository(databasePath);
    repository.migrate();
    repository.replaceProject(graph);
    assert.deepEqual(comparable(repository.readProject("edumeet")), comparable(graph));
    repository.close();

    await fs.rm(databasePath);
    repository = new SqliteGraphIndexRepository(databasePath);
    repository.migrate();
    repository.replaceProject(graph);
    assert.deepEqual(comparable(repository.readProject("edumeet")), comparable(graph));
    repository.deleteProject("edumeet");
    assert.equal(repository.readProject("edumeet"), null);
    repository.close();
    console.log(JSON.stringify({
      database: "temporary mds.sqlite",
      nodes: graph.nodes.length,
      edges: graph.edges.length,
      issues: graph.issues.length,
      rebuildEquivalent: true,
    }, null, 2));
  } finally {
    await fs.rm(temporaryRoot, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
