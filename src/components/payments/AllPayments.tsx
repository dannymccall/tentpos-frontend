import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import type { Product } from "@/types/product.types";
import CustomerFilter from "../sales/CustomerFilter";
import Payments from "./PaymentsList";

const AllPayments = () => {
  const [additionalQuery, setAdditionQuery] = useState("");
  const {
    data: payments,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/payments", additionalQuery });
  const [limit, setLimit] = useState<number>(10);
  const [customerId, setCustomerId] = useState<number | "all">("all");
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

  const headers: string[] = [
    "ID",
    "Sales Number",
    "Customer",
    "Amount",
    "Payment Method",
    "Description",
    "Branch",
    "Cashier",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: payments,
      fileName: "payments.csv",
      mapRow: (p) => [
        p.id,
        p.salePayment ? p.salePayment.saleNumber : "No sale made",
        p.customerPayment
          ? `${p.customerPayment?.firstName} ${p.customerPayment?.lastName}`
          : "Walk-in Customer",
        p.amount,
        p.method,
        p.description,
        p.branchPayment.name,
        p.userPayment.fullName,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: payments,
      fileName: "payments.pdf",
      title: "Payments",
      mapRow: (p: any) => [
        p.id,
        p.salePayment ? p.salePayment.saleNumber : "No sale made",
        p.customerPayment
          ? `${p.customerPayment?.firstName} ${p.customerPayment?.lastName}`
          : "Walk-in Customer",
        p.amount,
        p.method,
        p.description,
        p.branchPayment.name,
        p.userPayment.fullName,
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
    <div className="py-10">
      <DataTableWrapper
        data={payments}
        query={query}
        onRefresh={onRefresh}
        handleOnSelect={handleOnSelect}
        limit={limit}
        loading={loading}
        title="Payments"
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
        <Payments payments={payments} />
      </DataTableWrapper>
    </div>
  );
};

export default AllPayments;
