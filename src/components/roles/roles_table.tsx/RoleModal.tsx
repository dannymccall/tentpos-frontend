import React, { useState } from "react";
import type { Role as RoleProps } from "../../../types/role.types";
import { useNotification } from "../../../context/NotificationContext";
import { makeRequest } from "@/lib/helperFunctions";
import DialogModal from "@/components/Dialog";
import { DialogTitle } from "@/components/ui/dialog";
import ConfirmDialogContent from "@/components/confirmDialogContent";
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
      );

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
    <DialogModal
      open={isOpen}
      setOpen={onClose}
      title={
        <DialogTitle>
          {mode === "view"
            ? "View Role"
            : mode === "edit"
              ? "Edit Role"
              : ""}
        </DialogTitle>
      }
    >
      {/* {mode === "view" && <RoleForm role={role} mode={mode} />}

      {mode === "edit" && (
        <RoleForm role={role} mode={mode} onSuccess={onSuccess} />
      )} */}

      {mode === "delete" && (
        <ConfirmDialogContent
          title="Delete Role"
          description={
            <>
              {" "}
             Are you sure you want to delete the <strong>{role.name}</strong>{" "}
            role ?
            </>
          }
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

export default RoleModal;
