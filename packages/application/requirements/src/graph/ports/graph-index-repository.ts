import type { GraphIndexResult } from "@mds/domain";

/** Application-owned persistence boundary for the derived graph index. */
export interface GraphIndexRepository {
  migrate(): void;
  replaceProject(result: GraphIndexResult): void;
  readProject(projectId: string): GraphIndexResult | null;
  deleteProject(projectId: string): void;
  close(): void;
}
