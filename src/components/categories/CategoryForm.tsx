import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import type { Category } from "@/types/category.types";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is too short"),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const parentOptions = [
  "electronics",
  "fashion",
  "groceries",
  "beauty",
  "home_kitchen",
  "health_pharmacy",
  "hardware",
  "stationery",
  "automotive",
  "services",
  "food_restaurant",
  "agriculture",
  "entertainment",
  "baby_kids",
  "sports_fitness",
];

interface Props {
  mode: "add" | "edit";
  category?: Category | null;
  loading?: boolean;
  onSubmit: (data: CategoryFormData) => void;
}

export default function CategoryForm({
  mode,
  category,
  loading,
  onSubmit,
}: Props) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategory: "",
    },
  });

  // Safely load edit data
  useEffect(() => {
    if (category && mode === "edit") {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        parentCategory: category.parentCategory || "",
      });
    }
  }, [category, form.reset]);

  return (
    <div className="flex justify-center p-4">
      <Card className="max-w-xl w-full shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {mode === "add" ? "Add New Category" : ""}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Phones, Shoes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Category */}
              <FormField
                control={form.control}
                name="parentCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category (optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a parent category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentOptions.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Describe the category..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading
                  ? "Processing..."
                  : mode === "add"
                  ? "Create Category"
                  : "Update Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
