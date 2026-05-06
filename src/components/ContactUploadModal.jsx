import { useState, useRef } from "react";
import { T } from "../constants/theme";
import { importContactsFromCSV, TEMPLATE_CSV } from "../utils/csvImport";

export default function ContactUploadModal({ onImport, onClose }) {
  const [mode, setMode] = useState("append");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const contacts = importContactsFromCSV(e.target.result);
        setPreview(contacts);
        setError("");
      } catch (err) {
        setPreview(null);
        setError(err.message);
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ethos_contacts_template.csv";
    a.click();
  }

  function confirm() {
    if (!preview) return;
    onImport(preview, mode);
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: T.bgPanel, border: `1px solid ${T.border}`, borderRadius: 10, width: 560, maxHeight: "82vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>

        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.textPrimary }}>Upload Contacts</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textSubtle, fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            style={{ border: `2px dashed ${dragging ? T.accent : T.borderStrong}`, borderRadius: 8, padding: "28px 20px", textAlign: "center", cursor: "pointer", background: dragging ? T.accentBg : T.bgCard, transition: "all 0.15s" }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📂</div>
            <div style={{ fontFamily: T.sans, fontSize: 13, color: T.textSecondary }}>
              Drop a CSV file here, or <span style={{ color: T.accent, fontWeight: 600 }}>click to browse</span>
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 10, color: T.textSubtle, marginTop: 6 }}>
              Required: name · title · role · hospital · state · alos_delta · m2b · tier · email
            </div>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={downloadTemplate} style={{ background: "none", border: `1px solid ${T.border}`, color: T.textMuted, padding: "4px 12px", borderRadius: 5, fontSize: 10, fontFamily: T.mono, cursor: "pointer" }}>
              ↓ Download CSV template
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: T.redBg, border: `1px solid #FECACA`, borderRadius: 6, padding: "10px 14px", fontFamily: T.mono, fontSize: 11, color: T.red, whiteSpace: "pre-wrap" }}>
              {error}
            </div>
          )}

          {/* Preview table */}
          {preview && (
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.green, marginBottom: 8 }}>
                ✓ Parsed {preview.length} contact{preview.length !== 1 ? "s" : ""}
              </div>
              <div style={{ border: `1px solid ${T.border}`, borderRadius: 6, overflow: "auto", maxHeight: 160 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.mono, fontSize: 10 }}>
                  <thead>
                    <tr style={{ background: T.bgCard }}>
                      {["Name", "Hospital", "Role", "Tier", "M2B"].map(h => (
                        <th key={h} style={{ padding: "7px 10px", textAlign: "left", color: T.textMuted, fontWeight: 600, borderBottom: `1px solid ${T.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 5).map((c, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                        <td style={{ padding: "6px 10px", color: T.textPrimary }}>{c.name}</td>
                        <td style={{ padding: "6px 10px", color: T.textMuted }}>{c.hospital?.split("–")[0].trim()}</td>
                        <td style={{ padding: "6px 10px", color: T.textMuted }}>{c.role?.split(" ")[0]}</td>
                        <td style={{ padding: "6px 10px", color: T.textMuted }}>{c.tier}</td>
                        <td style={{ padding: "6px 10px", color: T.textMuted }}>{c.m2b}</td>
                      </tr>
                    ))}
                    {preview.length > 5 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "6px 10px", color: T.textSubtle, fontStyle: "italic" }}>
                          …and {preview.length - 5} more
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import mode */}
          {preview && (
            <div style={{ display: "flex", gap: 8 }}>
              {[["append", "＋ Append to existing"], ["replace", "↺ Replace all contacts"]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMode(val)}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 5, fontSize: 11, fontFamily: T.mono, cursor: "pointer", border: `1px solid ${mode === val ? T.accent : T.border}`, background: mode === val ? T.accentBg : "transparent", color: mode === val ? T.accent : T.textMuted, fontWeight: mode === val ? 600 : 400 }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ background: T.bgCard, color: T.textMuted, padding: "7px 16px", borderRadius: 5, fontSize: 11, fontFamily: T.mono, border: `1px solid ${T.border}`, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!preview}
            style={{ background: preview ? T.accent : T.bgCard, color: preview ? "#FFFFFF" : T.textSubtle, padding: "7px 18px", borderRadius: 5, fontSize: 11, fontFamily: T.mono, fontWeight: 600, border: "none", cursor: preview ? "pointer" : "default" }}
          >
            Import {preview ? `${preview.length} contacts` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
