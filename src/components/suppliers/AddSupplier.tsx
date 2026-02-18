import SupplierForm from "./SupplierForm";

import { useApiMutation } from "@/hooks/useApiMutation";

const AddSupplier = () => {
  const { mutate: supplierMutation, isPending } = useApiMutation({
    url: `/api/suppliers`,
    method: "POST",
    invalidateKey: "/api/suppliers",
    onSuccessCallback: () => {},
  });
  const onSubmit = async (formData: any) => {
    supplierMutation({...formData, openingBalance: formData.openingBalance ? Number(formData.openingBalance) : null });
  };
  return (
    <div>
      <SupplierForm mode="add" onSubmit={onSubmit} loading={isPending} />
    </div>
  );
};

export default AddSupplier;
