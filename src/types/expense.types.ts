import type { Branch } from "./businessProfile.types";

export interface Expense {
  data: Array<{
    id: number;
    title: string;
    amount: number;
    category: string;
    description?: string;
    date: string;
    recurring: boolean;
    recurrenceFrequency?: "weekly" | "monthly" | "yearly";
    recurrenceEndDate?: string | null;
    tenantId: string;
    branchId: number;
    createdAt?: Date;
    updatedAt?: Date;
    branchExpense: Branch;
  }>;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export type ExpenseProps = {
  id: number;
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  recurring: boolean;
  recurrenceFrequency?: "weekly" | "monthly" | "yearly";
  recurrenceEndDate?: string | null;
  tenantId: string;
  branchId: number;
  createdAt?: Date;
  updatedAt?: Date;
  branchExpense: Branch;
};
