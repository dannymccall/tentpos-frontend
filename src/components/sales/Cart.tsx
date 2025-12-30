import  { useState, useRef,  } from "react";
import { Button } from "@/components/ui/button";
import {  Undo2, X } from "lucide-react";
import type { CartProps } from "@/types/sale.types";
import CartContent from "./CartContent";
import EcommerceCheckoutPage from "./Checkout";

interface CartPropsExtended extends CartProps {
  handleSubmitCheckout: (data: any) => Promise<any> | any;
}

export default function Cart({
  cart,
  totals,
  updateQuantity,
  removeFromCart,
  loading,
  open,
  setOpen,
  handleSubmitCheckout,
}: CartPropsExtended) {
  //   const [open, setOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"sale" | "checkout">("sale");

  // Close dropdown if clicked outside
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
  //       setOpen(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [cartRef]);
  const subTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const renderCartItems = () => {
    if (cart.length === 0) {
      return (
        <div className="p-2">
          <p className="text-gray-500">Cart is empty</p>
        </div>
      );
    }
    switch (mode) {
      case "sale":
        return (
          <CartContent
            cart={cart}
            totals={totals}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            loading={loading}
            open={open}
            setOpen={setOpen}
            // handleSubmit={handleSubmit}
          />
        );
      case "checkout":
        return (
          <EcommerceCheckoutPage
            handleSubmitCheckout={handleSubmitCheckout}
            cartItems={cart}
            customer={{}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon */}

      {/* Dropdown Cart */}
      <div
        className={`absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg transition-all duration-300 transform origin-top ${
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {" "}
        {mode === "checkout" && (
          <div className="p-2 flex justify-between items-center border-b">
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={() => setMode("sale")}
            >
              <Undo2 />
            </Button>
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>
        )}
        {renderCartItems()}
        {mode === "sale" && cart.length > 0 && (
          <div className="p-4 border-t">
            <div className="mt-4 font-semibold">
              Total: ${Number(subTotal).toFixed(2)}
            </div>
            <Button
              className="w-full mt-2"
              onClick={() => setMode("checkout")}
              disabled={loading}
            >
              {"Proceed to checkout"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
