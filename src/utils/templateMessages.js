import { getMsgKey } from "./msgKey";

function firstName(fullName) {
  return fullName.split(" ")[0];
}

function shortHosp(hospital) {
  return hospital
    .split("–")[0].trim()
    .replace(" University Medical Center", "")
    .replace(" Medical Center", "")
    .replace(" Health System", "")
    .trim();
}

const roleContext = {
  "Pharmacy": "pharmacy and care coordination",
  "Case Mgmt Leadership": "care coordination and discharge planning",
  "C-Suite / Exec": "operational efficiency and patient throughput",
  "Case Management": "discharge coordination and patient transitions",
};

// Under 295 chars for LinkedIn connection request limit
function linkedinTemplate(contact, senderName) {
  const first = firstName(contact.name);
  const hosp = shortHosp(contact.hospital);
  return `Hi ${first}, I came across your profile at ${hosp} and wanted to connect. I'm ${senderName} at Ethos — we're partnering with Mayo Clinic on a discharge intelligence platform helping hospital systems reduce delays through pharmacy and case management automation. Would love to connect and hear your perspective!`;
}

function email1Template(contact, senderName) {
  const first = firstName(contact.name);
  const hosp = shortHosp(contact.hospital);
  const ctx = roleContext[contact.role] || "hospital operations";
  const m2bLine = contact.m2b === "Confirmed M2B"
    ? `I noticed ${hosp} already runs a Meds-to-Beds program — that tells me you already understand the value of coordinating care at discharge.`
    : `I noticed ${hosp}'s ALOS is running about ${contact.alos_delta} days above the state average — that kind of gap usually traces back to coordination breakdowns at discharge.`;

  return `Subject: Improving discharge efficiency at ${hosp}

Hi ${first},

Hope this finds you well. My name is ${senderName} and I'm part of the team at Ethos. I came across your profile while researching leaders doing meaningful work in ${ctx} at ${hosp}, and thought it would be worth reaching out.

In collaboration with the Mayo Clinic, we at Ethos developed a platform helping hospital systems increase their discharge efficiency through automation. Specifically, we help coordinate care across pharmacy and case management teams to prioritize patients at risk of discharge delays — reducing time to discharge and likelihood of readmission.

${m2bLine}

I would love to schedule a time to share what we're seeing across similar health systems and get your perspective — your insights would genuinely be valuable to us. Would you be open to a 20-minute conversation this week?

Warmly,
${senderName}
The Ethos Team | pilots@ethos.health | cal.ethos.health/pilot`;
}

function email2Template(contact, senderName) {
  const first = firstName(contact.name);
  const hosp = shortHosp(contact.hospital);
  return `Subject: Re: Improving discharge efficiency at ${hosp}

Hi ${first},

Just following up on my note from last week — I know inboxes get busy, and there's absolutely no pressure.

I genuinely believe what we're building at Ethos could make a meaningful difference for your team at ${hosp}, and I'd love the chance to share more. Even 20 minutes would be worthwhile.

Happy to work around your schedule — whatever's easiest for you.

Warmly,
${senderName}
The Ethos Team | pilots@ethos.health`;
}

export function generateTemplates(contacts, senderName = "Alex", startIdx = 0) {
  const messages = {};
  contacts.forEach((contact, i) => {
    const idx = startIdx + i;
    messages[getMsgKey(idx, "linkedin")] = linkedinTemplate(contact, senderName);
    messages[getMsgKey(idx, "email1")]   = email1Template(contact, senderName);
    messages[getMsgKey(idx, "email2")]   = email2Template(contact, senderName);
  });
  return messages;
}
