import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";

import DataTableWrapper from "../../DataTableWrapper";
import { useExportCSV } from "../../../hooks/useExportCSV";
import { useExportPDF } from "../../../hooks/useExportPDF";
import type { Expense } from "@/types/expense.types";
import { ExpenseTable } from "./Expenses";
const AllExpenses = () => {
  const [limit, setLimit] = useState<number>(10);
  const {
    data: expense,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Expense[]>({ uri: "/api/expenses", limit });
  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const onPageChange = (page: number) => {
    setPage(page);
  };
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
    "System ID",
    "First name",
    "Last name",
    "Email",
    "Phone",
    "Address",
    "Staff",
    "Gender",
    "Branch",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: expense,
      fileName: "clients.csv",
      mapRow: (client) => [
        client.systemId,
        client.firstName,
        client.lastName,
        client.email,
        client.phone,
        client.address,
        client.staff.fullName,
        client.gender,
        client.branch.name,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: expense,
      fileName: "clients.pdf",
      title: "Clients",
      mapRow: (client: any) => [
        client.systemId,
        client.firstName,
        client.lastName,
        client.email,
        client.phone,
        client.address,
        client.staff.fullName,
        client.gender,
        client.branch.name,
      ],
      orientation: "landscape"
    });
  };
  return (
    <DataTableWrapper
      data={expense}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All Expenses"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <ExpenseTable data={expense} refetch={refetch}/>
    </DataTableWrapper>
  );
};

export default AllExpenses;
