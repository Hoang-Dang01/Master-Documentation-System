import type { ArtifactNode, GraphIndexResult } from "@mds/domain";
import type { ImpactTraversalResult, ValidityTransitionProposal } from "./impact.js";

export type TruthAuthority = "AUTHORITATIVE" | "WARNING" | "EXCLUDED";

export type TruthItem = {
  artifactId: string;
  version?: string;
  versionId?: string;
  title: string;
  sourcePath: string;
  lifecycleState?: string;
  validityState: "CURRENT" | "NEEDS_REVIEW" | "STALE" | "CONFLICTED";
  authority: TruthAuthority;
  sourceReferences: string[];
  warnings: string[];
};

export type CurrentProjectTruth = {
  projectId: string;
  generatedAt: string;
  authoritative: TruthItem[];
  warnings: TruthItem[];
  excluded: TruthItem[];
  conflicts: TruthItem[];
  sourceRunId: string;
};

export type ContextPackageItem = TruthItem & {
  content?: string;
  instructionsEligible: boolean;
};

export type ImplementationContextPackage = {
  packageId: string;
  projectId: string;
  generatedAt: string;
  authorityNotice: string;
  sourceRunId: string;
  instructions: ContextPackageItem[];
  warnings: ContextPackageItem[];
  excludedCount: number;
};

export type TruthProjectionOptions = {
  approvedHeadVersionIds?: ReadonlySet<string>;
  validityProposals?: ReadonlyArray<ValidityTransitionProposal>;
  generatedAt?: string;
};

function validity(node: ArtifactNode): TruthItem["validityState"] {
  const value = node.metadata.validity_state;
  return value === "CURRENT" || value === "NEEDS_REVIEW" || value === "STALE" || value === "CONFLICTED"
    ? value
    : "NEEDS_REVIEW";
}

function versionId(node: ArtifactNode): string | undefined {
  const lineage = typeof node.metadata.lineage_id === "string" ? node.metadata.lineage_id : undefined;
  const version = typeof node.metadata.version === "string" ? node.metadata.version : undefined;
  return lineage && version ? `${lineage}@${version}` : undefined;
}

function nodeIsApprovedHead(node: ArtifactNode, options: TruthProjectionOptions): boolean {
  const id = versionId(node);
  if (options.approvedHeadVersionIds) return Boolean(id && options.approvedHeadVersionIds.has(id));
  return node.lifecycleState === "APPROVED";
}

function item(node: ArtifactNode, authority: TruthAuthority, warnings: string[] = []): TruthItem {
  const state = validity(node);
  const refs = [node.sourcePath];
  const sourceRefs = node.metadata.source_refs;
  if (Array.isArray(sourceRefs)) refs.push(...sourceRefs.map(String));
  return {
    artifactId: node.id,
    version: typeof node.metadata.version === "string" ? node.metadata.version : undefined,
    versionId: versionId(node),
    title: node.title,
    sourcePath: node.sourcePath,
    lifecycleState: node.lifecycleState,
    validityState: state,
    authority,
    sourceReferences: refs,
    warnings,
  };
}

export function projectCurrentTruth(
  graph: GraphIndexResult,
  options: TruthProjectionOptions = {},
): CurrentProjectTruth {
  const authoritative: TruthItem[] = [];
  const warnings: TruthItem[] = [];
  const excluded: TruthItem[] = [];
  const conflicts: TruthItem[] = [];
  for (const node of [...graph.nodes].sort((a, b) => a.id.localeCompare(b.id))) {
    const state = validity(node);
    const head = nodeIsApprovedHead(node, options);
    let target: TruthItem;
    if (!head || node.lifecycleState !== "APPROVED") {
      target = item(node, "EXCLUDED", ["Not an approved lineage head"]);
      excluded.push(target);
    } else if (state === "CURRENT") {
      target = item(node, "AUTHORITATIVE");
      authoritative.push(target);
    } else if (state === "NEEDS_REVIEW") {
      target = item(node, "WARNING", ["Approved head has evidence-backed downstream impact and needs review"]);
      warnings.push(target);
    } else {
      target = item(node, "EXCLUDED", [`Validity state ${state} is not authoritative`]);
      excluded.push(target);
      if (state === "CONFLICTED") conflicts.push(target);
    }
  }
  for (const proposal of options.validityProposals ?? []) {
    const found = [...authoritative, ...warnings].find((candidate) => candidate.artifactId === proposal.artifactId);
    if (found && found.authority === "AUTHORITATIVE") {
      found.warnings.push(proposal.reason);
    }
  }
  return {
    projectId: graph.projectId,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    authoritative,
    warnings,
    excluded,
    conflicts,
    sourceRunId: graph.runId,
  };
}

export function buildImplementationContext(
  truth: CurrentProjectTruth,
  contentByArtifactId: ReadonlyMap<string, string> = new Map(),
): ImplementationContextPackage {
  const toContext = (entry: TruthItem, eligible: boolean): ContextPackageItem => ({
    ...entry,
    content: contentByArtifactId.get(entry.artifactId),
    instructionsEligible: eligible,
  });
  return {
    packageId: `${truth.projectId}-${truth.sourceRunId}-context`,
    projectId: truth.projectId,
    generatedAt: truth.generatedAt,
    authorityNotice: "MDS context is bounded read-only evidence. It does not authorize source, test, Git, PR, or deployment mutation.",
    sourceRunId: truth.sourceRunId,
    instructions: truth.authoritative.map((entry) => toContext(entry, true)),
    warnings: truth.warnings.map((entry) => toContext(entry, false)),
    excludedCount: truth.excluded.length,
  };
}
