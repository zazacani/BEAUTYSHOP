import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import Header from "@/components/Header";
import ProductDetail from "@/components/ProductDetail";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import SearchDialog from "@/components/SearchDialog";
import serumImage1 from "@assets/generated_images/Luxury_face_serum_product_ebb63e00.png";
import serumImage2 from "@assets/generated_images/Face_serum_alternate_angle_d2eb6748.png";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

const mockProduct = {
  id: "1",
  title: "Sérum de Luxe pour le Visage",
  description:
    "Un sérum visage luxueux qui hydrate en profondeur et aide à réduire les signes de l'âge. Formulé avec des ingrédients premium pour une peau éclatante et rajeunie. Convient à tous les types de peau.",
  price: 89.90,
  image1: serumImage1,
  image2: serumImage2,
};

export default function ProductPage() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState("FR");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        isAuthenticated={false}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />

      <main className="flex-1 py-8">
        <ProductDetail
          title={mockProduct.title}
          description={mockProduct.description}
          price={mockProduct.price}
          image1={mockProduct.image1}
          image2={mockProduct.image2}
          deliveryEstimate="2-3 jours ouvrables"
          onAddToCart={(quantity) => {
            setCartItems((prev) => {
              const existing = prev.find((item) => item.id === mockProduct.id);
              if (existing) {
                return prev.map((item) =>
                  item.id === mockProduct.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                );
              }
              return [
                ...prev,
                {
                  id: mockProduct.id,
                  title: mockProduct.title,
                  price: mockProduct.price,
                  quantity,
                  image: mockProduct.image1,
                },
              ];
            });
            console.log(`Added ${quantity} items to cart`);
          }}
        />
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
