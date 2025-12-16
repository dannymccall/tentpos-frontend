import RolesList from "./RolesList";
import { useFetch } from "../../../hooks/useFetch";
import type { Role } from "../../../types/role.types";
import { useState } from "react";

import DataTableWrapper from "../../DataTableWrapper";
import { useExportCSV } from "../../../hooks/useExportCSV";
import { useExportPDF } from "../../../hooks/useExportPDF";
const AllRoles = () => {
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">(
    "view"
  );
  const [limit, setLimit] = useState<number>(10);

  const {
    data: roles,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Role[]>({ uri: "/api/roles/get-roles" });

  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const onPageChange = (page: number) => {
    setPage(page);
  };

  console.log({roles})

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    console.log(role);
    setSelectedRole(role);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
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

  const headers: string[] = ["Role", "Description", "Permissions"];

  const handleExportCSV = () => {
    exportCSV({
      headers,
      data: roles,
      fileName: "roles.csv",
      mapRow: (role) => [role.name, role.description, role.permissions.length],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers,
      data: roles,
      fileName: "roles.pdf",
      title: "Roles",
      mapRow: (role: any) => [
        role.name,
        role.description,
        role.permissions.length,
      ],
      orientation: "portrait",
    });
  };
  return (
    <DataTableWrapper
      data={roles}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All Roles"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <RolesList
        roles={roles}
        selectedRole={selectedRole!}
        onView={handleView}
        isOpen={modalOpen}
        mode={modalMode}
        onClose={() => setModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onHandleDelete={onHandleDelete}
      />{" "}
    </DataTableWrapper>
  );
};

export default AllRoles;
