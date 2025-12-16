import React, { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import type { User, UserProps } from "../../../types/staff.type";
import UserList from "./UserList";

import DataTableWrapper from "../../DataTableWrapper";
import { useExportCSV } from "../../../hooks/useExportCSV";
import { useExportPDF } from "../../../hooks/useExportPDF";
const AllUsers = () => {
  const {
    data: users,
    loading,
    error,
    totalPages,
    currentPage,
    hasLoaded,
    setPage,
    query,
    handleSearch,
    refetch,
    setQuery
  } = useFetch<User[]>({ uri: "/api/users/get-users" });
  const [limit, setLimit] = useState<number>(10);

  const [selectedUser, setSelectedUser] = useState<User>();
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
  const handleView = (user: User) => {
    console.log(user);
    setSelectedUser(user);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    console.log(user);
    setSelectedUser(user);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
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
    "Fuu Name",
    "App Role",
    "Company Role",
    "Branch",
  ];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: users,
      fileName: "accounts.csv",
      mapRow: (user) => [
        user.fullName,
        user.appRole,
        user.userRole ||  "N/A",
        user.branch ? user.branch.name : "N/A"
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: users,
      fileName: "accounts.pdf",
      title: "Accounts",
      mapRow: (user: any) => [
       user.fullName,
        user.appRole,
        user.userRole,
        user.userRole ||  "N/A",
        user.branch ? user.branch.name : "N/A"
      ],
      orientation: "portrait",
    });
  };
  return (
     <DataTableWrapper
      data={users}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All Staff"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
          <UserList
            users={users}
            onView={handleView}
            isOpen={modalOpen}
            mode={modalMode}
            onClose={() => setModalOpen(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onHandleDelete={onHandleDelete}
            onSuccess={onHandleDelete}
            selectedUser={selectedUser!}
          />
</DataTableWrapper>
  );
};

export default AllUsers;
