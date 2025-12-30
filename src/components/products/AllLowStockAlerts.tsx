import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import type { ProductBranch } from "@/types/product.types";
import LowStockAlertsTable from "./LowStockAlerts";
const AllLowStockAlerts = () => {
  const {
    data: lowStock,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<ProductBranch[]>({ uri: "/api/products/fetch-low-stock-products" });
  const [limit, setLimit] = useState<number>(10);

  console.log({lowStock})

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
      data: lowStock,
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
      data: lowStock,
      fileName: "lowStock.pdf",
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
