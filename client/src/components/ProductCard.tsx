import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image1: string;
  image2: string;
  onAddToCart?: (id: string) => void;
  onProductClick?: (id: string) => void;
}

export default function ProductCard({
  id,
  title,
  price,
  image1,
  image2,
  onAddToCart,
  onProductClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      data-testid={`card-product-${id}`}
    >
      <CardContent className="p-0">
        <div
          className="relative aspect-square overflow-hidden bg-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            onProductClick?.(id);
            console.log(`Product ${id} clicked`);
          }}
        >
          <img
            src={isHovered ? image2 : image1}
            alt={title}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3
            className="font-semibold text-lg mb-2 line-clamp-2"
            data-testid={`text-product-title-${id}`}
          >
            {title}
          </h3>
          <p
            className="text-2xl font-bold"
            data-testid={`text-product-price-${id}`}
          >
            CHF {price.toFixed(2)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="default"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(id);
            console.log(`Added product ${id} to cart`);
          }}
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
