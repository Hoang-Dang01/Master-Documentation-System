import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  ArtifactEdge,
  ArtifactNode,
  EdgeEvidence,
  GraphIndexResult,
  GraphIssue,
  GraphProjection,
  GraphQuery,
  ArtifactNodeDetail,
} from "@mds/domain";

const FRONTMATTER = /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/;
const TRACEABILITY_ID = /^[A-Z0-9]+(?:-[A-Z0-9]+){2,}$/;
const DAG_RELATIONSHIPS = new Set([
  "depends_on",
  "supersedes",
  "implements",
  "produces",
  "synthesizes",
  "elaborates",
]);

type ParsedRelationship = {
  type: string;
  targetId: string;
  evidence: EdgeEvidence;
};

type ParsedArtifact = {
  metadata: Record<string, unknown>;
  relationships: ParsedRelationship[];
};

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function scalar(value: string): unknown {
  const clean = unquote(value.replace(/\s+#.*$/, "").trim());
  if (clean === "[]") return [];
  if (clean === "{}") return {};
  if (clean === "true") return true;
  if (clean === "false") return false;
  if (clean === "null" || clean === "~") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(clean)) return Number(clean);
  if (clean.startsWith("[") && clean.endsWith("]")) {
    return clean
      .slice(1, -1)
      .split(",")
      .map((item) => unquote(item.trim()))
      .filter(Boolean);
  }
  return clean;
}

function indentation(line: string): number {
  return line.match(/^ */)?.[0].length ?? 0;
}

function evidence(
  sourcePath: string,
  fieldPath: string,
  rawValue: string,
  line: number,
): EdgeEvidence {
  return {
    artifactPath: sourcePath,
    fieldPath,
    rawValue,
    lineStart: line,
    lineEnd: line,
    origin: "frontmatter",
  };
}

export function parseArtifactFrontmatter(
  content: string,
  sourcePath: string,
  relationshipTypes: ReadonlySet<string>,
): ParsedArtifact {
  const match = content.match(FRONTMATTER);
  if (!match) throw new Error("Artifact does not contain YAML frontmatter.");
  const lines = match[1].split(/\r?\n/);
  const metadata: Record<string, unknown> = {};
  const relationships: ParsedRelationship[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (line.includes("\t")) throw new Error(`Tab indentation at line ${index + 2}.`);
    const top = line.match(/^([A-Za-z_][\w-]*):(?:\s*(.*))?$/);
    if (!top) {
      if (indentation(line) === 0) {
        throw new Error(`Invalid YAML field at line ${index + 2}.`);
      }
      continue;
    }
    const key = top[1];
    const raw = top[2] ?? "";
    if (raw) metadata[key] = scalar(raw);
    else metadata[key] = {};

    const isRelationshipContainer = key === "links" || key === "relationships";
    const isDirectRelationship = relationshipTypes.has(key);
    if (isDirectRelationship && raw) {
      const targets = Array.isArray(scalar(raw)) ? scalar(raw) as string[] : [String(scalar(raw))];
      for (const target of targets) {
        relationships.push({
          type: key,
          targetId: target,
          evidence: evidence(sourcePath, key, target, index + 2),
        });
      }
    }

    if (!isRelationshipContainer && !isDirectRelationship) continue;
    const baseIndent = indentation(line);
    let cursor = index + 1;
    let pendingType: { value: string; line: number } | null = null;
    while (cursor < lines.length && indentation(lines[cursor]) > baseIndent) {
      const child = lines[cursor];
      const trimmed = child.trim();
      const childLine = cursor + 2;
      if (!trimmed || trimmed.startsWith("#")) {
        cursor += 1;
        continue;
      }

      const listType = trimmed.match(/^-\s+type:\s*(.+)$/);
      const objectTarget = trimmed.match(/^target:\s*(.+)$/);
      const listObjectTarget = trimmed.match(/^-\s+target:\s*(.+)$/);
      const mapKey = trimmed.match(/^([A-Za-z_][\w-]*):(?:\s*(.*))?$/);
      const listValue = trimmed.match(/^-\s+(.+)$/);

      if (listType) {
        pendingType = { value: unquote(listType[1]), line: childLine };
      } else if ((objectTarget || listObjectTarget) && pendingType) {
        const target = unquote((objectTarget ?? listObjectTarget)![1]);
        relationships.push({
          type: pendingType.value,
          targetId: target,
          evidence: evidence(sourcePath, `${key}[].target`, target, childLine),
        });
        pendingType = null;
      } else if (mapKey && relationshipTypes.has(mapKey[1])) {
        const relationshipType = mapKey[1];
        const mapRaw = mapKey[2] ?? "";
        if (mapRaw) {
          const parsed = scalar(mapRaw);
          const targets = Array.isArray(parsed) ? parsed : [parsed];
          for (const targetValue of targets) {
            const target = String(targetValue);
            relationships.push({
              type: relationshipType,
              targetId: target,
              evidence: evidence(sourcePath, `${key}.${relationshipType}`, target, childLine),
            });
          }
        } else {
          let nested = cursor + 1;
          while (nested < lines.length && indentation(lines[nested]) > indentation(child)) {
            const nestedValue = lines[nested].trim().match(/^-\s+(.+)$/);
            if (nestedValue) {
              const target = unquote(nestedValue[1]);
              relationships.push({
                type: relationshipType,
                targetId: target,
                evidence: evidence(sourcePath, `${key}.${relationshipType}[]`, target, nested + 2),
              });
            }
            nested += 1;
          }
          cursor = nested - 1;
        }
      } else if (isDirectRelationship && listValue) {
        const target = unquote(listValue[1]);
        relationships.push({
          type: key,
          targetId: target,
          evidence: evidence(sourcePath, `${key}[]`, target, childLine),
        });
      }
      cursor += 1;
    }
    index = Math.max(index, cursor - 1);
  }
  return { metadata, relationships };
}

export async function loadCanonicalRelationshipTypes(
  documentStandardsPath: string,
): Promise<Set<string>> {
  const content = await fs.readFile(documentStandardsPath, "utf8");
  const section = content.match(/## RULE 4:[\s\S]*?(?=\r?\n---\r?\n\r?\n## RULE 5:)/)?.[0];
  if (!section) throw new Error("Canonical relationship policy RULE 4 was not found.");
  const types = new Set<string>();
  for (const match of section.matchAll(/^\| `([a-z_]+)` \|/gm)) types.add(match[1]);
  if (types.size === 0) throw new Error("Canonical relationship policy contains no edge types.");
  return types;
}

async function walkMarkdown(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "audit" || entry.name === "artifacts") continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walkMarkdown(entryPath));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) files.push(entryPath);
  }
  return files.sort((left, right) => left.localeCompare(right));
}

