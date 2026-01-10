import { Badge } from "@/components/ui/badge";
import { priorityBadgeClass, statusBadgeClass } from "@/lib/ticketBadges";

export const TicketStatusBadge = ({ status }: { status: string }) => (
  <Badge className={statusBadgeClass[status]}>
    {status.replace("_", " ").toUpperCase()}
  </Badge>
);

export const TicketPriorityBadge = ({ priority }: { priority: string }) => (
  <Badge className={priorityBadgeClass[priority]}>
    {priority.toUpperCase()}
  </Badge>
);
