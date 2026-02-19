import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
      <CategoryForm
        mode="add"
        loading={isPending}
        onSubmit={(data) => categoryMutation(data)}
      />
    </div>
  );
}
