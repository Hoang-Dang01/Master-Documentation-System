import type { ValidatedEvidenceManifest } from "@mds/domain";
import type { ImplementationContextPackage } from "./truth.js";

export type EvidenceCorrelationReason =
  | "MATCHED"
  | "PROJECT_MISMATCH"
  | "CONTEXT_NOT_FOUND"
  | "COMMIT_MISMATCH"
  | "ARTIFACT_VERSION_MISSING"
  | "ARTIFACT_VERSION_NON_AUTHORITATIVE";

export type EvidenceCorrelationAuthority = {
  projectId: string;
  expectedRepository: string;
  expectedCommit: string;
  context: ImplementationContextPackage;
};

export type EvidenceCorrelationResult = {
  bundleId: string;
  projectId: string;
  contextPackageId: string;
  producer: ValidatedEvidenceManifest["producer"];
  sourceIdentity: ValidatedEvidenceManifest["source_identity"];
  resultDeclarations: ValidatedEvidenceManifest["results"];
  matchedVersionIds: string[];
  missingVersionIds: string[];
  nonAuthoritativeVersionIds: string[];
  sourceReferences: string[];
  trust: "TRUSTED" | "UNTRUSTED";
  reasons: EvidenceCorrelationReason[];
};

export function correlateEvidence(
  manifest: ValidatedEvidenceManifest,
  authority: EvidenceCorrelationAuthority,
): EvidenceCorrelationResult {
  const reasons: EvidenceCorrelationReason[] = [];
  if (manifest.project_id !== authority.projectId || authority.context.projectId !== authority.projectId) reasons.push("PROJECT_MISMATCH");
  if (manifest.context_package_id !== authority.context.packageId) reasons.push("CONTEXT_NOT_FOUND");
  if (manifest.source_identity.repository !== authority.expectedRepository || manifest.source_identity.commit !== authority.expectedCommit) reasons.push("COMMIT_MISMATCH");

  const eligible = new Set(authority.context.instructions.map((item) => item.versionId).filter((value): value is string => Boolean(value)));
  const warning = new Set(authority.context.warnings.map((item) => item.versionId).filter((value): value is string => Boolean(value)));
  const known = new Set([...eligible, ...warning]);
  const matchedVersionIds = manifest.artifact_version_ids.filter((id) => eligible.has(id)).sort();
  const nonAuthoritativeVersionIds = manifest.artifact_version_ids.filter((id) => warning.has(id)).sort();
  const missingVersionIds = manifest.artifact_version_ids.filter((id) => !known.has(id)).sort();
  if (missingVersionIds.length) reasons.push("ARTIFACT_VERSION_MISSING");
  if (nonAuthoritativeVersionIds.length) reasons.push("ARTIFACT_VERSION_NON_AUTHORITATIVE");
  if (!reasons.length) reasons.push("MATCHED");
  return {
    bundleId: manifest.bundle_id,
    projectId: manifest.project_id,
    contextPackageId: manifest.context_package_id,
    producer: { ...manifest.producer },
    sourceIdentity: { ...manifest.source_identity },
    resultDeclarations: manifest.results.map((item) => ({ ...item })),
    matchedVersionIds,
    missingVersionIds,
    nonAuthoritativeVersionIds,
    sourceReferences: [
      `evidence/bundles/${manifest.bundle_id}/submitted-manifest.json`,
      `context:${manifest.context_package_id}`,
      `repository:${manifest.source_identity.repository}@${manifest.source_identity.commit}`,
      ...manifest.artifact_version_ids.map((id) => `artifact:${id}`),
    ],
    trust: reasons.length === 1 && reasons[0] === "MATCHED" ? "TRUSTED" : "UNTRUSTED",
    reasons,
  };
}
