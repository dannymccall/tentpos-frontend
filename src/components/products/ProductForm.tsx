import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import FormLoading from "../loaders/FormLoading";
import { useFetchCategories } from "@/hooks/useFetchCatgories";
import InventoryUpdate from "./InventoryUpdate";
import type { Product } from "@/types/product.types";
// Types & Schema
const money = z
  .string()
  .regex(/^\d+(?:\.\d{1,2})?$/, "Enter a valid amount (e.g. 9.99)");
//   .transform((s) => parseFloat(s));

const variantOptionSchema = z.object({
  name: z.string().min(1, "Option name required"),
  values: z
    .array(z.string().min(1, "Value required"))
    .min(1, "Add at least one value"),
});

const productSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  categoryId: z.string(),
  brand: z.string().optional(),
  price: money,
  compareAtPrice: money.optional().or(z.null()),
  cost: money.optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  inventory: z.string().optional(),
  trackInventory: z.boolean().optional(),
  status: z.enum(["draft", "active"]).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.any()).optional(),
  weight: z.string().optional(),
  dimensions: z
    .object({
      width: z.string().optional(),
      height: z.string().optional(),
      depth: z.string().optional(),
    })
    .optional(),
  variants: z.array(variantOptionSchema).optional(),
  threshold: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

// Example category list - in real app pass this as prop or fetch

interface Props {
  mode?: "add" | "edit";
  product?: Partial<Product> | null;
  categories?: string[];
  loading?: boolean;
  onSubmit: (data: ProductFormValues) => void | Promise<void>;
}

