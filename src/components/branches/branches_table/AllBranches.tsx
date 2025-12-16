import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import type { Branch } from "../../../types/branch.type";
import BranchesList from "./BranchesList";

import DataTableWrapper from "../../DataTableWrapper";
import { useExportCSV } from "../../../hooks/useExportCSV";
import { useExportPDF } from "../../../hooks/useExportPDF";
const AllBranches = () => {
  const [selectedBranch, setSelectBranch] = useState<Branch>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">(
    "view"
  );
  const [limit, setLimit] = useState<number>(10);
  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const {
    data: branches,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    setQuery,
    refetch,
  } = useFetch<Branch[]>({ uri: "/api/branches/get-branches" });

  console.log(branches);
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const handleView = (branch: Branch) => {
    console.log(branch);
    setSelectBranch(branch);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    console.log(branch);
    setSelectBranch(branch);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setSelectBranch(branch);
    setModalMode("delete");
    setModalOpen(true);
  };

  const onHandleDelete = () => {
    refetch();
    setModalOpen(false);
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
    "Name",
    "Code",
    "Address",
    "City",
    "Region",
    "Phone",
    "Email",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: branches,
      fileName: "branches.csv",
      mapRow: (branch) => [
        branch.name,
        branch.code,
        branch.address,
        branch.city,
        branch.region,
        branch.phone,
        branch.email
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: branches,
      fileName: "branches.pdf",
      title: "Branches",
      mapRow: (branch: any) => [
         branch.name,
        branch.code,
        branch.address,
        branch.city,
        branch.region,
        branch.phone,
        branch.email
      ],
      orientation: "landscape",
    });
  };

  return (
    <DataTableWrapper
      data={branches}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All Branches"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <BranchesList
        branches={branches}
        selectedBranch={selectedBranch!}
        isOpen={modalOpen}
        mode={modalMode}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onHandleDelete={onHandleDelete}
        onSuccess={onHandleDelete}
        onClose={() => setModalOpen(false)}
      />
    </DataTableWrapper>
  );
};

export default AllBranches;
