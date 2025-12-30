import React, { useState } from "react";
import type { Role as RoleProps } from "../../../types/role.types";
import { makeRequest } from "tenthub-request";
import { useNotification } from "../../../context/NotificationContext";
import FormLoading from "../../loaders/FormLoading";
import BaseModal from "@/components/BaseModal";
import { apiBase } from "@/lib/api";
interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleProps;
  mode: "view" | "edit" | "delete";
  onEdit: (role: RoleProps) => void;
  onDelete: (role: RoleProps) => void;
  onSuccess: () => void;
}

const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  role,
  mode,
  onDelete,
}) => {
  if (!role) return null;
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await makeRequest(
        `/api/roles/delete-role?id=${role.id}`,
        { method: "DELETE" },
apiBase      );

      if (response.status === "error") {
        setLoading(false);
        showToast(response.error?.message!, "error");
        return;
      }

      showToast(response.message!, "success");
      setLoading(false);
    } catch (error: any) {
      showToast(error.message);
      setLoading(false);
    }
    if (onDelete) onDelete(role);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "view"
          ? "View Role"
          : mode === "edit"
          ? "Edit Role"
          : "Delete Role"
      }
      maxWidth="max-w-[700px]"
    >
      {/* {mode === "view" && <RoleForm role={role} mode={mode} />}

      {mode === "edit" && (
        <RoleForm role={role} mode={mode} onSuccess={onSuccess} />
      )} */}

      {mode === "delete" && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{role.name}</strong>{" "}
            role ?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              {loading ? <FormLoading /> : "Delete"}
            </button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default RoleModal;
