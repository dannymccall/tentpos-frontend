import DialogModal from "@/components/Dialog";
import { DialogTitle } from "@/components/ui/dialog";
import type { StockTransferProduct } from "@/types/warehouse.types";
import React, { useState } from "react";
import StockTransferProductsList from "./StockTransferProductsList";
import { Button } from "@/components/Button";
import { useApiMutation } from "@/hooks/useApiMutation";
import { PermissionGate } from "@/components/PermissionGate";

interface TransferModalProps {
  onClose: () => void;
  open: boolean;
  products: StockTransferProduct[];
  mode: "view" | "delete";
  reference?: string;
  status: string;
  transferId?: number;
}
const TransferModal: React.FC<TransferModalProps> = ({
  open,
  onClose,
  products,
  mode,
  reference,
  status,
  transferId,
}) => {
  const [reason, setReason] = useState("");

  const { mutate: rejectTransfer, isPending } = useApiMutation({
    url: "/api/warehousing/cancel-transfer",
    method: "POST",
    invalidateKey: "/api/warehousing/transfers",
    onSuccessCallback: () => {
      setReason("");
      onClose();
    },
  });
  const { mutate: approveTransfer, isPending: approvingTransfer } =
    useApiMutation({
      url: "/api/warehousing/approve-transfer",
      method: "POST",
      invalidateKey: "/api/warehousing/transfers",
      onSuccessCallback: () => {
        onClose();
      },
    });

  return (
    <DialogModal
      open={open}
      setOpen={onClose}
      title={
        <DialogTitle className="text-center text-sm md:text-base">
          {mode === "view"
            ? "Stock Transfer Detail"
            : `Cancel Transfer for ref# ${reference}`}
        </DialogTitle>
      }
      size="w-full md:max-w-3xl"
    >
      {mode === "delete" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Reason for Canellation
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for canellation..."
            className="border border-gray-300  text-sm md:text-base rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500 min-h-20"
          />

          <div className="flex justify-end gap-3 mt-2">
            <PermissionGate code="warehouse.cancel.transfer">

            <Button
              onClick={() => rejectTransfer({ reason, reference })}
              disabled={isPending || !reason.trim()}
              loading={isPending}
              variant={"danger"}
              size={"sm"}
            >
              Cancel Transfer
            </Button>
            </PermissionGate>

            <Button
              onClick={onClose}
              variant={"ghost"}
              className="bg-gray-200"
              size={"sm"}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {mode === "view" && products && (
        <StockTransferProductsList
          products={products}
          status={status}
          approveTransfer={() => approveTransfer({ transferId })}
          approvingTransfer={approvingTransfer}
        />
      )}
    </DialogModal>
  );
};

export default TransferModal;
