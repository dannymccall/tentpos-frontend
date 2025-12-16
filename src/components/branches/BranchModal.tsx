import React, { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { makeRequest } from "tenthub-request";
import EditBranchForm from "./EditBranchForm";
import type { Branch } from "../../types/branch.type";
import FormLoading from "../loaders/FormLoading";
import { apiBase } from "@/lib/api";
import BaseModal from "../BaseModal";
interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch;
  mode: "view" | "edit" | "delete";
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onSuccess: () => void;
}

const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  branch,
  mode,
  onDelete,
  onSuccess
}) => {
  if (!branch) return null;
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await makeRequest(
        `/api/branches/delete-branch?id=${branch.id}`,
        { method: "DELETE" },
       apiBase
      );

      if (response.status === "error") {
        setLoading(false);
        showToast(response.error?.message!, "error");
        return;
      }

      showToast(response.message!, "success");
      setLoading(false);
      onSuccess()
    } catch (error: any) {
      showToast(error.message);
      setLoading(false);
    }
    if (onDelete) onDelete(branch);
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
    >
      {mode === "view" && <EditBranchForm branch={branch} mode={mode} onSuccess={onSuccess}/>}

      {mode === "edit" && <EditBranchForm branch={branch} mode={mode} onSuccess={onSuccess}/>}

      {mode === "delete" && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{branch.name}</strong>{" "}
            branch ?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded"
            >
              {loading ? <FormLoading /> : "Delete"}
            </button>
            <button onClick={onClose} className="bg-gray-300 cursor-pointer px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default BranchModal;
