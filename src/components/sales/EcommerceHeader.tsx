import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";

interface EcommerceHeaderProps {
  cartCount: number;
  searchValue?: string;
  onSearch?: (value: string) => void;
  onClickCart: () => void;
}

export default function EcommerceHeader({
  cartCount,
  searchValue = "",
  onSearch,
  onClickCart,
}: EcommerceHeaderProps) {
  return (
    <div className="w-full flex  md:justify-end justify-start p-2 md:p-0">
      <div className="flex gap-3 items-center w-full md:w-auto">
        {/* Search box */}
        <Input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => onSearch && onSearch(e.target.value)}
          className="placeholder:text-slate-400 border-gray-500 focus:ring-2 focus:ring-blue-500 transition-all rounded-md w-full md:w-64 text-sm"
        />

        {/* Shopping cart */}
        <div
          className="flex items-center gap-2 bg-[#eff2f7] p-2 rounded-lg cursor-pointer hover:bg-[#e0e5f2] transition"
          onClick={onClickCart}
        >
          <span className="text-xs">
            <ShoppingCart size={20} className="text-gray-700" />
          </span>
          <span className="font-medium text-gray-800">{cartCount}</span>
        </div>
      </div>
    </div>
  );
}
