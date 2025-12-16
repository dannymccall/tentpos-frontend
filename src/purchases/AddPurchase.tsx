import PurchaseForm from "./PurchaseForm";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useFetchSuppliers } from "@/hooks/useFetchSuppliers";
import { useFetchProducts } from "@/hooks/useFetchProducts";


const AddPurchase = () => {
    const {products} = useFetchProducts();
    const {suppliers} = useFetchSuppliers()
  const { mutate: supplierMutation, isPending } = useApiMutation({
    url: `/api/purchases`,
    method: "POST",
    invalidateKey: "/api/suppliers",
    onSuccessCallback: () => {},
  });
  const onSubmit = async (formData: any) => {
    supplierMutation(formData);
  };
  return (
    <div>
      <PurchaseForm mode="add" onSubmit={onSubmit} loading={isPending} suppliers={suppliers as any} products={products as any}/>
    </div>
  );
};

export default AddPurchase;
