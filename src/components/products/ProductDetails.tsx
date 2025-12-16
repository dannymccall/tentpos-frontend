import Tabs from "../Tabs";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaUser } from "react-icons/fa";
import ProductForm from "./ProductForm";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";
import NoDataFound from "../NoDataFound";
import { useNotification } from "@/context/NotificationContext";

const ProductDetails: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "details";
  const navigate = useNavigate();
  query = params.get("query")!;
  const productId = params.get("productId");

  const { data, isLoading } = useQuery({
    queryKey: ["get-product", productId],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/products/get-product?id=${productId}`
      );
      console.log(res.data.collaterals);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { showToast } = useNotification();
  const queryClient = new QueryClient();

  const productMutation = useMutation({
    mutationFn: async (payLoad: FormData) => {
      return await api.put(
        `/api/products/update-product?id=${productId}`,
        payLoad
      );
    },

    onSuccess: async (response) => {
      showToast(response.message, "success");

      queryClient.invalidateQueries({
        queryKey: [`get-product`, productId],
      });
    },

    onError: (error: any) => {
      showToast(error.message ?? "Something went wrong", "error");
    },
  });
  const onSubmit = async (formData: any) => {
    productMutation.mutate(formData);
  };
  if (isLoading) return <SpinnerCustom />;

  if (!data) return <NoDataFound />;
  return (
    <Tabs
      defaultTab="details"
      onChange={(key) => {
        window.scroll({ top: 0, behavior: "smooth" });

        // navigate(`/clients/client-details?query=${key}`)
      }}
      tabs={[
        {
          key: "details",
          label: "Product Details",
          icon: <FaBoxOpen className="text-[#0f172b]" />,
          panel: <ProductForm onSubmit={onSubmit} mode="edit" product={data} loading={productMutation.isPending}/>,
          code: "inventory.products.view",
        },
      ]}
    />
  );
};

export default ProductDetails;
