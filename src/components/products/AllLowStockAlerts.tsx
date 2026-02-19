import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import type { ProductBranch } from "@/types/product.types";
import LowStockAlertsTable from "./LowStockAlerts";
const AllLowStockAlerts = () => {
    const [limit, setLimit] = useState<number>(10);

  const {
    data: lowStock,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<ProductBranch[]>({ uri: "/api/products/fetch-low-stock-products" });

  // console.log({lowStock})

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

  const headers: string[] = ["ID", "Product", "Branch", "Inventory", "Threshold"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: lowStock,
      fileName: "lowStock.csv",
      mapRow: (p) => [
        p.id,
        p.product.title,
        p.branchInfo.name,
        p.inventory,
        p.product.threshold
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: lowStock,
      fileName: "lowStock.pdf",
      title: "Low Stock Products",
      mapRow: (p: any) => [
         p.id,
        p.product.title,
        p.branchInfo.name,
        p.inventory,
        p.product.threshold
      ],
      orientation: "landscape",
    });
  };
  return (
    <div className="py-10">

    <DataTableWrapper
      data={lowStock}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All products"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <LowStockAlertsTable
        products={lowStock}
       
      />
    </DataTableWrapper>
    </div>
  );
};

export default AllLowStockAlerts;
