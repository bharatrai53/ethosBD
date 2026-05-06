import { T } from "../constants/theme";
import { TIER_COLORS } from "../constants/colors";
import { STATUSES, STATUS_ORDER } from "../constants/statuses";

export default function ContactHeader({ contact, contactIdx, status, onStatusChange }) {
  const tierColors = TIER_COLORS[contact.tier] || { bg: T.bgCard, text: T.textMuted };

  return (
    <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, background: T.bgPanel }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>

        {/* Left: contact info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.textPrimary, marginBottom: 3 }}>{contact.name}</h2>
          <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.mono, marginBottom: 6 }}>{contact.title} · {contact.hospital}</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, background: T.accentBg, color: T.accent, padding: "2px 8px", borderRadius: 4, fontFamily: T.mono, fontWeight: 600 }}>ALOS +{contact.alos_delta}d</span>
            <span style={{ fontSize: 10, background: contact.m2b === "Confirmed M2B" ? T.greenBg : T.bgCard, color: contact.m2b === "Confirmed M2B" ? T.green : T.textMuted, padding: "2px 8px", borderRadius: 4, fontFamily: T.mono, border: `1px solid ${T.border}` }}>{contact.m2b}</span>
            <span style={{ fontSize: 10, background: tierColors.bg, color: tierColors.text, padding: "2px 8px", borderRadius: 4, fontFamily: T.mono }}>{contact.tier}</span>
            {contact.email && (
              <span style={{ fontSize: 10, color: T.accent, fontFamily: T.mono }}>{contact.email}</span>
            )}
          </div>
        </div>

        {/* Right: status selector */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.mono, marginBottom: 6, textAlign: "right" }}>Outreach Status</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {STATUS_ORDER.map(s => {
              const st = STATUSES[s];
              const isActive = status === s;
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(contactIdx, s)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 5, border: `1px solid ${isActive ? st.dot : T.border}`, background: isActive ? st.bg : "transparent", cursor: "pointer", transition: "all 0.1s" }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? st.dot : T.border }} />
                  <span style={{ fontSize: 10, fontFamily: T.mono, color: isActive ? st.color : T.textSubtle, fontWeight: isActive ? 600 : 400 }}>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
