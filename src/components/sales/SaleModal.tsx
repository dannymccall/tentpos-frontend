import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import FormLoading from "../loaders/FormLoading";
import type { Sale } from "@/types/sale.types";
import DialogModal from "../Dialog";
import { DialogTitle } from "../ui/dialog";
import ConfirmDialogContent from "../confirmDialogContent";
interface ProductProps {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
}

const SaleModal: React.FC<ProductProps> = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  const { mutate: cancelSale, isPending } = useApiMutation({
    url: `/api/sales/cancel?id=${sale.id}`,
    method: "PUT",
    invalidateKey: "/api/sales",
    onSuccessCallback: () => {
      //   onSuccess();
    },
  });

  const handleCancel = async () => {
    cancelSale({});
    onClose();
  };

  return (
    <DialogModal
      open={isOpen}
      setOpen={onClose}
      title={<DialogTitle className="text-center">Cancel Sale</DialogTitle>}
    >
      {sale && (
        <ConfirmDialogContent
          title="Delete Branch"
          description={
            <>
              {" "}
              <p className="">
                Are you sure you want to cancel the{" "}
                <strong>{sale.saleNumber}</strong> sale ?
              </p>
            </>
          }
          confirmText="Delete"
          variant="danger"
          isLoading={isPending}
          onConfirm={handleCancel}
          onCancel={onClose}
        />
      )}
    </DialogModal>
  );
};

export default SaleModal;
