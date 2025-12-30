import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { unparse } from "papaparse";

interface SummaryItem {
  key: string;
  value: number;
}

interface SummaryReportProps {
  data: SummaryItem[];
  title?: string;
}

export default function SalesSummaryReport({ data = [] }: SummaryReportProps) {

  const exportCSV = () => {
    const csv = unparse(data.map(d => ({ Metric: d.key, Value: d.value })));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `sales-summary-report.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Summary Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: data.map(d => [d.key, d.value.toLocaleString()]),
    });
    doc.save(`sales-summary-report.pdf`);
  };


  if(!data.length) return null

  return (
    <Card className="shadow-none rounded-2xl border-none w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-xl">Sales Summary Report</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportCSV}>Export CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}>Export PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/3 font-bold">Metric</TableHead>
                <TableHead className="w-1/3 font-bold">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.key}</TableCell>
                  <TableCell>{item.value.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
