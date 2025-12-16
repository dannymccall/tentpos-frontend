import { useEffect, useState } from "react";
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
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { Product } from "@/types/product.types";
import { useApiMutation } from "@/hooks/useApiMutation";

const ADJUSTMENT_REASONS = [
  { label: "Broken / Damaged", value: "BROKEN", direction: "DECREASE" },
  { label: "Expired", value: "EXPIRED", direction: "DECREASE" },
  { label: "Lost / Missing", value: "LOST", direction: "DECREASE" },
  { label: "Found Extra Stock", value: "FOUND", direction: "INCREASE" },
  { label: "Restock", value: "RESTOCK", direction: "INCREASE" },
  { label: "Manual Correction", value: "CORRECTION", direction: "BOTH" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product;
}

export default function StockAdjustmentModal({
  open,
  onClose,
  product,
}: Props) {
  const [reason, setReason] = useState<any>(null);
  const [direction, setDirection] = useState<"INCREASE" | "DECREASE">(
    "DECREASE"
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!reason) return;
    if (reason.direction === "BOTH") return;
    setDirection(reason.direction);
  }, [reason]);

  const isDecrease = direction === "DECREASE";
  const inventory =
    product && product.branches && product.branches.length > 0
      ? product.branches[0].inventory
      : 0;
  const newStock = isDecrease ? inventory - quantity : inventory + quantity;

  const canSubmit = quantity > 0 && newStock >= 0 && reason;

  const { mutate: stockAdjustment, isPending } = useApiMutation({
    url: `/api/stock-adjustments/adjust`,
    method: "POST",
    invalidateKey: "/api/products/get-products",
    onSuccessCallback: () => {
      onClose();
    },
  });
  const handleSubmit = async () => {
    if (!canSubmit) return;
    console.log(product.id, quantity, reason.value, direction, note);
    stockAdjustment({
      productId: product.id,
      quantity,
      reason: reason.value,
      direction,
      note,
    });
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Product</Label>
            <div className="font-medium">{product.title}</div>
          </div>

          <div>
            <Label>Current Stock</Label>
            <div className="text-lg font-bold">{inventory}</div>
          </div>

          <div>
            <Label>Reason</Label>
            <Select
              onValueChange={(v) =>
                setReason(ADJUSTMENT_REASONS.find((r) => r.value === v))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {ADJUSTMENT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason?.direction === "BOTH" && (
            <div>
              <Label>Direction</Label>
              <Select
                value={direction}
                onValueChange={(v: any) => setDirection(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DECREASE">Decrease</SelectItem>
                  <SelectItem value="INCREASE">Increase</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Note (optional)</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Explain what happened"
            />
          </div>

          <div
            className={`p-3 rounded flex items-center gap-2 ${
              isDecrease
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {isDecrease ? (
              <AlertTriangle size={18} />
            ) : (
              <CheckCircle size={18} />
            )}
            <span>
              New Stock: <strong>{newStock}</strong>
            </span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!canSubmit || isPending} onClick={handleSubmit}>
            {isPending ? "Adjusting..." : "Adjust Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
