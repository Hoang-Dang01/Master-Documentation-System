import { createHash } from "node:crypto";
import type { EvidenceCorrelationResult } from "./evidence-correlation.js";

export type VerificationFindingClassification =
  | "PASS_EVIDENCE"
  | "FAILED_CHECK"
  | "MISSING_EVIDENCE"
  | "STALE_IDENTITY"
  | "MISMATCH";

export type VerificationFinding = {
  findingId: string;
  bundleId: string;
  contextPackageId: string;
  classification: VerificationFindingClassification;
  severity: "INFO" | "WARNING" | "BLOCKER";
  lifecycleState: "DRAFT";
  artifactVersionIds: string[];
  sourceReferences: string[];
  reasonCode: string;
  summary: string;
};

function finding(correlation: EvidenceCorrelationResult, classification: VerificationFindingClassification, severity: VerificationFinding["severity"], reasonCode: string, summary: string, suffix: string): VerificationFinding {
  const identity = `${correlation.bundleId}:${classification}:${reasonCode}:${suffix}`;
  return {
    findingId: `QA-FND-${correlation.projectId.toUpperCase()}-${createHash("sha256").update(identity).digest("hex").slice(0, 16).toUpperCase()}`,
    bundleId: correlation.bundleId,
    contextPackageId: correlation.contextPackageId,
    classification,
    severity,
    lifecycleState: "DRAFT",
    artifactVersionIds: [...new Set([...correlation.matchedVersionIds, ...correlation.nonAuthoritativeVersionIds, ...correlation.missingVersionIds])].sort(),
    sourceReferences: [...correlation.sourceReferences],
    reasonCode,
    summary,
  };
}

export function projectVerificationFindings(correlation: EvidenceCorrelationResult): VerificationFinding[] {
  if (correlation.trust === "UNTRUSTED") {
    return correlation.reasons.map((reason, index) => finding(
      correlation,
      reason === "COMMIT_MISMATCH" ? "STALE_IDENTITY" : "MISMATCH",
      "BLOCKER",
      reason,
      `Evidence cannot be trusted: ${reason}`,
      String(index),
    ));
  }
  if (!correlation.resultDeclarations.length) {
    return [finding(correlation, "MISSING_EVIDENCE", "WARNING", "NO_RESULTS_DECLARED", "The bundle declares no verification results.", "none")];
  }
  return correlation.resultDeclarations.map((result, index) => {
    if (result.status === "PASSED") return finding(correlation, "PASS_EVIDENCE", "INFO", `${result.kind.toUpperCase().replaceAll("-", "_")}_PASSED`, `${result.command_label} passed according to validated evidence.`, String(index));
    if (result.status === "FAILED") return finding(correlation, "FAILED_CHECK", "BLOCKER", `${result.kind.toUpperCase().replaceAll("-", "_")}_FAILED`, `${result.command_label} failed according to validated evidence.`, String(index));
    return finding(correlation, "MISSING_EVIDENCE", "WARNING", `${result.kind.toUpperCase().replaceAll("-", "_")}_${result.status}`, `${result.command_label} is ${result.status}.`, String(index));
  });
}
