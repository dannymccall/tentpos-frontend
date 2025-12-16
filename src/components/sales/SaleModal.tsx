import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import BaseModal from "../BaseModal";
import FormLoading from "../loaders/FormLoading";
import type { Sale } from "@/types/sale.types";
interface ProductProps {
    sale: Sale,
    isOpen: boolean;
    onClose: () => void
}

const SaleModal: React.FC<ProductProps> = ({
  isOpen,
  onClose,
 sale
}) => {
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
    <BaseModal isOpen={isOpen} onClose={onClose} title={"Cancel Sale"}>

      {sale && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to cancel the <strong>{sale.saleNumber}</strong>{" "}
            sale ?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              {isPending ? <FormLoading /> : "Cancel"}
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

export default SaleModal;
