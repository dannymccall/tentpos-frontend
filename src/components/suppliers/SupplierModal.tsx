import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";

import type { Supplier } from "@/types/suppliers.types";
import DialogModal from "../Dialog";
import ConfirmDialogContent from "../confirmDialogContent";

interface SupplierProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

const SupplierModal: React.FC<SupplierProps> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  if (!supplier) return null;

  const { mutate: categoryMutation, isPending } = useApiMutation({
    url: `/api/suppliers/delete?id=${supplier.id}`,
    method: "DELETE",
    invalidateKey: "/api/suppliers",
    onSuccessCallback: () => {
      //   onSuccess();
    },
  });

  const handleDelete = async () => {
    categoryMutation({});
    onClose();
  };

  return (
    <DialogModal open={isOpen} setOpen={onClose} title={""}>
      {supplier && (
        <ConfirmDialogContent
          title="Delete Supplier"
          description={
            <>
              {" "}
              Are you sure you want to delete the{" "}
              <strong>{supplier.name}</strong> supplier ?
            </>
          }
          confirmText="Delete"
          variant="danger"
          isLoading={isPending}
          onConfirm={handleDelete}
          onCancel={onClose}
        />
      
      )}
    </DialogModal>
  );
};

export default SupplierModal;
