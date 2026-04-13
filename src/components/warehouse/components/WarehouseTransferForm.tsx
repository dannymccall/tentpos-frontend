import { Button } from "@/components/Button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
type Product = {
  id: string;
  title: string;
  available: number;
};

const WarehouseTransferForm = ({
  products,
  onSubmitTransfer,
  pending,
}: {
  products: Product[];
  onSubmitTransfer: (selectedProducts: Record<string, number>) => void;
  pending: boolean;
}) => {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const toggleProduct = (productId: string) => {
    setSelected((prev) => {
      const copy = { ...prev };
      if (copy[productId]) {
        delete copy[productId];
      } else {
        copy[productId] = 1; // default qty
      }
      return copy;
    });
  };

  const updateQty = (productId: string, qty: number, max: number) => {
    if (qty < 1) qty = 1;
    if (qty > max) qty = max;

    setSelected((prev) => ({
      ...prev,
      [productId]: qty,
    }));
  };

const filteredProducts = products?.filter((p) =>
  p?.title?.toLowerCase().includes(searchTerm?.toLowerCase())
);
  return (
    <div className="space-y-4 border p-3 rounded-xl overflow-auto min-h-72 max-h-[60vh]  md:max-h-[80vh]">
      {/* TABLE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        {/* Left side */}
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <div>
            <p className="text-sm font-medium text-blue-900">
              Select products to add to transfer
            </p>
            <p className="text-xs text-blue-700">
              You cannot move more than the available quantity in stock.
            </p>
          </div>
        </div>
        <div>
          <Input
            placeholder="Search by product title or SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="max-w-sm border-blue-500"
          />
        </div>
        {/* Right side (optional counter later) */}
        <span className="text-xs text-blue-800">
          {Object.keys(selected).length} selected
        </span>
      </div>
      <div className="grid grid-cols-4 text-xs md:text-sm font-medium text-gray-500 px-2 bg-gray-100 p-2 rounded-md">
        <span></span>
        <span>Product</span>
        <span>Available</span>
        <span>Move Qty</span>
      </div>

      {/* PRODUCTS */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
        {filteredProducts.map((product) => {
          const isChecked = selected[product.id] !== undefined;

          return (
            <div
              key={product.id}
              className="grid grid-cols-4 items-center gap-2 p-2 rounded-xl border hover:bg-gray-50 transition"
            >
              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={isChecked}
                disabled={product.available === 0}
                onChange={() => toggleProduct(product.id)}
              />

              {/* PRODUCT */}
              <span className="font-medium truncate text-xs md:text-sm">
                {product.title}
              </span>

              {/* AVAILABLE */}
              <span className="text-sm text-gray-600">{product.available}</span>

              {/* QUANTITY INPUT */}
              <div>
                {isChecked && (
                  <input
                    type="number"
                    min={1}
                    max={product.available}
                    value={selected[product.id]}
                    onChange={(e) =>
                      updateQty(
                        product.id,
                        Number(e.target.value),
                        product.available,
                      )
                    }
                    className="w-12 md:w-20 px-2 py-1 border rounded-md text-sm"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => onSubmitTransfer(selected)}
          variant={"primary"}
          loading={pending}
        >
          Move Stock
        </Button>
      </div>
    </div>
  );
};

export default WarehouseTransferForm;
