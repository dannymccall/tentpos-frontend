import { useNavigate } from "react-router-dom";
import { FaFileInvoiceDollar, FaTruckLoading } from "react-icons/fa";
import api from "@/lib/api";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useQuery } from "@tanstack/react-query";
import { SpinnerCustom } from "@/components/loaders/Spinner";
import NoDataFound from "@/components/NoDataFound";
import Tabs from "@/components/Tabs";
import PurchaseForm from "./PurchaseForm";
import type { Purchase } from "@/types/purchase.types";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";

const PurchaseDetails: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "details";
  const navigate = useNavigate();
  query = params.get("query")!;
  const purchaseId = params.get("purchaseId");
    const {products} = useFetchProducts();
    const {suppliers} = useFetchSuppliers();
  const { data, isLoading } = useQuery({
    queryKey: ["get-purchase", purchaseId],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/purchases/get-purchase?id=${purchaseId}`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  console.log(data)

  const { mutate: purchaseMutation, isPending } = useApiMutation({
    url: `/api/purchases/update?id=${purchaseId}`,
    method: "PUT",
    invalidateKey: `get-purchase ${purchaseId}`,
    onSuccessCallback: () => {},
  });

  const onSubmit = async (formData: Purchase) => {
    purchaseMutation(formData);
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
          label: "Purchase Details",
          icon: <FaFileInvoiceDollar className="text-[#0f172b]" />,
          panel: (
            <PurchaseForm
              onSubmit={onSubmit}
              mode="edit"
              defaultValues={data}
              loading={isPending}
              suppliers={suppliers as any}
              products={products as any}
            />
          ),
          code: "inventory.categories.view",
        },
      ]}
    />
  );
};

export default PurchaseDetails;
