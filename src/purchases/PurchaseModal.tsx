import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import type { Purchase } from "@/types/purchase.types";
import DialogModal from "@/components/Dialog";
import { DialogTitle } from "@/components/ui/dialog";
import ConfirmDialogContent from "@/components/confirmDialogContent";

interface PurchaseProps {
  purchase: Purchase;
  isOpen: boolean;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseProps> = ({
  isOpen,
  onClose,
  purchase,
}) => {
  if (!purchase) return null;

  const { mutate: purchaseMutation, isPending } = useApiMutation({
    url: `/api/purchases/delete?id=${purchase.id}`,
    method: "DELETE",
    invalidateKey: "/api/purchases",
    onSuccessCallback: () => {
      //   onSuccess();
    },
  });

  const handleDelete = async () => {
    purchaseMutation({});
    onClose();
  };

  return (
    <DialogModal
      open={isOpen}
      setOpen={onClose}
      title={
        <DialogTitle className="text-center">{""}</DialogTitle>
      }
    >
      {purchase && (
         <ConfirmDialogContent
          title="Delete Purchase"
          description={
            <>
              {" "}
               Are you sure you want to delete the{" "}
            <strong>{purchase.receiptNumber}</strong> purchase
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

export default PurchaseModal;
