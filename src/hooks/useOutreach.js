import { useState, useCallback, useRef, useEffect } from "react";
import { CONTACTS as INITIAL_CONTACTS } from "../data/contacts";
import { buildPrompt } from "../utils/promptBuilder";
import { getMsgKey } from "../utils/msgKey";
import { exportCSV } from "../utils/csvExport";
import { generateTemplates } from "../utils/templateMessages";
import { loadAll, saveMessage, saveStatus, saveSenderName, saveContacts } from "../lib/db";
import { supabase } from "../lib/supabase";

const FILTERS = [
  ["all", "All"],
  ["tier1", "Tier 1"],
  ["pharmacy", "Pharmacy"],
  ["casemgmt", "Case Mgmt"],
  ["csuite", "C-Suite"],
];

function applyFilter(contacts, filter) {
  switch (filter) {
    case "tier1":    return contacts.filter(c => c.tier === "Tier 1");
    case "pharmacy": return contacts.filter(c => c.role === "Pharmacy");
    case "csuite":   return contacts.filter(c => c.role === "C-Suite / Exec");
    case "casemgmt": return contacts.filter(c => c.role.includes("Case"));
    default:         return contacts;
  }
}

// Build a lookup: email → contact index, for mapping DB rows back to state
function emailIndex(contacts) {
  const map = {};
  contacts.forEach((c, i) => { map[c.email] = i; });
  return map;
}

export function useOutreach() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [senderName, setSenderName] = useState("Alex");
  const [selected, setSelected] = useState(0);
  const [touchType, setTouchType] = useState("linkedin");
  const [messages, setMessages] = useState(() => generateTemplates(INITIAL_CONTACTS, "Alex"));
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState({});
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(null);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [dbLoading, setDbLoading] = useState(!!supabase);
  const bulkRef = useRef(false);
  const saveTimer = useRef({});

  // Load persisted state from Supabase on mount
  useEffect(() => {
    if (!supabase) return;
    loadAll().then(data => {
      if (!data) return;

      // Restore contacts (custom uploads take precedence over hardcoded)
      const allContacts = data.contacts?.length
        ? data.contacts
        : INITIAL_CONTACTS;
      setContacts(allContacts);

      const idx = emailIndex(allContacts);
      const sender = data.settings?.sender_name ?? "Alex";
      setSenderName(sender);

      // Restore messages — seed templates first, then overlay saved content
      const base = generateTemplates(allContacts, sender);
      if (data.messages) {
        data.messages.forEach(row => {
          const i = idx[row.contact_email];
          if (i !== undefined) {
            base[getMsgKey(i, row.touch_type)] = row.content;
          }
        });
      }
      setMessages(base);

      // Restore statuses
      if (data.statuses) {
        const st = {};
        data.statuses.forEach(row => {
          const i = idx[row.contact_email];
          if (i !== undefined) st[i] = row.status;
        });
        setStatuses(st);
      }
    }).finally(() => setDbLoading(false));
  }, []);

  const contact = contacts[selected] ?? contacts[0];
  const filteredContacts = applyFilter(contacts, filter);
  const currentKey = getMsgKey(selected, touchType);
  const currentMsg = messages[currentKey];
  const isLoading = loading[currentKey];
  const generatedCount = Object.keys(messages).length;

  const getStatus = (idx) => statuses[idx] ?? "pending";

  const setContactStatus = (idx, status) => {
    setStatuses(s => ({ ...s, [idx]: status }));
    saveStatus(contacts[idx]?.email, status);
  };

  const updateSenderName = (name) => {
    setSenderName(name);
    setMessages(generateTemplates(contacts, name));
    saveSenderName(name);
  };

  // Debounce message saves — wait 800ms after last keystroke
  const persistMessage = (email, type, content) => {
    const key = `${email}__${type}`;
    clearTimeout(saveTimer.current[key]);
    saveTimer.current[key] = setTimeout(() => saveMessage(email, type, content), 800);
  };

  const generate = useCallback(async (contactIdx, type) => {
    const key = getMsgKey(contactIdx, type);
    if (loading[key]) return;
    setLoading(l => ({ ...l, [key]: true }));
    const c = contacts[contactIdx];
    const prompt = buildPrompt(c, type, senderName);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are an expert B2B sales copywriter specializing in healthcare SaaS outreach. Write messages that are warm, specific, and human — never salesy or corporate. Write as a person, not a company. Always reference specific details about the prospect's situation.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Error generating message";
      setMessages(m => ({ ...m, [key]: text }));
      saveMessage(c.email, type, text);
    } catch {
      setMessages(m => ({ ...m, [key]: "API error — check connection" }));
    }
    setLoading(l => ({ ...l, [key]: false }));
  }, [loading, contacts, senderName]);

  const generateAll = async () => {
    setBulkGenerating(true);
    bulkRef.current = true;
    setBulkProgress(0);
    const types = ["linkedin", "email1", "email2"];
    let done = 0;
    const total = contacts.length * types.length;
    for (let i = 0; i < contacts.length; i++) {
      if (!bulkRef.current) break;
      for (const type of types) {
        if (!bulkRef.current) break;
        if (!messages[getMsgKey(i, type)]) {
          await generate(i, type);
          await new Promise(r => setTimeout(r, 400));
        }
        done++;
        setBulkProgress(Math.round((done / total) * 100));
      }
    }
    setBulkGenerating(false);
    bulkRef.current = false;
  };

  const stopBulk = () => {
    bulkRef.current = false;
    setBulkGenerating(false);
  };

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteMessage = (key) =>
    setMessages(m => { const n = { ...m }; delete n[key]; return n; });

  const editMessage = (key, value) => {
    setMessages(m => ({ ...m, [key]: value }));
    // Parse contactIdx and type from key "{idx}-{type}"
    const dash = key.lastIndexOf("-");
    const idx = parseInt(key.slice(0, dash), 10);
    const type = key.slice(dash + 1);
    persistMessage(contacts[idx]?.email, type, value);
  };

  const importContacts = (newContacts, mode) => {
    const merged = mode === "replace" ? newContacts : [...contacts, ...newContacts];
    setContacts(merged);
    if (mode === "replace") {
      const templates = generateTemplates(newContacts, senderName);
      setMessages(templates);
      setStatuses({});
      setSelected(0);
    } else {
      setMessages(m => ({ ...m, ...generateTemplates(newContacts, senderName, contacts.length) }));
    }
    setFilter("all");
    saveContacts(merged);
  };

  return {
    contacts, FILTERS,
    senderName, updateSenderName,
    selected, setSelected,
    touchType, setTouchType,
    messages, loading,
    statuses, getStatus, setContactStatus,
    filter, setFilter,
    copied,
    bulkGenerating, bulkProgress,
    dbLoading,
    contact, filteredContacts,
    currentKey, currentMsg, isLoading,
    generatedCount,
    generate, generateAll, stopBulk,
    copyText, deleteMessage, editMessage,
    importContacts,
    exportCSV: () => exportCSV(contacts, messages),
  };
}
