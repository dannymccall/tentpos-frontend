import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableActions } from "@/components/TableActions";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/helperFunctions";
import type { Ticket } from "@/types/ticket.types";
import {
  TicketPriorityBadge,
  TicketStatusBadge,
} from "./StatusAndPriorityBadges";
interface Props {
  tickets: Ticket[];
}

export default function TicketsTable({ tickets }: Props) {
  const navigate = useNavigate();
  return (
    <Card className=" ">
      <CardHeader></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="text-slate-400">Date</TableHead>
              <TableHead className="text-slate-400">Email</TableHead>
              <TableHead className="text-slate-400">Tenant ID</TableHead>
              <TableHead className="text-slate-400">Subject</TableHead>
              <TableHead className="text-slate-400">Priority</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Category</TableHead>
              <TableHead className="text-slate-400 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className="border-gray-300">
                <TableCell className="font-medium">
                  {formatDate(ticket.createdAt)}
                </TableCell>
                <TableCell>{ticket.contactEmail}</TableCell>
                <TableCell>{ticket.tenantId}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>
                  {" "}
                  <TicketPriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  {" "}
                  <TicketStatusBadge status={ticket.status} />
                </TableCell>
                <TableCell>{ticket.category}</TableCell>

                <TableCell className="  flex justify-end">
                  <TableActions
                    showEdit
                    showView
                    onView={() => navigate(`/support/tickets/ticket?ticketId=${ticket.id}`)}
                    onEdit={() => navigate(`/support/tickets/ticket?ticketId=${ticket.id}`)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
