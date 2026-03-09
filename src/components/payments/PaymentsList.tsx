import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { PaymentProps } from "@/types/payment.type";
import { toCapitalized } from "@/lib/helperFunctions";

const Payments: React.FC<PaymentProps> = ({ payments }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Sales Number</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Payment Method</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Branch</TableHead>
            <TableHead className="font-semibold">Cashier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.salePayment ? payment.salePayment.saleNumber : "No sale made"}</TableCell>
              <TableCell>
                {payment.customerPayment
                  ? `${payment.customerPayment?.firstName} ${payment.customerPayment?.lastName}`
                  : "Walk-in Customer"}
              </TableCell>

              <TableCell>{payment.amount}</TableCell>
              <TableCell>{toCapitalized(payment.method) }</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>{payment.branchPayment.name}</TableCell>
              <TableCell>{payment.userPayment.fullName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Payments;
