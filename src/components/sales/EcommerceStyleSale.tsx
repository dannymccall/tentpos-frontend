import { useState, useMemo, useEffect } from "react";
import type { Product, CartItem, Invoice, Sale } from "../../types/sale.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import EcommerceHeader from "./EcommerceHeader";
import Cart from "./Cart";
import NoImage from "../../../public/no-image.png";
import DialogModal from "../Dialog";
import InvoiceView from "./InvoiceView";
import { useFetchCategories } from "@/hooks/useFetchCatgories";
import { Badge } from "../ui/badge";

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

  console.log("Products:", products);
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
            : p
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
          : p
      )
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
    const onScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      {/* Sections */}
      {!scrolled && (
        <div className="mb-4">
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

          <section className="mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge>Filter by Category</Badge>
              <Button
                size="sm"
                variant={activeCategory === "ALL" ? "default" : "outline"}
                onClick={() => handleClickCategory("ALL")}
              >
                All
              </Button>

              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  onClick={() => handleClickCategory(cat.id)}
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
      bg-neutral-900/80 backdrop-blur
      shadow-lg
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

          <section className="mb-2 md:ml-64 mt-3 md:mt-0 transition-all duration-300">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge>Filter by Category</Badge>

              <Button
                size="sm"
                variant={activeCategory === "ALL" ? "default" : "outline"}
                onClick={() => handleClickCategory("ALL")}
              >
                All
              </Button>

              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={activeCategory === cat.id ? "default" : "outline"}
                  onClick={() => handleClickCategory(cat.id)}
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
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Top Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
              {products.mostPurchasedProducts
                .sort(
                  (a, b) =>
                    Number((a as any).totalSold) - Number((b as any).totalSold)
                )
                .map((p) => (
                  <Card
                    key={p.id}
                    className="hover:shadow-lg shadow-none transition cursor-pointer bg-[#eff2f7]"
                  >
                    <CardContent>
                      <div className="flex justify-end mb-3">
                        <Badge>Stock: {p.branches[0].inventory}</Badge>
                      </div>
                      <img
                        src={
                          p && p.images.length > 0 ? p.images[0].url : NoImage
                        }
                        className="w-full h-40 object-cover mb-2 rounded"
                      />
                      <div className="font-semibold">{p.title}</div>
                      <div className="text-gray-600 mb-2">
                        ${Number(p.price).toFixed(2)}
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => addToCart(p)}
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6  ">
          {Object.values(products).length > 0 &&
            products.products
              // .filter((p) => p.recent)
              .map((p) => (
                <Card
                  key={p.id}
                  className="hover:shadow-lg transition cursor-pointer bg-[#eff2f7] shadow-none"
                >
                  <CardContent>
                    <div className="flex justify-end mb-3">
                      <Badge>
                        Stock:{" "}
                        {p && p.branches.length > 0
                          ? p.branches[0].inventory
                          : 0}
                      </Badge>
                    </div>
                    <img
                      src={p && p.images.length > 0 ? p.images[0].url : NoImage}
                      className="w-full h-40 object-cover mb-2 rounded"
                    />
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-gray-600 mb-2">
                      ${Number(p.price).toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => addToCart(p)}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
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
