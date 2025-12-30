import SalesSummaryReport from "./SalesSummaryReport";
import ReportTable from "./ReportTable";
import { toCapitalized } from "@/lib/helperFunctions";

const RenderReport = ({ status, data }: { status: string; data: any }) => {
  console.log({ data, status });
  const getReportType = () => {
    switch (status) {
      case "summary":
        return <SalesSummaryReport data={data} />;
      case "CANCELLED":
      case "COMPLETED":
      case "PENDING":
      case "RETURN":
      case "cash":
      case "mobile":
        case "all":
        return (
          <ReportTable
            title={`${toCapitalized(status)} Sales Report`}
            fileName="sales_report"
            data={data.rows}
            totals={data.totals}
            columns={[
              { key: "saleNumber", label: "Sale #" },
              { key: "date", label: "Date" },
              { key: "status", label: "Status" },
              { key: "paymentMethod", label: "Payment Method" },
              { key: "customer", label: "Customer" },
              { key: "cashier", label: "Cashier" },
              { key: "branch", label: "Branch" },
              {
                key: "subtotal",
                label: "Subtotal",
                format: (v) => `₵${Number(v).toFixed(2)}`,
              },
              {
                key: "discount",
                label: "Discount",
                format: (v) => `₵${Number(v).toFixed(2)}`,
              },
              {
                key: "tax",
                label: "Tax",
                format: (v) => `₵${Number(v).toFixed(2)}`,
              },
              {
                key: "amountPaid",
                label: "Amount Paid",
                format: (v) => `₵${Number(v).toFixed(2)}`,
              },
              {
                key: "balance",
                label: "Balance",
                format: (v) => `₵${Number(v).toFixed(2)}`,
              },
              {
                key: "total",
                label: "Total",
                format: (v) => `₵${Number(v).toFixed(2)}`,
              },
            ]}
          />
        );

      //   case "arrears":
      //     return <ArrearsReport data={data}/>
      //   case "defaults":
      //     return <DefaultReport data={data}/>
      //   case "active":
      //     return <ActiveLoansReport data={data} title="Active Loans Report"/>
      //   case "write-off":
      //     return <ActiveLoansReport data={data} title="Loans written-off Report"/>
      //   case "complete":
      //     return <ActiveLoansReport data={data} title="Loans complete Report"/>
      //   case "Active":
      //     return <ActiveAccountsReport data={data} title="Active Accounts Report"/>
      //   case "Dormant":
      //     return <ActiveAccountsReport data={data} title="Dormant Accounts Report"/>
      //   case "Closed":
      //     return <ActiveAccountsReport data={data} title="Closed Accounts Report"/>
      default:
        return (
          <div className="p-4 text-muted-foreground">
            Unsupported report type
          </div>
        );
    }
  };
  return getReportType();
};

export default RenderReport;
