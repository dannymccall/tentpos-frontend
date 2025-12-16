import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableActions } from "../TableActions";

import { formatDate } from "@/lib/helperFunctions";
import type { SaleReturn } from "@/types/sale.types";
import SaleReturnDetailModal from "./SaleReturnDetailModal";

const SaleReturnTable: React.FC<{ saleReturn: SaleReturn[] }> = ({
  saleReturn,
}) => {
  const [sale, setSale] = useState<SaleReturn | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <SaleReturnDetailModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        saleReturn={sale!}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Sales #</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Branch</TableHead>
            <TableHead className="font-semibold">Performed By</TableHead>
            <TableHead className="font-semibold">Reason</TableHead>
            <TableHead className="font-semibold">Total Refund</TableHead>
            <TableHead className="font-semibold">Refund Method</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saleReturn.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.sale.saleNumber}</TableCell>
              <TableCell>{formatDate(r.createdAt)}</TableCell>
              <TableCell>
                {r.sale.customer
                  ? r.sale.customer?.firstName
                  : "Walk-In Customer"}
              </TableCell>
              <TableCell>{r.branchReturn.name}</TableCell>
              <TableCell>{r.processedBy.fullName}</TableCell>
              <TableCell>{r.reason}</TableCell>
              <TableCell>{r.totalRefund}</TableCell>
              <TableCell>{r.refundMethod}</TableCell>

              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end gap-1">
                  <TableActions
                    showView
                    onView={() => {
                        console.log(r)
                      setSale(r);
                      setIsOpen(true);
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaleReturnTable;
