import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import type { Category } from "@/types/category.types";
import { useApiMutation } from "@/hooks/useApiMutation";
import FormLoading from "../loaders/FormLoading";
import CategoryForm from "./CategoryForm";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is too short"),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
});

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
type addCategory = z.infer<typeof categorySchema>;

export default function AddCategory() {
  const form = useForm<addCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", parentCategory: "" },
  });

  const { mutate: categoryMutation, isPending } = useApiMutation({
    url: `/api/categories/add-category`,
    method: "POST",
    invalidateKey: "/api/categories/get-categories",
    onSuccessCallback: () => {
      form.reset();
    },
  });

  return (
    <div className="flex justify-center p-4 mb-auto">
      <Card className="max-w-xl w-full shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Add New Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            mode="add"
            loading={isPending}
            onSubmit={(data) => categoryMutation(data)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
