import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import SearchDialog from "@/components/SearchDialog";
import heroImage from "@assets/generated_images/Hero_banner_beauty_image_87edf850.png";
import { api } from "@/lib/api";
import type { Product } from "@shared/schema";

interface ProductWithReviews extends Product {
  ratingAverage: number;
  ratingCount: number;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState<"FR" | "DE" | "EN">("FR");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { data: products = [], isLoading } = useQuery<ProductWithReviews[]>({
    queryKey: ["/api/products"],
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

      <main className="flex-1">
        <Hero
          title="MUE"
          subtitle="Découvrez notre collection de produits de beauté premium"
          ctaText="Découvrir la collection"
          ctaLink="#products"
          backgroundImage={heroImage}
        />

        <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-4xl font-serif font-bold mb-8 text-center">
            Nos Produits
          </h2>
          {isLoading ? (
            <div className="text-center py-12">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const titleKey = `title${language}` as keyof Product;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => {
                      setCartItems((prev) => {
                        const existing = prev.find((item) => item.id === product.id);
                        if (existing) {
                          return prev.map((item) =>
                            item.id === product.id
                              ? { ...item, quantity: item.quantity + 1 }
                              : item
                          );
                        }
                        return [
                          ...prev,
                          {
                            id: product.id,
                            title: product[titleKey] as string,
                            price: parseFloat(product.price),
                            quantity: 1,
                            image: product.imageUrl1,
                          },
                        ];
                      });
                      console.log(`Added product ${product.id} to cart`);
                    }}
                    onClick={() => setLocation(`/product/${product.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
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
        results={products.slice(0, 3).map((p) => {
          const titleKey = `title${language}` as keyof Product;
          return {
            id: p.id,
            title: p[titleKey] as string,
            price: parseFloat(p.price),
            image: p.imageUrl1,
          };
        })}
        onResultClick={(id) => {
          setLocation(`/product/${id}`);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
