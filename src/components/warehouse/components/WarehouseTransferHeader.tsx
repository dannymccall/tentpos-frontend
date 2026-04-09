import { useFetchBranches } from "@/hooks/useFetchBranches";
import { useFetchWarehouses } from "@/hooks/useFetchWarehouses";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import type { Warehouse } from "@/types/warehouse.types";
import { FaWarehouse } from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

interface WarehouseTransferHeaderProps {
  type: "warehouse_to_warehouse" | "warehouse_to_branch";
  selectFromWarehouse: (id: number) => void;
  selectToWarehouse?: (id: number) => void;
  selectToBranch?: (id: number) => void;
  fromWarehouseId: number;
  toWarehouseId?: number | null;
  toBranchId?: number | null;
}

const WarehouseTransferHeader: React.FC<WarehouseTransferHeaderProps> = ({
  type,
  selectFromWarehouse,
  selectToWarehouse,
  selectToBranch,
  fromWarehouseId,
  toBranchId,
  toWarehouseId,
}) => {
  const { branches } = useFetchBranches();
  const { warehouses } = useFetchWarehouses();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

        {/* FROM */}
        <div className="w-full flex items-center gap-3 bg-gray-50 border rounded-xl px-3 py-2">
          <FaWarehouse className="text-gray-500" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">From Warehouse</p>
            <WarehouseSelect
              warehouses={warehouses}
              onSelect={selectFromWarehouse}
              value={fromWarehouseId}
            />
          </div>
        </div>

        {/* ARROW */}
        <div className="hidden md:flex items-center justify-center text-gray-400">
          <FaArrowRight />
        </div>

        {/* TO */}
        <div className="w-full flex items-center gap-3 bg-gray-50 border rounded-xl px-3 py-2">
          {type === "warehouse_to_warehouse" ? (
            <FaWarehouse className="text-gray-500" />
          ) : (
            <FaCodeBranch className="text-gray-500" />
          )}

          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">
              {type === "warehouse_to_warehouse"
                ? "To Warehouse"
                : "To Branch"}
            </p>

            {type === "warehouse_to_warehouse" ? (
              <WarehouseSelect
                warehouses={warehouses}
                onSelect={(id) => selectToWarehouse?.(id)}
                value={toWarehouseId}
              />
            ) : (
              <Select
                onValueChange={(value) =>
                  selectToBranch?.(Number(value))
                }
                value={toBranchId?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id!.toString()}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseTransferHeader;


// 🔥 Reusable Warehouse Select
export const WarehouseSelect = ({
  warehouses,
  onSelect,
  value,
}: {
  warehouses: Warehouse[];
  onSelect: (id: number) => void;
  value?: number | null;
}) => {
  return (
    <Select
      onValueChange={(value) => onSelect(Number(value))}
      value={value?.toString()}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Warehouse" />
      </SelectTrigger>
      <SelectContent>
        {warehouses.map((w) => (
          <SelectItem key={w.id} value={w.id!.toString()}>
            {w.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};