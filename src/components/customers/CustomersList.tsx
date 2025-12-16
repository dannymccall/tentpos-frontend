
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
import type { Customer } from "@/types/customer.types";
import CustomerModal from "./CustomerModal";

const CustomerTable: React.FC<{ customers: Customer[] }> = ({ customers }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <CustomerModal
        customer={customer!}
        onClose={() => {setCustomer(null);  setIsOpen(false)}}
        isOpen={isOpen}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">First Name</TableHead>
            <TableHead className="font-semibold">Last Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Address</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.firstName}</TableCell>
              <TableCell>{customer.lastName}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <TableActions
                    showDelete
                    showEdit
                    showView
                    onDelete={() => {setCustomer(customer); setIsOpen(true)}}
                    onView={() => navigate(`/customers/customer-details?customerId=${customer.id}`)}
                    onEdit={() => navigate(`/customers/customer-details?customerId=${customer.id}`)}

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

export default CustomerTable;
