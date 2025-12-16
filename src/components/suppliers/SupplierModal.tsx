import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import BaseModal from "../BaseModal";
import FormLoading from "../loaders/FormLoading";
import type { Supplier } from "@/types/suppliers.types";

interface SupplierProps {
    supplier: Supplier,
    isOpen: boolean;
    onClose: () => void
}

const SupplierModal: React.FC<SupplierProps> = ({
  isOpen,
  onClose,
 supplier
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
    <BaseModal isOpen={isOpen} onClose={onClose} title={"Delete Supplier"}>

      {supplier && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{supplier.name}</strong>{" "}
            supplier
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

export default SupplierModal;
