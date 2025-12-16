"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductBranch } from "@/types/product.types";
import { useApiMutation } from "@/hooks/useApiMutation";

interface LowStockIncreaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductBranch;
}

interface FormValues {
  quantity: number;
  note?: string;
}

export default function LowStockIncreaseModal({
  isOpen,
  onClose,
  product,
}: LowStockIncreaseModalProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { mutate: stockAdjustment, isPending } = useApiMutation({
    url: `/api/stock-adjustments/adjust`,
    method: "POST",
    invalidateKey: "/api/products/fetch-low-stock-products",
    onSuccessCallback: () => {
      onClose();
      reset()
    },
  });
  const onSubmit = async (data: FormValues) => {
    stockAdjustment({
      productId: product.productId,
      quantity: data.quantity,
      reason: "RESTOCK",
      direction: "INCREASE",
      note: data.note
    });
   
  };

  if (!product) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Increase Stock for {product.product.title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm mb-4 text-gray-600">
          <strong>Note:</strong> This action will be counted as a{" "}
          <strong>stock adjustment</strong>.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity to add</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              {...register("quantity", {
                required: true,
                valueAsNumber: true,
                min: 1,
              })}
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              type="text"
              {...register("note")}
              placeholder="Enter a note for this adjustment"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Increase Stock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
