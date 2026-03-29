import { useState } from "react";
import {

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
import DialogModal from "@/components/Dialog";

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
    // console.log(amount, method, debtor.customerId);
    makePayment({ amount, method, customerId: debtor.customerId });
  };
  const { mutate: makePayment, isPending } = useApiMutation({
    url: `/api/payments`,
    method: "POST",
    invalidateKey: "/api/customers/debtors",
    onSuccessCallback: () => {},
  });
  if (!debtor) {
    return null;
  }

  return (
    <DialogModal
      open={open}
      setOpen={onClose}
      title={<DialogTitle className="text-sm md:text-base">Pay Debt</DialogTitle>}
    >
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
        <div className="flex w-full justify-center gap-3"> 

        <Button variant="outline" onClick={onClose} size={"sm"}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "Processing..." : "Pay Debt"}
        </Button>
        </div>
      </DialogFooter>
    </DialogModal>
  );
}
