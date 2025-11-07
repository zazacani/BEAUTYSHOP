import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import SearchDialog from "@/components/SearchDialog";
import heroImage from "@assets/generated_images/Hero_banner_beauty_image_87edf850.png";
import serumImage1 from "@assets/generated_images/Luxury_face_serum_product_ebb63e00.png";
import serumImage2 from "@assets/generated_images/Face_serum_alternate_angle_d2eb6748.png";
import shampooImage1 from "@assets/generated_images/Premium_shampoo_bottle_50ecea27.png";
import shampooImage2 from "@assets/generated_images/Shampoo_bottle_back_view_3fb15117.png";
import moisturizerImage1 from "@assets/generated_images/Moisturizer_cream_jar_fc9bf9ed.png";
import moisturizerImage2 from "@assets/generated_images/Moisturizer_top_view_12d337a4.png";
import lipstickImage1 from "@assets/generated_images/Luxury_red_lipstick_011ccdfc.png";
import lipstickImage2 from "@assets/generated_images/Lipstick_angled_view_23e9c01e.png";
import eyeshadowImage1 from "@assets/generated_images/Luxury_eye_shadow_palette_60a3d393.png";

const mockProducts = [
  {
    id: "1",
    title: "Sérum de Luxe pour le Visage",
    price: 89.90,
    image1: serumImage1,
    image2: serumImage2,
  },
  {
    id: "2",
    title: "Shampooing Premium Cheveux",
    price: 45.50,
    image1: shampooImage1,
    image2: shampooImage2,
  },
  {
    id: "3",
    title: "Crème Hydratante Visage",
    price: 125.00,
    image1: moisturizerImage1,
    image2: moisturizerImage2,
  },
  {
    id: "4",
    title: "Rouge à Lèvres Luxe",
    price: 38.90,
    image1: lipstickImage1,
    image2: lipstickImage2,
  },
  {
    id: "5",
    title: "Palette Fards à Paupières",
    price: 67.50,
    image1: eyeshadowImage1,
    image2: eyeshadowImage1,
  },
  {
    id: "6",
    title: "Sérum Anti-Âge Premium",
    price: 149.00,
    image1: serumImage1,
    image2: serumImage2,
  },
  {
    id: "7",
    title: "Shampooing Réparateur",
    price: 52.00,
    image1: shampooImage1,
    image2: shampooImage2,
  },
  {
    id: "8",
    title: "Crème de Nuit Régénérante",
    price: 98.50,
    image1: moisturizerImage1,
    image2: moisturizerImage2,
  },
];

const mockCartItems = [
  {
    id: "1",
    title: "Sérum de Luxe pour le Visage",
    price: 89.90,
    quantity: 2,
    image: serumImage1,
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [language, setLanguage] = useState("FR");
  const [cartItems, setCartItems] = useState(mockCartItems);

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
          <ProductGrid
            products={mockProducts}
            onAddToCart={(id) => {
              const product = mockProducts.find((p) => p.id === id);
              if (product) {
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
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      quantity: 1,
                      image: product.image1,
                    },
                  ];
                });
                console.log(`Added product ${id} to cart`);
              }
            }}
            onProductClick={(id) => setLocation(`/product/${id}`)}
          />
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
        results={mockProducts.slice(0, 3).map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.image1,
        }))}
        onResultClick={(id) => {
          setLocation(`/product/${id}`);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
