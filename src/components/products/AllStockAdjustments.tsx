import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import type { Product } from "@/types/product.types";
import StockAdjustmentsTable from "./StockAdjustments";
const AllStockAdjustments = () => {
  const {
    data: adjustments,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/stock-adjustments/adjustments" });
  const [limit, setLimit] = useState<number>(10);


  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const onPageChange = (page: number) => {
    setPage(page);
  };
  console.log(loading, hasLoaded);


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

  const headers: string[] = ["Fuu Name", "App Role", "Company Role", "Branch"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: adjustments,
      fileName: "accounts.csv",
      mapRow: (user) => [
        user.fullName,
        user.appRole,
        user.userRole || "N/A",
        user.branch ? user.branch.name : "N/A",
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: adjustments,
      fileName: "adjustments.pdf",
      title: "Accounts",
      mapRow: (user: any) => [
        user.fullName,
        user.appRole,
        user.userRole,
        user.userRole || "N/A",
        user.branch ? user.branch.name : "N/A",
      ],
      orientation: "portrait",
    });
  };
  return (
    <div className="py-10">

    <DataTableWrapper
      data={adjustments}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All adjustments"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <StockAdjustmentsTable
        adjustments={adjustments}
       
      />
    </DataTableWrapper>
    </div>
  );
};

export default AllStockAdjustments;
