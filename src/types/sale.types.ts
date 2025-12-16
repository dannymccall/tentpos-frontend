import type { Branch } from "./branch.type";
import type { Customer } from "./customer.types";
import type { User } from "./staff.type";

// types.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  images: Array<{ url: string }>;
  mostPurchased?: boolean;
  recent?: boolean;
  branches: {inventory: number}[];
}

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  total: number;
}

export type SaleItem = {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
  cost: number;
  product: Product
};

export type Invoice = {
  id: number;
  invoiceNumber: string;
  saleId: number;
  customerId?: number | null;
  amountDue: number;
  status: string; // PENDING | PAID | OVERDUE
  dueDate?: string | null;
  tenantId: string;
  branchId?: number;
  saleInvoice?: Sale;
  userSale: User;
  branchInvoice: Branch;
};

export type Sale = {
  id: number;
  saleNumber: string;
  customerId?: number | null;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod?: string | null;
  status: string; // PENDING | PAID | CANCELLED
  paymentStatus: string; // UNPAID | PARTIAL | PAID
  tenantId: string;
  branchId?: number;
  amountPaid: number;
  saleItems?: SaleItem[];
  customer?: Customer;
  branch?: Branch;
  invoice?: Invoice;
  balance: number;
  date: string;
};

// interface CartItem {
//   productId: number;
//   title: string;
//   quantity: number;
//   total: number;
// }

export interface CartProps {
  cart: CartItem[];
  totals: { total: number };
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  loading: boolean;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode?: "sale" | "checkout";
}

export type SaleReturnItem ={
     id: number;
   saleReturnId: number;
   saleItemId: number;
   productId: number;
   quantity: number;
   unitPrice: number;
   refundAmount: number;
   condition: "RESALEABLE" | "DAMAGED" | "EXPIRED";
   productItem: Product;
   createdAt: string
}
export interface SaleReturn {
   id: number;
   saleId: number;
   tenantId: string;
   branchId: number;
   totalRefund: number;
   refundMethod: "CASH" | "MOMO" | "BANK" | "STORE_CREDIT";
   reason: string;
   note?: string | null;
   userId: number;
   createdAt: number;
   updatedAt: number;
   sale: Sale,
   branchReturn: Branch;
   processedBy: User;
   items: SaleReturnItem[]
}