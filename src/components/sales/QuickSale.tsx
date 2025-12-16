import SaleForm from "./SalesForm";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useFetchProducts } from "@/hooks/useFetchProducts";
import { useFetchCustomers } from "@/hooks/useFetchCustomers";
const QuickSale = () => {
  const { products } = useFetchProducts();
  const {customers} = useFetchCustomers()
  const { mutateAsync: salesMutation, isPending } = useApiMutation({
    url: `/api/sales`,
    method: "POST",
    invalidateKey: "/api/sales",
    onSuccessCallback: () => {},
  });
  const onSubmit = async (formData: any) => {
   const result = await  salesMutation(formData);
   console.log({result})
   return result.data.data
  };
  return (
    <div>
      <SaleForm
        mode="add"
        onSubmit={onSubmit}
        loading={isPending}
        products={products as any}
        customers={customers as any}
      />
    </div>
  );
};

export default QuickSale;
