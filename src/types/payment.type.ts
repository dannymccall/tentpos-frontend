import type { Branch } from "./businessProfile.types";
import type { Customer } from "./customer.types";
import type { Sale } from "./sale.types";
import type { User } from "./staff.type";

export type Payment = {
  id: number;
  saleId: number;
  amount: number;
  method: "CASH" | "MOMO" | "BANK" | "CRYPTO";
  tenantId: string;
  branchId: number;
  userId: number;
  description: string;
  customerId: number;
  salePayment: Sale;
  customerPayment: Customer;
  branchPayment: Branch;
  userPayment: User
};

export interface PaymentProps {
    payments: Payment[]
}