import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApiMutation } from "@/hooks/useApiMutation";
import FormLoading from "../loaders/FormLoading";

interface ExpenseFormData {
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  id?:number
  // recurring: boolean;
  // recurrenceFrequency?: "weekly" | "monthly" | "yearly";
  // recurrenceEndDate?: string;
}

const categories = [
  "Office Supplies",
  "Travel",
  "Utilities",
  "Salaries",
  "Other",
];
const frequencies = ["weekly", "monthly", "yearly"];

export default function ExpenseCreation({
  expense,
  mode,
}: {
  expense?: ExpenseFormData;
  mode?: "add" | "edit" | "delete";
}) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<ExpenseFormData>({
    defaultValues: {
      title: "",
      amount: 0,
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      ...expense,
      // recurring: false,
      // recurrenceFrequency: undefined,
      // recurrenceEndDate: undefined,
    },
  });

  console.log({ expense });

  useEffect(() => {
    if (!expense) return;
    if (expense) reset({ category: expense.category });
  }, [expense]);

  // const watchRecurring = watch("recurring");
  const isEdit = mode === "edit";
  const url = isEdit ? `/api/expenses/update?id=${expense?.id}` : `/api/expenses/create`;
  const method = isEdit ? "PUT" : "POST";
  const { mutate: expenseMutation, isPending } = useApiMutation({
    url,
    method,
    invalidateKey: `/api/expenses`,
    onSuccessCallback: () => {

    }
  });
  const { mutate: createExpense, isPending:creationPending, } = useApiMutation({
    url:`/api/expenses/create`,
    method:"POST",
    invalidateKey: `/api/expenses`,
  });

  // -----------------------------
  // onSubmit handler
  // -----------------------------
  const onSubmit = async (
    data: ExpenseFormData,
    submitType: "update" | "new"
  ) => {
    console.log({ data, submitType });
    if (submitType === "new") {
      // ignore expense id and submit as new
      createExpense({ ...data, id: undefined });
    } else {
      // update existing expense (if expense exists)
      expenseMutation({
        ...data,
        id: expense?.title ? expense.title : undefined,
      });
    }
  };

  return (
    <Card
      className={`shadow-lg rounded-2xl ${
        expense ? "w-full shadow-none" : "max-w-xl"
      }  mx-auto p-2`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold tracking-wide">
          {mode === "add" && "Create Expense"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, "update"))}
          className="space-y-6"
        >
          {/* TITLE */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter expense title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* AMOUNT */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", {
                required: "Amount is required",
                valueAsNumber: true,
              })}
            />
            {errors.amount && (
              <p className="text-red-500 text-xs">{errors.amount.message}</p>
            )}
          </div>

          {/* CATEGORY */}
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Controller
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-xs">{errors.category.message}</p>
            )}
          </div>

          {/* DATE */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: "Date is required" })}
            />
            {errors.date && (
              <p className="text-red-500 text-xs">{errors.date.message}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add notes (optional)"
              {...register("description")}
            />
          </div>

          {/* RECURRING SWITCH */}
          <div className="flex items-center justify-between">
            {/* <div className="space-y-1">
              <Label htmlFor="recurring">Recurring Expense</Label>
              <p className="text-xs text-muted-foreground">
                Enable if this expense repeats over time
              </p>
            </div> */}
            {/* <Controller
              name="recurring"
              control={control}
              render={({ field }) => (
                <Switch
                  id="recurring"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            /> */}
          </div>

          {/* RECURRING SECTION */}
          {/* {watchRecurring && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/30 animate-in fade-in-50 duration-300">
              <div className="space-y-1.5">
                <Label htmlFor="recurrenceFrequency">Frequency</Label>
                <Controller
                  name="recurrenceFrequency"
                  control={control}
                  rules={{
                    required: "Frequency is required for recurring expenses",
                  }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.recurrenceFrequency && (
                  <p className="text-red-500 text-xs">
                    {errors.recurrenceFrequency.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="recurrenceEndDate">End Date (optional)</Label>
                <Input type="date" {...register("recurrenceEndDate")} />
              </div>
            </div>
          )} */}

          {/* SUBMIT BUTTONS */}
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={isPending}
              className=" text-base"
              onClick={handleSubmit((data) => onSubmit(data, "update"))}
            >
              {isPending ? (
                <FormLoading />
              ) : isEdit ? (
                "Update Expense"
              ) : (
                "Create Expense"
              )}
            </Button>
            {isEdit && (
              <Button
                type="button"
                disabled={creationPending}
                className=" text-base"
                variant={"secondary"}
                onClick={handleSubmit((data) => onSubmit(data, "new"))}
              >
                {creationPending ? "Submitting..." : "Submit as New Expense"}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
