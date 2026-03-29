
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { useNavigate } from "react-router-dom";
import type { Purchase } from "@/types/purchase.types";
import { TableActions } from "@/components/TableActions";
import { formatDate, getSaleStatusColor } from "@/lib/helperFunctions";
import PurchaseModal from "./PurchaseModal";
import { Badge } from "@/components/ui/badge";
const PurchaseTable: React.FC<{ purchases: Purchase[] }> = ({ purchases }) => {
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState<Purchase | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <PurchaseModal
        purchase={purchase!}
        onClose={() => {setPurchase(null);  setIsOpen(false)}}
        isOpen={isOpen}
      />
      <Table>
        <TableHeader>
          <TableRow className="text-xs md:text-sm"> 
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Purchase Date</TableHead>
            <TableHead className="font-semibold">Ref / Receipt # Date</TableHead>
            <TableHead className="font-semibold">Supplier</TableHead>
            <TableHead className="font-semibold">Tax</TableHead>
            <TableHead className="font-semibold">Total</TableHead>
            <TableHead className="font-semibold">Subtotal</TableHead>
            <TableHead className="font-semibold">Balance</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id} className="text-xs md:text-sm">
              <TableCell>{purchase.id}</TableCell>
              <TableCell>{formatDate(purchase.createdAt!)}</TableCell>
              <TableCell>{(purchase.receiptNumber!)}</TableCell>
              <TableCell>{purchase.supplier ?  purchase.supplier.name : "Random Supplier"}</TableCell>
              <TableCell>{purchase.tax}</TableCell>
              <TableCell>{purchase.total}</TableCell>
              <TableCell>{purchase.subtotal}</TableCell>
              <TableCell>{purchase.balance}</TableCell>
              <TableCell> <Badge className={getSaleStatusColor(purchase.status)}>
                  {purchase.status}
                </Badge></TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <TableActions
                    showDelete
                    showEdit
                    showView
                    onDelete={() => {setPurchase(purchase); setIsOpen(true)}}
                    onView={() => navigate(`/purchases/purchase-details?purchaseId=${purchase.id}`)}
                    onEdit={() => navigate(`/purchases/purchase-details?purchaseId=${purchase.id}`)}
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

export default PurchaseTable;
