import type { Branch } from "./businessProfile.types";
import type { Category } from "./category.types";

export type ProductImage = {
       id: number;
   productId: number;
   url: string;
   alt?: string | null;
   order?: number | null;
}
export type ProductVariant = {
      id: number;
   productId: number;
   sku?: string | null;
   price?: number | null;
   inventory?: number | null;
   options: { name: string; value: string }[];
}

export type Product = {
      id: number;
   title: string;
   description?: string | null;
   categoryId?: number;
   brand?: number;
   price: number;
   compareAtPrice?: number | null;
   cost?: number | null;
   sku?: string | null;
   barcode?: string | null;
   inventory?: number | null;
   trackInventory?: boolean;
   status?: "draft" | "active";
   tags?: string[] | null;
   weight?: string | null;
   dimensions?: {
    width?: string;
    height?: string;
    depth?: string;
  } | null;
   branchId: number;
  totalInventory: number;
  branchInventory: {inventory: number, branchId: number, qtySold:number}
  branches: {inventory: number, branchId: number, qtySold:number}[];
  // associations (not persisted)
   variants?: ProductVariant[] | any;
   images?: ProductImage[];
   categoryProduct: Category;
   qtySold: number;
   threshold?: number | null;
}

export type ProductBranch = {
     id: number;
   productId: number;
   branchId: number;
   qtySold?: number;
   price: number | null; // optional override
   inventory: number;
   reorderLevel?: number | null;
   tenantId: string;
   isActive?: boolean; // visible in this branch
   product: Product;
   branchInfo: Branch

}