import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import InvoiceTable from "./InvoiceList";
import type { Invoice } from "@/types/sale.types";
const AllSales = () => {
    const [limit, setLimit] = useState<number>(10);

  const {
    data: invoices,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Invoice[]>({ uri: "/api/sales/invoices", limit });

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
    "Invoice Number",
    "Sales Number",
    "Customer",
    "Status",
    "Payment Method",
    "Total",
    "Sub Total",
    "Amount Paid",
    "Balance",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: invoices,
      fileName: "invoices.csv",
      mapRow: (i) => [
        i.id,
        i.invoiceNumber,
        i.saleInvoice?.saleNumber,
        i.saleInvoice?.customer
          ? `${i.saleInvoice?.customer?.firstName} ${i.saleInvoice?.customer?.lastName}`
          : "Walk-in Customer",
        i.status,
        i.saleInvoice.paymentMethod,
        i.saleInvoice?.total,
        i.saleInvoice?.subtotal,
        i.saleInvoice?.amountPaid,
        i.saleInvoice?.balance,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: invoices,
      fileName: "invoices.pdf",
      title: "Invoices",
      mapRow: (i: any) => [
        i.id,
        i.invoiceNumber,
        i.saleInvoice?.saleNumber,
        i.saleInvoice?.customer
          ? `${i.saleInvoice?.customer?.firstName} ${i.saleInvoice?.customer?.lastName}`
          : "Walk-in Customer",
        i.status,
        i.saleInvoice.paymentMethod,
        i.saleInvoice?.total,
        i.saleInvoice?.subtotal,
        i.saleInvoice?.amountPaid,
        i.saleInvoice?.balance,
      ],
      orientation: "landscape",
    });
  };
  return (
    <DataTableWrapper
      data={invoices}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All invoices"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <InvoiceTable invoices={invoices || []} />
    </DataTableWrapper>
  );
};

export default AllSales;
