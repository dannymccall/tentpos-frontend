import  { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import SupplierTable from "./SuppliersList";
import type { Supplier } from "@/types/suppliers.types";
const AllSuppliers = () => {
  const [limit, setLimit] = useState<number>(10);
  const {
    data: suppliers,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Supplier[]>({ uri: "/api/suppliers", limit });


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

  const headers: string[] = ["ID", "Name", "Email", "Phone", "Address", "Contact Person", "Notes", "Opening Balance"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: suppliers,
      fileName: "suppliers.csv",
      mapRow: (s) => [
        s.id,
        s.name,
        s.email,
        s.phone || "N/A",
        s.address ? s.address : "N/A",
        s.contactPerson,
        s.notes,
        s.openingBalance
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: suppliers,
      fileName: "suppliers.pdf",
      title: "Suppliers",
      mapRow: (s: any) => [
        s.id,
        s.name,
        s.email,
        s.phone || "N/A",
        s.address ? s.address : "N/A",
        s.contactPerson,
        s.notes,
        s.openingBalance
      ],
      orientation: "landscape",
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
