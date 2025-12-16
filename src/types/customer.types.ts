import type { Branch } from "./businessProfile.types";

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tenantId: string;
  branchId?: number | null;
};
export type Debtor = {
     customerId: number;
   totalOwed: number;
   oldestDebtDate: Date;
   lastSaleDate: Date;
   status: "ACTIVE" | "CLEARED" | "BLOCKED";
   tenantId: string;
   branchId:number;
   customerDebtor: Customer
   branchDebtor: Branch,
   id: number
}