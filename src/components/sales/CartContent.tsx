import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { CartProps } from "@/types/sale.types";

const CartContent = ({ cart, updateQuantity, removeFromCart,    }: CartProps) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Cart</h2>
      {cart.length === 0 && <p className="text-gray-500">Cart is empty</p>}

      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex justify-between items-center mb-2"
        >
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-600">
              ${Number(item.total).toFixed(2)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={1}
              value={item.quantity}
              className="w-16"
              onChange={(e) =>
                updateQuantity(item.productId, Number(e.target.value))
              }
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeFromCart(item.productId)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
