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
import { currency } from "@/lib/helperFunctions";

interface ProfitRow {
  productId: number;
  productName: string;
  qtySold: number;
  revenue: number;
  cogs: number;
  profit: number;
  margin: number;
}

interface ProfitTotals {
  qtySold: number;
  revenue: number;
  cogs: number;
  profit: number;
  margin: number;
}

interface ProfitResponse {
  data: ProfitRow[];
  totals: ProfitTotals;
  period: string;
}

export default function ProfitReportTable() {
  const [pending, setPending] = useState(false);
  const [report, setReport] = useState<ProfitResponse | null>(null);
  const { showToast } = useNotification();

  /* ===================== PDF EXPORT ===================== */
  const exportPDF = () => {
    if (!report) return;

    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Profit Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Product", "Qty Sold", "Revenue", "COGS", "Profit", "Margin %"]],
      body: report.data.map((row) => [
        row.productName,
        row.qtySold,
        currency(row.revenue),
        currency(row.cogs),
        currency(row.profit),
        `${row.margin.toFixed(2)}%`,
      ]),
      foot: [
        [
          "TOTAL",
          report.totals.qtySold,
          currency(report.totals.revenue),
          currency(report.totals.cogs),
          currency(report.totals.profit),
          `${report.totals.margin.toFixed(2)}%`,
        ],
      ],
    });

    doc.save("profit-report.pdf");
  };

  /* ===================== CSV EXPORT ===================== */
  const exportCSV = () => {
    if (!report) return;

    const headers = [
      "Product",
      "Qty Sold",
      "Revenue",
      "COGS",
      "Profit",
      "Margin %",
    ];

    const rows = report.data.map((r) => [
      r.productName,
      r.qtySold,
      r.revenue,
      r.cogs,
      r.profit,
      r.margin.toFixed(2),
    ]);

    rows.push([
      "TOTAL",
      report.totals.qtySold,
      report.totals.revenue,
      report.totals.cogs,
      report.totals.profit,
      report.totals.margin.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "profit-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const fetchProfitReport = async (filters: AccountingFilterPayload) => {
    setPending(true);
    try {
      const res = await api.post("/api/accounting/profit", filters);

      if (!res.data?.data?.length) {
        showToast("No profit report found for this filter", "warning");
        setReport(null);
        return;
      }

      setReport(res.data);
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

      {report ? (
        <Card className="rounded-2xl shadow-sm mt-5">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardTitle className="text-lg">Profit Breakdown</CardTitle> */}
            Period: {report?.period}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportPDF}>
                <Download className="h-4 w-4 mr-1" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={exportCSV}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-right">Qty Sold</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">COGS</th>
                  <th className="p-3 text-right">Profit</th>
                  <th className="p-3 text-right">Margin</th>
                </tr>
              </thead>
              <tbody>
                {report.data.map((row) => (
                  <tr key={row.productId} className="border-b last:border-0">
                    <td className="p-3 font-medium">{row.productName}</td>
                    <td className="p-3 text-right">{row.qtySold}</td>
                    <td className="p-3 text-right">{currency(row.revenue)}</td>
                    <td className="p-3 text-right">{currency(row.cogs)}</td>
                    <td
                      className={`p-3 text-right font-semibold ${
                        row.profit < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {currency(row.profit)}
                    </td>
                    <td className="p-3 text-right">{row.margin.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold">
                <tr>
                  <td className="p-3">TOTAL</td>
                  <td className="p-3 text-right">{report.totals.qtySold}</td>
                  <td className="p-3 text-right">
                    {currency(report.totals.revenue)}
                  </td>
                  <td className="p-3 text-right">
                    {currency(report.totals.cogs)}
                  </td>
                  <td className="p-3 text-right text-green-600">
                    {currency(report.totals.profit)}
                  </td>
                  <td className="p-3 text-right ">
                    {report.totals.margin.toFixed(2)}%
                  </td>
                </tr>
              </tfoot>
            </table>
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
