import React from "react";
import DialogModal from "@/components/Dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FaWarehouse } from "react-icons/fa";
import { FaCodeBranch } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
interface WarehouseTransferModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  type: "warehouse_to_warehouse" | "warehouse_to_branch";
}
const WarehouseTransferModal: React.FC<WarehouseTransferModalProps> = ({
  open,
  onClose,
  children,
  type,
}) => {
  return (
    <DialogModal
      open={open}
      setOpen={onClose}
      title={
        <DialogTitle className="text-center">Stock Movement</DialogTitle>
      }
      size="w-full md:max-w-3xl"
    >
    <div className="flex items-center justify-between mb-6">
  
  {/* LEFT: Title + Flow */}
  <div className="flex items-center gap-3">
    
    {/* Icon Flow */}
    <div className="flex items-center gap-2 text-gray-500">
      <FaWarehouse />

      <FaArrowRight className="text-xs" />

      {type === "warehouse_to_warehouse" ? (
        <FaWarehouse />
      ) : (
        <FaCodeBranch />
      )}
    </div>

    {/* Text */}
    <div>
      <h1 className="text-base md:text-lg font-semibold text-gray-900">
        {type === "warehouse_to_warehouse"
          ? "Warehouse Transfer"
          : "Branch Transfer"}
      </h1>

      <p className="text-xs text-gray-500">
        {type === "warehouse_to_warehouse"
          ? "Move stock between warehouses"
          : "Move stock from warehouse to branch"}
      </p>
    </div>
  </div>

  {/* RIGHT: Status badge (optional but 🔥) */}
  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
    Transfer
  </span>
</div>
      <Separator />
      <div className="overflow-y-auto max-h-[60vh] md:max-h-full">{children}</div>
    </DialogModal>
  );
};

export default WarehouseTransferModal;
