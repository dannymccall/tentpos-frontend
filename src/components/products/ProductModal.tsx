import { useApiMutation } from "@/hooks/useApiMutation";
import React from "react";

import type { Product } from "@/types/product.types";
import ConfirmDialogContent from "../confirmDialogContent";
import DialogModal from "../Dialog";

interface ProductProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductProps> = ({ isOpen, onClose, product }) => {
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
    <DialogModal open={isOpen}setOpen={onClose} title={""}>
      {product && (
        <ConfirmDialogContent
          title="Delete Product"
          description={
            <>
              {" "}
              Are you sure you want to delete the{" "}
              <strong>{product.title}</strong> product
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

export default ProductModal;
