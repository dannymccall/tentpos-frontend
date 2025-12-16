import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";

import BaseModal from "@/components/BaseModal";
import FormLoading from "@/components/loaders/FormLoading";
import type { Purchase } from "@/types/purchase.types";

interface PurchaseProps {
    purchase: Purchase,
    isOpen: boolean;
    onClose: () => void
}

const PurchaseModal: React.FC<PurchaseProps> = ({
  isOpen,
  onClose,
 purchase
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
    <BaseModal isOpen={isOpen} onClose={onClose} title={"Delete Purchase"}>

      {purchase && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{purchase.receiptNumber}</strong>{" "}
            purchase
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              {isPending ? <FormLoading /> : "Delete"}
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

export default PurchaseModal;
