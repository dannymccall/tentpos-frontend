import { useState } from "react";
import type { User } from "@/types/user.types";
import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import TicketsTable from "./Tickets";
import DataTableWrapper from "@/components/DataTableWrapper";
import TicketFilters from "./TicketFilters";
const AllTickets = () => {
  const [additionalQuery, setAdditionQuery] = useState("");
  const {
    data: tickets,
    loading,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<User[]>({ uri: "/api/tickets/tickets", additionalQuery });
  const [limit, setLimit] = useState<number>(10);
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
  }>({});

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

 const onFilterChange = (newFilter: Partial<typeof filters>) => {
  const updated = { ...filters, ...newFilter };
  setFilters(updated);

  const params = new URLSearchParams();

  if (updated.status) {
    params.set("status", updated.status);
  }

  if (updated.priority) {
    params.set("priority", updated.priority);
  }
  setPage(1)
  setAdditionQuery(params.toString());
};

  const headers: string[] = [
    "Plan name",
    "Billing Type",
    "Frequency",
    "Client Name",
    "client Email",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: tickets,
      fileName: "subscriptions.csv",
      mapRow: (s) => [
        s.plan.name,
        s.billingType,
        s.tenantId,
        s.client.user.fullName,
        s.client.user.email,
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: tickets,
      fileName: "subscriptions.pdf",
      title: "Subscriptions",
      mapRow: (s: any) => [
        s.plan.name,
        s.billingType,
        s.tenantId,
        s.client.user.fullName,
        s.client.user.email,
      ],
      orientation: "portrait",
    });
  };
  return (
    <DataTableWrapper
      data={tickets}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="Tickets"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
      filters={
        <TicketFilters
          status={filters.status}
          priority={filters.priority}
          onChange={onFilterChange}
        />
      }
    >
      <TicketsTable tickets={tickets} />
    </DataTableWrapper>
  );
};

export default AllTickets;
