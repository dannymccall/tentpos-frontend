import React from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { StockTransferProduct } from "@/types/warehouse.types";
import { Button } from "@/components/Button";
import { Separator } from "@/components/ui/separator";
interface StockTransferProductsListProps {
  products: StockTransferProduct[];
  status: string;
    approveTransfer: () => void;
  approvingTransfer: boolean

}
const StockTransferProductsList: React.FC<StockTransferProductsListProps> = ({
  products,
  status,
  approveTransfer,
  approvingTransfer
}) => {
  return (
    <Card className="w-full max-h-[60vh] md:h-full bg-transparent overflow-y-auto">
      <CardContent>
        <Table className="table w-full max-h-[350px] overflow-y-auto">
          <TableHeader>
            <TableRow className="bg-gray-100 rounded-md">
              <TableHead>Title</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Source (Before → After)</TableHead>
              <TableHead>Destination (Before → After)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} className="border-b border-b-gray-100">
                <TableCell>{p.Product.title}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{`${p.sourceQuantityBefore} → ${p.sourceQuantityAfter} `}</TableCell>
                <TableCell>{`${p.destinationQuantityBefore} → ${p.destinationQuantityAfter} `}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            <Separator />
        {status === "pending" && (
          <div className="flex justify-end gap-3 mt-5">
            <Button className="bg-emerald-500" size={"sm"} onClick={approveTransfer} loading={approvingTransfer}>
              Accept Transfer
            </Button>
          
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockTransferProductsList;
