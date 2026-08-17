import { useEffect, useMemo, useRef, useState } from "react";
import { KnowledgeGraphView } from "./KnowledgeGraphView";
import {
  Button,
  CountBadge,
  IconButton,
  Kbd,
  StatusBadge,
  Surface,
} from "./ui";

type IconName =
  | "activity"
  | "alert"
  | "analysis"
  | "archive"
  | "chevron"
  | "document"
  | "folder"
  | "import"
  | "moon"
  | "overview"
  | "search"
  | "settings"
  | "spark"
  | "sun"
  | "task"
  | "workflow";

type NavigationItem = {
  label: string;
  icon: IconName;
  target?:
    | "main-content"
    | "attention-panel"
    | "workflow-panel"
    | "documents-panel"
    | "activity-panel";
  disabled?: boolean;
  badge?: number;
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const lifecycleLabels: Record<string, string> = {
  APPROVED: "Đã duyệt",
  ARCHIVED: "Đã lưu trữ",
  DEPRECATED: "Ngừng sử dụng",
  DRAFT: "Bản nháp",
  REVIEW: "Chờ duyệt",
};

const ownerLabels: Record<string, string> = {
  arch_agent: "Kiến trúc",
  ba_agent: "Phân tích nghiệp vụ",
  dev_agent: "Backend",
  PM: "Quản lý dự án",
  system: "Hệ thống",
};

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    activity: <><path d="M4 12h3l2-7 4 14 2-7h5" /></>,
    alert: <><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.7 2.4 17.4A2 2 0 0 0 4.1 20h15.8a2 2 0 0 0 1.7-2.6L13.7 3.7a2 2 0 0 0-3.4 0Z" /></>,
    analysis: <><path d="M3 3v18h18" /><path d="m7 16 4-5 3 3 5-7" /></>,
    archive: <><path d="M4 7h16" /><path d="M5 7v13h14V7" /><path d="M9 11h6" /><path d="M3 3h18v4H3z" /></>,
    chevron: <><path d="m9 18 6-6-6-6" /></>,
    document: <><path d="M6 2h9l4 4v16H6z" /><path d="M14 2v5h5" /><path d="M9 13h6M9 17h6" /></>,
    folder: <><path d="M3 6h6l2 2h10v11H3z" /></>,
    import: <><path d="M12 3v12" /><path d="m8 11 4 4 4-4" /><path d="M4 19h16" /></>,
    moon: <><path d="M20 15.3A9 9 0 0 1 8.7 4a9 9 0 1 0 11.3 11.3Z" /></>,
    overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    spark: <><path d="m12 3 1.2 4.2L17 9l-3.8 1.8L12 15l-1.2-4.2L7 9l3.8-1.8Z" /><path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7Z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
    task: <><path d="M9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
    workflow: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="12" r="2" /><circle cx="6" cy="19" r="2" /><path d="M8 5h4a4 4 0 0 1 4 4v1M16 14v1a4 4 0 0 1-4 4H8" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {paths[name]}
      </g>
    </svg>
  );
}

function displayLifecycle(value: string): string {
  return lifecycleLabels[value] ?? value;
}

function displayOwner(value: string): string {
  return ownerLabels[value] ?? value.replaceAll("_", " ");
}

