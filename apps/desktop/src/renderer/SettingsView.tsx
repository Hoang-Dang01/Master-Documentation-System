import type { ReactNode } from "react";
import { Button, SectionHeading, Surface } from "./ui";

export type AccentId = "yellow" | "blue" | "green" | "pink";
export type Density = "comfortable" | "compact";
export type InterfaceLanguage = "vi" | "en";
export type Typography = "standard" | "technical";

export type InterfacePreferences = {
  accent: AccentId;
  density: Density;
  fontScale: number;
  language: InterfaceLanguage;
  reduceMotion: boolean;
  typography: Typography;
};

type Props = {
  onReset: () => void;
  onUpdate: (next: Partial<InterfacePreferences>) => void;
  preferences: InterfacePreferences;
};

const accents: Array<{ id: AccentId; label: string; description: string }> = [
  { id: "yellow", label: "Vàng", description: "Mặc định MDS" },
  { id: "blue", label: "Xanh dương", description: "Tập trung & thông tin" },
  { id: "green", label: "Xanh lá", description: "Trạng thái tích cực" },
  { id: "pink", label: "Hồng", description: "Nhấn mạnh nhẹ" },
];

function ChoiceCard({
  children,
  checked,
  onClick,
}: {
  children: ReactNode;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={checked}
      className={`settings-choice ${checked ? "is-selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="settings-choice__radio" />
      <span>{children}</span>
    </button>
  );
}

export function SettingsView({ onReset, onUpdate, preferences }: Props) {
  const fontPercent = Math.round(preferences.fontScale * 100);

  return (
    <main className="settings-main" id="main-content">
      <header className="settings-hero">
        <div>
          <span className="settings-kicker">Advanced settings / local workspace</span>
          <h1>Tùy chỉnh giao diện</h1>
          <p>
            Điều chỉnh cách MDS hiển thị trên máy này. Những thiết lập này chỉ
            thay đổi lớp trình bày, không thay đổi Project Truth hay workflow.
          </p>
        </div>
        <Button onClick={onReset} tone="secondary">Khôi phục mặc định</Button>
      </header>

      <div className="settings-layout">
        <section aria-labelledby="settings-appearance">
          <Surface className="settings-panel" emphasis="raised">
            <SectionHeading description="Màu được dùng cho action chính, lựa chọn đang mở và điểm nhấn." id="settings-appearance" eyebrow="01 / Appearance">
              Màu chủ đạo
            </SectionHeading>
            <div className="accent-grid">
              {accents.map((accent) => (
                <button
                  aria-pressed={preferences.accent === accent.id}
                  className={`accent-choice accent-choice--${accent.id} ${preferences.accent === accent.id ? "is-selected" : ""}`}
                  key={accent.id}
                  onClick={() => onUpdate({ accent: accent.id })}
                  type="button"
                >
                  <i aria-hidden="true" />
                  <span><strong>{accent.label}</strong><small>{accent.description}</small></span>
                </button>
              ))}
            </div>
          </Surface>

          <Surface className="settings-panel" emphasis="raised">
            <SectionHeading description="MDS ưu tiên khả năng đọc lâu dài; thay đổi có hiệu lực ngay." eyebrow="02 / Type">
              Cỡ chữ & kiểu chữ
            </SectionHeading>
            <div className="settings-control-row">
              <div>
                <strong>Cỡ chữ giao diện</strong>
                <p>{fontPercent}% · ảnh hưởng text trong shell, bảng và panel.</p>
              </div>
              <output aria-live="polite" className="font-scale-output">{fontPercent}%</output>
            </div>
            <input
              aria-label="Cỡ chữ giao diện"
              className="settings-range"
              max="1.2"
              min="0.9"
              onChange={(event) => onUpdate({ fontScale: Number(event.target.value) })}
              step="0.05"
              type="range"
              value={preferences.fontScale}
            />
            <div className="settings-choice-grid">
              <ChoiceCard checked={preferences.typography === "standard"} onClick={() => onUpdate({ typography: "standard" })}>
                <strong>Chuẩn</strong><small>Sans rõ ràng cho toàn bộ giao diện.</small>
              </ChoiceCard>
              <ChoiceCard checked={preferences.typography === "technical"} onClick={() => onUpdate({ typography: "technical" })}>
                <strong>Kỹ thuật</strong><small>Mono rõ hơn cho ID, số liệu và nhãn.</small>
              </ChoiceCard>
            </div>
          </Surface>
        </section>

        <section aria-labelledby="settings-workspace">
          <Surface className="settings-panel" emphasis="raised">
            <SectionHeading description="Chọn mức độ dày của thông tin trong màn desktop." id="settings-workspace" eyebrow="03 / Workspace">
              Layout
            </SectionHeading>
            <div className="settings-choice-grid">
              <ChoiceCard checked={preferences.density === "comfortable"} onClick={() => onUpdate({ density: "comfortable" })}>
                <strong>Thoáng</strong><small>Khoảng cách rộng, phù hợp đọc và review.</small>
              </ChoiceCard>
              <ChoiceCard checked={preferences.density === "compact"} onClick={() => onUpdate({ density: "compact" })}>
                <strong>Gọn</strong><small>Ít khoảng cách hơn, thấy nhiều dữ liệu hơn.</small>
              </ChoiceCard>
            </div>
            <div aria-label="Xem trước layout" className={`layout-preview is-${preferences.density}`}>
              <span /> <span /> <span />
            </div>
          </Surface>

          <Surface className="settings-panel" emphasis="raised">
            <SectionHeading description="Ngôn ngữ được lưu theo local desktop profile." eyebrow="04 / Language">
              Ngôn ngữ & chuyển động
            </SectionHeading>
            <label className="settings-select">
              <span>Ngôn ngữ giao diện</span>
              <select
                onChange={(event) => onUpdate({ language: event.target.value as InterfaceLanguage })}
                value={preferences.language}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English (beta)</option>
              </select>
              <small>English được lưu sẵn cho gói dịch giao diện kế tiếp.</small>
            </label>
            <label className="settings-switch-row">
              <span><strong>Giảm chuyển động</strong><small>Tắt animation hover/press không cần thiết.</small></span>
              <input
                checked={preferences.reduceMotion}
                onChange={(event) => onUpdate({ reduceMotion: event.target.checked })}
                type="checkbox"
              />
              <i aria-hidden="true" />
            </label>
          </Surface>
        </section>
      </div>

      <p className="settings-footnote">Lưu tự động trên máy này · Không gửi dữ liệu cấu hình ra ngoài MDS.</p>
    </main>
  );
}
