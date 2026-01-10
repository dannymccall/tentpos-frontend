import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket.types";

const TicketMeta = ({ ticket }: { ticket: Ticket }) => (
  <Card>
    <CardHeader>
      <CardTitle>Ticket Info</CardTitle>
    </CardHeader>
    <CardContent className="text-sm space-y-2">
      <div><strong>Subject:</strong> {ticket.subject}</div>
      <div><strong>Email:</strong> {ticket.contactEmail}</div>
      <div><strong>Category:</strong> {ticket.category}</div>
      <div><strong>Branch:</strong> {ticket.branchId}</div>
      <div><strong>Created:</strong> {new Date(ticket.createdAt!).toLocaleString()}</div>
    </CardContent>
  </Card>
);


export default TicketMeta