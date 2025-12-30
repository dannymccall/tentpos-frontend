import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import SupplierTable from "./SuppliersList";
import type { Supplier } from "@/types/suppliers.types";
const AllSuppliers = () => {
  const {
    data: suppliers,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Supplier[]>({ uri: "/api/suppliers" });
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
      data: suppliers,
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
      data: suppliers,
      fileName: "suppliers.pdf",
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
    <DataTableWrapper
      data={suppliers}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All suppliers"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <SupplierTable
        suppliers={suppliers}
       
      />
    </DataTableWrapper>
  );
};

export default AllSuppliers;
