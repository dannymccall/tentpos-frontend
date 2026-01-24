import type { Purchase } from "@/types/purchase.types";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency, formatDate } from "@/lib/helperFunctions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
const PurchasesReportTable: React.FC<{ data: Purchase[] }> = ({ data }) => {
  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();

  const headers: string[] = [
    "Supplier",
    "Receipt Number",
    "Date",
    "Status",
    "Sub Total",
    "Total",
    "Amount Paid",
    "Balance",
    "Notes",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: data,
      fileName: "purchases.csv",
      mapRow: (p) => [
        p.supplier ? `${p.supplier.name}` : "One-Time Purchase",
        p.receiptNUmber,
        formatDate(p.purchaseDate),
        p.status,
        p.subtotal,
        p.total,
        p.amountPaid,
        p.balance,
        p.notes,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: data,
      fileName: "purchases.pdf",
      title: "Purchases",
      mapRow: (p: any) => [
        p.supplier ? `${p.supplier.name}` : "One-Time Purchase",
        p.receiptNumber,
        formatDate(p.purchaseDate),
        p.status,
        p.subtotal,
        p.total,
        p.amountPaid,
        p.balance,
        p.notes,
      ],
      orientation: "portrait",
    });
  };

  const totals = data.reduce(
    (accum, p) => {
      accum.subtotal += Number(p.subtotal ?? 0);
      accum.total += Number(p.total ?? 0);
      accum.balance += Number(p.balance);
      accum.amountPaid += Number(p.amountPaid);
      return accum;
    },
    {
      subtotal: 0,
      total: 0,
      amountPaid: 0,
      balance: 0,
    },
  );
  if (!data) return null;
  return (
    <div className="space-y-4">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Stock Valuation Report</h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportPDF}>
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV}>
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Receipt Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SubTotal</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow>
                <TableCell>
                  {p.supplier ? `${p.supplier.name}` : "One-Time Purchase"}
                </TableCell>
                <TableCell>{p.receiptNumber}</TableCell>
                <TableCell>{formatDate(p.purchaseDate)}</TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.subtotal}</TableCell>
                <TableCell>{p.total}</TableCell>
                <TableCell>{p.amountPaid}</TableCell>
                <TableCell>{p.balance}</TableCell>
                <TableCell>{p.notes}</TableCell>
              </TableRow>
            ))}
            <TableRow></TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="">
                {currency(Number(totals.subtotal))}
              </TableCell>
              <TableCell>{currency(Number(totals.total))}</TableCell>
              <TableCell>{currency(Number(totals.amountPaid))}</TableCell>
              <TableCell>{currency(Number(totals.balance))}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default PurchasesReportTable;
