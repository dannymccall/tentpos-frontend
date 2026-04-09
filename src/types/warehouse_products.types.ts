import type { Product } from "./product.types";

export interface WarehouseProducts {
  wareouseId: number;
  quantity: number;
  Product: Product;
}
