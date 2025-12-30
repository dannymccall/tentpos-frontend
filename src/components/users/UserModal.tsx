import React, { useState } from "react";
import type { ActionProps } from "../../types/types";
import type { User } from "../../types/staff.type";
import { useNotification } from "../../context/NotificationContext";
import { makeRequest } from "tenthub-request";
import EditUserForm from "./users_table/UserEditForm";
import FormLoading from "../loaders/FormLoading";
import { useFetchBranches } from "../../hooks/useFetchBranches";
import { apiBase } from "@/lib/api";
// import BaseModal from "../BaseModal";
import DialogModal from "../Dialog";
import { SpinnerCustom } from "../loaders/Spinner";
interface RoleModalProps extends ActionProps<User> {
  selectedUser:User
}

const UserModal: React.FC<RoleModalProps> = ({
  isOpen,
  onClose,
  selectedUser,
  mode,
  onDelete,
  onSuccess
}) => {
  if (!selectedUser) return null;
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();
  const { branches, loading: branchLoading } = useFetchBranches();
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await makeRequest(
        `/api/roles/delete-role?id=${selectedUser.id}`,
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
    if (onDelete) onDelete(selectedUser);
    onClose();
  };

  if(branchLoading) return <SpinnerCustom />

  return (
    <DialogModal
      open={isOpen}
      setOpen={() => onClose()}
      title={
        mode === "view"
          ? "View User"
          : mode === "edit"
          ? "Edit User"
          : "Delete User"
      }

    >
      {mode === "view" && <EditUserForm selectedUser={selectedUser} mode={mode} onSuccess={onSuccess} branches={ branches}/>}

      {mode === "edit" && <EditUserForm selectedUser={selectedUser} mode={mode} onSuccess={onSuccess} branches={branches}/>}

      {mode === "delete" && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{selectedUser.fullName}</strong>{" "}
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
    </DialogModal>
  );
};

export default UserModal;
