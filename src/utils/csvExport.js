import { getMsgKey } from "./msgKey";

function parseEmail(raw) {
  const lines = raw.split("\n");
  const subject = lines.find(l => l.startsWith("Subject:"))?.replace("Subject:", "").trim() || "";
  const body = lines.filter(l => !l.startsWith("Subject:")).join("\n").trim();
  return { subject, body };
}

export function exportCSV(contacts, messages) {
  const headers = [
    "Name", "Title", "Role", "Hospital", "State", "Tier", "M2B Status",
    "Email", "LinkedIn", "ALOS Delta",
    "LI Connection Note",
    "Email 1 Subject", "Email 1 Body",
    "Email 2 Subject", "Email 2 Body",
  ];

  const rows = contacts.map((c, i) => {
    const li = messages[getMsgKey(i, "linkedin")] || "";
    const e1 = parseEmail(messages[getMsgKey(i, "email1")] || "");
    const e2 = parseEmail(messages[getMsgKey(i, "email2")] || "");
    return [
      c.name, c.title, c.role, c.hospital, c.state, c.tier, c.m2b,
      c.email, c.linkedin, c.alos_delta,
      li, e1.subject, e1.body, e2.subject, e2.body,
    ];
  });

  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map(r => r.map(escape).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ethos_outreach_sequences.csv";
  a.click();
}
