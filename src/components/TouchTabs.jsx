import { T } from "../constants/theme";
import { TOUCH_TABS } from "../constants/tabs";
import { getMsgKey } from "../utils/msgKey";

export default function TouchTabs({ touchType, onSelect, messages, contactIdx }) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.bgPanel }}>
      {TOUCH_TABS.map(tab => {
        const isActive = touchType === tab.id;
        const isDone = !!messages[getMsgKey(contactIdx, tab.id)];
        return (
          <button
            key={tab.id}
            className={`tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onSelect(tab.id)}
            style={{ padding: "10px 20px", fontSize: 12, fontFamily: T.mono, color: isActive ? T.accent : T.textMuted, background: isActive ? T.accentBg : "transparent", borderBottom: isActive ? `2px solid ${T.accent}` : "2px solid transparent", display: "flex", alignItems: "center", gap: 6 }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span style={{ fontSize: 9, color: T.textSubtle }}>{tab.limit}</span>
            {isDone && <span style={{ fontSize: 9, color: T.green }}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}
