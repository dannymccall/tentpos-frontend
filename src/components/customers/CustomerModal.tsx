import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import type { Customer } from "@/types/customer.types";
import DialogModal from "../Dialog";
import { DialogTitle } from "../ui/dialog";
import ConfirmDialogContent from "../confirmDialogContent";
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
      title={<DialogTitle className="m-auto"></DialogTitle>}
    >
      {customer && (
         <ConfirmDialogContent
          title="Delete Customer"
          description={
            <>
               Are you sure you want to delete the{" "}
            <strong>{`${customer.firstName} ${customer.lastName}`}</strong>{" "}
            customer ?
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

export default CustomerModal;
