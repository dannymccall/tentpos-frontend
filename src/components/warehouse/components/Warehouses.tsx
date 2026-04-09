import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { Warehouse } from "@/types/warehouse.types";
import { TableActions } from "@/components/TableActions";
import { useNavigate } from "react-router-dom";
import WarehouseModal from "../WarehouseModal";
interface WarehousesProps {
  warehouses: Warehouse[];
  showActions?: boolean;
}
const Warehouses: React.FC<WarehousesProps> = ({
  warehouses,
  showActions = true,
}) => {
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState<Warehouse>();
  const [open, setOpen] = useState(false);

  return (
    <>
      {warehouse && (
        <WarehouseModal
          isOpen={open}
          onClose={() => setOpen(false)}
          warehouse={warehouse}
        />
      )}
      <Card className="">
        <CardContent>
          <Table className="table w-full border">
            <TableHeader>
              <TableRow className="bg-gray-100 rounded-md">
                <TableHead>Warehouse</TableHead>
                <TableHead>Location</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((w) => (
                <TableRow key={w.id} className="border-b border-b-gray-100">
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.location}</TableCell>
                  {showActions && (
                    <TableCell>
                      <TableActions
                        showDelete
                        showView
                        onView={() =>
                          navigate(`/warehousing/add-warehouse?id=${w.id}`)
                        }
                        onDelete={() => {
                          setWarehouse(w);
                          setOpen(true);
                        }}
                        deletePermission="warehouse.delete"
                        viewPermission="wareouse.view"
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default Warehouses;
