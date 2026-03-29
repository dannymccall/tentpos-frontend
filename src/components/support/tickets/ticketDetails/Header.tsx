import type { Ticket } from "@/types/ticket.types";
import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from "../StatusAndPriorityBadges";

const TicketHeader = ({ ticket }: { ticket: Ticket }) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <h1 className="text-base md:text-xl font-semibold">
        Ticket #{ticket.id}
      </h1>

      <TicketStatusBadge status={ticket.status} />
      <TicketPriorityBadge priority={ticket.priority} />
    </div>
  );
};

export default TicketHeader;
