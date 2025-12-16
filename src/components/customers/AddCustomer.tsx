
import { useApiMutation } from "@/hooks/useApiMutation";
import CustomerForm from "./CustomerForm";

const AddCustomer = () => {
  const { mutate: customerMutation, isPending } = useApiMutation({
    url: `/api/customers`,
    method: "POST",
    invalidateKey: "/api/customers",
    onSuccessCallback: () => {},
  });
  const onSubmit = async (formData: any) => {
    customerMutation(formData);
  };
  return (
    <div>
      <CustomerForm  onSubmit={onSubmit} loading={isPending} mode="add"/>
    </div>
  );
};

export default AddCustomer;
