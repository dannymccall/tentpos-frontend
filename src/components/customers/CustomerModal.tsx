import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import FormLoading from "../loaders/FormLoading";
import type { Customer } from "@/types/customer.types";
import DialogModal from "../Dialog";
import { DialogTitle } from "../ui/dialog";
interface customerProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerModal: React.FC<customerProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  if (!customer) return null;

  const { mutate: categoryMutation, isPending } = useApiMutation({
    url: `/api/customers/delete?id=${customer.id}`,
    method: "DELETE",
    invalidateKey: "/api/customers",
    onSuccessCallback: () => {
      //   onSuccess();
    },
  });

  const handleDelete = async () => {
    categoryMutation({});
    onClose();
  };

  return (
    <DialogModal
      open={isOpen}
      setOpen={onClose}
      title={<DialogTitle className="m-auto">Delete Customer</DialogTitle>}
    >
      {customer && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the{" "}
            <strong>{`${customer.firstName} ${customer.lastName}`}</strong>{" "}
            customer
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
    </DialogModal>
  );
};

export default CustomerModal;
