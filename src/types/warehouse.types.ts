import type { Branch } from "./businessProfile.types";
import type { Product } from "./product.types";
import type { User } from "./staff.type";

export interface Warehouse {
  name: string;
  description?: string | null;
  tenantId: string;
  location?: string | null;
  userId: number; // userId
  id?: number;
}

export interface StockTransfer {
  id: number;

  reference: string; // e.g. TRF-20260406-0001

  type: "warehouse_to_warehouse" | "warehouse_to_branch";

  fromWarehouseId: number;
  toWarehouseId: number;
  toBranchId: number;

  status: "pending" | "completed" | "cancelled";

  notes: string | null;

  userId: number; // user/admin

  tenantId: string;

  createdAt?: Date;
  updatedAt?: Date;
  fromWarehouse: Warehouse;
  toWarehouse: Warehouse;
  toBranch: Branch;
  User: User;
  products: StockTransferProduct[];
}

export interface StockTransferProduct {
  id: number;

  transferId: number;
  productId: number;

  quantity: number;

  // Optional but powerful
  sourceQuantityBefore: number | null;
  sourceQuantityAfter: number | null;
  Product: Product;
  destinationQuantityBefore: number | null;
  destinationQuantityAfter: number | null;
  tenantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
