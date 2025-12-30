import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import CustomerTable from "./CustomersList";
import type { Customer } from "@/types/customer.types";


const AllCustomers = () => {
  const {
    data: customers,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Customer[]>({ uri: "/api/customers" });
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
      data: customers,
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
      data: customers,
      fileName: "customers.pdf",
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
      data={customers}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All customers"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <CustomerTable
        customers={customers}
       
      />
    </DataTableWrapper>
  );
};

export default AllCustomers;
