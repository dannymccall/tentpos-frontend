import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "../ui/button";

import type { ProductBranch } from "@/types/product.types";
import LowStockIncreaseModal from "./LowIncreaseModal";
import { ArrowUpFromDot } from "lucide-react";

const LowStockAlertsTable: React.FC<{ products: ProductBranch[] }> = ({
  products,
}) => {
  const [product, setProduct] = useState<ProductBranch | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <LowStockIncreaseModal
        product={product!}
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Branch</TableHead>
            <TableHead className="font-semibold">Inventory</TableHead>
            <TableHead className="font-semibold">Threshold</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.product.title}</TableCell>
              <TableCell>{product.branchInfo.name}</TableCell>
              <TableCell>{product.inventory}</TableCell>
              <TableCell>{product.product.threshold}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <Button
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                      setIsOpen(true), setProduct(product);
                    }}
                  >
                    <ArrowUpFromDot className="text-emerald-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LowStockAlertsTable;
