import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";

import type { Product } from "@/types/product.types";
import DataTableWrapper from "@/components/DataTableWrapper";
import { toCapitalized } from "@/lib/helperFunctions";
import Warehouses from "./Warehouses";
const AllWarehouses = () => {
  const [limit, setLimit] = useState<number>(10);
  const {
    data: warehouses,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/warehousing/warehouses", limit });

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
    "Reference",
    "Type",
    "Source",
    "Destination",
    "Status",
    "Note",
    "Created By",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers: [...headers, "Status"],
      data: warehouses,
      fileName: "transfers.csv",
      mapRow: (t) => [
        t.id,
        t.reference,
        toCapitalized(t.type.replaceAll("_", " ")),
        t.fromWarehouse.name,
        t.toWarehouse.name,
        t.status,
        t.notes,
        t.User.fullName,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers: headers,
      data: warehouses,
      fileName: "warehouses.pdf",
      title: "warehouses",
      mapRow: (t: any) => [
        t.id,
        t.reference,
        toCapitalized(t.type.replaceAll("_", " ")),
        t.fromWarehouse.name,
        t.toWarehouse.name,
        t.status,
        t.notes,
        t.User.fullName,
      ],
      orientation: "landscape",
    });
  };
  return (
    <div className="py-2  md:py-10">
      <DataTableWrapper
        data={warehouses}
        query={query}
        onRefresh={onRefresh}
        handleOnSelect={handleOnSelect}
        limit={limit}
        loading={loading}
        title=""
        onSearch={onSearch}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        exportCSV={handleExportCSV}
        exportPDF={handleExportPDF}
      >
        <Warehouses warehouses={warehouses} />
      </DataTableWrapper>
    </div>
  );
};

export default AllWarehouses;
