import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { StockAdjustment } from "@/types/stockadjustment.type";

const StockAdjustmentsTable: React.FC<{ adjustments: StockAdjustment[] }> = ({ adjustments }) => {

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Branch</TableHead>
            <TableHead className="font-semibold">User</TableHead>
            <TableHead className="font-semibold">Quantity</TableHead>
            <TableHead className="font-semibold">Reason</TableHead>
            <TableHead className="font-semibold">Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adjustments.map((adjustment) => (
            <TableRow key={adjustment.id}>
              <TableCell>{adjustment.id}</TableCell>
              <TableCell>{adjustment.productStockAdjustment.title}</TableCell>
              <TableCell>
                {adjustment.branchStockAdjustment.name}
              </TableCell>
              <TableCell>{adjustment.userStockAdjustment.fullName}</TableCell>
              <TableCell>{adjustment.qtyChange}</TableCell>
              <TableCell>{adjustment.reason}</TableCell>
             
              <TableCell>
                {adjustment.note}
              </TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockAdjustmentsTable;
