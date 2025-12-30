import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


import { useApiMutation } from "@/hooks/useApiMutation";
import CategoryForm from "./CategoryForm";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is too short"),
  description: z.string().optional(),
  parentCategory: z.string().optional(),
});


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
