import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiMutation } from "@/hooks/useApiMutation";
import type { Ticket } from "@/types/ticket.types";
import { useState } from "react";

const TicketActions = ({ ticket }: { ticket: Ticket }) => {
  const [status, setStatus] = useState("");
  const { mutate: closeTicket, isPending: closing, } = useApiMutation({
    url: `/api/tickets/ticket?id=${ticket.id}`,
    method: "PUT",
    invalidateKey: `ticket-details`,
    onSuccessCallback: () => {},
  });
  const onClickClose = () => {
    closeTicket({status});
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          defaultValue={ticket.status}
          value={status}
          onValueChange={(v) => setStatus(v)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size={"sm"} onClick={onClickClose} disabled={!status}>
            Update Status
          </Button>
          {ticket.status !== "closed" && (
            <Button
              variant="destructive"
              size={"sm"}
              onClick={() => {
                setStatus("closed");
                onClickClose();
              }}
              disabled={closing}
            >
              Close Ticket
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketActions;
