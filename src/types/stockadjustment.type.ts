import type { Branch } from "./businessProfile.types";
import type { Product } from "./product.types";
import type { User } from "./staff.type";

export type StockAdjustment = {
   id: number;
   productId: number;
   branchId: number;
   qtyChange: number; // + or -
   reason:
    | "BROKEN"
    | "EXPIRED"
    | "LOST"
    | "FOUND"
    | "CORRECTION"
    | "RESTOCK";
   note?: string;
   userId: number;
   tenantId: string;
   createdAt?: Date;
   productStockAdjustment: Product,
   branchStockAdjustment: Branch,
   userStockAdjustment: User
}