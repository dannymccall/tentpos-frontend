import StockSummaryTable from "./InventorySummaryReport";
import StockAdjustmentReportTable from "./StockAdjustmentReportTable";
import LowStockReportTable from "./LowStockReport";
import StockValuationReportTable from "./StockValuationReport";

const RenderInventoryReport = ({ status, data }: { status: string; data: any }) => {
  const getReportType = () => {
    switch (status) {
      case "SUMMARY":
        return <StockSummaryTable data={data} />;
      case "ADJUSTMENT":
        return <StockAdjustmentReportTable data={data}/>
      case "LOW_STOCK":
        return <LowStockReportTable data={data}/>
      case "VALUATION":
        return <StockValuationReportTable data={data}/>
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
        return;
    }
  };
  return (
    <div className="p-5">
        {getReportType()}

    </div>
  ) 
};

export default RenderInventoryReport;
