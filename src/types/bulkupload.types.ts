export type BulkCategory = {
    name:string;
    parentCategory:string;
    description: string
}

export type BulkUploadProduct = {
      id?: number | null;
       title: string;
       description?: string | null;
       price: number | null;
       compareAtPrice?: number | null;
       cost?: number | null;
       sku?: string | null;
       barcode?: string | null;
       inventory?: number | null;
       weight?: string | null;
}

export type BulkUploadSupplier = {
      name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
  openingBalance?: number | null;
}

export type BulkUploadCustomers = {
    firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}