import React, { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import EditBranchForm from "./EditBranchForm";
import type { Branch } from "../../types/branch.type";
// import BaseModal from "../BaseModal";
import { makeRequest } from "@/lib/helperFunctions";
import DialogModal from "../Dialog";
import { DialogTitle } from "../ui/dialog";
import ConfirmDialogContent from "../confirmDialogContent";
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
  onSuccess,
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
      );

      if (response.status === "error") {
        setLoading(false);
        showToast(response.error?.message!, "error");
        return;
      }

      showToast(response.message!, "success");
      setLoading(false);
      onSuccess();
    } catch (error: any) {
      showToast(error.message);
      setLoading(false);
    }
    if (onDelete) onDelete(branch);
    onClose();
  };

  return (
    <DialogModal
      open={isOpen}
      setOpen={onClose}
      title={
        <DialogTitle className="text-center">
          {mode === "view"
            ? "View Branch"
            : mode === "edit"
              ? "Edit Branch"
              : ""}
              
        </DialogTitle>
      }
      size="w-full md:max-w-[600px]"
    >
      {mode === "view" && (
        <EditBranchForm branch={branch} mode={mode} onSuccess={onSuccess} />
      )}

      {mode === "edit" && (
        <EditBranchForm branch={branch} mode={mode} onSuccess={onSuccess} />
      )}

      {mode === "delete" && (

         <ConfirmDialogContent
            title="Delete Branch"
            description={<>  <p className="">
            Are you sure you want to delete the <strong>{branch.name}</strong>{" "}
            branch ?
          </p></>}
            confirmText="Delete"
            variant="danger"
            isLoading={loading}
            onConfirm={handleDelete}
            onCancel={onClose}
          />


      )}
    </DialogModal>
  );
};

export default BranchModal;
