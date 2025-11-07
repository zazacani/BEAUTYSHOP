import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import SearchDialog from "@/components/SearchDialog";
import heroImage from "@assets/generated_images/Hero_banner_beauty_image_87edf850.png";
import { api } from "@/lib/api";
import type { Product } from "@shared/schema";

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

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: api.products.getAll,
  });

  const getLocalizedProduct = (product: Product) => {
    return {
      id: product.id,
      title: product[`title${language}` as keyof Product] as string,
      price: parseFloat(product.price),
      image1: product.imageUrl1,
      image2: product.imageUrl2,
    };
  };

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
          title="Beauté Suisse"
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
            <ProductGrid
              products={products.map(getLocalizedProduct)}
              onAddToCart={(id) => {
                const product = products.find((p) => p.id === id);
                if (product) {
                  const localized = getLocalizedProduct(product);
                  setCartItems((prev) => {
                    const existing = prev.find((item) => item.id === id);
                    if (existing) {
                      return prev.map((item) =>
                        item.id === id
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                      );
                    }
                    return [
                      ...prev,
                      {
                        id: localized.id,
                        title: localized.title,
                        price: localized.price,
                        quantity: 1,
                        image: localized.image1,
                      },
                    ];
                  });
                  console.log(`Added product ${id} to cart`);
                }
              }}
              onProductClick={(id) => setLocation(`/product/${id}`)}
            />
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
          const localized = getLocalizedProduct(p);
          return {
            id: localized.id,
            title: localized.title,
            price: localized.price,
            image: localized.image1,
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
