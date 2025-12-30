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

interface LowStock {
  productId: number;
  productTitle: string;
  sku?: string;
  branchName: string;
  currentQty: number;
  threshold: number;
  stockStatus: "OK" | "LOW" | "OUT";
  productThreshold:number;
  reorderLevel:number
}

interface Props {
  data: LowStock[];
}

const LowStockReportTable: React.FC<Props> = ({ data = [] }) => {
  // ---------------- CSV EXPORT ----------------
  const exportCSV = () => {
    const header = [
      "Product",
      "SKU",
      "Branch",
      "Quantity",
      "Threshold",
      "Status",
      "Unit Cost",
      "Stock Value",
    ];

    const rows = data.map((row) => [
      row.productTitle,
      row.sku ?? "-",
      row.branchName,
      row.currentQty,
      row.threshold,
      row.stockStatus,
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
    doc.text("Low  Stock Report", 14, 15);

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
      
      ]),
    });

    doc.save("stock_summary_report.pdf");
  };

  const statusVariant = (status: LowStock["stockStatus"]) => {
    if (status === "OUT") return "destructive";
    if (status === "LOW") return "secondary";
    return "default";
  };

  return (
    <div className="space-y-4">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Low Stock Report</h3>

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
              <TableHead className="">Qty</TableHead>
              <TableHead className="">Reorder</TableHead>
              <TableHead className="">Product Threshold</TableHead>
              <TableHead>Status</TableHead>
              
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
                <TableCell className="">
                  {row.currentQty}
                </TableCell>
                <TableCell className="">
                  {row.reorderLevel}
                </TableCell>
                <TableCell className="">
                  {row.productThreshold}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant(row.stockStatus)}>
                    {row.stockStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LowStockReportTable;
