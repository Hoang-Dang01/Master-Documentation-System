import { useEffect, useMemo, useRef, useState } from "react";
import type { Core } from "cytoscape";

type Props = {
  projectId: string;
  projectPath: string;
  onOpenSource: (relativePath: string) => Promise<void>;
  onNotice: (message: string) => void;
};

const TYPE_COLORS: Record<string, string> = {
  CTX: "#eab464",
  REQ: "#ff7a67",
  BR: "#d89ff4",
  ADR: "#77a9ff",
  API: "#53c7b1",
  SRV: "#53c7b1",
  TSK: "#f0c96a",
  TC: "#87d37c",
  REG: "#9db1c6",
};

function shortType(node: MdsGraphNode): string {
  return TYPE_COLORS[node.artifactType]
    ? node.artifactType
    : node.id.split("-")[1] ?? node.artifactType;
}

export function KnowledgeGraphView({ projectId, projectPath, onOpenSource, onNotice }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Core | null>(null);
  const [projection, setProjection] = useState<MdsGraphProjection | null>(null);
  const [selected, setSelected] = useState<MdsGraphNodeDetail | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showIssuesOnly, setShowIssuesOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [indexCounts, setIndexCounts] = useState({ nodes: 0, edges: 0 });

  const availableTypes = useMemo(
    () => [...new Set(projection?.nodes.map((node) => shortType(node)) ?? [])].sort(),
    [projection],
  );

  async function loadGraph(refresh: boolean) {
    if (!projectId || !projectPath) return;
    setIsRefreshing(true);
    try {
      const indexed = refresh ? await window.mds.buildGraphIndex(projectPath) : null;
      const graph = await window.mds.queryGraph({ projectId, limit: 2000 });
      setProjection(graph);
      setIndexCounts({ nodes: indexed?.indexedNodes ?? graph.nodes.length, edges: indexed?.indexedEdges ?? graph.edges.length });
      setSelected(null);
      onNotice(refresh ? `Đã lập chỉ mục ${graph.nodes.length} artifact và ${graph.edges.length} quan hệ.` : "");
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Không thể tải bản đồ truy vết.");
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadGraph(true);
  }, [projectId, projectPath]);

  useEffect(() => {
    if (!canvasRef.current || !projection) return;
    let disposed = false;
    void import("cytoscape").then(({ default: cytoscape }) => {
      if (disposed || !canvasRef.current) return;
      graphRef.current?.destroy();
      const issueNodeIds = new Set(projection.issues.map((issue) => issue.nodeId).filter(Boolean));
      const existingIds = new Set(projection.nodes.map((node) => node.id));
      const missingTargets = [...new Set(projection.edges.map((edge) => edge.targetId).filter((target) => !existingIds.has(target)))];
      const graph = cytoscape({
      container: canvasRef.current,
      elements: [
        ...projection.nodes.map((node) => ({
          data: {
            id: node.id,
            label: node.id,
            kind: shortType(node),
            color: TYPE_COLORS[shortType(node)] ?? "#9db1c6",
            hasIssue: issueNodeIds.has(node.id),
          },
        })),
        ...missingTargets.map((target) => ({ data: { id: target, label: target, kind: "MISSING", color: "#182735", isMissing: true, hasIssue: true } })),
        ...projection.edges.map((edge) => ({
          data: { id: edge.id, source: edge.sourceId, target: edge.targetId, label: edge.relationshipType },
        })),
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            "border-color": "#0e1824",
            "border-width": 3,
            color: "#eaf1f7",
            label: "data(label)",
            "font-family": "Cascadia Code, Consolas, monospace",
            "font-size": 8,
            "font-weight": 600,
            "text-background-color": "#101b28",
            "text-background-opacity": 0.92,
            "text-background-padding": "4px",
            "text-background-shape": "roundrectangle",
            "text-margin-y": 18,
            width: 32,
            height: 32,
          },
        },
        { selector: "node[?hasIssue]", style: { "border-color": "#ff766b", "border-width": 4 } },
        { selector: "node[?isMissing]", style: { "border-style": "dashed", color: "#ff9a8f", "background-opacity": 0.45 } },
        { selector: "node:selected", style: { "overlay-color": "#7bb8ff", "overlay-opacity": 0.2, "overlay-padding": 8 } },
        {
          selector: "edge",
          style: {
            width: 1.4,
            "line-color": "#5d7893",
            "target-arrow-color": "#7d9ab4",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            color: "#96aec4",
            "font-size": 7,
            "font-family": "Cascadia Code, Consolas, monospace",
            "text-background-color": "#101b28",
            "text-background-opacity": 0.86,
            "text-background-padding": "2px",
          },
        },
      ],
      layout: { name: "cose", animate: false, fit: true, padding: 44, nodeRepulsion: () => 6000 },
      minZoom: 0.25,
      maxZoom: 1.35,
    });
    graph.on("tap", "node", async (event) => {
      if (event.target.data("isMissing")) {
        onNotice(`Thiếu artifact đích: ${event.target.id()}`);
        setSelected(null);
      } else {
        const detail = await window.mds.getGraphNode(projectId, event.target.id());
        setSelected(detail);
      }
    });
      graphRef.current = graph;
    });
    return () => {
      disposed = true;
      graphRef.current?.destroy();
      graphRef.current = null;
    };
  }, [projection, projectId]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const normalized = query.trim().toLocaleLowerCase("vi");
    graph.nodes().forEach((element) => {
      const node = projection?.nodes.find((candidate) => candidate.id === element.id());
      const matchesSearch = !normalized || `${node?.id} ${node?.title}`.toLocaleLowerCase("vi").includes(normalized);
      const matchesType = typeFilter === "ALL" || (node && shortType(node) === typeFilter);
      const matchesIssue = !showIssuesOnly || projection?.issues.some((issue) => issue.nodeId === node?.id);
      element.style("opacity", matchesSearch && matchesType && matchesIssue ? 1 : 0.1);
    });
  }, [projection, query, showIssuesOnly, typeFilter]);

  const issues = projection?.issues ?? [];

  return (
    <section className="graph-workbench" aria-labelledby="graph-title">
      <header className="graph-hero">
        <div>
          <span className="graph-kicker">Traceability atlas / {projectId}</span>
          <h1 id="graph-title">Bản đồ tri thức</h1>
          <p>Đi từ tài liệu nguồn đến quan hệ có bằng chứng — không có “đường nối bí ẩn”.</p>
        </div>
        <div className="graph-pulse" aria-label="Tóm tắt graph">
          <span><strong>{indexCounts.nodes}</strong> artifact</span>
          <span><strong>{indexCounts.edges}</strong> quan hệ</span>
          <span className={issues.length ? "has-alert" : ""}><strong>{issues.length}</strong> cảnh báo</span>
        </div>
      </header>

      <div className="graph-toolbar" aria-label="Công cụ graph">
        <label className="graph-search">
          <span>Tìm node</span>
          <input aria-label="Tìm node theo ID hoặc tiêu đề" onChange={(event) => setQuery(event.target.value)} placeholder="REQ, API, tên artifact…" type="search" value={query} />
        </label>
        <label>
          <span>Loại artifact</span>
          <select onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}>
            <option value="ALL">Tất cả</option>
            {availableTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <button aria-pressed={showIssuesOnly} className={showIssuesOnly ? "is-active" : ""} onClick={() => setShowIssuesOnly((value) => !value)} type="button">Chỉ node có lỗi</button>
        <button onClick={() => graphRef.current?.fit(undefined, 36)} type="button">Vừa khung</button>
        <button onClick={() => graphRef.current?.layout({ name: "cose", animate: true, animationDuration: 280, padding: 44 }).run()} type="button">Sắp lại</button>
        <button className="graph-refresh" disabled={isRefreshing} onClick={() => void loadGraph(true)} type="button">{isRefreshing ? "Đang quét…" : "Quét lại graph"}</button>
      </div>

      <div className="graph-stage">
        <aside className="graph-legend" aria-label="Chú giải">
          <div className="graph-section-heading"><span>01</span><strong>Lớp tri thức</strong></div>
          <div className="legend-list">
            {availableTypes.map((type) => <button key={type} onClick={() => setTypeFilter(type)} type="button"><i style={{ background: TYPE_COLORS[type] ?? "#9db1c6" }} />{type}</button>)}
          </div>
          <div className="graph-section-heading"><span>02</span><strong>Chất lượng</strong></div>
          {issues.length ? <div className="issue-stack">{issues.slice(0, 6).map((issue) => <button key={issue.id} onClick={() => issue.nodeId && graphRef.current?.getElementById(issue.nodeId).select()} type="button"><span>{issue.type.replaceAll("_", " ")}</span><small>{issue.message}</small></button>)}</div> : <p className="graph-empty-copy">Chưa có lỗi graph được ghi nhận.</p>}
        </aside>

        <div className="graph-canvas-wrap">
          <div className="graph-grid" aria-hidden="true" />
          <div className="graph-canvas" ref={canvasRef} role="img" aria-label="Đồ thị quan hệ giữa các artifact" />
          {!projection?.nodes.length ? <div className="graph-empty-state"><strong>Chưa có node để vẽ</strong><span>Chọn “Quét lại graph” sau khi thêm artifact có frontmatter hợp lệ.</span></div> : null}
          <div className="canvas-coordinate">MDS / OUTBOUND CANONICAL / EVIDENCE ON</div>
        </div>

        <aside className="graph-inspector" aria-label="Chi tiết node">
          {selected ? (
            <>
              <div className="inspector-type"><i style={{ background: TYPE_COLORS[shortType(selected)] ?? "#9db1c6" }} />{shortType(selected)} · {selected.lifecycleState ?? "NO STATE"}</div>
              <h2>{selected.title}</h2>
              <code>{selected.id}</code>
              <button className="open-source-button" onClick={() => void onOpenSource(selected.sourcePath)} type="button">Mở Markdown nguồn ↗</button>
              <dl className="node-facts">
                <div><dt>Nguồn</dt><dd>{selected.sourcePath}</dd></div>
                <div><dt>Đi ra</dt><dd>{selected.outgoing.length}</dd></div>
                <div><dt>Đi vào</dt><dd>{selected.incoming.length}</dd></div>
              </dl>
              <div className="relationship-block"><h3>Quan hệ đi ra</h3>{selected.outgoing.length ? selected.outgoing.map((edge) => <div className="relationship-card" key={edge.id}><span>{edge.relationshipType}</span><strong>{edge.targetId}</strong><small>{edge.evidence[0]?.fieldPath} · dòng {edge.evidence[0]?.lineStart ?? "—"}</small></div>) : <p>Không có quan hệ đi ra.</p>}</div>
              <div className="relationship-block"><h3>Quan hệ đi vào</h3>{selected.incoming.length ? selected.incoming.map((edge) => <div className="relationship-card" key={edge.id}><span>{edge.relationshipType}</span><strong>{edge.sourceId}</strong></div>) : <p>Không có quan hệ đi vào.</p>}</div>
            </>
          ) : (
            <div className="inspector-empty"><span>◎</span><strong>Chọn một node</strong><p>Metadata, quan hệ hai chiều và bằng chứng nguồn sẽ hiện ở đây.</p></div>
          )}
        </aside>
      </div>
    </section>
  );
}
