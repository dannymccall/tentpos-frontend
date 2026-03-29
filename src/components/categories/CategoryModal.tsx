import { useApiMutation } from "@/hooks/useApiMutation";
import type { Category } from "@/types/category.types";
import type { ActionProps } from "@/types/types";
import React from "react";

import CategoryForm from "./CategoryForm";
import ConfirmDialogContent from "../confirmDialogContent";
import DialogModal from "../Dialog";

interface CategoryProps extends ActionProps<Category> {
  category: Category;
}

const CategoryModal: React.FC<CategoryProps> = ({
  isOpen,
  onClose,
  category,
  mode,
  onDelete,
  onSuccess,
}) => {
  if (!category) return null;

  const { mutate: categoryMutation, isPending } = useApiMutation({
    url: `/api/categories/delete-category?id=${category.id}`,
    method: "DELETE",
    invalidateKey: "/api/categories/get-categories",
    onSuccessCallback: () => {
      onSuccess();
    },
  });
  const { mutate: updateCategoryMutation, isPending: isUpdatingPending } =
    useApiMutation({
      url: `/api/categories/update-category?id=${category.id}`,
      method: "PUT",
      invalidateKey: "/api/categories/get-categories",
      onSuccessCallback: () => {
        onSuccess();
      },
    });
  const handleDelete = async () => {
    categoryMutation({});
    if (onDelete) onDelete(category);
    onClose();
  };

  return (
    <DialogModal open={isOpen} setOpen={onClose} title={""}>
      {mode === "edit" && (
        <CategoryForm
          mode="edit"
          category={category}
          loading={isUpdatingPending}
          onSubmit={(data) =>
            updateCategoryMutation({ id: category.id, ...data })
          }
        />
      )}

      {mode === "delete" && (
        <ConfirmDialogContent
          title="Delete Category"
          description={
            <>
              {" "}
              Are you sure you want to delete the{" "}
              <strong>{category.name}</strong> category ?
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

export default CategoryModal;
