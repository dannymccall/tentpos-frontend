import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Invoice } from "@/types/sale.types";
import { Badge } from "@/components/ui/badge";
import { getSaleStatusColor } from "@/lib/helperFunctions";
import { Button } from "../ui/button";
import DialogModal from "../Dialog";
import InvoiceView from "../sales/InvoiceView";
const InvoiceTable: React.FC<{ invoices: Invoice[] }> = ({ invoices }) => {
  const [invoice, setInvoice] = useState<Invoice | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);



  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <DialogModal open={isOpen} setOpen={() => setIsOpen(false)} size="w-[300px]">
        {invoice && (
          <InvoiceView
            invoice={invoice}
            sale={invoice.saleInvoice}
            tenant={{ name: "My Shop", logoUrl: "/logo.png" }}
            onClose={() => setIsOpen(false)}
            onPay={() => console.log("Pay")}
            onDownload={() => console.log("Download PDF")}
            onPrint={() => window.print()}
          />
        )}
      </DialogModal>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Invoice Number</TableHead>
            <TableHead className="font-semibold">Sales Number</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Payment Method</TableHead>
            <TableHead className="font-semibold">Total</TableHead>
            <TableHead className="font-semibold">Sub Total</TableHead>
            <TableHead className="font-semibold">Amount Paid</TableHead>
            <TableHead className="font-semibold">Balance</TableHead>
            <TableHead className="font-semibold text-end">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.invoiceNumber}</TableCell>
              <TableCell>{invoice.saleInvoice?.saleNumber}</TableCell>
              <TableCell>
                {invoice.saleInvoice?.customer
                  ? `${invoice.saleInvoice?.customer?.firstName} ${invoice.saleInvoice?.customer?.lastName}`
                  : "Walk-in Customer"}
              </TableCell>
              <TableCell>
                <Badge className={getSaleStatusColor(invoice.status!)}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.saleInvoice?.paymentMethod}</TableCell>
              <TableCell>{invoice.saleInvoice?.total}</TableCell>
              <TableCell>{invoice.saleInvoice?.subtotal}</TableCell>
              <TableCell>{invoice.saleInvoice?.amountPaid}</TableCell>
              <TableCell>{invoice.saleInvoice?.balance}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <Button variant={"secondary"} size={"sm"} onClick={() => {setInvoice(invoice), setIsOpen(true)}}>
                    Generate Receipt
                  </Button>{" "}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoiceTable;
