import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import DialogModal from "../Dialog";
import { DialogTitle } from "../ui/dialog";
import ConfirmDialogContent from "../confirmDialogContent";
import type { Warehouse } from "@/types/warehouse.types";
interface WarehouseProps {
  warehouse: Warehouse;
  isOpen: boolean;
  onClose: () => void;
}

const WarehouseModal: React.FC<WarehouseProps> = ({
  isOpen,
  onClose,
  warehouse,
}) => {
  if (!warehouse) return null;

  const { mutate: deleteWarehouse, isPending } = useApiMutation({
    url: `/api/warehousing/delete-warehouse?id=${warehouse.id}`,
    method: "DELETE",
    invalidateKey: "/api/warehousing/warehouses",
    onSuccessCallback: () => {
      //   onSuccess();
      onClose()
    },
  });

  const handleDelete = async () => {
    deleteWarehouse({});
  
  };

  return (
    <DialogModal
      open={isOpen}
      setOpen={onClose}
      title={<DialogTitle className="m-auto"></DialogTitle>}
    >
      {warehouse && (
        <ConfirmDialogContent
          title="Delete warehouse"
          description={
            <>
              Are you sure you want to delete the{" "}
              <strong>{`${warehouse.name}`}</strong> warehouse ?
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

export default WarehouseModal;
