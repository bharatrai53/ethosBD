import { T } from "../constants/theme";

export default function Header({ generatedCount, bulkGenerating, bulkProgress, onGenerateAll, onStop, onExportCSV, onUpload, senderName, onSenderChange }) {
  return (
    <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: T.bgPanel, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
        <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, letterSpacing: "0.04em", color: T.textPrimary }}>Ethos</span>
        <span style={{ color: T.border, fontSize: 16 }}>|</span>
        <span style={{ fontFamily: T.sans, fontSize: 13, color: T.textMuted }}>Outreach Engine</span>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Editable sender name */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 6 }}>
          <span style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.mono }}>From:</span>
          <input
            className="sender-input"
            value={senderName}
            onChange={e => onSenderChange(e.target.value)}
            placeholder="Your name"
            title="Sender name used in templates"
          />
        </div>

        <span style={{ fontSize: 11, color: T.textSubtle, fontFamily: T.mono }}>{generatedCount} msgs</span>

        <button className="gen-btn" onClick={onUpload}
          style={{ background: T.bgCard, color: T.textSecondary, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontFamily: T.mono, fontWeight: 500, border: `1px solid ${T.border}` }}>
          ↑ Upload Contacts
        </button>

        {!bulkGenerating ? (
          <button className="gen-btn" onClick={onGenerateAll}
            style={{ background: T.accent, color: "#FFFFFF", padding: "6px 14px", borderRadius: 6, fontSize: 11, fontFamily: T.mono, fontWeight: 600 }}>
            ⚡ AI Regen All
          </button>
        ) : (
          <button className="gen-btn" onClick={onStop}
            style={{ background: T.redBg, color: T.red, padding: "6px 14px", borderRadius: 6, fontSize: 11, fontFamily: T.mono, fontWeight: 600, border: `1px solid ${T.red}` }}>
            ■ Stop ({bulkProgress}%)
          </button>
        )}

        <button className="gen-btn" onClick={onExportCSV}
          style={{ background: generatedCount > 0 ? T.greenBg : T.bgCard, color: generatedCount > 0 ? T.green : T.textSubtle, padding: "6px 14px", borderRadius: 6, fontSize: 11, fontFamily: T.mono, fontWeight: 600, border: `1px solid ${generatedCount > 0 ? T.green : T.border}` }}>
          ↓ Export CSV
        </button>
      </div>
    </div>
  );
}
