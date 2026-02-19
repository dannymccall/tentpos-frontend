import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import CustomerTable from "./CustomersList";
import type { Customer } from "@/types/customer.types";


const AllCustomers = () => {
  const [limit, setLimit] = useState<number>(10);
  const {
    data: customers,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Customer[]>({ uri: "/api/customers", limit });


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

  const headers: string[] = ["ID", "First Name", "Last Name", "Email", "Phone", "Address", "Opening Balance", "Credit Limit"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: customers,
      fileName: "customers.csv",
      mapRow: (c) => [
        c.id,
        c.firstName,
        c.lastName,
        c.email,
        c.phone,
        c.address,
        c.openingBalance,
        c.creditLimit
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: customers,
      fileName: "customers.pdf",
      title: "Customers",
      mapRow: (c: any) => [
        c.id,
        c.firstName,
        c.lastName,
        c.email,
        c.phone,
        c.address,
        c.openingBalance,
        c.creditLimit
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
