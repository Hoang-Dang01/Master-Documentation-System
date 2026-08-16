import { createHash } from "node:crypto";
import type {
  ArtifactEdge,
  ArtifactNode,
  GraphIndexResult,
  ValidityState,
} from "@mds/domain";

export type ImpactPathStep = {
  artifactId: string;
  version?: string;
  sourcePath: string;
  relationshipType?: string;
  evidence: ArtifactEdge["evidence"];
};

export type ValidityTransitionProposal = {
  artifactId: string;
  version?: string;
  from: ValidityState;
  to: "NEEDS_REVIEW";
  reason: string;
  sourceReferences: string[];
  path: ImpactPathStep[];
};

export type ImpactTraversalResult = {
  projectId: string;
  sourceArtifactId: string;
  sourceVersion?: string;
  paths: ImpactPathStep[][];
  affectedArtifacts: Array<{
    artifactId: string;
    version?: string;
    sourcePath: string;
    lifecycleState?: string;
    validityState: ValidityState;
  }>;
  proposals: ValidityTransitionProposal[];
  reportId: string;
};

const FORWARD_RELATIONSHIPS = new Set([
  "produces",
  "references",
]);

const REVERSE_RELATIONSHIPS = new Set([
  "implements",
  "elaborates",
  "synthesizes",
  "includes",
  "extends",
  "depends_on",
  "tested_by",
  "verifies",
  "adheres_to",
]);

function nodeValidity(node: ArtifactNode): ValidityState {
  const value = node.metadata.validity_state;
  return value === "CURRENT" || value === "NEEDS_REVIEW" || value === "STALE" || value === "CONFLICTED"
    ? value
    : "NEEDS_REVIEW";
}

function sourceReference(node: ArtifactNode): string {
  const version = typeof node.metadata.version === "string" ? `@${node.metadata.version}` : "";
  return `${node.id}${version} (${node.sourcePath})`;
}

function pathKey(path: ImpactPathStep[]): string {
  return path.map((step) => `${step.artifactId}:${step.relationshipType ?? "source"}`).join("->");
}

export function traverseImpact(
  graph: GraphIndexResult,
  sourceArtifactId: string,
  options: { sourceVersion?: string; maxDepth?: number } = {},
): ImpactTraversalResult {
  const source = graph.nodes.find((node) => node.id === sourceArtifactId);
  if (!source) throw new Error(`Impact source artifact ${sourceArtifactId} was not found`);
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const outbound = new Map<string, Array<{ edge: ArtifactEdge; targetId: string }>>();
  for (const edge of graph.edges) {
    if (!FORWARD_RELATIONSHIPS.has(edge.relationshipType) && !REVERSE_RELATIONSHIPS.has(edge.relationshipType)) continue;
    const targetId = REVERSE_RELATIONSHIPS.has(edge.relationshipType) ? edge.sourceId : edge.targetId;
    const sourceId = REVERSE_RELATIONSHIPS.has(edge.relationshipType) ? edge.targetId : edge.sourceId;
    if (!byId.has(sourceId)) continue;
    const current = outbound.get(sourceId) ?? [];
    current.push({ edge, targetId });
    outbound.set(sourceId, current.sort((a, b) => a.targetId.localeCompare(b.targetId)));
  }

  const maxDepth = Math.max(1, Math.min(options.maxDepth ?? 32, 128));
  const paths: ImpactPathStep[][] = [];
  const seenPathKeys = new Set<string>();
  const initial: ImpactPathStep[] = [{
    artifactId: source.id,
    version: typeof source.metadata.version === "string" ? source.metadata.version : undefined,
    sourcePath: source.sourcePath,
    evidence: [],
  }];

  function visit(currentId: string, currentPath: ImpactPathStep[], visited: Set<string>): void {
    if (currentPath.length > maxDepth) return;
    for (const { edge, targetId } of outbound.get(currentId) ?? []) {
      const target = byId.get(targetId);
      if (!target || visited.has(target.id)) continue;
      const nextPath = [...currentPath, {
        artifactId: target.id,
        version: typeof target.metadata.version === "string" ? target.metadata.version : undefined,
        sourcePath: target.sourcePath,
        relationshipType: edge.relationshipType,
        evidence: edge.evidence,
      }];
      const key = pathKey(nextPath);
      if (seenPathKeys.has(key)) continue;
      seenPathKeys.add(key);
      paths.push(nextPath);
      visit(target.id, nextPath, new Set([...visited, target.id]));
    }
  }
  visit(source.id, initial, new Set([source.id]));

  const affectedIds = new Set(paths.flatMap((path) => path.slice(1).map((step) => step.artifactId)));
  const affectedArtifacts = [...affectedIds]
    .map((id) => byId.get(id)!)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((node) => ({
      artifactId: node.id,
      version: typeof node.metadata.version === "string" ? node.metadata.version : undefined,
      sourcePath: node.sourcePath,
      lifecycleState: node.lifecycleState,
      validityState: nodeValidity(node),
    }));

  const proposals = affectedArtifacts.flatMap((artifact) => {
    if (artifact.validityState !== "CURRENT") return [];
    const artifactPaths = paths.filter((path) => path.some((step) => step.artifactId === artifact.artifactId));
    const selectedPath = artifactPaths.sort((a, b) => a.length - b.length || pathKey(a).localeCompare(pathKey(b)))[0];
    const evidence = [...new Set(artifactPaths.flatMap((path) => path.flatMap((step) => step.evidence.map((item) => `${item.artifactPath}:${item.fieldPath}:${item.lineStart ?? 0}`))))];
    return [{
      artifactId: artifact.artifactId,
      version: artifact.version,
      from: "CURRENT" as const,
      to: "NEEDS_REVIEW" as const,
      reason: `Evidence-backed impact from ${sourceReference(source)} via ${selectedPath.map((step) => step.artifactId).join(" → ")}`,
      sourceReferences: [sourceReference(source), ...evidence],
      path: selectedPath,
    }];
  });

  return {
    projectId: graph.projectId,
    sourceArtifactId: source.id,
    sourceVersion: options.sourceVersion ?? (typeof source.metadata.version === "string" ? source.metadata.version : undefined),
    paths,
    affectedArtifacts,
    proposals,
    reportId: createHash("sha256").update(`${graph.runId}:${source.id}:${paths.map(pathKey).join("|")}`).digest("hex").slice(0, 16),
  };
}

export function proposeImpactFromGraph(
  graph: GraphIndexResult,
  sourceArtifactId: string,
  options: { sourceVersion?: string; maxDepth?: number } = {},
): ImpactTraversalResult {
  return traverseImpact(graph, sourceArtifactId, options);
}
