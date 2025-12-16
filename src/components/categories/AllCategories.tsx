import React, { useState } from "react";

import type { Category } from "@/types/category.types";
import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import CategoryTable from "./CategoryList";

const AllCategories = () => {
  const {
    data: categories,
    loading,
    error,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    handleSearch,
    refetch,
    setQuery,
  } = useFetch<Category[]>({ uri: "/api/categories/get-categories" });
  const [limit, setLimit] = useState<number>(10);

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">(
    "view"
  );
  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const onPageChange = (page: number) => {
    setPage(page);
  };
  console.log(loading, hasLoaded);
  const handleView = (user: Category) => {
    console.log(user);
    setSelectedCategory(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (user: Category) => {
    console.log(user);
    setSelectedCategory(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = (user: Category) => {
    setSelectedCategory(user);
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

  const headers: string[] = ["Fuu Name", "App Role", "Company Role", "Branch"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: categories,
      fileName: "accounts.csv",
      mapRow: (user) => [
        user.fullName,
        user.appRole,
        user.userRole || "N/A",
        user.branch ? user.branch.name : "N/A",
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: categories,
      fileName: "categories.pdf",
      title: "Accounts",
      mapRow: (user: any) => [
        user.fullName,
        user.appRole,
        user.userRole,
        user.userRole || "N/A",
        user.branch ? user.branch.name : "N/A",
      ],
      orientation: "portrait",
    });
  };
  return (
    <DataTableWrapper
      data={categories}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All Categories"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <CategoryTable
        categories={categories}
        onView={handleView}
        isOpen={modalOpen}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onHandleDelete={onHandleDelete}
        onSuccess={onHandleDelete}
        category={selectedCategory!}
      />
    </DataTableWrapper>
  );
};

export default AllCategories;
