import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";
import BaseModal from "../BaseModal";
import FormLoading from "../loaders/FormLoading";
import type { Product } from "@/types/product.types";

interface ProductProps {
    product: Product,
    isOpen: boolean;
    onClose: () => void
}

const ProductModal: React.FC<ProductProps> = ({
  isOpen,
  onClose,
 product
}) => {
  if (!product) return null;

  const { mutate: categoryMutation, isPending } = useApiMutation({
    url: `/api/products/delete-product?id=${product.id}`,
    method: "DELETE",
    invalidateKey: "/api/products/get-products",
    onSuccessCallback: () => {
    //   onSuccess();
    },
  });

  const handleDelete = async () => {
    categoryMutation({});
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={"Delete Product"}>

      {product && (
        <div className="flex flex-col gap-4 items-center">
          <p className="">
            Are you sure you want to delete the <strong>{product.title}</strong>{" "}
            product
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

export default ProductModal;
