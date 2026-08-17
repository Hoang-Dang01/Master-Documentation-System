import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export type SemanticTone =
  | "action"
  | "approved"
  | "review"
  | "conflict"
  | "info"
  | "neutral";

export type ArtifactStatus =
  | "APPROVED"
  | "ARCHIVED"
  | "CONFLICTED"
  | "DEPRECATED"
  | "DRAFT"
  | "REJECTED"
  | "REVIEW"
  | "STALE";

const artifactStatusTone: Record<ArtifactStatus, SemanticTone> = {
  APPROVED: "approved",
  ARCHIVED: "neutral",
  CONFLICTED: "conflict",
  DEPRECATED: "neutral",
  DRAFT: "neutral",
  REJECTED: "conflict",
  REVIEW: "review",
  STALE: "review",
};

const artifactStatusLabel: Record<ArtifactStatus, string> = {
  APPROVED: "Đã duyệt",
  ARCHIVED: "Đã lưu trữ",
  CONFLICTED: "Mâu thuẫn",
  DEPRECATED: "Ngừng sử dụng",
  DRAFT: "Bản nháp",
  REJECTED: "Từ chối",
  REVIEW: "Chờ duyệt",
  STALE: "Cần xem lại",
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function semanticToneForStatus(status: ArtifactStatus): SemanticTone {
  return artifactStatusTone[status];
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "quiet" | "danger";
  size?: "sm" | "md";
};

export function Button({
  children,
  className,
  size = "md",
  tone = "secondary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames("mds-button", `mds-button--${tone}`, `mds-button--${size}`, className)}
      type={type}
    >
      {children}
    </button>
  );
}

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({ children, className, label, type = "button", ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      className={classNames("mds-icon-button", className)}
      title={label}
      type={type}
    >
      {children}
    </button>
  );
}

export type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "aside" | "div" | "section";
  emphasis?: "flat" | "raised" | "selected";
  tone?: SemanticTone;
};

export function Surface({
  as: Tag = "div",
  children,
  className,
  emphasis = "flat",
  tone,
  ...props
}: SurfaceProps) {
  return (
    <Tag
      {...props}
      className={classNames(
        "mds-surface",
        `mds-surface--${emphasis}`,
        tone && `mds-surface--${tone}`,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export type StatusBadgeProps = {
  label?: string;
  status?: ArtifactStatus;
  tone?: SemanticTone;
};

export function StatusBadge({ label, status, tone }: StatusBadgeProps) {
  const resolvedTone = tone ?? (status ? semanticToneForStatus(status) : "neutral");
  const resolvedLabel = label ?? (status ? artifactStatusLabel[status] : "Chưa xác định");

  return (
    <span className={classNames("mds-status", `mds-status--${resolvedTone}`)}>
      <span aria-hidden="true" className="mds-status__mark" />
      {resolvedLabel}
    </span>
  );
}

export function CountBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: SemanticTone }) {
  return <span className={classNames("mds-count", `mds-count--${tone}`)}>{children}</span>;
}

export function SectionHeading({
  action,
  children,
  description,
  eyebrow,
  id,
}: {
  action?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  id?: string;
}) {
  return (
    <header className="mds-section-heading">
      <div>
        {eyebrow ? <span className="mds-eyebrow">{eyebrow}</span> : null}
        <h2 id={id}>{children}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="mds-section-heading__action">{action}</div> : null}
    </header>
  );
}

export function EmptyState({
  action,
  children,
  icon,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className="mds-empty-state">
      {icon ? <span aria-hidden="true" className="mds-empty-state__icon">{icon}</span> : null}
      <strong>{title}</strong>
      <p>{children}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function Field({
  hint,
  inputProps,
  label,
}: {
  hint?: ReactNode;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  label: ReactNode;
}) {
  return (
    <label className="mds-field">
      <span>{label}</span>
      <input {...inputProps} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function DataRow({
  children,
  className,
  selected = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { selected?: boolean }) {
  return (
    <div {...props} className={classNames("mds-data-row", selected && "is-selected", className)}>
      {children}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="mds-kbd">{children}</kbd>;
}