function issueId(type: string, key: string): string {
  return hash(`${type}:${key}`).slice(0, 16);
}

function edgeId(projectId: string, source: string, type: string, target: string): string {
  return hash(`${projectId}:${source}:${type}:${target}`).slice(0, 16);
}

function findCycles(edges: ArtifactEdge[]): string[][] {
  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    if (!DAG_RELATIONSHIPS.has(edge.relationshipType)) continue;
    const targets = adjacency.get(edge.sourceId) ?? [];
    targets.push(edge.targetId);
    adjacency.set(edge.sourceId, targets.sort());
  }
  const cycles: string[][] = [];
  const active = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];
  function visit(node: string): void {
    if (active.has(node)) {
      const start = stack.indexOf(node);
      cycles.push([...stack.slice(start), node]);
      return;
    }
    if (visited.has(node)) return;
    active.add(node);
    stack.push(node);
    for (const target of adjacency.get(node) ?? []) visit(target);
    stack.pop();
    active.delete(node);
    visited.add(node);
  }
  for (const node of [...adjacency.keys()].sort()) visit(node);
  return cycles;
}

export type BuildGraphIndexOptions = {
  projectPath: string;
  activeProjectsRoot: string;
  documentStandardsPath: string;
  completedAt?: string;
};

export async function buildGraphIndex(options: BuildGraphIndexOptions): Promise<GraphIndexResult> {
  const projectPath = path.resolve(options.projectPath);
  const root = path.resolve(options.activeProjectsRoot);
  if (projectPath !== root && !projectPath.startsWith(`${root}${path.sep}`)) {
    throw new Error("Project is outside MDS_DATA_DIR/projects/active.");
  }
  const projectId = path.basename(projectPath);
  const relationshipTypes = await loadCanonicalRelationshipTypes(options.documentStandardsPath);
  const files = await walkMarkdown(projectPath);
  const parsed: Array<{ node: ArtifactNode; relationships: ParsedRelationship[] }> = [];
  const issues: GraphIssue[] = [];

  for (const file of files) {
    const relativePath = path.relative(projectPath, file).replaceAll("\\", "/");
    const content = await fs.readFile(file, "utf8");
    try {
      const artifact = parseArtifactFrontmatter(content, relativePath, relationshipTypes);
      const id = String(artifact.metadata.id ?? "");
      if (!TRACEABILITY_ID.test(id)) {
        issues.push({
          id: issueId("parse_error", relativePath), projectId, type: "parse_error", severity: "error",
          message: `${relativePath}: artifact id is missing or invalid.`,
          evidence: evidence(relativePath, "id", id, 2),
        });
        continue;
      }
      parsed.push({
        node: {
          id,
          projectId,
          artifactType: String(artifact.metadata.artifact_type ?? id.split("-")[1] ?? "UNKNOWN"),
          title: String(artifact.metadata.title ?? id),
          lifecycleState: artifact.metadata.lifecycle_state ? String(artifact.metadata.lifecycle_state) : undefined,
          sourcePath: relativePath,
          contentHash: hash(content),
          metadata: artifact.metadata,
        },
        relationships: artifact.relationships,
      });
    } catch (error) {
      issues.push({
        id: issueId("parse_error", relativePath), projectId, type: "parse_error", severity: "error",
        message: `${relativePath}: ${error instanceof Error ? error.message : String(error)}`,
        evidence: evidence(relativePath, "frontmatter", "", 1),
      });
    }
  }

  const byId = new Map<string, typeof parsed[number]>();
  for (const artifact of parsed.sort((a, b) => a.node.sourcePath.localeCompare(b.node.sourcePath))) {
    const existing = byId.get(artifact.node.id);
    if (existing) {
      issues.push({
        id: issueId("duplicate_artifact_id", `${artifact.node.id}:${artifact.node.sourcePath}`),
        projectId, type: "duplicate_artifact_id", severity: "error", nodeId: artifact.node.id,
        message: `Duplicate artifact id ${artifact.node.id} in ${existing.node.sourcePath} and ${artifact.node.sourcePath}.`,
        evidence: evidence(artifact.node.sourcePath, "id", artifact.node.id, 2),
      });
      continue;
    }
    byId.set(artifact.node.id, artifact);
  }

  const edges: ArtifactEdge[] = [];
  for (const artifact of [...byId.values()].sort((a, b) => a.node.id.localeCompare(b.node.id))) {
    for (const relationship of artifact.relationships) {
      const id = edgeId(projectId, artifact.node.id, relationship.type, relationship.targetId);
      const edge: ArtifactEdge = {
        id, projectId, sourceId: artifact.node.id, targetId: relationship.targetId,
        relationshipType: relationship.type, direction: "outbound", status: "confirmed",
        origin: "parsed", evidence: [relationship.evidence],
      };
      if (!relationshipTypes.has(relationship.type)) {
        issues.push({
          id: issueId("invalid_relationship", id), projectId, type: "invalid_relationship",
          severity: "error", nodeId: artifact.node.id, edgeId: id,
          message: `Relationship ${relationship.type} is not canonical.`, evidence: relationship.evidence,
        });
        continue;
      }
      edges.push(edge);
      if (!byId.has(relationship.targetId) && !relationship.targetId.startsWith("EXT-REF-")) {
        issues.push({
          id: issueId("broken_reference", id), projectId, type: "broken_reference",
          severity: "error", nodeId: artifact.node.id, edgeId: id,
          message: `${artifact.node.id} ${relationship.type} target ${relationship.targetId} does not exist.`,
          evidence: relationship.evidence,
        });
      }
    }
  }

  for (const cycle of findCycles(edges)) {
    issues.push({
      id: issueId("cycle_detected", cycle.join("->")), projectId, type: "cycle_detected",
      severity: "error", nodeId: cycle[0], message: `Governed relationship cycle: ${cycle.join(" -> ")}.`,
    });
  }

  const nodes = [...byId.values()].map((item) => item.node).sort((a, b) => a.id.localeCompare(b.id));
  edges.sort((a, b) => `${a.sourceId}:${a.relationshipType}:${a.targetId}`.localeCompare(`${b.sourceId}:${b.relationshipType}:${b.targetId}`));
  issues.sort((a, b) => `${a.type}:${a.id}`.localeCompare(`${b.type}:${b.id}`));
  const completedAt = options.completedAt ?? new Date().toISOString();
  return {
    projectId,
    runId: hash(`${projectId}:${nodes.map((node) => node.contentHash).join(":")}`).slice(0, 16),
    scannedFiles: files.length,
    indexedNodes: nodes.length,
    indexedEdges: edges.length,
    nodes,
    edges,
    issues,
    completedAt,
  };
}

