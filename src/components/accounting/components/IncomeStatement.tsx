import { useState } from "react";
import AccountingReportFilter from "../AccountingReportFilter";
import type { AccountingFilterPayload } from "@/lib/essentials";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Filter } from "lucide-react";
import api from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";
import { currency, formatCurrency } from "@/lib/helperFunctions";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
type Props = {
  period: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  expenses: number;
  netProfit: number;
};
const IncomeStatement = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [data, setData] = useState<Props | null>(null);
  const { showToast } = useNotification();

  const isProfit = data?.netProfit! >= 0;
  const exportPDF = (data: Props) => {
    if (!data) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Income Statement", 14, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${data.period}`, 14, 28);

    const tableBody = [
      ["Revenue", formatCurrency(data.revenue)],
      ["Cost of Goods Sold (COGS)", formatCurrency(-data.cogs)],
      ["Gross Profit", formatCurrency(data.grossProfit)],
      ["Operating Expenses", formatCurrency(-data.expenses)],
      ["Net Profit", formatCurrency(data.netProfit)],
    ];

    autoTable(doc, {
      startY: 36,
      head: [["Item", "Amount"]],
      body: tableBody,
      theme: "grid",
      styles: { cellPadding: 3 },
      columnStyles: { 1: { halign: "right" } },
    });

    doc.save("income-statement.pdf");
  };

  const exportCSV = (data: Props) => {
    if (!data) return;

    const headers = ["Item", "Amount"];
    const rows = [
      ["Revenue", data.revenue.toFixed(2)],
      ["Cost of Goods Sold (COGS)", (-data.cogs).toFixed(2)],
      ["Gross Profit", data.grossProfit.toFixed(2)],
      ["Operating Expenses", (-data.expenses).toFixed(2)],
      ["Net Profit", data.netProfit.toFixed(2)],
    ];

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "income-statement.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const fetchIncomeStatement = async (filters: AccountingFilterPayload) => {
    console.log(filters);
    try {
      const res = await api.post("/api/accounting/income-statement", filters);
      if (!res.data) {
        showToast("No income statement found for this filter", "warning");
        setPending(false);
        return;
      }

      setData(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load income statement", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="rounded-none">
      <AccountingReportFilter
        title=""
        description="Summary of revenue, costs, and profit"
        loading={pending}
        onGenerate={(filters) => fetchIncomeStatement(filters)}
      />
      {data && Object.keys(data!).length > 0 ? (
        <Card className="max-w-3xl mx-auto mt-5">
          <CardHeader>
            {/* <CardTitle className="text-xl">Income Statement</CardTitle> */}
            <div className="flex items-center justify-between">

            <p className="text-sm text-muted-foreground font-semibold">
              Period: {data?.period}
            </p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportPDF(data!)}
              >
                Export PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(data!)}
              >
                Export CSV
              </Button>
            </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Row label="Revenue" value={data?.revenue!} />
            <Row label="Cost of Goods Sold (COGS)" value={-data?.cogs!} />
            <Divider />
            <Row label="Gross Profit" value={data?.grossProfit!} highlight />
            <Row label="Operating Expenses" value={-data?.expenses!} />
            <Divider />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Net Profit</span>
              <Badge variant={isProfit ? "default" : "destructive"}>
                {currency(data?.netProfit!)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto min-h-[400px] translate-y-1/3">
          <div className="m-auto text-center">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">
              Ready to generate income statement
            </h3>
            <p className="text-sm text-muted-foreground">
              Select filters above to view income statement.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default IncomeStatement;

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between ${highlight ? "font-semibold" : ""}`}>
      <span>{label}</span>
      <span>{currency(value)}</span>
    </div>
  );
}

function Divider() {
  return <div className="border-t my-2" />;
}
