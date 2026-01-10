import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useState } from "react";

const TicketReplyBox = ({ ticketId }: { ticketId: number }) => {
  const [reply, setReply] = useState("");

  const { mutate, isPending } = useApiMutation({
    url: `/api/tickets/message?ticketId=${ticketId}`,
    method: "POST",
    invalidateKey: `ticket-details`,
    
    onSuccessCallback: () => {
      setReply("");
    },
  });

  return (
    <div className="border-t pt-4 space-y-3">
      <Textarea
        placeholder="Type your reply..."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        // onKeyDown={(e) => {
        //   if (e.key === "Enter") {
        //     mutate({ message: reply });
        //   }
        // }}
      />

      <div className="flex justify-end">
        <Button
          disabled={!reply || isPending}
          onClick={() => mutate({ message: reply })}
        >
          Send Reply
        </Button>
      </div>
    </div>
  );
};

export default TicketReplyBox;
