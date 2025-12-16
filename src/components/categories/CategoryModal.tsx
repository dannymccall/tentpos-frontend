import { useApiMutation } from "@/hooks/useApiMutation";
import type { Category } from "@/types/category.types";
import type { ActionProps } from "@/types/types";
import React from "react";
import BaseModal from "../BaseModal";
import AddCategory from "./AddCategory";
import FormLoading from "../loaders/FormLoading";
import CategoryForm from "./CategoryForm";

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
    <BaseModal isOpen={isOpen} onClose={onClose} title={"Edit Category"}>
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
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{category.name}</strong>{" "}
            category
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

export default CategoryModal;
