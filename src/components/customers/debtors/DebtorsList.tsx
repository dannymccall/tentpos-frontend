import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Debtor } from "@/types/customer.types";
import { formatDate } from "@/lib/helperFunctions";
import { Button } from "@/components/ui/button";
import PayDebtModal from "./PayDebtModal";

const DebtorsTable: React.FC<{ debtors: Debtor[] }> = ({ debtors }) => {
  const [debtor, setDebtor] = useState<Debtor | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <PayDebtModal
        debtor={debtor!}
        onClose={() => {setDebtor(null);  setIsOpen(false)}}
        open={isOpen}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Oldest Debt Date</TableHead>
            <TableHead className="font-semibold">Last Sale Date</TableHead>
            <TableHead className="font-semibold">Branch</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {debtors.map((debtor) => (
            <TableRow key={debtor.id}>
              <TableCell>{debtor.id}</TableCell>
              <TableCell>{`${debtor.customerDebtor.firstName} ${debtor.customerDebtor.firstName}`}</TableCell>
              <TableCell>{debtor.totalOwed}</TableCell>
              <TableCell>{formatDate(debtor.oldestDebtDate)}</TableCell>
              <TableCell>{formatDate(debtor.lastSaleDate)}</TableCell>
              <TableCell>{debtor.branchDebtor.name}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  {/* <TableActions
                    showDelete
                    showEdit
                    showView
                    onDelete={() => {setCustomer(customer); setIsOpen(true)}}
                    onView={() => navigate(`/customers/customer-details?customerId=${customer.id}`)}
                    onEdit={() => navigate(`/customers/customer-details?customerId=${customer.id}`)}

                  /> */}
                  <Button size={"sm"} onClick={() => {setIsOpen(true), setDebtor(debtor)}}>Pay</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DebtorsTable;
