export type Supplier = {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
  openingBalance?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};
