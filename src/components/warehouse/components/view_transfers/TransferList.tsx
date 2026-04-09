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
import type { StockTransfer, StockTransferProduct } from "@/types/warehouse.types";
import { TableActions } from "@/components/TableActions";
import { formatDate, getSaleStatusColor, toCapitalized } from "@/lib/helperFunctions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TransferModal from "./TransferModal";
import { Button } from "@/components/ui/button";
import {  XCircle } from "lucide-react";

interface TransferTableProps {
  transfers: StockTransfer[];
  visibleColumns?: string[]; // list of column keys to show
  rowLimit?: number;         // optional row limit
  showActions?: boolean;     // whether to show actions column
}

const TransferTable: React.FC<TransferTableProps> = ({
  transfers,
  visibleColumns,
  rowLimit,
  showActions = true,
}) => {
  const [products, setProducts] = useState<StockTransferProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "delete">("view");
  const [transferMeta, setTransferMeta] = useState<Record<string, any>>({
    reference: "",
    status: "",
    transferId: null
  });

  const displayedTransfers = rowLimit ? transfers.slice(0, rowLimit) : transfers;

  const columnKeys = visibleColumns ?? [
    "date",
    "reference",
    "type",
    "source",
    "destination",
    "status",
    "note",
    "createdBy",
  ];

  return (
    <>
      {(products.length > 0 || transferMeta.reference) && (
        <TransferModal
          open={open}
          onClose={() => setOpen(false)}
          products={products}
          mode={mode}
          reference={transferMeta.reference}
          status={transferMeta.status}
          transferId={transferMeta.transferId}
        />
      )}
      <Card className="w-full">
        <CardContent>
          <Table className="table w-full border">
            <TableHeader>
              <TableRow className="bg-gray-100 rounded-md">
                {columnKeys.includes("date") && <TableHead>Date</TableHead>}
                {columnKeys.includes("reference") && <TableHead>Reference</TableHead>}
                {columnKeys.includes("type") && <TableHead>Type</TableHead>}
                {columnKeys.includes("source") && <TableHead>Source</TableHead>}
                {columnKeys.includes("destination") && <TableHead>Destination</TableHead>}
                {columnKeys.includes("status") && <TableHead>Status</TableHead>}
                {columnKeys.includes("note") && <TableHead>Note</TableHead>}
                {columnKeys.includes("createdBy") && <TableHead>Created By</TableHead>}
                {showActions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransfers.map((t) => (
                <TableRow key={t.id} className="border-b border-b-gray-100">
                  {columnKeys.includes("date") && <TableCell>{formatDate(t.createdAt)}</TableCell>}
                  {columnKeys.includes("reference") && <TableCell>{t.reference}</TableCell>}
                  {columnKeys.includes("type") && (
                    <TableCell>{toCapitalized(t.type.replaceAll("_", " "))}</TableCell>
                  )}
                  {columnKeys.includes("source") && <TableCell>{t.fromWarehouse.name}</TableCell>}
                  {columnKeys.includes("destination") && (
                    <TableCell>{t.toWarehouse?.name ?? t.toBranch?.name ?? "-"}</TableCell>
                  )}
                  {columnKeys.includes("status") && (
                    <TableCell className="">
                      <Badge className={cn(getSaleStatusColor(t.status), "text-[10px] md:text-[12px]")}>
                        {toCapitalized(t.status)}
                      </Badge>
                    </TableCell>
                  )}
                  {columnKeys.includes("note") && <TableCell>{t.notes ?? "-"}</TableCell>}
                  {columnKeys.includes("createdBy") && <TableCell>{t.User.fullName}</TableCell>}
                  {showActions && (
                    <TableCell className="flex justify-end gap-2">
                      <TableActions
                        showView
                        onView={() => {
                          setOpen(true);
                          setProducts(t.products);
                          setMode("view");
                          setTransferMeta({ status: t.status, transferId: t.id });
              
                        }}
                      />
                      {t.status === "pending" && (
                        <Button
                          variant={"ghost"}
                          className="bg-gray-200"
                          size={"sm"}
                          onClick={() => {
                            setOpen(true);
                            setTransferMeta({ reference: t.reference });
                            setMode("delete");
                          }}
                        >
                          <XCircle size={18} className="text-red-500" />{" "}
                        </Button>
                      )}
                      {/* {t.status === "completed" && (
                        <Button variant={"ghost"} className="bg-gray-200" size={"sm"}>
                          <RotateCcw />
                        </Button>
                      )} */}
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

export default TransferTable;