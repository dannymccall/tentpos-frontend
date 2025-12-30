import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

interface StockSummary {
  productId: number;
  productTitle: string;
  sku?: string;
  branchName: string;
  currentQty: number;
  reorderLevel: number;
  stockStatus: "OK" | "LOW" | "OUT";
  unitCost: number | string;
  stockValue: number;
  trackInventory: boolean;
}

interface Props {
  data: StockSummary[];
}

const StockSummaryTable: React.FC<Props> = ({ data = [] }) => {
  // ---------------- CSV EXPORT ----------------
  const exportCSV = () => {
    const header = [
      "Product",
      "SKU",
      "Branch",
      "Quantity",
      "Reorder Level",
      "Status",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = data.map((row) => [
      row.productTitle,
      row.sku ?? "-",
      row.branchName,
      row.currentQty,
      row.reorderLevel,
      row.stockStatus,
      Number(row.unitCost).toFixed(2),
      row.stockValue.toFixed(2),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_summary_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------- PDF EXPORT ----------------
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Stock Summary Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          "Product",
          "SKU",
          "Branch",
          "Qty",
          "Reorder Level",
          "Status",
          "Unit Cost",
          "Stock Value",
        ],
      ],
      body: data.map((row) => [
        row.productTitle,
        row.sku ?? "-",
        row.branchName,
        row.currentQty,
        row.reorderLevel,
        row.stockStatus,
        Number(row.unitCost).toFixed(2),
        row.stockValue.toFixed(2),
      ]),
    });

    doc.save("stock_summary_report.pdf");
  };

  const statusVariant = (status: StockSummary["stockStatus"]) => {
    if (status === "OUT") return "destructive";
    if (status === "LOW") return "secondary";
    return "default";
  };

  return (
    <div className="space-y-4">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Stock Summary</h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportPDF}>
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportCSV}>
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLE */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Reorder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead className="text-right">Stock Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No stock data available
                </TableCell>
              </TableRow>
            )}

            {data.map((row, index) => (
              <TableRow key={`${row.productId}-${index}`}>
                <TableCell className="font-medium">
                  {row.productTitle}
                </TableCell>
                <TableCell>{row.sku ?? "-"}</TableCell>
                <TableCell>{row.branchName}</TableCell>
                <TableCell className="text-right">
                  {row.currentQty}
                </TableCell>
                <TableCell className="text-right">
                  {row.reorderLevel}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(row.stockStatus)}>
                    {row.stockStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {Number(row.unitCost).toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {row.stockValue.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockSummaryTable;
