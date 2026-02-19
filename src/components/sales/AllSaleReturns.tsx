import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import type { Product } from "@/types/product.types";
import SaleReturnTable from "./SaleReturns";
import { formatDate } from "@/lib/helperFunctions";
const AllSaleReturns = () => {
  const {
    data: returns,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/sales/returns" });
  const [limit, setLimit] = useState<number>(10);

  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const onPageChange = (page: number) => {
    setPage(page);
  };
  // console.log(loading, hasLoaded);

  const onSearch = (query: string) => {
    setQuery(query);
  };

  const onRefresh = () => {
    setQuery("");
    refetch();
  };

  const handleOnSelect = (value: number) => {
    setLimit(value);
  };

  const headers: string[] = [
    "ID",
    "Sales Number",
    "Date",
    "Customer",
    "Branch",
    "Performed By",
    "Reason",
    "Total Refund",
    "Refund Method",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: returns,
      fileName: "returns.csv",
      mapRow: (r) => [
        r.id,
        r.sale.saleNumber,
        formatDate(r.createdAt),
        r.sale.customer ? r.sale.customer?.firstName : "Walk-In Customer",
        r.branchReturn.name,
        r.processedBy.fullName,
        r.reason,
        r.totalRefund,
        r.refundMethod,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: returns,
      fileName: "returns.pdf",
      title: "Returns",
      mapRow: (r: any) => [
        r.id,
        r.sale.saleNumber,
        formatDate(r.createdAt),
        r.sale.customer ? r.sale.customer?.firstName : "Walk-In Customer",
        r.branchReturn.name,
        r.processedBy.fullName,
        r.reason,
        r.totalRefund,
        r.refundMethod,
      ],
      orientation: "portrait",
    });
  };
  return (
    <div className="py-10">
      <DataTableWrapper
        data={returns}
        query={query}
        onRefresh={onRefresh}
        handleOnSelect={handleOnSelect}
        limit={limit}
        loading={loading}
        title="All returns"
        onSearch={onSearch}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        exportCSV={handleExportCSV}
        exportPDF={handleExportPDF}
      >
        <SaleReturnTable saleReturn={returns} />
      </DataTableWrapper>
    </div>
  );
};

export default AllSaleReturns;
