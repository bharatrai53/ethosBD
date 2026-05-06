import { supabase } from "./supabase";

// All functions return silently if Supabase is not configured.
// The app stays fully functional with local-only state in that case.

export async function loadAll() {
  if (!supabase) return null;
  const [
    { data: messages },
    { data: statuses },
    { data: settings },
    { data: contacts },
  ] = await Promise.all([
    supabase.from("messages").select("*"),
    supabase.from("statuses").select("*"),
    supabase.from("settings").select("*").eq("id", "default").maybeSingle(),
    supabase.from("contacts").select("*").order("created_at"),
  ]);
  return { messages, statuses, settings, contacts };
}

export async function saveMessage(contactEmail, touchType, content) {
  if (!supabase) return;
  await supabase.from("messages").upsert({
    id: `${contactEmail}__${touchType}`,
    contact_email: contactEmail,
    touch_type: touchType,
    content,
  });
}

export async function saveStatus(contactEmail, status) {
  if (!supabase) return;
  await supabase.from("statuses").upsert({
    contact_email: contactEmail,
    status,
  });
}

export async function saveSenderName(name) {
  if (!supabase) return;
  await supabase.from("settings").upsert({ id: "default", sender_name: name });
}

export async function saveContacts(contacts) {
  if (!supabase) return;
  // Replace all custom contacts with the current list
  await supabase.from("contacts").delete().neq("id", 0);
  if (contacts.length > 0) {
    await supabase.from("contacts").insert(contacts.map(c => ({
      name: c.name, title: c.title, role: c.role, hospital: c.hospital,
      state: c.state, alos_delta: c.alos_delta, m2b: c.m2b, tier: c.tier,
      email: c.email, linkedin: c.linkedin || "",
    })));
  }
}
