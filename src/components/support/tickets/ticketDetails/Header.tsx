import { Button } from "@/components/ui/button";
import type { Ticket } from "@/types/ticket.types";
import { ArrowLeft } from "lucide-react";
import { TicketPriorityBadge, TicketStatusBadge } from "../StatusAndPriorityBadges";

const TicketHeader = ({ ticket }: { ticket: Ticket }) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="ghost" size="icon">
        <ArrowLeft />
      </Button>

      <h1 className="text-2xl font-semibold">
        Ticket #{ticket.id}
      </h1>

      <TicketStatusBadge status={ticket.status} />
      <TicketPriorityBadge priority={ticket.priority} />
    </div>
  );
};


export default TicketHeader