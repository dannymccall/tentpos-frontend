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

import { useNavigate } from "react-router-dom";
import type { Sale } from "@/types/sale.types";
import { formatDate, getSaleStatusColor } from "@/lib/helperFunctions";
import { Button } from "../ui/button";
import SaleModal from "./SaleModal";
import { Undo2, X } from "lucide-react";
import ReturnSaleModal from "./ReturnSaleModal";
import { Badge } from "../ui/badge";
const SaleTable: React.FC<{ sales: Sale[] }> = ({ sales }) => {
  const navigate = useNavigate();
  const [sale, setSale] = useState<Sale | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [returnModal, setReturnModal] = useState<boolean>(false);
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <SaleModal
        sale={sale!}
        onClose={() => {
          setSale(null);
          setIsOpen(false);
        }}
        isOpen={isOpen}
      />
      <ReturnSaleModal
        sale={sale!}
        open={returnModal}
        onClose={() => setReturnModal(false)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Sales #</TableHead>
            <TableHead className="font-semibold">Invoice #</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Total</TableHead>
            <TableHead className="font-semibold">Subtotal</TableHead>
            <TableHead className="font-semibold">Amount Paid</TableHead>
            <TableHead className="font-semibold">Balance</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Payment Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.saleNumber}</TableCell>
              <TableCell>{sale.invoice?.invoiceNumber}</TableCell>
              <TableCell>{formatDate(sale.date)}</TableCell>
              <TableCell>
                {sale.customer
                  ? `${sale.customer?.firstName} ${sale.customer?.lastName}`
                  : "Walk-In Customer"}
              </TableCell>
              <TableCell>{sale.total}</TableCell>
              <TableCell>{sale.subtotal}</TableCell>
              <TableCell>{sale.amountPaid}</TableCell>
              <TableCell>{sale.balance}</TableCell>
              <TableCell>
                <Badge className={getSaleStatusColor(sale.status)}>
                  {sale.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getSaleStatusColor(sale.status)}>
                  {sale.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end gap-1">
                  <TableActions
                    showView
                    onView={() =>
                      navigate(`/sales/sale-details?saleId=${sale.id}`)
                    }
                    viewPermission="sales.view"
                  />
                  {sale.status !== "CANCELLED" && sale.status !== "RETURN" && (
                   <>
                   
                   <Button
                      size={"sm"}
                      variant={"secondary"}
                      onClick={() => {
                        setSale(sale);
                        setIsOpen(true);
                      }}
                    >
                      <X className="text-red-500" />
                    </Button>
                    <Button
                      size={"sm"}
                      variant={"secondary"}
                      onClick={() => {
                        setSale(sale);
                        setReturnModal(true);
                      }}
                    >
                      <Undo2 className="text-amber-500" />
                    </Button>
                   </>
                  )}
            
                  
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaleTable;
