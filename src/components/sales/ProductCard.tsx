"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import NoImage from "../../../public/no-image.png";
import { FaPlus } from "react-icons/fa";
import { Button } from "../Button";

export interface Product {
  id: number;
  title: string;
  price: number;
  images: { url: string }[];
  branches: { inventory: number }[];
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const stock = product.branches?.[0]?.inventory ?? 0;
  const image = product.images?.[0]?.url ?? NoImage;

  return (
    <Card
      key={product.id}
      className="w-64 md:w-11/12 place-self-center md:place-self-start shadow-none"
    >
      <CardContent className="p-0 rounded-lg transition-shadow shadow-md hover:shadow-xl cursor-pointer">
        {/* Product Image & Stock */}
        <div className="bg-[#d0d3db] rounded-t-lg p-3 flex flex-col items-center">
          <div className="w-full flex justify-end mb-2">
            <Badge variant="outline" className="border border-primary">Stock: {stock}</Badge>
          </div>

          <img
            src={image}
            alt={product.title}
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg mb-2"
          />

          <div className="font-semibold text-gray-800 text-center">
            {product.title}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="p-3 flex flex-col gap-2">
          <div className="text-gray-600 flex text-sm md:text-base font-medium w-full justify-between items-center">
            ${Number(product.price).toFixed(2)}
            <Button
              size="sm"
              className="  hover:bg-secondary-foreground text-white text-xs"
              onClick={() => addToCart(product)}
            >
              <span className="text-[9px]">
                {" "}
                <FaPlus className="" />
              </span>
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
