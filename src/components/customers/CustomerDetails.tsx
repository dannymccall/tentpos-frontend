import Tabs from "../Tabs";
import { useNavigate } from "react-router-dom";
import { FaTruckLoading, FaUser } from "react-icons/fa";
import api from "@/lib/api";
import { SpinnerCustom } from "../loaders/Spinner";
import NoDataFound from "../NoDataFound";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQuery } from "@tanstack/react-query";
import CustomerForm from "./CustomerForm";

const CustomerDetails: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  let query = "details";
  const navigate = useNavigate();
  query = params.get("query")!;
  const customerId = params.get("customerId");

  const { data, isLoading } = useQuery({
    queryKey: ["get-customer", customerId],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/customers/get?id=${customerId}`
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: supplierMutation, isPending } = useApiMutation({
    url: `/api/customers/update?id=${customerId}`,
    method: "PUT",
    invalidateKey: `get-customer ${customerId}`,
    onSuccessCallback: () => {},
  });

  const onSubmit = async (formData: any) => {
    supplierMutation(formData);
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
          label: "Customer Details",
          icon: <FaUser  className="text-[#0f172b]" />,
          panel: (
            <CustomerForm
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

export default CustomerDetails;
