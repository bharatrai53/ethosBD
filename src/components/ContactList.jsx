import { T } from "../constants/theme";
import { ROLE_COLORS, TIER_COLORS } from "../constants/colors";
import { STATUSES, STATUS_ORDER } from "../constants/statuses";
import { getMsgKey } from "../utils/msgKey";

const FILTER_OPTIONS = [
  ["all", "All"],
  ["tier1", "Tier 1"],
  ["pharmacy", "Pharmacy"],
  ["casemgmt", "Case Mgmt"],
  ["csuite", "C-Suite"],
];

export default function ContactList({ contacts, filteredContacts, selected, onSelect, filter, onFilter, messages, statuses }) {
  // Status summary counts
  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = contacts.filter((_, i) => (statuses[i] ?? "pending") === s).length;
    return acc;
  }, {});

  return (
    <div style={{ width: 290, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", background: T.bgPanel, flexShrink: 0 }}>

      {/* Status summary */}
      <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {STATUS_ORDER.filter(s => s !== "passed").map(s => {
          const st = STATUSES[s];
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
              <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono }}>{counts[s]}</span>
            </div>
          );
        })}
        <span style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.mono, marginLeft: "auto" }}>{contacts.length} contacts</span>
      </div>

      {/* Filters */}
      <div style={{ padding: "8px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", flexWrap: "wrap", gap: 4 }}>
        {FILTER_OPTIONS.map(([val, label]) => (
          <button
            key={val}
            className={`filter-btn ${filter === val ? "active" : ""}`}
            onClick={() => onFilter(val)}
            style={{ background: filter === val ? T.accent : T.bgCard, color: filter === val ? "#FFFFFF" : T.textMuted, fontSize: 10, padding: "3px 8px", borderRadius: 4, fontFamily: T.mono, fontWeight: filter === val ? 600 : 400, border: `1px solid ${filter === val ? T.accent : T.border}` }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contact rows */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {filteredContacts.map((c) => {
          const globalIdx = contacts.indexOf(c);
          const rc = ROLE_COLORS[c.role] || { bg: T.bgCard, text: T.textMuted };
          const hasAll = ["linkedin", "email1", "email2"].every(t => messages[getMsgKey(globalIdx, t)]);
          const isActive = selected === globalIdx;
          const status = statuses[globalIdx] ?? "pending";
          const st = STATUSES[status];

          return (
            <div
              key={globalIdx}
              className={`contact-row ${isActive ? "active" : ""}`}
              onClick={() => onSelect(globalIdx)}
              style={{ padding: "10px 12px", background: isActive ? T.bgActive : "transparent" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? T.accent : T.textPrimary, fontFamily: T.sans, lineHeight: 1.3, flex: 1 }}>{c.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 6 }}>
                  {hasAll && <span style={{ fontSize: 9, color: T.green }}>✓</span>}
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: st.dot, flexShrink: 0 }} title={st.label} />
                </div>
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono, marginBottom: 4, lineHeight: 1.3 }}>{c.hospital.split("–")[0].trim()}</div>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <span style={{ fontSize: 9, background: rc.bg, color: rc.text, padding: "1px 6px", borderRadius: 3, fontFamily: T.mono }}>{c.role.split(" ")[0]}</span>
                <span style={{ fontSize: 9, background: TIER_COLORS[c.tier]?.bg || T.bgCard, color: TIER_COLORS[c.tier]?.text || T.textMuted, padding: "1px 6px", borderRadius: 3, fontFamily: T.mono }}>Δ+{c.alos_delta}</span>
                {c.m2b === "Confirmed M2B" && <span style={{ fontSize: 9, color: T.green, fontFamily: T.mono }}>M2B</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
