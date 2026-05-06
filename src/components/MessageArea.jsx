import { T } from "../constants/theme";
import { TOUCH_TABS } from "../constants/tabs";

export default function MessageArea({ contact, touchType, onTouchType, currentMsg, currentKey, isLoading, onGenerate, onEdit, onDelete, onCopy, copied }) {
  const tab = TOUCH_TABS.find(t => t.id === touchType);

  return (
    <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: T.bgMain }}>

      {/* Context bar */}
      <div style={{ background: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: 6, padding: "10px 14px", fontSize: 11, color: T.textMuted, fontFamily: T.mono, lineHeight: 1.7 }}>
        <span style={{ color: T.accent, fontWeight: 600 }}>Context: </span>
        {contact.hospital} · ALOS +{contact.alos_delta}d · {contact.m2b} · {contact.role} · {contact.state}
        {touchType === "linkedin" && <> · <span style={{ color: T.amber, fontWeight: 600 }}>295 char limit</span></>}
      </div>

      {/* AI generate — only shown when message was cleared */}
      {!currentMsg && (
        <button
          className="gen-btn"
          onClick={onGenerate}
          disabled={isLoading}
          style={{ alignSelf: "flex-start", background: isLoading ? T.bgCard : T.accent, color: isLoading ? T.textSubtle : "#FFFFFF", padding: "10px 20px", borderRadius: 6, fontSize: 12, fontFamily: T.mono, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, boxShadow: isLoading ? "none" : "0 1px 4px rgba(2,132,199,0.3)" }}
        >
          {isLoading
            ? <><span className="loading-dot" style={{ color: T.accent }}>●</span> Generating…</>
            : <>⚡ AI Generate {tab?.label}</>
          }
        </button>
      )}

      {/* Generated / template message */}
      {currentMsg && (
        <div className="slide-in" style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: touchType === "linkedin" && currentMsg.length > 295 ? T.red : T.textSubtle, fontFamily: T.mono }}>
              {touchType === "linkedin"
                ? `${currentMsg.length} / 295 chars ${currentMsg.length > 295 ? "⚠ OVER LIMIT" : "✓"}`
                : `${currentMsg.split(" ").filter(Boolean).length} words`}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="copy-btn"
                onClick={() => onCopy(currentMsg, currentKey)}
                style={{ background: copied === currentKey ? T.greenBg : T.bgPanel, color: copied === currentKey ? T.green : T.textMuted, padding: "4px 12px", borderRadius: 4, fontSize: 10, fontFamily: T.mono, border: `1px solid ${copied === currentKey ? T.green : T.border}` }}
              >
                {copied === currentKey ? "✓ Copied" : "Copy"}
              </button>
              <button
                className="gen-btn"
                onClick={() => onDelete(currentKey)}
                style={{ background: T.bgPanel, color: T.textMuted, padding: "4px 12px", borderRadius: 4, fontSize: 10, fontFamily: T.mono, border: `1px solid ${T.border}` }}
              >
                AI Regen
              </button>
            </div>
          </div>

          <textarea
            className="msg-area"
            rows={touchType === "linkedin" ? 5 : 16}
            value={currentMsg}
            onChange={e => onEdit(currentKey, e.target.value)}
          />

          {/* Advance to next touch */}
          {touchType !== "email2" && (
            <button
              className="gen-btn"
              onClick={() => onTouchType(touchType === "linkedin" ? "email1" : "email2")}
              style={{ alignSelf: "flex-start", background: T.bgPanel, color: T.textMuted, padding: "7px 14px", borderRadius: 5, fontSize: 11, fontFamily: T.mono, border: `1px solid ${T.border}` }}
            >
              → Next: {touchType === "linkedin" ? "Email 1" : "Email 2 Follow-up"}
            </button>
          )}
        </div>
      )}

      {/* Loading dots */}
      {isLoading && !currentMsg && (
        <div style={{ display: "flex", gap: 4, padding: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="loading-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
