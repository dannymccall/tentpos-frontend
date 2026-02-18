import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import type { Product } from "@/types/product.types";
import SaleTable from "./SalesList";
import CustomerFilter from "./CustomerFilter";
import { formatDate } from "@/lib/helperFunctions";
const AllSales = () => {
  const [limit, setLimit] = useState<number>(10);
  const [additionalQuery, setAdditionQuery] = useState("");
  const {
    data: sales,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/sales", additionalQuery, limit });
  const [customerId, setCustomerId] = useState<number | "all">("all");
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

  const headers: string[] = [
    "ID",
    "Sales Number",
    "Receipt Number",
    "Date",
    "Customer",
    "Total",
    "Sub Total",
    "Amount Paid",
    "Balance",
    "Status",
    "Payment Status",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: sales,
      fileName: "sales.csv",
      mapRow: (s) => [
        s.id,
        s.saleNumber,
        s.invoice?.invoiceNumber,
        formatDate(s.createdAt),
        s.customer
          ? `${s.customer?.firstName} ${s.customer?.lastName}`
          : "Walk-In Customer",
        s.total,
        s.subtotal,
        s.amountPaid,
        s.balance,
        s.status,
        s.paymentStatus,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: sales,
      fileName: "sales.pdf",
      title: "Sales",
      mapRow: (s: any) => [
        s.id,
        s.saleNumber,
        s.invoice?.invoiceNumber,
        formatDate(s.createdAt),
        s.customer
          ? `${s.customer?.firstName} ${s.customer?.lastName}`
          : "Walk-In Customer",
        s.total,
        s.subtotal,
        s.amountPaid,
        s.balance,
        s.status,
        s.paymentStatus,
      ],
      orientation: "landscape",
    });
  };

  const onChangeCustomer = (id: number | "all") => {
    console.log(id);
    setCustomerId(id);
    const params = new URLSearchParams();
    params.set("customerId", String(id!));
    console.log(customerId);
    setAdditionQuery(params.toString());
  };
  return (
    <DataTableWrapper
      data={sales}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All sales"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
      filters={
        <CustomerFilter customerId={customerId} onChange={onChangeCustomer} />
      }
    >
      <SaleTable sales={sales} />
    </DataTableWrapper>
  );
};

export default AllSales;
