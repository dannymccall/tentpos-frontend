import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { currency } from "@/lib/helperFunctions";

interface Column<T> {
  key: keyof T;
  label: string;
  format?: (value: any, row: T) => string;
}

interface Totals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  count: 1;
}
interface ReportTableProps<T> {
  title: string;
  fileName: string;
  data: T[];
  columns: Column<T>[];
  totals: Totals;
}

export default function ReportTable<T extends Record<string, any>>({
  title,
  fileName,
  data,
  columns,
  totals,
}: ReportTableProps<T>) {
  const exportCSV = () => {
    const header = columns.map((c) => c.label);
    const rows = data.map((row) =>
      columns.map((c) => {
        const value = row[c.key];
        return c.format ? c.format(value, row) : String(value ?? "");
      })
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text(title, 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [columns.map((c) => c.label)],
      body: data.map((row) =>
        columns.map((c) => {
          const value = row[c.key];
          return c.format ? c.format(value, row) : String(value ?? "");
        })
      ),
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <Card className="rounded-2xl shadow-none w-full border-none mb-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportCSV}>Export CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}>Export PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className="font-semibold">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground"
                >
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.format
                        ? col.format(row[col.key], row)
                        : String(row[col.key] ?? "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow className="font-semibold">
              <TableCell colSpan={7}>Total</TableCell>
              <TableCell className="">{currency(totals.subtotal)}</TableCell>
              <TableCell className="">{currency(totals.discount)}</TableCell>
              <TableCell className="">{currency(totals.tax)}</TableCell>
              <TableCell className="">{currency(totals.amountPaid)}</TableCell>
              <TableCell className="">{currency(totals.balance)}</TableCell>
              <TableCell className="">{currency(totals.total)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
