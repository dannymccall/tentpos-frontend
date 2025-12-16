import type { Supplier } from "./suppliers.types";

export type PurchaseItem = {
  id: number;
  purchaseId: number;
  productId: number;
  quantity: number;
  costPrice: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Purchase = {
      id: number;
   supplierId: number;
   receiptNumber?: string | null;
   purchaseDate?: Date | null;
   status: "draft" | "completed" | "cancelled";
   subtotal: number;
   tax: number;
   discount: number;
   total: number;
   amountPaid: number;
   balance: number;
   notes?: string | null;
   createdAt?: Date;
   updatedAt?: Date;
   items?:PurchaseItem
   tenantId: string;
   supplier: Supplier
};
