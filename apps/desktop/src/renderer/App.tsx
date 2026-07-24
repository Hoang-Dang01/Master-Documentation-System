import { useEffect, useMemo, useState } from "react";

type NavigationItem = {
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
};

const navigation: NavigationItem[] = [
  { label: "Tổng quan", icon: "⌂", active: true },
  { label: "Tài liệu", icon: "▤" },
  { label: "Requirement Inbox", icon: "◇", badge: "0" },
  { label: "Phân tích thay đổi", icon: "↗" },
  { label: "Thiết kế nháp", icon: "✦" },
  { label: "Workflows", icon: "⌘", badge: "1" }
];

const workflowSteps = [
  "Nhập tài liệu",
  "Trích xuất requirement",
  "Human review",
  "Impact analysis",
  "Design draft"
];

export function App() {
  const [appInfo, setAppInfo] = useState<MdsAppInfo | null>(null);
  const [workspacePath, setWorkspacePath] = useState("");
  const [notice, setNotice] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    window.mds
      .getAppInfo()
      .then((info) => {
        setAppInfo(info);
        setWorkspacePath(info.defaultWorkspacePath);
      })
      .catch(() => {
        setNotice("Không thể đọc thông tin desktop bridge.");
      });
  }, []);

  const workspaceName = useMemo(() => {
    const normalized = workspacePath.replace(/[\\/]+$/, "");
    return normalized.split(/[\\/]/).pop() || "Chưa chọn workspace";
  }, [workspacePath]);

  async function handleSelectWorkspace() {
    setIsSelecting(true);
    setNotice("");
    try {
      const selection = await window.mds.selectWorkspace();
      if (!selection.canceled && selection.path) {
        setWorkspacePath(selection.path);
        setNotice("Workspace đã sẵn sàng.");
      }
    } catch {
      setNotice("Không thể mở hộp thoại chọn workspace.");
    } finally {
      setIsSelecting(false);
    }
  }

  async function handleOpenWorkspace() {
    if (!workspacePath) return;
    const result = await window.mds.openWorkspace(workspacePath);
    if (!result.ok) {
      setNotice(result.error);
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <strong>MDS</strong>
            <span>Engineering OS</span>
          </div>
        </div>

        <nav className="navigation" aria-label="Điều hướng chính">
          <p className="nav-label">Workspace</p>
          {navigation.map((item) => (
            <button
              className={`nav-item ${item.active ? "is-active" : ""}`}
              key={item.label}
              type="button"
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="status-dot" />
          <div>
            <strong>Local-first</strong>
            <span>v{appInfo?.version ?? "0.1.0"}</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Personal Engineering Operating System</p>
            <h1>Chào buổi làm việc, Hoàng.</h1>
          </div>
          <div className="topbar-actions">
            <button className="button button-quiet" type="button">
              Tài liệu hướng dẫn
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={handleSelectWorkspace}
              disabled={isSelecting}
            >
              <span aria-hidden="true">＋</span>
              {isSelecting ? "Đang chọn..." : "Chọn workspace"}
            </button>
          </div>
        </header>

        {notice && <div className="notice">{notice}</div>}

        <section className="hero-grid">
          <article className="workspace-card">
            <div className="card-kicker">
              <span className="live-pill">ACTIVE</span>
              <span>Workspace hiện tại</span>
            </div>
            <div className="workspace-heading">
              <div>
                <h2>{workspaceName}</h2>
                <p title={workspacePath}>{workspacePath || "Chưa chọn thư mục"}</p>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Mở workspace trong File Explorer"
                onClick={handleOpenWorkspace}
                disabled={!workspacePath}
              >
                ↗
              </button>
            </div>

            <div className="workspace-metrics">
              <div>
                <strong>03</strong>
                <span>Design phase</span>
              </div>
              <div>
                <strong>01</strong>
                <span>Workflow</span>
              </div>
              <div>
                <strong>33</strong>
                <span>Glossary terms</span>
              </div>
            </div>
          </article>

          <article className="brief-card">
            <div className="section-title">
              <div>
                <p className="eyebrow">Today&apos;s brief</p>
                <h2>Điểm cần tập trung</h2>
              </div>
              <span className="date-chip">Local</span>
            </div>
            <ul className="brief-list">
              <li>
                <span className="brief-index">01</span>
                <div>
                  <strong>Hoàn thiện desktop shell</strong>
                  <span>Electron · React · IPC</span>
                </div>
              </li>
              <li>
                <span className="brief-index">02</span>
                <div>
                  <strong>Kết nối document ingestion</strong>
                  <span>DOCX · PDF · Markdown</span>
                </div>
              </li>
              <li>
                <span className="brief-index">03</span>
                <div>
                  <strong>Giữ approval gate</strong>
                  <span>AI đề xuất · Con người duyệt</span>
                </div>
              </li>
            </ul>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel workflow-panel">
            <div className="section-title">
              <div>
                <p className="eyebrow">First vertical slice</p>
                <h2>Customer Change Analysis</h2>
              </div>
              <span className="draft-pill">DRAFT</span>
            </div>

            <div className="workflow-track">
              {workflowSteps.map((step, index) => (
                <div className="workflow-step" key={step}>
                  <span className={index === 0 ? "step-dot is-ready" : "step-dot"}>
                    {index + 1}
                  </span>
                  <div>
                    <strong>{step}</strong>
                    <span>{index === 0 ? "Sẵn sàng" : "Chờ bước trước"}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="button button-dark" type="button">
              Mở workflow
              <span aria-hidden="true">→</span>
            </button>
          </article>

          <article className="panel principles-panel">
            <div className="section-title">
              <div>
                <p className="eyebrow">System health</p>
                <h2>Nguyên tắc vận hành</h2>
              </div>
            </div>
            <div className="principle">
              <span className="principle-mark deterministic">D</span>
              <div>
                <strong>Deterministic first</strong>
                <span>Việc có quy tắc rõ chạy bằng code.</span>
              </div>
            </div>
            <div className="principle">
              <span className="principle-mark assisted">AI</span>
              <div>
                <strong>AI tạo bản nháp</strong>
                <span>Kết quả có nguồn và cần review.</span>
              </div>
            </div>
            <div className="principle">
              <span className="principle-mark approval">H</span>
              <div>
                <strong>Human approval</strong>
                <span>Quyết định quan trọng không tự động.</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

