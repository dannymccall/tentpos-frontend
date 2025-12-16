import React, { useEffect, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toCapitalized } from "@/lib/helperFunctions";

// Schema
const money = z.string().regex(/^\d+(?:\.\d{1,2})?$/, "Invalid amount");

const itemSchema = z.object({
  productId: z.string().min(1, "Select product"),
  quantity: z.string().regex(/^\d+$/, "Enter quantity"),
  costPrice: money,
  total: money,
});

const purchaseSchema = z.object({
  supplierId: z.string().min(1),
  receiptNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  status: z.enum(["draft", "completed", "cancelled"]).optional(),
  items: z.array(itemSchema).min(1, "Add at least one item"),
  tax: money.optional().or(z.literal("")),
  discount: money.optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  amountPaid: money.optional().or(z.literal("")),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

export default function PurchaseForm({
  mode = "add",
  defaultValues,
  onSubmit,
  loading = false,
  suppliers = [],
  products = [],
}: {
  mode?: "add" | "edit";
  defaultValues?: Partial<PurchaseFormValues>;
  onSubmit: (data: any) => Promise<void> | void;
  loading?: boolean;
  suppliers: Array<{ id: string; name: string }>;
  products: Array<{ id: string; title: string; costPrice?: number }>;
}) {
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: "",
      receiptNumber: "",
      purchaseDate: new Date().toISOString().slice(0, 10),
      status: "draft",
      items: [{ productId: "", quantity: "1", costPrice: "0.00" }],
      tax: "",
      discount: "",
      notes: "",
      amountPaid: "",
      ...defaultValues, 
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if(!suppliers || suppliers.length === 0) return;
    if(!products) return;
    if (!defaultValues) return;
      form.reset({
        ...defaultValues,
        supplierId: String(defaultValues.supplierId),
        status: defaultValues.status,
        items: defaultValues.items?.map((it) => ({
          ...it,
          productId: String(it.productId),
          quantity: String(it.quantity)
        })),
      });
  }, [defaultValues, form.reset]);
  // when product selected, populate costPrice
  const onProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    const cost =
      product?.costPrice != null
        ? String(product.costPrice.toFixed(2))
        : "0.00";
    form.setValue(`items.${index}.costPrice` as any, cost);
    const qty = Number(form.getValues(`items.${index}.quantity`));
    form.setValue(
      `items.${index}.total` as any,
      (qty * Number(cost)).toFixed(2)
    );
  };

  const calcTotals = useMemo(() => {
    const items = form.getValues("items") || [];
    const subtotal = items.reduce(
      (s: number, it: any) => s + Number(it.total || 0),
      0
    );
    const tax = Number(form.getValues("tax") || 0);
    const discount = Number(form.getValues("discount") || 0);
    const total = subtotal + tax - discount;
    const amountPaid = Number(form.getValues("amountPaid") || 0);
    const balance = total - amountPaid;
    return { subtotal, tax, discount, total, amountPaid, balance };
  }, [
    form.watch("items"),
    form.watch("tax"),
    form.watch("discount"),
    form.watch("amountPaid"),
  ]);

  useEffect(() => {
    // ensure at least one empty row
    if (!fields.length)
      append({
        productId: "",
        quantity: "1",
        costPrice: "0.00",
        total: "0.00",
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (vals: PurchaseFormValues) => {
    // convert strings to numbers where necessary
    const items = vals.items.map((it) => ({
      productId: Number(it.productId),
      quantity: Number(it.quantity),
      costPrice: Number(it.costPrice),
      total: Number(it.total),
    }));

    const header = {
      supplierId: Number(vals.supplierId),
      receiptNumber: vals.receiptNumber,
      purchaseDate: vals.purchaseDate,
      status: vals.status,
      tax: Number(vals.tax),
      discount: Number(vals.discount),
      amountPaid: Number(vals.amountPaid),
      notes: vals.notes,
    };

    console.log(items, header);
    await onSubmit({ items, header });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "add" ? "Create Purchase" : "Edit Purchase"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((s) => (
                              <SelectItem key={s.id} value={String(s.id)}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receiptNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ref / Receipt #</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Purchase ref" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-12 gap-2 items-end border rounded p-3"
                  >
                    <div className="col-span-5">
                      <FormField
                        control={form.control}
                        name={`items.${idx}.productId` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product</FormLabel>
                            <FormControl>
                              <Select
                                value={String(field.value)}
                                onValueChange={(v) => {
                                  field.onChange(String(v));
                                  onProductChange(idx, v);
                                }}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  {products.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                      {p.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${idx}.quantity` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qty</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(String(e));
                                  const qty = Number(e.target.value || 0);
                                  const cp = Number(
                                    form.getValues(`items.${idx}.costPrice`) ||
                                      0
                                  );
                                  form.setValue(
                                    `items.${idx}.total`,
                                    (qty * cp).toFixed(2)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${idx}.costPrice` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  const cp = Number(e.target.value || 0);
                                  const qty = Number(
                                    form.getValues(`items.${idx}.quantity`) || 0
                                  );
                                  form.setValue(
                                    `items.${idx}.total`,
                                    (qty * cp).toFixed(2)
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`items.${idx}.total` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total</FormLabel>
                            <FormControl>
                              <Input
                                {...field} readOnly
                                onChange={(e) => field.onChange(e)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="col-span-1 flex gap-2 justify-end">
                      <Button
                        type="button"
                        disabled={loading}
                        variant="destructive"
                        onClick={() => remove(idx)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex">
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      append({
                        productId: "",
                        quantity: "1",
                        costPrice: "0.00",
                        total: "0.00",
                      })
                    }
                  >
                    Add item
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount paid</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(e) => field.onChange(e)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {["draft", "completed", "cancelled"].map((s, i) => (
                              <SelectItem key={i} value={s}>
                                {toCapitalized(s)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <div>Subtotal: {calcTotals.subtotal.toFixed(2)}</div>
                <div>Total: {calcTotals.total.toFixed(2)}</div>
                <div>Balance: {calcTotals.balance.toFixed(2)}</div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {mode === "add" ? "Create Purchase" : "Update Purchase"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
