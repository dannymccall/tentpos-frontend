import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";

import type { Product } from "@/types/product.types";
import DataTableWrapper from "@/components/DataTableWrapper";
import TransferTable from "./TransferList";
import { toCapitalized } from "@/lib/helperFunctions";
const AllTransfers = () => {
  const [limit, setLimit] = useState<number>(10);
  const {
    data: transfers,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/warehousing/transfers", limit });

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
      data: transfers,
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
      data: transfers,
      fileName: "transfers.pdf",
      title: "transfers",
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
        data={transfers}
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
        <TransferTable transfers={transfers} />
      </DataTableWrapper>
    </div>
  );
};

export default AllTransfers;
