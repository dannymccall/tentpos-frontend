import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/types/sale.types";
import { useFetchCustomers } from "@/hooks/useFetchCustomers";

interface Customer {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CheckoutProps {
  cartItems: CartItem[];
  customer: Customer;
  handleSubmitCheckout: (data: any) => Promise<any> | any;
}

export default function EcommerceCheckoutPage({
  cartItems,
  customer,
  handleSubmitCheckout
}: CheckoutProps) {
  const form = useForm({
    defaultValues: {
      fullName: customer?.name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      city: "",
      region: "",
      paymentMethod: "online",
      tax: 0,
      amountPaid: 0,
    },
  });

  const { register, watch } = form;
  const [loading, setLoading] = useState(false);
  const { customers } = useFetchCustomers();
  const [customerId, setCustomerId] = useState<string | number | null>(null);

  const subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = Number(watch("tax") || 0);
  const amountPaid = Number(watch("amountPaid") || 0);

  const total = subTotal + tax;
  const balance = total - amountPaid;

  const onSubmit = async () => {
     if (!cartItems.length) return alert("Cart is empty");
    const payload = {
      saleItems: cartItems.map((p:any) => ({
        productId: p.productId,
        quantity: p.quantity,
        price: Number(p.price),
        total:Number(p.total),
      })),
      subtotal: subTotal,
      tax: 0,
      discount: 0,
      total: total,
      amountPaid: amountPaid
    };
    console.log("Submitting Checkout:", payload);
    handleSubmitCheckout(payload);
  };

  return (
    <div className=" w-full mt-6">
     
      {/* LEFT SECTION */}
      <div className="space-y-6">

        {/* Customer Select */}
        <div className="space-y-2 p-3">
          <Label>Select Customer</Label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={customerId || ""}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">Guest Customer</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.firstName} {cust.lastName}
              </option>
            ))}
          </select>
        </div>


        {/* Payment Inputs */}
        <div className="space-y-4 p-3">
          <div>
            <Label>Tax (GHS)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("tax")}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Amount Paid (GHS)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("amountPaid")}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION — ORDER SUMMARY */}
      <div className="bg-white shadow rounded-xl p-6 space-y-4">

        <h2 className="text-xl font-semibold">Order Summary</h2>

        {cartItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <p>
              {item.title} ×{" "}
              <span className="font-medium">{item.quantity}</span>
            </p>
            <p className="font-semibold">
              {item.price * item.quantity} GHS
            </p>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold">{subTotal.toFixed(2)} GHS</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span className="font-semibold">{tax.toFixed(2)} GHS</span>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)} GHS</span>
        </div>

        <div className="flex justify-between text-base">
          <span>Amount Paid</span>
          <span>{amountPaid.toFixed(2)} GHS</span>
        </div>

        <div className="flex justify-between text-base font-semibold">
          <span>Balance</span>
          <span className={balance > 0 ? "text-red-600" : "text-green-600"}>
            {balance.toFixed(2)} GHS
          </span>
        </div>

        <Button
          className="w-full mt-4"
          disabled={loading}
          onClick={form.handleSubmit(onSubmit)}
        >
          {loading ? "Processing..." : "Complete Checkout"}
        </Button>
      </div>
    </div>
  );
}
