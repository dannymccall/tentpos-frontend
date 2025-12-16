import { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Sale, SaleItem } from "@/types/sale.types";
import { useApiMutation } from "@/hooks/useApiMutation";
import FormLoading from "../loaders/FormLoading";

interface ReturnSaleModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale;
}

type ReturnFormValues = {
  items: {
    saleItemId: number;
    productId: number;
    quantitySold: number;
    quantityToReturn: number;
    condition: "RESALEABLE" | "DAMAGED" | "EXPIRED";
  }[];
  reason: string;
  refundMethod: "CASH" | "MOMO" | "BANK" | "STORE_CREDIT";
  note?: string;
};

export default function ReturnSaleModal({
  open,
  onClose,
  sale,
}: ReturnSaleModalProps) {
  const { control, register, handleSubmit, watch, reset } =
    useForm<ReturnFormValues>({
      defaultValues: {
        items:
          sale &&
          sale.saleItems?.map((item) => ({
            saleItemId: item.id,
            productId: item.productId,
            quantitySold: item.quantity,
            quantityToReturn: 0,
            condition: "RESALEABLE",
          })),
        reason: "",
        refundMethod: "CASH",
        note: "",
      },
    });

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!sale) return;
    reset({
      items:
        sale &&
        sale.saleItems?.map((item) => ({
          saleItemId: item.id,
          productId: item.productId,
          quantitySold: item.quantity,
          quantityToReturn: 0,
          condition: "RESALEABLE",
        })),
      reason: "",
      refundMethod: "CASH",
      note: "",
    });
  }, [sale]);
  const watchedItems = watch("items");

  const totalRefund = useMemo(() => {
    if (!sale) return 0;
    if (!sale.saleItems) return null;

    return watchedItems.reduce((sum, item) => {
      const saleItem = sale.saleItems?.find((si) => si.id === item.saleItemId);
      if (!saleItem) return sum;
      return sum + item.quantityToReturn * saleItem.price;
    }, 0);
  }, [watchedItems, sale, JSON.stringify(watchedItems)]);
  const { mutate: returnSale, isPending } = useApiMutation({
    url: `/api/sales/return`,
    method: "POST",
    invalidateKey: "/api/sales",
    onSuccessCallback: () => {
      onClose();
    },
  });

  const onSubmit = async (data: ReturnFormValues) => {
    const payload = {
      saleId: sale.id,
      items: data.items.filter((i) => i.quantityToReturn > 0),
      reason: data.reason,
      refundMethod: data.refundMethod,
      note: data.note,
    };
    console.log(payload);
    if (payload.items.length === 0) return;
    returnSale(payload);
  };

  console.log(sale);

  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Return Items — Sale #{sale.saleNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ⚠️ This action will create a <strong>return record</strong>, adjust
            inventory, and may issue a refund. This cannot be undone.
          </p>

          {/* Sale Items */}
          <div className="space-y-3">
            {fields.map((field, index) => {
              const saleItem = sale.saleItems?.find(
                (i) => i.id === field.saleItemId
              ) as SaleItem;

              return (
                <div
                  key={field.id}
                  className="grid grid-cols-5 gap-3 items-end border p-3 rounded-lg"
                >
                  <div className="col-span-2">
                    <Label>Product</Label>
                    <Input
                      value={saleItem && saleItem.product.title}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>Sold</Label>
                    <Input value={saleItem && saleItem.quantity} disabled />
                  </div>

                  <div>
                    <Label>Return Qty</Label>
                    <Input
                      type="number"
                      min={0}
                      max={saleItem && saleItem.quantity}
                      {...register(`items.${index}.quantityToReturn`, {
                        valueAsNumber: true,
                        min: 0,
                        max: saleItem && saleItem.quantity,
                      })}
                    />
                  </div>

                  <div>
                    <Label>Condition</Label>
                    <Controller
                      control={control}
                      name={`items.${index}.condition`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="RESALEABLE">
                              Resaleable
                            </SelectItem>
                            <SelectItem value="DAMAGED">Damaged</SelectItem>
                            <SelectItem value="EXPIRED">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reason */}
          <div>
            <Label>Reason for return</Label>
            <Input
              {...register("reason", { required: true })}
              placeholder="e.g. Defective product"
            />
          </div>

          {/* Refund */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Refund Method</Label>
              <Controller
                control={control}
                name="refundMethod"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="MOMO">MoMo</SelectItem>
                      <SelectItem value="BANK">Bank</SelectItem>
                      <SelectItem value="STORE_CREDIT">Store Credit</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Total Refund</Label>
              <Input value={totalRefund?.toFixed(2)} disabled />
            </div>
          </div>

          {/* Note */}
          <div>
            <Label>Note (optional)</Label>
            <Input {...register("note")} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? <FormLoading /> : "Process Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
