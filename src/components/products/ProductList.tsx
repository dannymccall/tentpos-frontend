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
import type { Product } from "@/types/product.types";
import { useNavigate } from "react-router-dom";
import ProductModal from "./ProductModal";
import { useAuth } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import StockAdjustmentModal from "./StockAdjustmentModal";

const ProductTable: React.FC<{ products: Product[] }> = ({ products }) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { businessProfile } = useAuth();
  const [stockModal, setStockModal] = useState<boolean>(false);
  const isOwner = businessProfile?.appRole === "owner";
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <ProductModal
        product={product!}
        onClose={() => {
          setProduct(null);
          setIsOpen(false);
        }}
        isOpen={isOpen}
      />
      <StockAdjustmentModal
        product={product!}
        open={stockModal}
        onClose={() => setStockModal(false)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Product</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
            <TableHead className="font-semibold">Price</TableHead>
            <TableHead className="font-semibold">Cost</TableHead>
            <TableHead className="font-semibold">
              {isOwner ? "Total Inventory" : "Inventory"}
            </TableHead>
            <TableHead className="font-semibold">
              {isOwner ? "Total Qty Sold" : "Qty Sold"}
            </TableHead>

            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell>
                {product.categoryProduct ? product.categoryProduct.name : "-"}
              </TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.cost}</TableCell>
              <TableCell>
                {isOwner
                  ? product.totalInventory ?? 0
                  : product.branchInventory?.inventory ?? 0}
              </TableCell>
              <TableCell>
                {isOwner
                  ? product.qtySold ?? 0
                  : product.branchInventory?.qtySold ?? 0}
              </TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell className="text-right">
                <div className="w-full  flex-1 flex justify-end">
                  <TableActions
                    showDelete
                    showEdit
                    showView
                    viewPermission="inventory.products.view"
                    editPermission="inventory.products.update"
                    permissionMode="disable"
                    onDelete={() => {
                      setProduct(product);
                      setIsOpen(true);
                    }}
                    onView={() =>
                      navigate(
                        `/inventory/product/product-details?productId=${product.id}`
                      )
                    }
                    onEdit={() =>
                      navigate(
                        `/inventory/product/product-details?productId=${product.id}`
                      )
                    }
                  />
                  <Button  variant={"secondary"} size={"icon"} onClick={() => {setStockModal(true), setProduct(product)}}>
                    <ArrowUpDown className="text-emerald-500"/>
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

export default ProductTable;