function displayProject(value: string): string {
  if (value === "edumeet") return "EduMeet";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function relativeTime(value: string): string {
  const elapsed = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.floor(elapsed / 60_000));
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function App() {
  const [activeView, setActiveView] = useState<"overview" | "graph">("overview");
  const [appInfo, setAppInfo] = useState<MdsAppInfo | null>(null);
  const [workspacePath, setWorkspacePath] = useState("");
  const [artifacts, setArtifacts] = useState<MdsArtifactSummary[]>([]);
  const [notice, setNotice] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [technicalMode, setTechnicalMode] = useState(false);
  const [isDark, setIsDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
  );
  const [query, setQuery] = useState("");
  const [importedDocument, setImportedDocument] =
    useState<MdsImportedDocument | null>(null);
  const [selectedReview, setSelectedReview] = useState<MdsArtifactSummary | null>(null);
  const [impactResult, setImpactResult] = useState<MdsImpactReportResult | null>(null);
  const [reviewBusy, setReviewBusy] = useState(false);
  const [evidenceBundles, setEvidenceBundles] = useState<MdsEvidenceBundleSummary[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<MdsEvidenceBundleSummary | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [isDark]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    let canceled = false;
    window.mds
      .getAppInfo()
      .then(async (info) => {
        const [projectArtifacts, projectEvidence] = await Promise.all([
          window.mds.listArtifacts(info.defaultWorkspacePath),
          window.mds.listEvidenceBundles(info.defaultWorkspacePath),
        ]);
        if (canceled) return;
        setAppInfo(info);
        setWorkspacePath(info.defaultWorkspacePath);
        setArtifacts(projectArtifacts);
        setEvidenceBundles(projectEvidence);
      })
      .catch(() => {
        if (!canceled) {
          setNotice("Không thể đọc dữ liệu dự án từ desktop bridge.");
        }
      });
    return () => {
      canceled = true;
    };
  }, []);

  const workspaceName =
    workspacePath.replace(/[\\/]+$/, "").split(/[\\/]/).pop() ||
    "Chưa chọn project";
  const workspaceDisplayName = displayProject(workspaceName);
  const reviewArtifacts = artifacts.filter(
    (artifact) => artifact.lifecycleState === "REVIEW",
  );
  const attentionArtifacts = artifacts.filter((artifact) =>
    ["DRAFT", "REVIEW"].includes(artifact.lifecycleState),
  );
  const blockerCount = 0;
  const runningWorkflows = importedDocument ? 1 : 0;
  const recentArtifacts = artifacts.slice(0, 5);
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const visibleArtifacts = useMemo(
    () =>
      recentArtifacts.filter((artifact) =>
        [artifact.title, artifact.owner, artifact.lifecycleState]
          .join(" ")
          .toLocaleLowerCase("vi")
          .includes(normalizedQuery),
      ),
    [normalizedQuery, recentArtifacts],
  );

  const navigationGroups: NavigationGroup[] = [
    {
      label: "Workspace",
      items: [
        { label: "Tổng quan", icon: "overview", target: "main-content" },
        { label: "Bản đồ tri thức", icon: "analysis", target: "main-content" },
        { label: "Tài liệu", icon: "document", target: "documents-panel" },
      ],
    },
    {
      label: "Phân tích",
      items: [
        {
          label: "Yêu cầu",
          icon: "task",
          target: "attention-panel",
          badge: reviewArtifacts.length,
        },
        { label: "Báo cáo tác động", icon: "analysis", disabled: true },
        { label: "Thiết kế", icon: "archive", disabled: true },
      ],
    },
    {
      label: "Thực thi",
      items: [
        { label: "Công việc", icon: "task", target: "attention-panel" },
        {
          label: "Workflow",
          icon: "workflow",
          target: "workflow-panel",
          badge: runningWorkflows,
        },
      ],
    },
    {
      label: "Hệ thống",
      items: [
        { label: "Hoạt động", icon: "activity", target: "activity-panel" },
        { label: "Cài đặt", icon: "settings", disabled: true },
      ],
    },
  ];

  async function refreshArtifacts(projectPath: string) {
    const [projectArtifacts, projectEvidence] = await Promise.all([
      window.mds.listArtifacts(projectPath),
      window.mds.listEvidenceBundles(projectPath),
    ]);
    setArtifacts(projectArtifacts);
    setEvidenceBundles(projectEvidence);
  }

  async function handleSelectWorkspace() {
    setIsSelecting(true);
    setNotice("");
    try {
      const selection = await window.mds.selectWorkspace();
      if (!selection.canceled && selection.path) {
        setWorkspacePath(selection.path);
        await refreshArtifacts(selection.path);
        setImportedDocument(null);
        setNotice("Project đã sẵn sàng.");
      }
    } catch {
      setNotice("Không thể mở project. Hãy chọn thư mục trong workspace active.");
    } finally {
      setIsSelecting(false);
    }
  }

  async function handleOpenWorkspace() {
    if (!workspacePath) return;
    const result = await window.mds.openWorkspace(workspacePath);
    if (!result.ok) setNotice(result.error);
  }

  async function handleImportDocument() {
    if (!workspacePath) return;
    setIsImporting(true);
    setNotice("");
    try {
      const result = await window.mds.importDocument(workspacePath);
      if (!result.canceled) {
        setImportedDocument(result.document);
        await refreshArtifacts(workspacePath);
        setNotice("Đã lưu nguồn và tạo requirement DRAFT để duyệt.");
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Không thể nhập tài liệu đã chọn.",
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function handleOpenArtifact(relativePath: string) {
    const result = await window.mds.openArtifact(workspacePath, relativePath);
    if (!result.ok) setNotice(result.error);
  }

  async function handleReview(decision: "APPROVED" | "REJECTED", artifact = selectedReview) {
    if (!workspacePath || !artifact) return;
    setReviewBusy(true);
    try {
      await window.mds.reviewRequirement(
        workspacePath,
        artifact.relativePath,
        decision,
        "human",
        decision === "APPROVED" ? "Approved from desktop review workbench" : "Rejected from desktop review workbench",
      );
      await refreshArtifacts(workspacePath);
      setSelectedReview(null);
      setNotice(decision === "APPROVED" ? "Requirement da duoc phe duyet; approved head moi da duoc ghi nhan." : "Requirement da bi tu choi; ban nhap van duoc bao ton.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Khong the ghi nhan quyet dinh review.");
    } finally {
      setReviewBusy(false);
    }
  }

  async function handleImpact(artifact: MdsArtifactSummary) {
    if (!workspacePath) return;
    try {
      const result = await window.mds.createImpactReport(workspacePath, artifact.relativePath);
      setImpactResult(result);
      setNotice(`Da tao impact report cho ${artifact.title}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Khong the tao impact report.");
    }
  }

  function navigateTo(target: NavigationItem["target"]) {
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div className="brand-copy">
            <strong>MDS</strong>
            <span>Documentation workspace</span>
          </div>
        </div>

        <nav className="navigation" aria-label="Điều hướng chính">
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p className="nav-label">{group.label}</p>
              {group.items.map((item) => (
                <button
                  aria-current={(item.label === "Bản đồ tri thức" ? activeView === "graph" : item.target === "main-content" && activeView === "overview") ? "page" : undefined}
                  className={`nav-item ${(item.label === "Bản đồ tri thức" ? activeView === "graph" : item.target === "main-content" && activeView === "overview") ? "is-active" : ""}`}
                  disabled={item.disabled}
                  key={item.label}
                  onClick={() => {
                    if (item.label === "Bản đồ tri thức") {
                      setActiveView("graph");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      setActiveView("overview");
                      navigateTo(item.target);
                    }
                  }}
                  title={item.disabled ? "Chưa có trong lát cắt hiện tại" : undefined}
                  type="button"
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <IconButton
            className="sidebar-icon-button"
            label={isDark ? "Dùng giao diện sáng" : "Dùng giao diện tối"}
            onClick={() => setIsDark((current) => !current)}
          >
            <Icon name={isDark ? "sun" : "moon"} />
          </IconButton>
          <button
            aria-pressed={technicalMode}
            className={`technical-toggle ${technicalMode ? "is-on" : ""}`}
            onClick={() => setTechnicalMode((current) => !current)}
            type="button"
          >
            Chi tiết kỹ thuật
          </button>
          <span className="version">v{appInfo?.version ?? "0.1.0"}</span>
        </div>
      </aside>

      <div className="workspace-shell">
        <header className="topbar">
          <button
            className="project-switcher"
            disabled={isSelecting}
            onClick={handleSelectWorkspace}
            type="button"
          >
            <span className="project-mark">{workspaceDisplayName.slice(0, 1)}</span>
            <span>
              <strong>{workspaceDisplayName}</strong>
              <small>Đang hoạt động</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>

          <label className="command-search">
            <Icon name="search" />
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tài liệu…"
              ref={searchRef}
              type="search"
              value={query}
            />
            <Kbd>Ctrl K</Kbd>
          </label>

          <div className="topbar-actions">
            <Button
              className="button button-secondary"
              disabled
              title="Sẽ được mở ở lát cắt workflow tiếp theo"
              tone="secondary"
            >
              <Icon name="spark" />
              Phân tích mới
            </Button>
            <Button
              className="button button-primary"
              disabled={isImporting || !workspacePath}
              onClick={handleImportDocument}
              tone="primary"
            >
              <Icon name="import" />
              {isImporting ? "Đang nhập…" : "Nhập tài liệu"}
            </Button>
          </div>
        </header>

        {activeView === "graph" ? (
          <main className="graph-main" id="main-content">
            <KnowledgeGraphView
              key={workspacePath}
              onNotice={setNotice}
              onOpenSource={handleOpenArtifact}
              projectId={workspaceName === "Chưa chọn project" ? "" : workspaceName}
              projectPath={workspacePath}
            />
          </main>
        ) : (
        <main className="main-content" id="main-content">
          <div className="page-heading">
            <div>
              <h1>Tổng quan</h1>
              <p>Việc cần xử lý và thay đổi mới nhất của {workspaceDisplayName}.</p>
            </div>
            <Button
              className="button button-ghost"
              disabled={!workspacePath}
              onClick={handleOpenWorkspace}
              tone="quiet"
            >
              <Icon name="folder" />
              Mở thư mục
            </Button>
          </div>

          {notice ? (
            <div className="notice" role="status">
              <span className="notice-dot" />
              {notice}
            </div>
          ) : null}

          <section className="status-grid" aria-label="Trạng thái dự án">
            <Surface as="article" className="status-card" emphasis="raised" tone="review">
              <div className="status-card-icon warning"><Icon name="task" /></div>
              <div>
                <span>Yêu cầu chờ duyệt</span>
                <strong>{reviewArtifacts.length}</strong>
                <small>{reviewArtifacts.length ? "Cần phản hồi" : "Không có hàng chờ"}</small>
              </div>
            </Surface>
            <Surface as="article" className="status-card" emphasis="raised" tone="info">
              <div className="status-card-icon accent"><Icon name="workflow" /></div>
              <div>
                <span>Workflow đang chạy</span>
                <strong>{runningWorkflows}</strong>
                <small>{runningWorkflows ? "Đang chờ duyệt bản nháp" : "Chưa có phiên chạy"}</small>
              </div>
            </Surface>
            <Surface
              as="article"
              className="status-card"
              emphasis="raised"
              tone={blockerCount ? "conflict" : "neutral"}
            >
              <div className="status-card-icon success"><Icon name="alert" /></div>
              <div>
                <span>Blocker đã ghi nhận</span>
                <strong>{blockerCount}</strong>
                <small>{blockerCount ? "Cần xử lý trước khi tiếp tục" : "Không có blocker đang mở"}</small>
              </div>
            </Surface>
            <Surface as="article" className="status-card" emphasis="raised" tone="neutral">
              <div className="status-card-icon neutral"><Icon name="document" /></div>
              <div>
                <span>Tài liệu gần đây</span>
                <strong>{recentArtifacts.length}</strong>
                <small>Trong danh sách hiện tại</small>
              </div>
            </Surface>
          </section>

          <section className="responsibility-map" aria-labelledby="responsibility-map-title">
            <div className="responsibility-map-heading">
              <div>
                <span className="section-kicker">Mô hình làm việc</span>
                <h2 id="responsibility-map-title">Bản đồ trách nhiệm</h2>
                <p>
                  MDS giữ Project Truth xuyên suốt các bàn giao; trách nhiệm triển khai vẫn thuộc về con người và công cụ bên ngoài.
                </p>
              </div>
              <span className="model-status">Định hướng mô hình</span>
            </div>

            <div className="responsibility-flow">
              <div className="responsibility-row">
                <div className="responsibility-row-label">
                  <strong>Định hướng</strong>
                  <span>Từ nhu cầu đến quyết định kỹ thuật</span>
                </div>
                <div className="role-route" aria-label="Product Management đến Architecture và Tech Lead">
                  <div className="role-node is-product"><strong>Product Management</strong><span>Giá trị &amp; ưu tiên</span></div>
                  <div className="role-node"><strong>Business Analysis</strong><span>Yêu cầu &amp; quy tắc</span></div>
                  <div className="role-node"><strong>System Analysis</strong><span>Phân rã giải pháp</span></div>
                  <div className="role-node is-architecture"><strong>Architecture / Tech Lead</strong><span>Ràng buộc kỹ thuật</span></div>
                </div>
              </div>

              <div className="responsibility-row">
                <div className="responsibility-row-label">
                  <strong>Đưa vào vận hành</strong>
                  <span>Từ thiết kế đến phản hồi thực tế</span>
                </div>
                <div className="role-route role-route-delivery" aria-label="Các tuyến xây dựng đến vận hành và phản hồi">
                  <div className="role-node role-build-lanes">
                    <strong>Các tuyến xây dựng</strong>
                    <span>UI/UX · Frontend · Backend · Database</span>
                  </div>
                  <div className="role-node"><strong>Quality Assurance</strong><span>Kiểm chứng &amp; cảnh báo</span></div>
                  <div className="role-node"><strong>DevOps / SRE</strong><span>Độ tin cậy vận hành</span></div>
                  <div className="role-node is-operations"><strong>Support / Operations</strong><span>Phản hồi về Product</span></div>
                </div>
              </div>

              <div className="responsibility-row responsibility-crosscutting">
                <div className="responsibility-row-label">
                  <strong>Xuyên suốt</strong>
                  <span>Không phải một bước tuần tự</span>
                </div>
                <div className="crosscutting-roles">
                  <span className="crosscutting-role"><strong>Project Management</strong><span>Điều phối delivery, phụ thuộc &amp; rủi ro</span></span>
                  <span className="crosscutting-role"><strong>Security</strong><span>Ràng buộc an toàn, threat &amp; bằng chứng</span></span>
                </div>
              </div>
            </div>

            <div className="responsibility-boundary">
              <div>
                <strong>MDS control plane</strong>
                <span>Ghi nhận, chuẩn hóa, duyệt, truy vết, phân tích tác động và tạo context package.</span>
              </div>
              <div>
                <strong>Implementation plane</strong>
                <span>Developer, IDE, coding agent và CI/CD triển khai; MDS chỉ nhận evidence đọc-được.</span>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <article className="panel attention-panel" id="attention-panel">
              <div className="panel-heading">
                <div>
                  <h2>Cần xử lý</h2>
                  <p>Bản nháp và tài liệu đang chờ quyết định.</p>
                </div>
                <CountBadge tone="review">{attentionArtifacts.length}</CountBadge>
              </div>

              {attentionArtifacts.length ? (
                <div className="attention-list">
                  {attentionArtifacts.slice(0, 4).map((artifact) => (
                    <button
                      className="attention-item"
                      key={artifact.relativePath}
                      onClick={() => handleOpenArtifact(artifact.relativePath)}
                      type="button"
                    >
                      <span className={`state-marker ${artifact.lifecycleState.toLowerCase()}`} />
                      <span className="attention-copy">
                        <strong>{artifact.title}</strong>
                        <small>
                          {displayLifecycle(artifact.lifecycleState)} · {displayOwner(artifact.owner)}
                        </small>
                      </span>
                      <Icon name="chevron" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="compact-empty">
                  <Icon name="task" />
                  <div>
                    <strong>Không có việc tồn đọng</strong>
                    <span>Bản nháp mới sẽ xuất hiện ở đây.</span>
                  </div>
                </div>
              )}
            </article>

            <article className="panel workflow-panel" id="workflow-panel">
              <div className="panel-heading">
                <div>
                  <h2>Workflow hiện tại</h2>
                  <p>Customer Change Analysis</p>
                </div>
                <StatusBadge
                  label={runningWorkflows ? "Đang chạy" : "Chưa chạy"}
                  tone={runningWorkflows ? "info" : "neutral"}
                />
              </div>

              {runningWorkflows ? (
                <>
                  <div className="workflow-summary">
                    <strong>3/6 bước hoàn thành</strong>
                    <span>Requirement DRAFT đang chờ con người duyệt.</span>
                  </div>
                  <div
                    aria-label="3 trong 6 bước hoàn thành"
                    aria-valuemax={6}
                    aria-valuemin={0}
                    aria-valuenow={3}
                    className="progress-track"
                    role="progressbar"
                  >
                    <span />
                  </div>
                  <ol className="workflow-steps">
                    <li className="is-done">Lưu nguồn</li>
                    <li className="is-done">Chuẩn hóa</li>
                    <li className="is-done">Tạo bản nháp</li>
                    <li className="is-current">Duyệt yêu cầu</li>
                  </ol>
                </>
              ) : (
                <div className="workflow-empty">
                  <div className="workflow-illustration"><Icon name="workflow" size={22} /></div>
                  <strong>Chưa có workflow đang chạy</strong>
                  <span>Nhập DOCX, Markdown hoặc TXT để tạo bản nháp đầu tiên.</span>
                  <Button
                    className="button button-primary compact-button"
                    disabled={isImporting || !workspacePath}
                    onClick={handleImportDocument}
                    size="sm"
                    tone="primary"
                  >
                    <Icon name="import" />
                    Nhập tài liệu
                  </Button>
                </div>
              )}
            </article>
          </section>

          {importedDocument ? (
            <section className="import-result" aria-labelledby="import-result-title">
              <div className="import-result-heading">
                <span className="success-check">✓</span>
                <div>
                  <h2 id="import-result-title">Đã nhập {importedDocument.title}</h2>
                  <p>Đã bảo toàn nguồn, chuẩn hóa nội dung và tạo requirement DRAFT.</p>
                </div>
              </div>
              <p className="preview-text">{importedDocument.preview}</p>
              <div className="result-files">
                <button
                  onClick={() => handleOpenArtifact(importedDocument.normalizedRelativePath)}
                  type="button"
                >
                  Xem nội dung chuẩn hóa
                </button>
                <button
                  onClick={() => handleOpenArtifact(importedDocument.requirementRelativePath)}
                  type="button"
                >
                  Mở requirement DRAFT
                </button>
              </div>
              {technicalMode ? (
                <dl className="technical-details">
                  <div>
                    <dt>SHA-256</dt>
                    <dd translate="no">{importedDocument.checksum}</dd>
                  </div>
                  <div>
                    <dt>Nguồn</dt>
                    <dd translate="no">{importedDocument.sourceRelativePath}</dd>
                  </div>
                </dl>
              ) : null}
            </section>
          ) : null}

          <section className="review-workbench" id="review-workbench" aria-label="Review, truth va impact">
            <article className="panel review-panel">
              <div className="panel-heading">
                <div><h2>Review workbench</h2><p>Draft va review decision</p></div>
                <span className="count-chip">{reviewArtifacts.length}</span>
              </div>
              {reviewArtifacts.length ? reviewArtifacts.slice(0, 5).map((artifact) => (
                <div className="review-row" key={artifact.relativePath}>
                  <button className="review-select" onClick={() => setSelectedReview(artifact)} type="button">
                    <span className="state-marker review" />
                    <span><strong>{artifact.title}</strong><small>{artifact.version} · {artifact.relativePath}</small></span>
                  </button>
                  <div className="review-actions">
                    <button className="button button-ghost compact-button" onClick={() => handleOpenArtifact(artifact.relativePath)} type="button">Mo</button>
                    <button className="button button-primary compact-button" onClick={() => { setSelectedReview(artifact); void handleReview("APPROVED", artifact); }} type="button">Duyet</button>
                    <button className="button button-ghost compact-button" onClick={() => { setSelectedReview(artifact); void handleReview("REJECTED", artifact); }} type="button">Tu choi</button>
                    <button className="button button-ghost compact-button" onClick={() => void handleImpact(artifact)} type="button">Impact</button>
                  </div>
                </div>
              )) : <div className="compact-empty"><Icon name="task" /><div><strong>Khong co draft cho review</strong><span>Nhap tai lieu de tao requirement draft.</span></div></div>}
              {selectedReview ? <div className="review-selection" aria-live="polite"><strong>{selectedReview.title}</strong><span>Version history: {selectedReview.version} · approved head transition is immutable.</span></div> : null}
              {reviewBusy ? <small className="panel-footnote">Dang ghi nhan quyet dinh...</small> : null}
            </article>

            <article className="panel truth-panel">
              <div className="panel-heading"><div><h2>Current Project Truth</h2><p>Authority rail from artifact state</p></div></div>
              <div className="truth-rail">
                <div className="truth-authoritative"><strong>{artifacts.filter((a) => a.lifecycleState === "APPROVED").length}</strong><span>AUTHORITATIVE</span></div>
                <div className="truth-warning"><strong>{artifacts.filter((a) => ["REVIEW", "DRAFT"].includes(a.lifecycleState)).length}</strong><span>WARNING</span></div>
                <div className="truth-excluded"><strong>{artifacts.filter((a) => ["STALE", "CONFLICTED", "ARCHIVED", "DEPRECATED"].includes(a.lifecycleState)).length}</strong><span>EXCLUDED</span></div>
              </div>
              <p className="truth-note">Chi AUTHORITATIVE duoc phep lam instruction. WARNING can review; EXCLUDED khong duoc dua vao context.</p>
            </article>

            <article className="panel impact-panel">
              <div className="panel-heading"><div><h2>Impact & context</h2><p>Evidence-backed downstream view</p></div></div>
              {impactResult ? <>
                <div className="impact-summary"><strong>{impactResult.matchedArtifacts.length}</strong><span>affected artifacts</span></div>
                <ul className="impact-list">{impactResult.matchedArtifacts.slice(0, 6).map((item) => <li key={item}><code>{item}</code><span>NEEDS_REVIEW proposal</span></li>)}</ul>
              </> : <div className="compact-empty"><Icon name="analysis" /><div><strong>Chua co impact report</strong><span>Chon Impact tren requirement de xem duong dan anh huong.</span></div></div>}
              <div className="context-authority"><span className="authority-dot" /> Context package: bounded read-only evidence · khong uy quyen sua source/test/Git/deploy.</div>
            </article>
          </section>

          <section className="evidence-ledger" aria-labelledby="evidence-ledger-title">
            <article className="panel evidence-list-panel">
              <div className="panel-heading">
                <div><h2 id="evidence-ledger-title">Implementation evidence</h2><p>Read-only proof returned by the external implementation plane.</p></div>
                <span className="count-chip">{evidenceBundles.length}</span>
              </div>
              {evidenceBundles.length ? <div className="evidence-bundle-list">
                {evidenceBundles.slice(0, 8).map((bundle) => {
                  const failed = bundle.results.some((result) => result.status === "FAILED");
                  const incomplete = bundle.results.some((result) => result.status === "NOT_RUN" || result.status === "INCOMPLETE");
                  const label = failed ? "BLOCKER" : incomplete ? "WARNING" : "EVIDENCE";
                  return <button className={`evidence-bundle-row ${selectedEvidence?.bundleId === bundle.bundleId ? "is-selected" : ""}`} key={bundle.bundleId} onClick={() => setSelectedEvidence(bundle)} type="button">
                    <span className={`evidence-seal ${failed ? "is-blocker" : incomplete ? "is-warning" : "is-pass"}`}>{label}</span>
                    <span><strong>{bundle.bundleId}</strong><small>{bundle.producerType}:{bundle.producerId} · {bundle.results.length} result(s)</small></span>
                    <code>{bundle.commit.slice(0, 10)}</code>
                  </button>;
                })}
              </div> : <div className="compact-empty"><Icon name="archive" /><div><strong>Chua co implementation evidence</strong><span>Evidence bundle da duoc MDS chap nhan se xuat hien tai day.</span></div></div>}
            </article>
            <aside className="panel evidence-inspector" aria-live="polite">
              <div className="panel-heading"><div><h2>Evidence inspector</h2><p>Identity, authority and result references</p></div></div>
              {selectedEvidence ? <>
                <dl className="evidence-facts">
                  <div><dt>Context</dt><dd>{selectedEvidence.contextPackageId}</dd></div>
                  <div><dt>Source</dt><dd>{selectedEvidence.repository}@{selectedEvidence.commit}</dd></div>
                  <div><dt>Producer</dt><dd>{selectedEvidence.producerType}:{selectedEvidence.producerId}</dd></div>
                  <div><dt>Manifest</dt><dd>{selectedEvidence.submittedManifestSha256}</dd></div>
                </dl>
                <h3>Linked versions</h3>
                <ul className="evidence-reference-list">{selectedEvidence.artifactVersionIds.map((id) => <li key={id}><code>{id}</code></li>)}</ul>
                <h3>Findings preview</h3>
                <ul className="evidence-result-list">{selectedEvidence.results.map((result, index) => <li key={`${result.kind}-${index}`}><span className={`result-state is-${result.status.toLowerCase()}`}>{result.status}</span><strong>{result.command_label}</strong><code>{result.evidence_file}</code></li>)}</ul>
              </> : <div className="inspector-guidance"><span>↗</span><strong>Chon mot evidence bundle</strong><p>MDS chi hien thi bang chung da duoc validate. PASS khong tu dong duyet release.</p></div>}
              <div className="evidence-authority-notice"><span className="authority-dot" /> Read-only evidence · không cho phép sửa source/test, Git, PR hoặc deploy.</div>
            </aside>
          </section>

          <section className="lower-grid">
            <article className="panel documents-panel" id="documents-panel">
              <div className="panel-heading">
                <div>
                  <h2>Tài liệu gần đây</h2>
                  <p>{normalizedQuery ? `Kết quả cho “${query.trim()}”` : "Cập nhật mới nhất trong project."}</p>
                </div>
                <span className="count-chip">{visibleArtifacts.length}</span>
              </div>

              {visibleArtifacts.length ? (
                <div className="document-list">
                  {visibleArtifacts.map((artifact) => (
                    <button
                      className="document-row"
                      key={artifact.relativePath}
                      onClick={() => handleOpenArtifact(artifact.relativePath)}
                      type="button"
                    >
                      <span className="document-icon"><Icon name="document" /></span>
                      <span className="document-main">
                        <strong>{artifact.title}</strong>
                        <span>
                          {displayLifecycle(artifact.lifecycleState)} · {displayOwner(artifact.owner)}
                        </span>
                        {technicalMode ? (
                          <code translate="no">{artifact.id} · {artifact.relativePath}</code>
                        ) : null}
                      </span>
                      <time dateTime={artifact.updatedAt}>{relativeTime(artifact.updatedAt)}</time>
                      <Icon name="chevron" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="compact-empty">
                  <Icon name={normalizedQuery ? "search" : "document"} />
                  <div>
                    <strong>
                      {normalizedQuery
                        ? "Không tìm thấy tài liệu"
                        : "Project chưa có tài liệu"}
                    </strong>
                    <span>
                      {normalizedQuery
                        ? "Thử một từ khóa khác."
                        : "Nhập DOCX, Markdown hoặc TXT để bắt đầu."}
                    </span>
                  </div>
                </div>
              )}
            </article>

            <article className="panel activity-panel" id="activity-panel">
              <div className="panel-heading">
                <div>
                  <h2>Hoạt động gần đây</h2>
                  <p>Được suy ra từ thay đổi tài liệu.</p>
                </div>
              </div>
              <div className="activity-list">
                {importedDocument ? (
                  <div className="activity-item">
                    <span className="activity-dot success" />
                    <div>
                      <strong>Đã nhập {importedDocument.title}</strong>
                      <small>Vừa xong · Requirement DRAFT đã được tạo</small>
                    </div>
                  </div>
                ) : null}
                {recentArtifacts.slice(0, 4).map((artifact) => (
                  <div className="activity-item" key={artifact.relativePath}>
                    <span className="activity-dot" />
                    <div>
                      <strong>{artifact.title}</strong>
                      <small>
                        Cập nhật {relativeTime(artifact.updatedAt)} · {displayLifecycle(artifact.lifecycleState)}
                      </small>
                    </div>
                  </div>
                ))}
                {!recentArtifacts.length ? (
                  <div className="compact-empty">
                    <Icon name="activity" />
                    <div>
                      <strong>Chưa có hoạt động</strong>
                      <span>Thay đổi tài liệu sẽ xuất hiện tại đây.</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          </section>
        </main>
        )}
      </div>
    </div>
  );
}
