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

  const headers: string[] = ["ID", "Product", "Branch", "User", "Quantity", "Reason", "Note"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: adjustments,
      fileName: "adjustments.csv",
      mapRow: (a) => [
        a.id,
        a.productStockAdjustment.title,
        a.branchStockAdjustment.name,
        a.userStockAdjustment.fullName,
        a.qtyChange,
        a.reason,
        a.note
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: adjustments,
      fileName: "adjustments.pdf",
      title: "Stock Adjustments",
      mapRow: (a: any) => [
        a.id,
        a.productStockAdjustment.title,
        a.branchStockAdjustment.name,
        a.userStockAdjustment.fullName,
        a.qtyChange,
        a.reason,
        a.note
      ],
      orientation: "landscape",
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
