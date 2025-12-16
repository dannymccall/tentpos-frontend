import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { formatDate } from "@/lib/helperFunctions";

import type { SaleReturn, SaleReturnItem } from "@/types/sale.types";

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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Returned Items — Sale #{saleReturn.sale.saleNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
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
                <TableRow key={item.id}>
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
          <div className="mt-4 text-right font-semibold text-lg">
            Total Refund: ${totalRefund.toFixed(2)}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
