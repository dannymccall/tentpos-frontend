import type {
  BulkCategory,
  BulkUploadCustomers,
  BulkUploadProduct,
  BulkUploadSupplier,
} from "@/types/bulkupload.types";

export const bulkCategory: BulkCategory = {
  name: "",
  parentCategory: "",
  description: "",
};

export const bulkUploadProducts: BulkUploadProduct = {
  title: "",
  description: "",
  price: null,
  compareAtPrice: null,
  cost: null,
  sku: "",
  barcode: null,
  inventory: null,
  weight: null,
};

export const bulkUploadSupplier: BulkUploadSupplier = {
  name: "",
  email: "",
  phone: "",
  address: "",
  contactPerson: "",
  notes: "",
  openingBalance: null,
};

export const bulkUploadCustomers: BulkUploadCustomers = {
    firstName: "",
    lastName: "",
    email:"",
    phone: "",
    address: "",
    
}

export type AccountingFilterPayload = {
  startDate: string | null;
  endDate: string | null;
  branchId?: number | string;
};
