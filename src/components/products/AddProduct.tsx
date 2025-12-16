import React from "react";
import ProductForm from "./ProductForm";
import { QueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useNotification } from "@/context/NotificationContext";

const AddProduct = () => {
  const { showToast } = useNotification();
  const queryClient = new QueryClient();

  const productMutation = useMutation({
    mutationFn: async (payLoad: FormData) => {
      return await api.post("/api/products/", payLoad);
    },

    onSuccess: async (response) => {

     

      showToast(response.message, "success");
   
      queryClient.invalidateQueries({
        queryKey: [`/api/products/get-products`],
      });
    },

    onError: (error: any) => {
      showToast(error.message ?? "Something went wrong", "error");
    },
  });
  const onSubmit = async (formData: any) => {
    console.log(formData.get("price"))
    productMutation.mutate(formData)
  };
  return (
    <div>
      <ProductForm mode="add" onSubmit={onSubmit} loading={productMutation.isPending
      
      }/>
    </div>
  );
};

export default AddProduct;
