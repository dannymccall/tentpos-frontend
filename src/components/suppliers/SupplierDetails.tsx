import Tabs from "../Tabs";
// import { useNavigate } from "react-router-dom";
import { FaTruckLoading } from "react-icons/fa";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";
import NoDataFound from "../NoDataFound";
import SupplierForm from "./SupplierForm";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQuery } from "@tanstack/react-query";

const SupplierDetails: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "details";
  // const navigate = useNavigate();
  query = params.get("query")!;
  const supplierId = params.get("supplierId");

  const { data, isLoading } = useQuery({
    queryKey: ["get-supplier", supplierId],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/suppliers/get-supplier?id=${supplierId}`
      );
      console.log(res.data.collaterals);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: supplierMutation, isPending } = useApiMutation({
    url: `/api/suppliers/update?id=${supplierId}`,
    method: "PUT",
    invalidateKey: `/api/supplier ${supplierId}`,
    onSuccessCallback: () => {},
  });

  const onSubmit = async (formData: any) => {
    supplierMutation(formData);
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
          label: "Supplier Details",
          icon: <FaTruckLoading className="text-[#0f172b]" />,
          panel: (
            <SupplierForm
              onSubmit={onSubmit}
              mode="edit"
              defaultValues={data}
              loading={isPending}
            />
          ),
          code: "inventory.categories.view",
        },
      ]}
    />
  );
};

export default SupplierDetails;
