import { T } from "../constants/theme";

export default function ProgressBar({ bulkProgress }) {
  return (
    <div style={{ background: T.bgCard, borderBottom: `1px solid ${T.border}`, padding: "8px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 4, background: T.border, borderRadius: 2 }}>
        <div className="progress-bar" style={{ width: `${bulkProgress}%`, height: "100%", background: T.accent, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.sans, whiteSpace: "nowrap" }}>
        Generating… {bulkProgress}%
      </span>
    </div>
  );
}
