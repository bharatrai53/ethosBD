import { T } from "../constants/theme";
import { STATUSES, STATUS_ORDER } from "../constants/statuses";

function FunnelSummary({ grouped, total }) {
  const stages = STATUS_ORDER.filter(s => s !== "passed");
  return (
    <div style={{ background: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: 10, padding: "18px 24px" }}>
      <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.textPrimary, marginBottom: 14 }}>
        Outreach Funnel · <span style={{ fontWeight: 400, color: T.textMuted }}>{total} contacts total</span>
      </div>
      <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
        {stages.map((s, i) => {
          const st = STATUSES[s];
          const count = grouped[s]?.length ?? 0;
          const pct = total ? ((count / total) * 100).toFixed(0) : 0;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ flex: 1, padding: "10px 14px", background: count > 0 ? st.bg : T.bgCard, borderRadius: 6, border: `1px solid ${count > 0 ? st.dot + "44" : T.border}` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: count > 0 ? st.color : T.textSubtle, fontFamily: T.mono }}>{count}</span>
                  <span style={{ fontSize: 10, color: T.textSubtle, fontFamily: T.mono }}>{pct}%</span>
                </div>
                <div style={{ fontSize: 11, color: count > 0 ? st.color : T.textSubtle, fontFamily: T.sans, fontWeight: 500 }}>{st.label}</div>
                <div style={{ marginTop: 6, height: 3, background: T.border, borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: st.dot, borderRadius: 2, transition: "width 0.4s ease" }} />
                </div>
              </div>
              {i < stages.length - 1 && (
                <div style={{ color: T.border, fontSize: 18, padding: "0 6px", flexShrink: 0 }}>→</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactCard({ contact, idx, status, onStatusChange, onOpenCompose }) {
  const st = STATUSES[status];
  const statusIdx = STATUS_ORDER.indexOf(status);
  const canAdvance = statusIdx < STATUS_ORDER.length - 2; // exclude "passed"
  const canRetreat = statusIdx > 0;

  return (
    <div style={{ background: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "box-shadow 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.09)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"}
    >
      {/* Name + compose link */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.textPrimary, fontFamily: T.sans, lineHeight: 1.3, marginBottom: 2 }}>{contact.name}</div>
          <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono, lineHeight: 1.4 }}>{contact.title}</div>
        </div>
        <button
          onClick={() => onOpenCompose(idx)}
          title="Open in Compose"
          style={{ background: T.accentBg, border: "none", color: T.accent, fontSize: 10, padding: "3px 7px", borderRadius: 4, cursor: "pointer", fontFamily: T.mono, flexShrink: 0, fontWeight: 600 }}
        >
          Open →
        </button>
      </div>

      {/* Hospital */}
      <div style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono }}>{contact.hospital.split("–")[0].trim()}</div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <span style={{ fontSize: 9, background: T.accentBg, color: T.accent, padding: "1px 6px", borderRadius: 3, fontFamily: T.mono }}>ALOS +{contact.alos_delta}d</span>
        {contact.m2b === "Confirmed M2B" && <span style={{ fontSize: 9, background: T.greenBg, color: T.green, padding: "1px 6px", borderRadius: 3, fontFamily: T.mono }}>M2B ✓</span>}
        <span style={{ fontSize: 9, background: T.bgCard, color: T.textMuted, padding: "1px 6px", borderRadius: 3, fontFamily: T.mono, border: `1px solid ${T.border}` }}>{contact.tier}</span>
      </div>

      {/* Status advance/retreat */}
      <div style={{ display: "flex", gap: 4, borderTop: `1px solid ${T.border}`, paddingTop: 8, marginTop: 2 }}>
        <button
          onClick={() => canRetreat && onStatusChange(idx, STATUS_ORDER[statusIdx - 1])}
          disabled={!canRetreat}
          style={{ flex: 1, background: "transparent", border: `1px solid ${T.border}`, color: canRetreat ? T.textMuted : T.textSubtle, padding: "3px 0", borderRadius: 4, fontSize: 10, cursor: canRetreat ? "pointer" : "default", fontFamily: T.mono }}
        >
          ← Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 2, justifyContent: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: st.dot }} />
          <span style={{ fontSize: 9, color: st.color, fontFamily: T.mono, fontWeight: 600 }}>{st.label}</span>
        </div>
        <button
          onClick={() => canAdvance && onStatusChange(idx, STATUS_ORDER[statusIdx + 1])}
          disabled={!canAdvance}
          style={{ flex: 1, background: canAdvance ? T.accent : "transparent", border: `1px solid ${canAdvance ? T.accent : T.border}`, color: canAdvance ? "#fff" : T.textSubtle, padding: "3px 0", borderRadius: 4, fontSize: 10, cursor: canAdvance ? "pointer" : "default", fontFamily: T.mono }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ status, items, onStatusChange, onOpenCompose }) {
  const st = STATUSES[status];
  return (
    <div style={{ width: 240, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Column header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: st.bg, borderRadius: 8, border: `1px solid ${st.dot}33` }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.dot }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: st.color, fontFamily: T.sans }}>{st.label}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: st.color, fontFamily: T.mono }}>{items.length}</span>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ padding: "20px 12px", textAlign: "center", color: T.textSubtle, fontSize: 11, fontFamily: T.mono, border: `2px dashed ${T.border}`, borderRadius: 8 }}>
            No contacts
          </div>
        ) : (
          items.map(({ contact, idx }) => (
            <ContactCard
              key={idx}
              contact={contact}
              idx={idx}
              status={status}
              onStatusChange={onStatusChange}
              onOpenCompose={onOpenCompose}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function PipelineView({ contacts, statuses, setContactStatus, onOpenCompose }) {
  const grouped = {};
  STATUS_ORDER.forEach(s => { grouped[s] = []; });
  contacts.forEach((c, i) => {
    const s = statuses[i] ?? "pending";
    grouped[s].push({ contact: c, idx: i });
  });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: T.bgMain }}>
      <FunnelSummary grouped={grouped} total={contacts.length} />

      <div style={{ overflowX: "auto", paddingBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, minWidth: "min-content" }}>
          {STATUS_ORDER.map(s => (
            <KanbanColumn
              key={s}
              status={s}
              items={grouped[s]}
              onStatusChange={setContactStatus}
              onOpenCompose={onOpenCompose}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
