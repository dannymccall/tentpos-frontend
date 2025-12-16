import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";

import type { Customer } from "@/types/customer.types";
import DataTableWrapper from "@/components/DataTableWrapper";
import DebtorsTable from "./DebtorsList";


const AllDebtors = () => {
  const {
    data: debtors,
    loading,
    error,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    handleSearch,
    refetch,
    setQuery,
  } = useFetch<Customer[]>({ uri: "/api/customers/debtors" });
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
      data: debtors,
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
      data: debtors,
      fileName: "debtors.pdf",
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
      data={debtors}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All debtors"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <DebtorsTable
        debtors={debtors}
       
      />
    </DataTableWrapper>
  );
};

export default AllDebtors;
