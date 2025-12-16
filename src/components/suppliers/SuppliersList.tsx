
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
import SupplierModal from "./SupplierModal";
import type { Supplier } from "@/types/suppliers.types";
const SupplierTable: React.FC<{ suppliers: Supplier[] }> = ({ suppliers }) => {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <SupplierModal
        supplier={supplier!}
        onClose={() => {setSupplier(null);  setIsOpen(false)}}
        isOpen={isOpen}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Phone</TableHead>
            <TableHead className="font-semibold">Address</TableHead>
            <TableHead className="font-semibold">Contact Person</TableHead>
            <TableHead className="font-semibold">Notes</TableHead>
            <TableHead className="font-semibold">Opening Balance</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.id}</TableCell>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.address}</TableCell>
              <TableCell>{supplier.contactPerson}</TableCell>
              <TableCell>{supplier.notes}</TableCell>
              <TableCell>{supplier.openingBalance}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <TableActions
                    showDelete
                    showEdit
                    showView
                    onDelete={() => {setSupplier(supplier); setIsOpen(true)}}
                    onView={() => navigate(`/suppliers/supplier-details?supplierId=${supplier.id}`)}
                    onEdit={() => navigate(`/suppliers/supplier-details?supplierId=${supplier.id}`)}
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

export default SupplierTable;
