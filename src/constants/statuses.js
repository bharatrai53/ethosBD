export const STATUSES = {
  pending:   { label: "Not Contacted", color: "#6B7280", bg: "#F3F4F6", dot: "#D1D5DB" },
  sent:      { label: "Reached Out",   color: "#0284C7", bg: "#E0F2FE", dot: "#0284C7" },
  responded: { label: "Responded",     color: "#059669", bg: "#D1FAE5", dot: "#10B981" },
  meeting:   { label: "Meeting Set",   color: "#7C3AED", bg: "#EDE9FE", dot: "#8B5CF6" },
  passed:    { label: "Not Interested", color: "#9CA3AF", bg: "#F3F4F6", dot: "#D1D5DB" },
};

export const STATUS_ORDER = ["pending", "sent", "responded", "meeting", "passed"];
