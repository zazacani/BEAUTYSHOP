import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";
import SearchDialog from "@/components/SearchDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const [match, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const { language } = useLanguage();
  const { addToCart, updateQuantity, cartItems } = useCart();

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", params?.id],
    queryFn: () => api.products.getById(params!.id),
    enabled: !!params?.id,
  });

  if (!match || !params?.id) {
    setLocation("/");
    return null;
  }

  const languageKey = language.charAt(0).toUpperCase() + language.slice(1);
  const getLocalizedData = (prod: Product) => ({
    title: prod[`title${languageKey}` as keyof Product] as string,
    description: prod[`description${languageKey}` as keyof Product] as string,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

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
              addToCart({
                id: product.id,
                title: localized.title,
                price: parseFloat(product.price),
                image: product.imageUrl1,
              }, quantity);
              console.log(`Added ${quantity} items to cart`);
            }}
          />
        ) : (
          <div className="text-center py-12">Produit non trouvé</div>
        )}
      </main>

      <Footer />

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
