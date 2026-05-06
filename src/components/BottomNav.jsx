import { T } from "../constants/theme";

export default function BottomNav({ selected, onSelect, total }) {
  const atStart = selected === 0;
  const atEnd = selected === total - 1;

  const btnStyle = (disabled) => ({
    background: disabled ? "transparent" : T.bgPanel,
    color: disabled ? T.textSubtle : T.textMuted,
    padding: "5px 14px",
    borderRadius: 5,
    fontSize: 11,
    fontFamily: T.mono,
    border: `1px solid ${disabled ? "transparent" : T.border}`,
    cursor: disabled ? "default" : "pointer",
  });

  return (
    <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: T.bgPanel }}>
      <button className="gen-btn" onClick={() => onSelect(s => Math.max(0, s - 1))} disabled={atStart} style={btnStyle(atStart)}>
        ← Prev
      </button>
      <span style={{ fontSize: 11, color: T.textSubtle, fontFamily: T.mono }}>
        {selected + 1} / {total}
      </span>
      <button className="gen-btn" onClick={() => onSelect(s => Math.min(total - 1, s + 1))} disabled={atEnd} style={btnStyle(atEnd)}>
        Next →
      </button>
    </div>
  );
}
