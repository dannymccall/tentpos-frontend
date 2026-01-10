// utils/ticketBadges.ts
export const statusBadgeClass: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  inprogress: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  resolved: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  closed: "bg-slate-200 text-slate-700 hover:bg-slate-200",
};

export const priorityBadgeClass: Record<string, string> = {
  low: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  high: "bg-red-100 text-red-700 hover:bg-red-100",
};
