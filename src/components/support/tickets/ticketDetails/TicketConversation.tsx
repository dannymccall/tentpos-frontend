// components/tickets/TicketConversation.tsx
import type { Ticket } from "@/types/ticket.types";
import TicketMessage from "./TicketMessage";
import TicketReplyBox from "./TicketReplyBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

const TicketConversation = ({ ticket }: { ticket: Ticket }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket.ticketMessages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {ticket.ticketMessages.map((msg) => (
            <TicketMessage key={msg.id} message={msg} />
          ))}

          {/* scroll anchor */}
          <div ref={bottomRef} />
        </div>

        <TicketReplyBox ticketId={ticket.id} />
      </CardContent>
    </Card>
  );
};

export default TicketConversation;
