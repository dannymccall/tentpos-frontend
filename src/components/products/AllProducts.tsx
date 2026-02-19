import { useState } from "react";

import { useFetch } from "@/hooks/useFetch";
import { useExportCSV } from "@/hooks/useExportCSV";
import { useExportPDF } from "@/hooks/useExportPDF";
import DataTableWrapper from "../DataTableWrapper";
import ProductTable from "./ProductList";
import type { Product } from "@/types/product.types";
import { useAuth } from "@/context/AuthContext";
const AllProducts = () => {
  const [limit, setLimit] = useState<number>(10);
  const {
    data: products,
    loading,
    totalPages,
    currentPage,
    setPage,
    query,
    refetch,
    setQuery,
  } = useFetch<Product[]>({ uri: "/api/products/get-products", limit });

  const { exportCSV } = useExportCSV();
  const { exportPDF } = useExportPDF();
  const onPageChange = (page: number) => {
    setPage(page);
  };
  // console.log(loading, hasLoaded);
  const { businessProfile } = useAuth();

  const isOwner = businessProfile?.appRole === "owner";

  const onSearch = (query: string) => {
    setQuery(query);
  };

  const onRefresh = () => {
    setQuery("");
    refetch();
  };

  const handleOnSelect = (value: number) => {
    setLimit(value);
  };

  const baseHeader: string[] = [
    "ID",
    "Product",
    "Catgory",
    "Description",
    "Price",
    "Cost",
  ];

  const headers = isOwner
    ? [...baseHeader, "Total Iventory", "Total Qty Sold"]
    : [...baseHeader, "Inventory", "Qty Sold"];
  const handleExportCSV = () => {
    exportCSV({
      headers: [...headers, "Status"],
      data: products,
      fileName: "products.csv",
      mapRow: (p) => [
        p.id,
        p.title,
        p.categoryProduct ? p.categoryProduct.name : "-",
        p.description ? p.description : "-",
        p.price,
        p.cost,
        isOwner ? p.totalInventory : p.branchInventory?.inventory,
        isOwner ? p.qtySold : p.branchInventory?.qtySold,
        p.status
      ],
    });
  };

  const handleExportPDF = () => {
    exportPDF({
      headers: [...headers, "Status"],
      data: products,
      fileName: "products.pdf",
      title: "Products",
      mapRow: (p: any) => [
        p.id,
        p.title,
        p.categoryProduct ? p.categoryProduct.name : "-",
        p.description ? p.description : "-",
        p.price,
        p.cost,
        isOwner ? p.totalInventory : p.branchInventory?.inventory,
        isOwner ? p.qtySold : p.branchInventory?.qtySold,
        p.status
      ],
      orientation: "landscape",
    });
  };
  return (
    <DataTableWrapper
      data={products}
      query={query}
      onRefresh={onRefresh}
      handleOnSelect={handleOnSelect}
      limit={limit}
      loading={loading}
      title="All products"
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      exportCSV={handleExportCSV}
      exportPDF={handleExportPDF}
    >
      <ProductTable products={products} />
    </DataTableWrapper>
  );
};

export default AllProducts;
