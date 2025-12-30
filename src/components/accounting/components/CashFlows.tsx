import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import AccountingReportFilter from "../AccountingReportFilter";
import type { AccountingFilterPayload } from "@/lib/essentials";
import api from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import { currency, formatCurrency } from "@/lib/helperFunctions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

type InflowsBreakDown = {
  method: string | null;
  amount: number;
};

type OutFlowsBreakDown = {
  category: string;
  amount: number;
};
interface CashFlowProps {
  period: string;
  inflows: { breakdown: InflowsBreakDown[]; total: number };
  outflows: { breakdown: OutFlowsBreakDown[]; total: number };
  netCashFlow: number;
}

export default function CashFlow() {
  const [pending, setPending] = useState(false);
  const [data, setData] = useState<CashFlowProps | null>(null);
  const { showToast } = useNotification();

  /* ===================== PDF EXPORT ===================== */
  /* ===================== PDF EXPORT ===================== */
  const exportPDF = () => {
    if (!data) return;

    const doc = new jsPDF() as jsPDF & { previousAutoTable?: any };
    doc.setFontSize(16);
    doc.text("Cash Flow Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${data.period}`, 14, 28);

    // Inflows
    autoTable(doc, {
      startY: 36,
      head: [["Inflows - Method", "Amount"]],
      body: data.inflows.breakdown.map((row) => [
        row.method || "Unknown",
        formatCurrency(row.amount),
      ]),
      foot: [["Total Inflows", formatCurrency(data.inflows.total)]],
    });

    // Outflows
    const startY = (doc as any).previousAutoTable?.finalY
      ? (doc as any).previousAutoTable.finalY + 10
      : 36;
    autoTable(doc, {
      startY,
      head: [["Outflows - Category", "Amount"]],
      body: data.outflows.breakdown.map((row) => [
        row.category,
        formatCurrency(row.amount),
      ]),
      foot: [["Total Outflows", formatCurrency(data.outflows.total)]],
    });

    // Net Cash Flow
    const outflowsStartY = (doc as any).previousAutoTable?.finalY
      ? (doc as any).previousAutoTable.finalY + 37
      : startY + 60;
    doc.setFontSize(14);
    doc.setTextColor(data.netCashFlow < 0 ? 255 : 0, 0, 0); // Red if negative
    doc.text(
      `Net Cash Flow: ${formatCurrency(data.netCashFlow)}`,
      14,
      outflowsStartY
    );

    doc.save("cash-flow-report.pdf");
  };

  /* ===================== CSV EXPORT ===================== */
  const exportCSV = () => {
    if (!data) return;

    let rows: string[][] = [];

    // Inflows
    rows.push(["Inflows - Method", "Amount"]);
    data.inflows.breakdown.forEach((row) => {
      rows.push([row.method || "Unknown", row.amount.toString()]);
    });
    rows.push(["Total Inflows", data.inflows.total.toString()]);
    rows.push([]); // empty row for spacing

    // Outflows
    rows.push(["Outflows - Category", "Amount"]);
    data.outflows.breakdown.forEach((row) => {
      rows.push([row.category, row.amount.toString()]);
    });
    rows.push(["Total Outflows", data.outflows.total.toString()]);
    rows.push([]); // empty row

    // Net Cash Flow
    rows.push(["Net Cash Flow", data.netCashFlow.toString()]);

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "cash-flow-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fetchProfitReport = async (filters: AccountingFilterPayload) => {
    setPending(true);
    try {
      const res = await api.post("/api/accounting/cash-flow", filters);

      if (!res.data) {
        showToast("No profit report found for this filter", "warning");
        setData(null);
        return;
      }

      setData(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load profit report", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <AccountingReportFilter
        title=""
        description="Profit breakdown by product"
        loading={pending}
        onGenerate={fetchProfitReport}
      />

      {data && Object.keys(data!).length > 0 ? (
        <Card className="mt-5">
          <CardHeader>
            {/* <CardTitle>Cash Flow Report</CardTitle> */}
            <div className="flex items-center justify-between">

            <p className="text-sm text-muted-foreground font-semibold">
              Period: {data?.period}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportPDF}>
                <Download className="h-4 w-4 mr-1" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {/* Inflows */}
            <h3 className="text-lg font-semibold mb-2">Inflows</h3>
            <Table className="mb-4">
              <TableHead>
                <TableRow>
                  <TableCell>Method</TableCell>
                  <TableCell className="text-right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.inflows.breakdown.map((row, idx) => (
                  <TableRow key={idx} className="">
                    <TableCell className="">{row.method || "Unknown"}</TableCell>
                    <TableCell className="text-right">
                      {currency(row.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold border-t border-t-slate-200">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {currency(data?.inflows.total!)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Outflows */}
            <h3 className="text-lg font-semibold mb-2">Outflows</h3>
            <Table className="mb-4">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell className="text-right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.outflows.breakdown.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-right">
                      {currency(row.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold border-t border-t-slate-200">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {currency(data?.outflows.total!)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Net Cash Flow */}
            <h3 className="text-lg font-semibold mb-2">Net Cash Flow</h3>
            <p
              className={`text-xl font-bold ${
                data?.netCashFlow! < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {currency(data?.netCashFlow!)}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto min-h-[400px] translate-y-1/3">
          <div className="m-auto text-center">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Ready to generate profit report
            </h3>
            <p className="text-sm text-muted-foreground">
              Select filters above to view profit data.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
