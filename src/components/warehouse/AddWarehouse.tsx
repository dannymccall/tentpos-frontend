import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../Button";
import { useApiMutation } from "@/hooks/useApiMutation";
import WarehouseForm from "./WarehouseForm";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { WarehouseProducts } from "@/types/warehouse_products.types";
import { MdCancel } from "react-icons/md";
import { Tooltip } from "./components/StockMovementButton";

type WarehouseFormValues = {
  name: string;
  description?: string;
  location?: string;
};

type Product = {
  id: number;
  title: string;
  sku: string;
  currentStock: number;
  isExisting: boolean;
};

type ProductAllocation = {
  productId: number;
  quantity: number;
};

export default function WarehouseStepperPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<"all" | "existing" | "new">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const { data } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: async () => {
      const res = await api.get<{ data: any }>(
        `/api/warehousing/get-warehouse?id=${id}`,
      );
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: !!id,
  });

  type PreparedProduct = {
    productId: number;
    quantity: number;
    title: string;
    sku: string;
  };

  useEffect(() => {
    if (!id) {
      setStep(1);
    }
  }, [id]);
  const preparedProducts = useMemo(() => {
    if (!data?.WarehouseProducts) return [];
    setWarehouseId(data.id);
    return data.WarehouseProducts.map((d: WarehouseProducts) => ({
      productId: d.Product.id,
      quantity: d.quantity,
      title: d.Product.title,
      sku: d.Product.sku,
    }));
  }, [data]);

  const { control, register, handleSubmit, watch } = useForm({
    defaultValues: {
      allocations: [
        { productId: 0, title: "", sku: "", quantity: 0, isExisting: false },
      ],
    },
  });

  const { fields, remove, replace } = useFieldArray({
    control,
    name: "allocations",
  });

  const allocations = watch("allocations");

  const fetchProductsForAllocation = async () => {
    const res = await api.get("/api/products/get-products-for-allocation");

    const preparedMap = new Map(
      preparedProducts.map((p: PreparedProduct) => [p.productId, p]),
    );
    const formatted = res.data.map((p: Product) => {
      const existing = preparedMap.get(p.id);
      return {
        productId: p.id,
        title: p.title,
        sku: p.sku,
        quantity: existing ? (existing as { quantity: number }).quantity : 0,
        isExisting: !!existing,
      };
    });

    replace(formatted);
    setDeletedIds([]); // reset deletedIds
  };

  useEffect(() => {
    if (data && step === 2) fetchProductsForAllocation();
  }, [data, step]);

  const { mutate: createWarehouse, isPending: creatingWarehouse } =
    useApiMutation({
      url: "/api/warehousing/create-warehouse",
      method: "POST",
      invalidateKey: "warehouse-dashboard",
      onSuccessCallback: async (res) => {
        setWarehouseId(res.data.data.id);
        setStep(2);
        await fetchProductsForAllocation();
      },
    });

  const url = data
    ? `/api/warehouse-products/update-products?warehouseId=${id}`
    : "/api/warehouse-products/allocate";
  const method = data ? "PUT" : "POST";

  const { mutate: allocateProducts, isPending: allocatingProducts } =
    useApiMutation({
      url,
      method,
      invalidateKey: `warehouse ${data && data.id}`,
      onSuccessCallback: () => {
        if (!data) setTimeout(() => navigate("/warehousing/dashboard"), 200);
      },
    });

  const handleRemove = (
    index: number,
    productId: number,
    isExisting: boolean,
  ) => {
    if (isExisting) setDeletedIds((prev) => [...prev, productId]);
    remove(index);
  };

  const handleReset = () => {
    fetchProductsForAllocation();
  };

  const onSubmitAllocation = (data: { allocations: ProductAllocation[] }) => {
    if (!warehouseId) return;
    allocateProducts({
      warehouseId,
      allocations: data.allocations,
      deletedIds,
    });
  };

  // Utility to highlight matching text
  const highlightMatch = (text: string, term: string) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, idx) =>
      regex.test(part) ? (
        <span key={idx} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="w-full p-2 md:p-10">
      <div className="w-full flex flex-col gap-10 py-10 px-4 mx-auto bg-white rounded-2xl">
        {/* Stepper Header */}
        <div className="flex items-center gap-6 cursor-pointer">
          <div
            className={`font-semibold ${step === 1 ? "text-[#1d3449]" : "text-gray-400"} text-xs md:text-sm`}
            onClick={() => data && setStep(1)}
          >
            1. Warehouse Information
          </div>
          <div
            className={`font-semibold ${step === 2 ? "text-[#1d3449]" : "text-gray-400"} cursor-pointer text-xs md:text-sm`}
            onClick={() => data && setStep(2)}
          >
            2. Allocate Products
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <WarehouseForm
            mode={data ? "edit" : "create"}
            onSubmitWarehouse={(d: WarehouseFormValues) => createWarehouse(d)}
            isPending={creatingWarehouse}
            data={data}
          />
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <Card className="rounded-2xl border max-h-[63vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Allocate Products</CardTitle>
                <p className="md:text-sm text-xs  bg-blue-100 border rounded p-2 text-blue-700 border-blue-600">
                  Specify quantities for each product in this warehouse.
                  Existing products will be updated automatically, while new
                  ones will be added. You can also remove products if needed.{" "}
                  <span className="font-bold">
                    Note: for new products, only products with quantity greater
                    than 0 will be created.
                  </span>
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2">
                  {/* Search Input */}
                  <Input
                    placeholder="Search by product title or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  {data && (
                    <div className="flex gap-4 mt-2">
                      {["all", "existing", "new"].map((f) => (
                        <Button
                          key={f}
                          variant={filter === f ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => setFilter(f as any)}
                        >
                          {f[0].toUpperCase() + f.slice(1)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {allocations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Loading products...
                  </p>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmitAllocation)}
                    className="space-y-4"
                  >
                    {fields
                      .filter((f) => {
                        if (filter === "existing") return f.isExisting;
                        if (filter === "new") return !f.isExisting;
                        return true;
                      })
                      .filter((f) => {
                        // Filter by search term
                        if (!searchTerm) return true;
                        const term = searchTerm.toLowerCase();
                        return (
                          f.title.toLowerCase().includes(term) ||
                          f.sku.toLowerCase().includes(term)
                        );
                      })
                      .map((field, index) => {
                        const quantity = allocations?.[index]?.quantity || 0;
                        return (
                          <div
                            key={field.id}
                            className="grid grid-cols-4 gap-4 md:items-center"
                          >
                            <div className="text-xs md:text-sm flex flex-col md:flex-row items-center gap-2">
                              {highlightMatch(field.title, searchTerm)}
                              {field.isExisting ? (
                                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                                  Existing
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-600 rounded">
                                  New
                                </span>
                              )}
                            </div>

                            <div className="text-muted-foreground text-xs md:text-sm">
                              SKU: {highlightMatch(field.sku, searchTerm)}
                            </div>

                            <Input
                              type="number"
                              {...register(`allocations.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                            />
                            <div className="w-full">
                              <Tooltip
                                label={
                                  quantity > 0
                                    ? "Can't remove: quantity > 0"
                                    : ""
                                }
                                className="w-full"
                              >
                                <Button
                                  type="button"
                                  variant="danger"
                                  disabled={quantity > 0}
                                  onClick={() =>
                                    handleRemove(
                                      index,
                                      field.productId,
                                      field.isExisting,
                                    )
                                  }
                                  className="w-full disabled:bg-red-200"
                                >
                                  <span className="md:hidden">
                                    <MdCancel className="text-xl" />
                                  </span>
                                  <span className="hidden md:inline">
                                    Remove
                                  </span>
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })}
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/warehousing/dashboard")}
                size="sm"
              >
                Skip
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                size="sm"
                className="bg-gray-200"
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={allocatingProducts}
                onClick={handleSubmit(onSubmitAllocation)}
              >
                Allocate Products
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
