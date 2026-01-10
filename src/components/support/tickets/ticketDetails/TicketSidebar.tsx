import type { Ticket } from "@/types/ticket.types";
import TicketMeta from "./TicketMeta";
import TicketActions from "./TicketActions";


const TicketSidebar = ({ ticket }: { ticket: Ticket }) => {
  return (
    <div className="space-y-6">
      <TicketMeta ticket={ticket} />
      <TicketActions ticket={ticket} />
    </div>
  );
};


export default TicketSidebar