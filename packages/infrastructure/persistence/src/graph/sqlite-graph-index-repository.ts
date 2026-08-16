import Database from "better-sqlite3";
import type {
  ArtifactEdge,
  ArtifactNode,
  GraphIndexResult,
  GraphIssue,
} from "@mds/domain";
import type { GraphIndexRepository } from "@mds/requirements";

export class SqliteGraphIndexRepository implements GraphIndexRepository {
  private readonly database: Database.Database;

  constructor(databasePath: string) {
    this.database = new Database(databasePath);
    this.database.pragma("foreign_keys = ON");
  }

  migrate(): void {
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS graph_schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS graph_index_runs (
        run_id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        scanned_files INTEGER NOT NULL,
        indexed_nodes INTEGER NOT NULL,
        indexed_edges INTEGER NOT NULL,
        completed_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS artifacts (
        project_id TEXT NOT NULL,
        artifact_id TEXT NOT NULL,
        artifact_type TEXT NOT NULL,
        title TEXT NOT NULL,
        lifecycle_state TEXT,
        source_path TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        metadata_json TEXT NOT NULL,
        PRIMARY KEY (project_id, artifact_id)
      );
      CREATE TABLE IF NOT EXISTS artifact_edges (
        edge_id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        source_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        relationship_type TEXT NOT NULL,
        direction TEXT NOT NULL,
        status TEXT NOT NULL,
        origin TEXT NOT NULL,
        UNIQUE (project_id, source_id, target_id, relationship_type),
        FOREIGN KEY (project_id, source_id) REFERENCES artifacts(project_id, artifact_id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS edge_evidence (
        evidence_id INTEGER PRIMARY KEY AUTOINCREMENT,
        edge_id TEXT NOT NULL,
        artifact_path TEXT NOT NULL,
        field_path TEXT NOT NULL,
        raw_value TEXT,
        line_start INTEGER,
        line_end INTEGER,
        origin TEXT NOT NULL,
        FOREIGN KEY (edge_id) REFERENCES artifact_edges(edge_id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS graph_issues (
        issue_id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        issue_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        message TEXT NOT NULL,
        node_id TEXT,
        edge_id TEXT,
        evidence_json TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_artifacts_type ON artifacts(project_id, artifact_type);
      CREATE INDEX IF NOT EXISTS idx_artifacts_source ON artifacts(project_id, source_path);
      CREATE INDEX IF NOT EXISTS idx_edges_source ON artifact_edges(project_id, source_id);
      CREATE INDEX IF NOT EXISTS idx_edges_target ON artifact_edges(project_id, target_id);
      CREATE INDEX IF NOT EXISTS idx_edges_type ON artifact_edges(project_id, relationship_type);
    `);
    this.database.prepare(
      "INSERT OR IGNORE INTO graph_schema_migrations(version, applied_at) VALUES (1, ?)",
    ).run(new Date().toISOString());
  }

  replaceProject(result: GraphIndexResult): void {
    const replace = this.database.transaction((graph: GraphIndexResult) => {
      this.deleteProjectRows(graph.projectId);
      const nodeStatement = this.database.prepare(`
        INSERT INTO artifacts(project_id, artifact_id, artifact_type, title, lifecycle_state, source_path, content_hash, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const node of graph.nodes) {
        nodeStatement.run(node.projectId, node.id, node.artifactType, node.title,
          node.lifecycleState ?? null, node.sourcePath, node.contentHash, JSON.stringify(node.metadata));
      }
      const edgeStatement = this.database.prepare(`
        INSERT INTO artifact_edges(edge_id, project_id, source_id, target_id, relationship_type, direction, status, origin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const evidenceStatement = this.database.prepare(`
        INSERT INTO edge_evidence(edge_id, artifact_path, field_path, raw_value, line_start, line_end, origin)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      for (const edge of graph.edges) {
        edgeStatement.run(edge.id, edge.projectId, edge.sourceId, edge.targetId,
          edge.relationshipType, edge.direction, edge.status, edge.origin);
        for (const item of edge.evidence) {
          evidenceStatement.run(edge.id, item.artifactPath, item.fieldPath,
            item.rawValue ?? null, item.lineStart ?? null, item.lineEnd ?? null, item.origin);
        }
      }
      const issueStatement = this.database.prepare(`
        INSERT INTO graph_issues(issue_id, project_id, issue_type, severity, message, node_id, edge_id, evidence_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const issue of graph.issues) {
        issueStatement.run(issue.id, issue.projectId, issue.type, issue.severity,
          issue.message, issue.nodeId ?? null, issue.edgeId ?? null,
          issue.evidence ? JSON.stringify(issue.evidence) : null);
      }
      this.database.prepare(`
        INSERT INTO graph_index_runs(run_id, project_id, scanned_files, indexed_nodes, indexed_edges, completed_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(graph.runId, graph.projectId, graph.scannedFiles, graph.indexedNodes,
        graph.indexedEdges, graph.completedAt);
    });
    replace(result);
  }

  readProject(projectId: string): GraphIndexResult | null {
    const run = this.database.prepare(`
      SELECT run_id, project_id, scanned_files, indexed_nodes, indexed_edges, completed_at
      FROM graph_index_runs WHERE project_id = ? ORDER BY completed_at DESC, run_id DESC LIMIT 1
    `).get(projectId) as Record<string, unknown> | undefined;
    if (!run) return null;
    const nodes = this.database.prepare("SELECT * FROM artifacts WHERE project_id = ? ORDER BY artifact_id")
      .all(projectId).map((row: any): ArtifactNode => ({
        id: row.artifact_id, projectId: row.project_id, artifactType: row.artifact_type,
        title: row.title, lifecycleState: row.lifecycle_state ?? undefined,
        sourcePath: row.source_path, contentHash: row.content_hash,
        metadata: JSON.parse(row.metadata_json),
      }));
    const edgeRows = this.database.prepare("SELECT * FROM artifact_edges WHERE project_id = ? ORDER BY source_id, relationship_type, target_id")
      .all(projectId) as any[];
    const evidenceRows = this.database.prepare(`
      SELECT evidence.* FROM edge_evidence evidence
      JOIN artifact_edges edge ON edge.edge_id = evidence.edge_id
      WHERE edge.project_id = ? ORDER BY evidence.evidence_id
    `).all(projectId) as any[];
    const evidenceByEdge = new Map<string, any[]>();
    for (const item of evidenceRows) {
      const current = evidenceByEdge.get(item.edge_id) ?? [];
      current.push(item);
      evidenceByEdge.set(item.edge_id, current);
    }
    const edges = edgeRows.map((row): ArtifactEdge => ({
      id: row.edge_id, projectId: row.project_id, sourceId: row.source_id,
      targetId: row.target_id, relationshipType: row.relationship_type,
      direction: row.direction, status: row.status, origin: row.origin,
      evidence: (evidenceByEdge.get(row.edge_id) ?? []).map((item) => ({
        artifactPath: item.artifact_path, fieldPath: item.field_path,
        rawValue: item.raw_value ?? undefined, lineStart: item.line_start ?? undefined,
        lineEnd: item.line_end ?? undefined, origin: item.origin,
      })),
    }));
    const issues = (this.database.prepare("SELECT * FROM graph_issues WHERE project_id = ? ORDER BY issue_type, issue_id")
      .all(projectId) as any[]).map((row): GraphIssue => ({
        id: row.issue_id, projectId: row.project_id, type: row.issue_type,
        severity: row.severity, message: row.message, nodeId: row.node_id ?? undefined,
        edgeId: row.edge_id ?? undefined,
        evidence: row.evidence_json ? JSON.parse(row.evidence_json) : undefined,
      }));
    return {
      projectId: String(run.project_id), runId: String(run.run_id),
      scannedFiles: Number(run.scanned_files), indexedNodes: Number(run.indexed_nodes),
      indexedEdges: Number(run.indexed_edges), completedAt: String(run.completed_at),
      nodes, edges, issues,
    };
  }

  deleteProject(projectId: string): void {
    this.database.transaction(() => this.deleteProjectRows(projectId))();
  }

  private deleteProjectRows(projectId: string): void {
    this.database.prepare("DELETE FROM graph_issues WHERE project_id = ?").run(projectId);
    this.database.prepare("DELETE FROM artifact_edges WHERE project_id = ?").run(projectId);
    this.database.prepare("DELETE FROM artifacts WHERE project_id = ?").run(projectId);
    this.database.prepare("DELETE FROM graph_index_runs WHERE project_id = ?").run(projectId);
  }

  close(): void {
    this.database.close();
  }
}
