import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, FileSpreadsheet } from "lucide-react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDate } from "@/lib/helperFunctions";

interface StockAdjustment {
  id: number;
  date: string;
  productTitle: string;
  sku?: string;
  branchName: string;
  qtyChange: number;
  direction: "IN" | "OUT";
  category?: string;
  reason: string;
  note?: string | null;
  adjustedBy: string;
}

interface Props {
  data: StockAdjustment[];
}

const StockAdjustmentReportTable: React.FC<Props> = ({ data = [] }) => {
  // ---------------- CSV EXPORT ----------------
  const exportCSV = () => {
    const header = [
      "Date",
      "Product",
      "SKU",
      "Branch",
      "Category",
      "Qty Change",
      "Direction",
      "Reason",
      "Note",
      "Adjusted By",
    ];

    const rows = data.map((row) => [
      new Date(row.date).toLocaleString(),
      row.productTitle,
      row.sku ?? "",
      row.branchName,
      row.category ?? "",
      row.qtyChange,
      row.direction,
      row.reason,
      row.note ?? "",
      row.adjustedBy,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_adjustment_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------- PDF EXPORT ----------------
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.text("Stock Adjustment Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Date",
          "Product",
          "SKU",
          "Branch",
          "Category",
          "Qty",
          "Dir",
          "Reason",
          "Note",
          "Adjusted By",
        ],
      ],
      body: data.map((row) => [
        new Date(row.date).toLocaleString(),
        row.productTitle,
        row.sku ?? "",
        row.branchName,
        row.category ?? "",
        row.qtyChange,
        row.direction,
        row.reason,
        row.note ?? "",
        row.adjustedBy,
      ]),
      styles: { fontSize: 9 },
    });

    doc.save("stock_adjustment_report.pdf");
  };

  const directionBadge = (dir: "IN" | "OUT") =>
    dir === "IN" ? (
      <Badge className="bg-green-600">IN</Badge>
    ) : (
      <Badge variant="destructive">OUT</Badge>
    );

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stock Adjustment Report</CardTitle>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
              <div className="rounded-md border">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Adjusted By</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {formatDate(row.date)}
                </TableCell>
                <TableCell className="font-medium">
                  {row.productTitle}
                </TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.branchName}</TableCell>
                <TableCell
                  className={
                    row.qtyChange > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {row.qtyChange > 0 ? `+${row.qtyChange}` : row.qtyChange}
                </TableCell>
                <TableCell>{directionBadge(row.direction)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.reason}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.note ?? "-"}
                </TableCell>
                <TableCell>{row.adjustedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAdjustmentReportTable;
