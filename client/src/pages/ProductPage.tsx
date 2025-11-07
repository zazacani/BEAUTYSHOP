import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import SearchDialog from "@/components/SearchDialog";
import { api } from "@/lib/api";
import type { Product } from "@shared/schema";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ProductPage() {
  const [match, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<"FR" | "DE" | "EN">("FR");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", params?.id],
    queryFn: () => api.products.getById(params!.id),
    enabled: !!params?.id,
  });

  if (!match || !params?.id) {
    setLocation("/");
    return null;
  }

  const getLocalizedData = (prod: Product) => ({
    title: prod[`title${language}` as keyof Product] as string,
    description: prod[`description${language}` as keyof Product] as string,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        currentLanguage={language}
        onLanguageChange={(lang) => setLanguage(lang as "FR" | "DE" | "EN")}
        isAuthenticated={false}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      <main className="flex-1 py-8">
        {isLoading ? (
          <div className="text-center py-12">Chargement...</div>
        ) : product ? (
          <ProductDetail
            title={getLocalizedData(product).title}
            description={getLocalizedData(product).description}
            price={parseFloat(product.price)}
            image1={product.imageUrl1}
            image2={product.imageUrl2}
            deliveryEstimate="2-3 jours ouvrables"
            onAddToCart={(quantity) => {
              const localized = getLocalizedData(product);
              setCartItems((prev) => {
                const existing = prev.find((item) => item.id === product.id);
                if (existing) {
                  return prev.map((item) =>
                    item.id === product.id
                      ? { ...item, quantity: item.quantity + quantity }
                      : item
                  );
                }
                return [
                  ...prev,
                  {
                    id: product.id,
                    title: localized.title,
                    price: parseFloat(product.price),
                    quantity,
                    image: product.imageUrl1,
                  },
                ];
              });
              console.log(`Added ${quantity} items to cart`);
            }}
          />
        ) : (
          <div className="text-center py-12">Produit non trouvé</div>
        )}
      </main>

      <Footer />

      <ShoppingCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, quantity) => {
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
          );
        }}
        onRemoveItem={(id) => {
          setCartItems((prev) => prev.filter((item) => item.id !== id));
        }}
        onApplyDiscount={(code) => console.log(`Discount code: ${code}`)}
        onCheckout={() => setLocation("/checkout")}
      />

      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={(query) => console.log("Search:", query)}
        results={[]}
        onResultClick={(id) => {
          setLocation(`/product/${id}`);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
