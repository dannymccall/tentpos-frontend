import { useState, useMemo, useEffect } from "react";
import type { Product, CartItem, Invoice, Sale } from "../../types/sale.types";

import EcommerceHeader from "./EcommerceHeader";
import Cart from "./Cart";
import DialogModal from "../Dialog";
import InvoiceView from "./InvoiceView";
import { useFetchCategories } from "@/hooks/useFetchCatgories";
import { Badge } from "../ui/badge";
import ProductCard from "./ProductCard";
import { Button } from "../Button";

interface AddSalePageProps {
  products: { products: Product[]; mostPurchasedProducts: Product[] };
  onSubmit: (payload: any) => Promise<{ invoice?: Invoice; sale: Sale }>;
  loading?: boolean;
  onClickCategory?: (categoryId: number | "ALL") => void;
  searchValue?: string;
  onSearch?: (value: string) => void;
}

export default function AddSalePage({
  products,
  onSubmit,
  loading = false,
  onClickCategory,
  onSearch,
  searchValue = "",
}: AddSalePageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [latestInvoice, setLatestInvoice] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | "ALL">("ALL");
  const { categories } = useFetchCategories();
  const [scrolled, setScrolled] = useState<boolean>(false);

  // console.log("Products:", products);
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.productId === product.id);
      if (exists) {
        return prev.map((p) =>
          p.productId === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                total: (p.quantity + 1) * p.price,
              }
            : p,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          // image: product.images[0].url,
          quantity: 1,
          total: product.price,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) =>
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  const updateQuantity = (productId: number, qty: number) =>
    setCart((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity: qty, total: qty * p.price }
          : p,
      ),
    );

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, p) => sum + p.total, 0);
    return { subtotal, total: subtotal };
  }, [cart]);

  const handleSubmit = async (payload: any) => {
    const result = await onSubmit(payload);

    if (result && result.invoice && result.sale) {
      setCart([]);
      setLatestInvoice(result);
      setInvoiceModalOpen(true);
    }
  };

  const handleClickCategory = (categoryId: number | "ALL") => {
    setActiveCategory(categoryId);
    if (onClickCategory) {
      onClickCategory(categoryId);
    }
  };

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled((prev) => {
            if (!prev && window.scrollY > 150) return true;
            if (prev && window.scrollY < 100) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="bg-white p-4 rounded-md">
      {/* Sections */}
      {!scrolled && (
        <div className="my-4">
          <EcommerceHeader
            cartCount={cart.length}
            onClickCart={() => setOpen((p) => !p)}
            onSearch={onSearch}
            searchValue={searchValue}
          />

          <Cart
            cart={cart}
            totals={totals}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            loading={loading}
            open={open}
            setOpen={setOpen}
            handleSubmitCheckout={handleSubmit}
          />

          <section className="mb-4  mt-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge className="text-xs bg-primary">Filter by Category</Badge>
              <Button
                size="sm"
                variant={activeCategory === "ALL" ? "primary" : "ghost"}
                onClick={() => handleClickCategory("ALL")}
              >
                All
              </Button>

              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={activeCategory === cat.id ? "primary" : "ghost"}
                  onClick={() => handleClickCategory(cat.id)}
                  className="text-xs border py-1"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </section>
        </div>
      )}

      {scrolled && (
        <div
          className="
      fixed top-0 right-0 z-50 w-full
      bg-[#0f172b]/80 backdrop-blur
      shadow-lg h-32
      transition-all duration-300 ease-in-out
      animate-in slide-in-from-top
    "
        >
          <div className="mr-10 mt-2">
            <EcommerceHeader
              cartCount={cart.length}
              onClickCart={() => setOpen((p) => !p)}
              onSearch={onSearch}
              searchValue={searchValue}
            />
          </div>
          <Cart
            cart={cart}
            totals={totals}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            loading={loading}
            open={open}
            setOpen={setOpen}
            handleSubmitCheckout={handleSubmit}
          />

          <section className="mb-2 ml-5 mt-5  transition-all duration-300">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge>Filter by Category</Badge>

              <Button
                size="sm"
                variant={activeCategory === "ALL" ? "primary" : "ghost"}
                onClick={() => handleClickCategory("ALL")}
              >
                All
              </Button>

              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={activeCategory === cat.id ? "primary" : "ghost"}
                  onClick={() => handleClickCategory(cat.id)}
                  className="text-xs border border-gray-500 text-slate-50"
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </section>
        </div>
      )}

      {Object.values(products).length > 0 &&
        products.mostPurchasedProducts.length > 0 && (
          <section className="mb-6 ">
            <h2 className="text-base md:text-lg font-bold mb-4 text-center">
              Top Products
            </h2>
            <div className="flex  gap-5  overflow-x-auto">
              {products.mostPurchasedProducts
                .sort(
                  (a, b) =>
                    Number((a as any).totalSold) - Number((b as any).totalSold),
                )
                .map((p) => (
                  <ProductCard product={p} addToCart={() => addToCart(p)} />
                ))}
            </div>
          </section>
        )}

      <section className="mb-6 w-full">
        <h2 className="text-xl font-bold mb-4 text-center">All Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2  md:gap-4">
          {products?.products?.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              addToCart={() => addToCart(p)}
            />
          ))}
        </div>
      </section>

      <DialogModal
        open={invoiceModalOpen}
        setOpen={setInvoiceModalOpen}
        size="w-[400px]"
        // title={}
      >
        {latestInvoice ? (
          <InvoiceView
            invoice={latestInvoice.invoice}
            sale={latestInvoice.sale}
            tenant={{ name: "My Shop", logoUrl: "/logo.png" }}
            onClose={() => setInvoiceModalOpen(false)}
            onPay={() => console.log("Pay")}
            onDownload={() => console.log("Download PDF")}
            onPrint={() => window.print()}
          />
        ) : (
          <div>Preparing invoice...</div>
        )}
      </DialogModal>
    </div>
  );
}
