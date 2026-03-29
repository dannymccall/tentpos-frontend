import { useMemo } from "react";
import {

  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { formatDate } from "@/lib/helperFunctions";

import type { SaleReturn, SaleReturnItem } from "@/types/sale.types";
import DialogModal from "../Dialog";

interface SaleReturnDetailModalProps {
  open: boolean;
  onClose: () => void;
  saleReturn: SaleReturn | null;
}

export default function SaleReturnDetailModal({
  open,
  onClose,
  saleReturn,
}: SaleReturnDetailModalProps) {
  if (!saleReturn) return null;

  // ✅ Calculate total refund
  const totalRefund = useMemo(() => {
    return saleReturn.items.reduce((sum: number, item: SaleReturnItem) => {
      return sum + Number(item.refundAmount);
    }, 0);
  }, [saleReturn]);

  return (
    <DialogModal
      open={open}
      setOpen={onClose}
      title={
        <DialogTitle className="text-sm md:text-base">
          Returned Items — Sale #{saleReturn.sale.saleNumber}
        </DialogTitle>
      }
    >
      <div className="overflow-x-auto mt-4">
        <Table>
          <TableHeader>
            <TableRow className="text-xs md:text-sm">
              <TableHead>Product ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Refund Amount</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Date Returned</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {saleReturn.items.map((item: SaleReturnItem) => (
              <TableRow key={item.id} className="text-xs md:text-sm">
                <TableCell>{item.productItem.title}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{Number(item.unitPrice).toFixed(2)}</TableCell>
                <TableCell>{Number(item.refundAmount).toFixed(2)}</TableCell>
                <TableCell>{item.condition}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total */}
        <div className="mt-4 text-right font-semibold text-sm md:text-base">
          Total Refund: ${totalRefund.toFixed(2)}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogModal>
  );
}
