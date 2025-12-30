import Tabs from "../Tabs";
// import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";
import NoDataFound from "../NoDataFound";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQuery } from "@tanstack/react-query";
import SaleForm from "./SalesForm";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { useFetchCustomers } from "@/hooks/useFetchCustomers";

const SaleDetails: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
   const {products} = useFetchProducts();
   const {customers} = useFetchCustomers()
  let query = "details";
  // const navigate = useNavigate();
  query = params.get("query")!;
  const saleId = params.get("saleId");

  const { data, isLoading } = useQuery({
    queryKey: ["get-sale", saleId],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/sales/get?id=${saleId}`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: cancelSale, isPending } = useApiMutation({
    
    url: `/api/sales/cancel?id=${saleId}`,
    method: "PUT",
    invalidateKey: `get-customer ${saleId}`,
    onSuccessCallback: () => {},
  });

  const { mutateAsync: completeHoldSale, isPending: holdSaleLoading } = useApiMutation({
    
    url: `/api/sales/complete-hold-sale?id=${saleId}`,
    method: "POST",
    invalidateKey: `get-customer ${saleId}`,
    onSuccessCallback: () => {},
  });

  const onSubmit = async (formData: any) => {
    console.log(saleId)
    console.log(formData)
    if(formData && formData.status === "HOLD"){
      const result = await completeHoldSale(formData);
    return result.data.data;
    }else
    cancelSale(formData);
  };
  if (isLoading) return <SpinnerCustom />;

  if (!data) return <NoDataFound />;
  return (
    <Tabs
      defaultTab={query}
      // onChange={(key) => {
      //   window.scroll({ top: 0, behavior: "smooth" });

      //   // navigate(`/clients/client-details?query=${key}`)
      // }}
      tabs={[
        {
          key: "details",
          label: "Sale Details",
          icon: <FaUser  className="text-[#0f172b]" />,
          panel: (
            <SaleForm
              onSubmit={onSubmit}
              mode="edit"
              defaultValues={data}
              loading={isPending || holdSaleLoading}
              products={products as any}
              customers={customers as any}
            />
          ),
          code: "inventory.categories.view",
        },
      ]}
    />
  );
};

export default SaleDetails;
