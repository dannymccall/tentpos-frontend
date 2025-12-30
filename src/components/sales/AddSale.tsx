import { useApiMutation } from "@/hooks/useApiMutation";
import AddSalePage from "./EcommerceStyleSale";
import { useFetchSaleProducts } from "@/hooks/useFetchSaleProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";

const AddSale = () => {
  // const { products } = useFetchProducts();
  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce<string>(query, 500);
  const [categoryId, setCategoryId] = useState<number | "ALL">("ALL");
  const { products, refetch } = useFetchSaleProducts(
    query.length > 2 ? debouncedQuery : "",
     categoryId
  );

  const { mutateAsync: salesMutation, isPending } = useApiMutation({
    url: `/api/sales?search=${debouncedQuery}`,
    method: "POST",
    invalidateKey: "/api/sales",
    onSuccessCallback: (response) => {
      return response;
    },
  });
  // const { mutateAsync: holdSaleMutation, isPending:holdSalePending } = useApiMutation({
  //   url: `/api/sales/complete-hold-sale`,
  //   method: "POST",
  //   invalidateKey: "/api/sales",
  //   onSuccessCallback: (response) => {
  //     return response;
  //   },
  // });
  const onSubmit = async (formData: any) => {
    const result = await salesMutation(formData);
    console.log({ result });
    return result.data.data;
  };

  const onClickCategory = (categoryId: number | "ALL") => {
    console.log("Clicked category:", categoryId);
    setCategoryId(categoryId);
  };

  const onSearch = async (value: string) => {
    console.log("Search query:", value);
    setQuery(value);
    if (debouncedQuery && debouncedQuery.length > 2) {
      refetch();
    }
  };
  return (
    <div>
      <AddSalePage
        onSubmit={onSubmit}
        loading={isPending}
        products={products as any}
        onClickCategory={onClickCategory}
        onSearch={onSearch}
        searchValue={query}
      />
    </div>
  );
};

export default AddSale;