export function queryGraphProjection(
  graph: GraphIndexResult,
  query: GraphQuery,
): GraphProjection {
  const limit = Math.max(1, Math.min(query.limit ?? 500, 2000));
  const artifactTypes = new Set(query.artifactTypes ?? []);
  const relationshipTypes = new Set(query.relationshipTypes ?? []);
  const search = query.search?.trim().toLocaleLowerCase() ?? "";
  const nodes = graph.nodes.filter((node) =>
    (artifactTypes.size === 0 || artifactTypes.has(node.artifactType)) &&
    (!search || `${node.id} ${node.title}`.toLocaleLowerCase().includes(search)),
  ).slice(0, limit);
  const nodeIds = new Set(nodes.map((node) => node.id));
  const allNodeIds = new Set(graph.nodes.map((node) => node.id));
  const edges = graph.edges.filter((edge) =>
    nodeIds.has(edge.sourceId) && (nodeIds.has(edge.targetId) || !allNodeIds.has(edge.targetId)) &&
    (relationshipTypes.size === 0 || relationshipTypes.has(edge.relationshipType)),
  );
  const edgeIds = new Set(edges.map((edge) => edge.id));
  const issues = graph.issues.filter((issue) =>
    (!issue.nodeId || nodeIds.has(issue.nodeId)) && (!issue.edgeId || edgeIds.has(issue.edgeId) || !query.search),
  );
  return { projectId: graph.projectId, nodes, edges, issues };
}

export function getGraphNodeDetail(
  graph: GraphIndexResult,
  nodeId: string,
): ArtifactNodeDetail | null {
  const node = graph.nodes.find((candidate) => candidate.id === nodeId);
  if (!node) return null;
  return {
    ...node,
    incoming: graph.edges.filter((edge) => edge.targetId === nodeId),
    outgoing: graph.edges.filter((edge) => edge.sourceId === nodeId),
    issues: graph.issues.filter((issue) => issue.nodeId === nodeId),
  };
}
