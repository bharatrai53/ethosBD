// Parses a CSV string into an array of row objects keyed by header.
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row.");

  const headers = splitRow(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, "_"));

  return lines.slice(1).map((line, i) => {
    const values = splitRow(line);
    if (values.every(v => v === "")) return null; // skip blank rows
    const row = {};
    headers.forEach((h, j) => { row[h] = values[j] ?? ""; });
    return row;
  }).filter(Boolean);
}

// Splits a single CSV row respecting double-quoted fields.
function splitRow(line) {
  const fields = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuote = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ",") { fields.push(cur); cur = ""; }
      else { cur += ch; }
    }
  }
  fields.push(cur);
  return fields;
}

const COLUMN_ALIASES = {
  name:       ["name"],
  title:      ["title"],
  role:       ["role"],
  hospital:   ["hospital"],
  state:      ["state"],
  alos_delta: ["alos_delta", "alos delta", "alos"],
  m2b:        ["m2b", "m2b_status", "m2b status"],
  tier:       ["tier"],
  email:      ["email"],
  linkedin:   ["linkedin"],
};

const REQUIRED = ["name", "title", "role", "hospital", "state", "alos_delta", "m2b", "tier", "email"];

function mapRow(row) {
  const contact = { linkedin: "" };
  for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
    const key = aliases.find(a => row[a] !== undefined);
    if (key !== undefined) contact[field] = row[key];
  }
  contact.alos_delta = parseFloat(contact.alos_delta) || 0;
  return contact;
}

export function importContactsFromCSV(text) {
  const rows = parseCSV(text);
  const contacts = rows.map(mapRow);

  const missing = REQUIRED.filter(f => contacts[0]?.[f] === undefined || contacts[0]?.[f] === "");
  if (missing.length > 0) {
    throw new Error(`Missing required columns: ${missing.join(", ")}.\n\nRequired: name, title, role, hospital, state, alos_delta, m2b, tier, email`);
  }

  return contacts;
}

export const TEMPLATE_CSV = `name,title,role,hospital,state,alos_delta,m2b,tier,email,linkedin
Jane Smith,VP Pharmacy,Pharmacy,General Hospital,CA,0.8,Confirmed M2B,Tier 1,jane.smith@generalhospital.org,
John Doe,Director of Case Management,Case Mgmt Leadership,City Medical Center,NY,1.1,Likely M2B,Tier 1,john.doe@citymedical.com,`;
