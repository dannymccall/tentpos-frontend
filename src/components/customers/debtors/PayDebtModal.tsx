import { useState } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import type { Debtor } from "@/types/customer.types";
import { useApiMutation } from "@/hooks/useApiMutation";

interface PayDebtModalProps {
  open: boolean;
  onClose: () => void;
  debtor: Debtor;
}

export default function PayDebtModal({
  open,
  onClose,
  debtor,
}: PayDebtModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<string>("CASH");

  const handleSubmit = async () => {
    console.log(amount, method, debtor.customerId);
    makePayment({amount, method, customerId: debtor.customerId});
   
  };
 const { mutate: makePayment, isPending } = useApiMutation({
    url: `/api/payments`,
    method: "POST",
    invalidateKey: "/api/payments",
    onSuccessCallback: () => {
      
    },
  });
  if (!debtor) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Debt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Customer</Label>
            <Input
              value={`${debtor.customerDebtor.firstName} ${debtor.customerDebtor.lastName}`}
              disabled
            />
          </div>

          <div>
            <Label>Total Owed</Label>
            <Input value={debtor.totalOwed} disabled />
          </div>

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              min={0}
              max={debtor.totalOwed}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CARD">Card</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
                <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Processing..." : "Pay Debt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
