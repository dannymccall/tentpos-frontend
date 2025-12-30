import  { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import DialogModal from "../Dialog";
import type { Customer } from "@/types/customer.types";
import InvoiceView from "./InvoiceView";
import { formatDate } from "@/lib/helperFunctions";
// Schema
const money = z.string().regex(/^\d+(?:\.\d{1,2})?$/, "Invalid amount");

const itemSchema = z.object({
  productId: z.string().min(1, "Select product"),
  quantity: z.string().regex(/^\d+$/, "Enter quantity"),
  price: money.optional().or(z.literal("")),
  total: money.optional().or(z.literal("0.00")),
});

const saleSchema = z.object({
  customerId: z.string().optional().or(z.literal("")),
  items: z.array(itemSchema).min(1, "Add at least one item"),
  discount: money.optional().or(z.literal("")),
  tax: money.optional().or(z.literal("")),
  paymentMethod: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  date: z.string().optional(),
  amountPaid: z.string().or(z.literal("0.00")),
  status: z.string().optional().or(z.null()),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export default function SaleForm({
  mode = "add",
  defaultValues,
  onSubmit,
  loading = false,
  customers = [],
  products = [],
}: {
  mode?: "add" | "edit";
  defaultValues?: Partial<SaleFormValues>;
  onSubmit: (data: any) => Promise<any> | any;
  loading?: boolean;
  customers: Customer[];
  products: Array<{ id: string; title: string; price?: number }>;
}) {
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [latestInvoice, setLatestInvoice] = useState<any>(null);
  const [error, setError] = useState<{ isError: boolean; message: string }>({
    isError: false,
    message: "",
  });

  console.log(defaultValues)
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerId: "",
      items: [{ productId: "", quantity: "1", price: "0.00", total: "0.00" }],
      discount: "",
      tax: "",
      paymentMethod: "",
      notes: "",
      amountPaid: "0.00",
      ...defaultValues,
    },
  });

  const getButtonLabel = (mode: "add" | "edit", status?: string) => {
    switch (true) {
      // New sale that is on hold
      case mode === "add":
        return "Create Sale";

      // New sale that is not on hold
      case mode === "edit" && status === "HOLD":
        return "Complete Sale";

      // Editing a sale
      case mode === "edit":
        return "Cancel Sale";

      default:
        return "Submit";
    }
  };

  useEffect(() => {
    if (!defaultValues) return;
    if (!products.length) return;
    if (!customers.length) return;

    const safeValues: any = {
      customerId: defaultValues.customerId
        ? String(defaultValues.customerId)
        : "",
      discount: defaultValues.discount ?? 0,
      tax: defaultValues.tax ?? 0,
      amountPaid: defaultValues.amountPaid ?? 0,
      paymentMethod: defaultValues.paymentMethod ?? "",

      date:
        formatDate(defaultValues.date) ?? new Date().toISOString().slice(0, 10),

      // ITEMS
      items:
        (defaultValues as any).saleItems?.map((item: any) => ({
          id: item.id ?? undefined,
          productId: item.productId ? String(item.productId) : "",
          quantity: item.quantity ? String(item.quantity) : "1",
          price: item.price ?? 0,
          total: item.total ?? 0,
          // any other fields you use in SaleItem
        })) ?? [],
    };

    form.reset(safeValues);
  }, [defaultValues, products, customers]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (!fields.length) {
      append({ productId: "", quantity: "1", price: "0.00", total: "0.00" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProductChange = (index: number, productId: string) => {
    const p = products.find((x) => String(x.id) === String(productId));
    const price =
      p?.price != null ? String(Number(p.price).toFixed(2)) : "0.00";
    form.setValue(`items.${index}.price` as any, price);
    const qty = Number(form.watch(`items.${index}.quantity`));
    form.setValue(
      `items.${index}.total` as any,
      (qty * Number(price)).toFixed(2)
    );
  };

  const watchedItems = form.watch("items") ?? [];
  const watchedTax = Number(form.watch("tax") || 0);
  const watchedDiscount = Number(form.watch("discount") || 0);
  const watchedAmountPaid = Number(form.watch("amountPaid") || 0);
  const calcTotals = useMemo(() => {
    const subtotal = watchedItems.reduce(
      (s: number, it: any) => s + Number(it.total || 0),
      0
    );

    const total = subtotal + watchedTax - watchedDiscount;
    const balance = total - watchedAmountPaid;

    return { subtotal, total, balance };
  }, [
    JSON.stringify(watchedItems),
    watchedTax,
    watchedDiscount,
    watchedAmountPaid,
  ]);

  const submit = async (
    vals: SaleFormValues,
    hold: boolean,
    type?: "partial" | "complete"
  ) => {
    setError({ isError: false, message: "" });
    const saleItems = vals.items.map((it) => ({
      productId: Number(it.productId),
      quantity: Number(it.quantity),
      price: Number(it.price || 0),
      total: Number(it.total || 0),
    }));

    const payload = {
      customerId: vals.customerId ? Number(vals.customerId) : null,
      saleItems,
      tax: Number(vals.tax || 0),
      discount: Number(vals.discount || 0),
      paymentMethod: vals.paymentMethod || "",
      notes: vals.notes || "",
      date: vals.date,
      amountPaid: Number(vals.amountPaid),
      holdSale: hold,
    };
    console.log(payload);
    const subtotal = saleItems?.reduce(
      (s, it) => s + Number(it.total || it.price * it.quantity),
      0
    );
    const isPartial = payload.amountPaid < subtotal;
    if (isPartial && type === "complete") {
      console.log("partial");
      setError({
        isError: true,
        message:
          "Amount paid is less than total. For partial sales, please use the 'Partial Sale' button.",
      });
      return;
    }

    if (isPartial && type === "partial" && payload.customerId == null) {
      setError({
        isError: true,
        message: "Please select a customer for partial payments.",
      });
      return;
    }

    let result;
    if (defaultValues && defaultValues?.status === "HOLD") {
      result = await onSubmit({
        saleId: (defaultValues as any).id,
        amountPaid: payload.amountPaid,
        paymentMethod: payload.paymentMethod,
        tax: payload.tax,
        discount: payload.discount,
        status: "HOLD"
      });
    } else {
      result = await onSubmit(payload);
    }

    // if result contains invoice, show modal
    if (result && result.invoice && result.sale) {
      setLatestInvoice(result);
      setInvoiceModalOpen(true);
    }

    return result;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>{mode === "add" ? "Create Sale" : "Edit Sale"}</CardTitle>
          <div>
            {" "}
            <strong>
              {mode === "edit" && (defaultValues as any)?.saleNumber}
            </strong>{" "}
          </div>
        </CardHeader>
        <div>
          {error.isError && (
            <div className="bg-red-100 text-red-700 p-3 m-4 rounded">
              {error.message}
            </div>
          )}
        </div>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => submit(data, false))}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <Select
                          value={String(field.value)}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select customer (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {`${c.firstName} ${c.lastName}`}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Select
                            value={String(field.value)}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              {/* <SelectItem value="card">Card</SelectItem> */}
                              <SelectItem value="mobile">Mobile</SelectItem>
                              {/* <SelectItem value="online">Online</SelectItem> */}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-3" />
              </div>

              <div className="space-y-3">
                {fields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="grid grid-cols-12 gap-2 items-end border rounded p-3"
                  >
                    <div className="col-span-6">
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
                                  const value = e.target.value;
                                  field.onChange(value);
                                  const qty = Number(value);
                                  const price = Number(
                                    form.getValues(`items.${idx}.price`) || 0
                                  );
                                  form.setValue(
                                    `items.${idx}.total`,
                                    (qty * price).toFixed(2),
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                      shouldValidate: false,
                                    }
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
                        name={`items.${idx}.price` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                  const price = Number(value);
                                  const qty = Number(
                                    form.getValues(`items.${idx}.quantity`) || 0
                                  );
                                  form.setValue(
                                    `items.${idx}.total`,
                                    (qty * price).toFixed(2),
                                    {
                                      shouldDirty: true,
                                      shouldTouch: true,
                                    }
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
                              <Input {...field} readOnly />
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
                        size={"sm"}
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
                    size={"sm"}
                    onClick={() =>
                      append({
                        productId: "",
                        quantity: "1",
                        price: "0.00",
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
                <div className="md:col-span-2">
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
                </div>
                <div />
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
                {/* Reset the form */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>

                {/* Hold the sale (partial/incomplete) */}
                {((defaultValues && defaultValues!.status !== "HOLD" &&
                  defaultValues!.status !== "COMPLETED") ||  mode === "add") && (
                    <Button
                      type="submit"
                      disabled={loading}
                      variant="outline"
                      onClick={form.handleSubmit((data) => submit(data, true))}
                    >
                      Hold Sale
                    </Button>
                  )}
                <Button
                  type="submit"
                  disabled={loading}
                  variant="outline"
                  onClick={form.handleSubmit((data) =>
                    submit(data, false, "partial")
                  )}
                  className="bg-amber-600 text-slate-100 hover:bg-amber-400"
                >
                  Partial Sale
                </Button>

                {/* Complete or cancel the sale depending on mode */}
                <Button
                  type="submit"
                  disabled={loading}
                  variant={
                    mode === "edit" && defaultValues?.status !== "HOLD"
                      ? "destructive"
                      : (defaultValues as any)?.status === "HOLD"
                      ? "default"
                      : "default"
                  }
                  onClick={form.handleSubmit((data) =>
                    submit(data, false, "complete")
                  )}
                >
                  {getButtonLabel(mode, (defaultValues as any)?.status)}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* invoice modal */}

      <DialogModal
        open={invoiceModalOpen}
        setOpen={setInvoiceModalOpen}
        size="w-[400px]"
        // title={}
      >
        {latestInvoice ? (
          <InvoiceView
            invoice={latestInvoice.invoice}
            sale={latestInvoice.sale}
            tenant={{ name: "My Shop", logoUrl: "/logo.png" }}
            onClose={() => setInvoiceModalOpen(false)}
            onPay={() => console.log("Pay")}
            onDownload={() => console.log("Download PDF")}
            onPrint={() => window.print()}
          />
        ) : (
          <div>Preparing invoice...</div>
        )}
      </DialogModal>
    </div>
  );
}
