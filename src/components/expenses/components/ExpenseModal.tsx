import FormLoading from "@/components/loaders/FormLoading";
import { useApiMutation } from "@/hooks/useApiMutation";
import type { ExpenseProps } from "@/types/expense.types";
import React from "react";
import ExpenseCreation from "../AddExpense";
import DialogModal from "@/components/Dialog";
import { DialogTitle } from "@/components/ui/dialog";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseProps;
  refetch: () => void;
  mode: "edit" | "add" | "delete";
}

const ExpenseModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  expense,
  refetch,
  mode,
}) => {
  const { mutate: deleteClient, isPending } = useApiMutation({
    url: `/api/expenses/${expense && expense.id}`,
    method: "DELETE",
    invalidateKey: `api-expenses,${10}`,
    onSuccessCallback: () => {
      onClose();
      refetch && refetch();
    },
  });

  const handleDelete = () => {
    deleteClient({});
  };
  return (
    <div className="w-full">
      <DialogModal
        open={isOpen}
        setOpen={() => onClose()}
        title={<DialogTitle className="m-auto">Delete Expense</DialogTitle>}
      >
        {mode === "edit" && <ExpenseCreation expense={expense} mode={mode} />}
        {expense && mode === "delete" && (
          <div className="flex flex-col gap-4 items-center mt-3">
            <p className="">
              Are you sure you want to delete the{" "}
              <strong>{expense.title}</strong> expense ?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded"
              >
                {isPending ? <FormLoading /> : "Delete"}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-300 cursor-pointer px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </DialogModal>
    </div>
  );
};

export default ExpenseModal;
