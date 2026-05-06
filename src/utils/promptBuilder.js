const roleContext = {
  "Pharmacy": "pharmacy director focused on discharge medication workflows, meds-to-beds programs, and reducing pharmacist burden on transition-of-care coordination",
  "Case Mgmt Leadership": "case management director focused on discharge planning, reducing avoidable LOS, and coordinating complex patient transitions",
  "C-Suite / Exec": (title) => `hospital executive (${title}) focused on operational efficiency, readmission reduction, and ROI on care coordination investments`,
  "Case Management": "case manager focused on patient discharge coordination and post-acute care transitions",
};

const painByRole = {
  "Pharmacy": "medication access barriers at discharge, and pharmacist time spent chasing prior auths and copay issues instead of clinical work",
  "Case Mgmt Leadership": "discharge delays caused by unresolved medication and follow-up barriers, and the lack of a centralized worklist for the team",
  "C-Suite / Exec": "above-average ALOS and readmission exposure, and difficulty proving ROI on care coordination investments",
  "Case Management": "juggling too many patients with no prioritized view of who needs action most urgently",
};

function getM2BContext(contact) {
  if (contact.m2b === "Confirmed M2B")
    return `${contact.hospital} already runs a confirmed Meds-to-Beds program — they understand the workflow, so the focus should be on making it smarter and more measurable`;
  if (contact.m2b === "Likely M2B")
    return `${contact.hospital} likely has an M2B-style program — the pitch is about formalizing and measuring what they're already doing`;
  return `${contact.hospital} is a strong opportunity for M2B introduction — their ALOS is ${contact.alos_delta} days above the state average`;
}

function getRoleCtx(contact) {
  const ctx = roleContext[contact.role];
  return typeof ctx === "function" ? ctx(contact.title) : (ctx || contact.role);
}

export function buildPrompt(contact, touchType, senderName = "Alex") {
  const ctx = getRoleCtx(contact);
  const pain = painByRole[contact.role] || "discharge workflow challenges";
  const m2b = getM2BContext(contact);
  const first = contact.name.split(" ")[0];
  const hosp = contact.hospital.split("–")[0].trim()
    .replace(" University Medical Center", "")
    .replace(" Medical Center", "")
    .trim();

  const tone = `Tone: warm, direct, and genuinely human. Write as a person, not a company. Be specific, not salesy. No buzzwords like "revolutionize", "streamline", "cutting-edge", or "leverage". The sender's name is ${senderName}.`;

  const prompts = {
    linkedin: `Write a LinkedIn connection request note to ${contact.name} (${contact.title} at ${contact.hospital}).

${tone}

Requirements:
- STRICT limit: under 295 characters (LinkedIn hard limit) — count carefully
- Start with a warm, personal greeting using their first name: "Hi ${first},"
- Mention that ${senderName} came across their profile at ${hosp}
- Reference Ethos's partnership with the Mayo Clinic on discharge automation
- Hint at helping pharmacy and case management teams reduce discharge delays
- End with a soft question inviting a reply
- Do NOT mention Ethos by name beyond the partnership mention
- No subject line. Just the message body.

Their context: ${ctx}. Their hospital's ALOS is ${contact.alos_delta}d above the CA average. ${m2b}.`,

    email1: `Write a warm cold outreach email to ${contact.name}, ${contact.title} at ${contact.hospital}.

${tone}

Context:
- They are a ${ctx}
- Hospital ALOS: ${contact.alos_delta}d above CA state average of 5.6
- ${m2b}
- Their pain: ${pain}
- Sender: ${senderName} at Ethos

Email structure:
Subject: [6-8 words, reference their hospital or role, not generic]

Body:
- Open with "Hi ${first},"
- 1-2 sentence warm personal intro: ${senderName} came across their profile while researching leaders in their space at ${contact.hospital}, thought it worth reaching out
- 1-2 sentences on Ethos: "In collaboration with the Mayo Clinic, we at Ethos developed a platform helping hospital systems increase their discharge efficiency through automation. Specifically, we help coordinate care across pharmacy and case management teams to prioritize patients at risk of discharge delays — reducing time to discharge and likelihood of readmission."
- 1 sentence connecting to their specific situation (reference ALOS or M2B status)
- 1 sentence: would love to schedule a time, gain their insights, their perspective would be valuable
- CTA: "Would you be open to a 20-minute conversation this week?"
- Sign off: "Warmly, ${senderName} / The Ethos Team | pilots@ethos.health | cal.ethos.health/pilot"

Keep the total under 200 words. Warm, genuine, not salesy.`,

    email2: `Write a short warm follow-up email (Touch 2) to ${contact.name} at ${contact.hospital}.

${tone}

This is a 5-day follow-up to the first email about Ethos's discharge intelligence platform.

Structure:
Subject: Re: [reference the original subject]
- Open with "Hi ${first},"
- 2-3 sentences max
- Acknowledge it's a follow-up without being apologetic about it
- Be human — they know it's a follow-up email
- Reference that you genuinely think there's a fit at ${hosp} given their situation
- Offer flexibility: happy to work around their schedule
- Sign off warmly: "${senderName} / The Ethos Team | pilots@ethos.health"`,
  };

  return prompts[touchType];
}
