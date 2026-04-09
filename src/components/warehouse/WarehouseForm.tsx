import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../Button";
import type { Warehouse } from "@/types/warehouse.types";
import { useEffect } from "react";

type WarehouseFormValues = {
  name: string;
  description?: string;
  location?: string;
};

interface WarehouseFormProps {
  data?: Warehouse;
  mode?: "create" | "edit";
  onSubmitWarehouse: (data: WarehouseFormValues) => void | Promise<void>;
  isPending?: boolean;
}

export default function WarehouseForm({
  data,
  mode = "create",
  isPending,
  onSubmitWarehouse,
}: WarehouseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormValues>();

  const onSubmit = async (data: WarehouseFormValues) => {
    onSubmitWarehouse(data);
  };

  useEffect(() => {
    if (!data) return;

    reset({
      name: data.name,
      location: data.location!,
      description: data.description!,
    });
  }, [data]);

  return (
    <div className="w-full flex justify-center items-center ">
      <Card className="w-full   rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-sm md:text-base font-semibold">
            {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Set up or manage a warehouse to handle inventory and stock
            movements.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Warehouse Name</Label>
              <Input
                id="name"
                placeholder="e.g. Main Warehouse"
                {...register("name", {
                  required: "Warehouse name is required",
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. Accra, Ghana"
                {...register("location")}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional details about this warehouse..."
                rows={4}
                {...register("description")}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size={"sm"}
                onClick={() => reset()}
              >
                Cancel
              </Button>

              <Button variant="primary" loading={isPending} size={"sm"}>
                {mode === "create" ? "Create Warehouse" : "Update Warehouse"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