export default function ProductForm({
  mode = "add",
  product = null,
  loading = false,
  onSubmit,
}: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      brand: "",
      price: "0" as any,
      compareAtPrice: undefined,
      cost: undefined,
      sku: "",
      barcode: "",
      inventory: "",
      trackInventory: false,
      status: "draft",
      tags: [],
      images: [],
      weight: "",
      dimensions: { width: "", height: "", depth: "" },
      variants: [],
    },
  });
  const { categories: cat } = useFetchCategories();
  const [qty, setQty] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  console.log({ cat });
  // Field arrays for tags and variants
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  } as any);

  console.log(tagFields, appendTag, removeTag)
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  console.log(product);
  useEffect(() => {
    if (!product) return;
    if (!cat || cat.length === 0) return;

    form.reset({
      title: product.title ?? "",
      description: product.description ?? "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
      brand: product.brand ? String(product.brand) : "",
      price: (product.price ?? 0).toString(),
      compareAtPrice: String(product.compareAtPrice!),
      cost: String(product.cost!),
      sku: product.sku ?? "",
      barcode: product.barcode ?? "",
      inventory:
        product && product.branchInventory
          ? String(product.branchInventory.inventory)
          : product.branches?.length! > 0 ? String(product.branches![0].inventory) :  "",
      trackInventory: product.trackInventory ?? false,
      status: product.status?.toLowerCase() === "active" ? "active" : "draft",
      tags: product.tags ?? [],
      images: product.images ?? [],
      weight: product.weight ?? "",
      dimensions: product.dimensions ?? { width: "", height: "", depth: "" },
      variants: product.variants ?? [],
    });
  }, [product, cat]);

  // Image handling (local preview). In real app upload to CDN in onChange or onSubmit
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const current = form.getValues("images") || [];
    const mapped = fileArray.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    form.setValue("images", [...current, ...mapped]);
  };

  const removeImage = (index: number) => {
    const imgs = form.getValues("images") || [];
    const removed = imgs.filter((_, i) => i !== index);
    form.setValue("images", removed);
  };

  const submitHandler = async (vals: ProductFormValues) => {
    // Convert price strings to numbers were needed already handled by Zod transform - but ensure
    // In this example money fields are transformed in schema, but react-hook-form will give strings
    // We'll just forward the shape to onSubmit and let API handle the rest; you can mutate here.
    const payLoad = {
      ...vals,
      price: Number(vals.price),
      cost: Number(vals.cost),
      brand: isNaN(Number(vals.brand)) ? null : Number(vals.brand),
    };
    const formData = new FormData();
    (Object.keys(payLoad) as Array<keyof typeof payLoad>).forEach((key) => {
      const value = payLoad[key];
      console.log(value);
      if (value !== undefined && value !== null) {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((item: any) => {
            const actualFile = item?.file;
            if (actualFile instanceof File) {
              formData.append("images", actualFile);
            }
          });
        } else if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value)); // ✅ for objects/arrays that are NOT files
        } else {
          formData.append(key, String(value));
        }
      }
    });
    await onSubmit(formData as any);
  };

  const handleUpdate = (value: string) => {
    console.log(value);
    const inventory = form.getValues("inventory");
    const newqty = Number(inventory! as any) + Number(value);
    form.setValue("inventory", String(newqty));
    setOpen(false);
  };

  return (
    <div className="p-4">
      <InventoryUpdate
        qty={qty!}
        setQty={setQty}
        open={open}
        setOpen={setOpen}
        handleUpdate={handleUpdate}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "add" ? "Create Product" : "Edit Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="space-y-6"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description (rich editor could be swapped in) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder="Long description or HTML"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={String(field.value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {cat.map((c) => (
                              <SelectItem key={c.id} value={String(c.id)}>
                                {c.name}
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

                {/* <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Brand (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </div>

              {/* Price block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0.00" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare At Price</FormLabel>
                      <FormControl>
                        <Input {...field as any} placeholder="Optional" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <div className="md:col-span-2">

                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Cost to you (optional)"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>

              {/* Inventory & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SKU (optional)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Barcode */}
                {/* <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Barcode / UPC" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                {/* Barcode */}
                <FormField
                  control={form.control}
                  name="threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Threshold</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Threshold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Inventory + Button (only on edit mode) */}
                {mode === "edit" && (
                  <>
                    <div className="flex flex-col space-y-2">
                      <FormField
                        control={form.control}
                        name="inventory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inventory</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} disabled/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Track Inventory switch */}
              <FormField
                control={form.control}
                name="trackInventory"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Track Inventory</FormLabel>
                      <FormMessage />
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(v)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex gap-2 flex-wrap mb-2">
                  {(form.getValues("tags") || []).map(
                    (t: string, i: number) => (
                      <Badge key={i} className="capitalize">
                        {t}
                        <button
                          type="button"
                          onClick={() => {
                            const arr = form.getValues("tags") || [];
                            arr.splice(i, 1);
                            form.setValue("tags", arr);
                          }}
                          className="ml-2 text-xs opacity-70"
                        >
                          ✕
                        </button>
                      </Badge>
                    )
                  )}
                </div>

                <div className="flex gap-2">
                  <Input
                    id="tag-input"
                    placeholder="Add tag and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (!val) return;
                        const existing = form.getValues("tags") || [];
                        form.setValue("tags", [...existing, val]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>
              </FormItem>

              {/* Images */}
              <FormItem>
                <FormLabel>Images</FormLabel>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(form.getValues("images") || []).map(
                    (img: any, i: number) => (
                      <div
                        key={i}
                        className="relative border rounded overflow-hidden"
                      >
                        <img
                          src={img.preview || img.url}
                          alt={`img-${i}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-white rounded px-1"
                          onClick={() => removeImage(i)}
                        >
                          x
                        </button>
                      </div>
                    )
                  )}
                </div>
              </FormItem>

              {/* Variants */}
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Variants</FormLabel>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() =>
                      appendVariant({ name: "Size", values: ["S", "M"] })
                    }
                  >
                    Add Variant
                  </Button>
                </div>

                <div className="space-y-3 mt-3">
                  {variantFields.map((vf, idx) => (
                    <div key={vf.id} className="border p-3 rounded">
                      <div className="flex gap-2 items-center">
                        <Controller
                          control={form.control}
                          name={`variants.${idx}.name` as any}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Variant name (e.g. Color)"
                            />
                          )}
                        />
                        <div className="flex-1">
                          <Controller
                            control={form.control}
                            name={`variants.${idx}.values` as any}
                            render={({ field }) => (
                              <Input
                                value={(field.value || []).join(", ")}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      .split(",")
                                      .map((s: string) => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                                placeholder="Comma separated values e.g. Red, Blue, Green"
                              />
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeVariant(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </FormItem>

              {/* Dimensions & Weight */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. 1.2 kg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensions.width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="cm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensions.height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="cm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <FormLoading />
                  ) : mode === "add" ? (
                    "Create Product"
                  ) : (
                    "Update Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
