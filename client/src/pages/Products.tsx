import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Star } from "lucide-react";
import type { Product } from "@shared/schema";
import Navbar from "@/components/Navbar";

interface ProductWithReviews extends Product {
  ratingAverage: number;
  ratingCount: number;
}

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const { t, language } = useLanguage();

  const { data: products, isLoading } = useQuery<ProductWithReviews[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product) => {
    if (!searchQuery) return true;
    const title = product[`title${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Product] as string;
    const description = product[`description${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Product] as string;
    return (
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif mb-4" data-testid="text-products-title">
            {t("products.title")}
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={t("products.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-products"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12" data-testid="text-loading">
            {t("common.loading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts?.map((product) => {
              const titleKey = `title${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Product;
              const descKey = `description${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Product;
              const altKey = `altText${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof Product;
              
              return (
                <Card key={product.id} className="flex flex-col group" data-testid={`card-product-${product.id}`}>
                  <CardHeader className="p-0 relative overflow-hidden">
                    <img
                      src={product.imageUrl1}
                      alt={product[altKey] as string}
                      className="w-full h-64 object-cover rounded-t-md transition-opacity duration-300 group-hover:opacity-0"
                      data-testid={`img-product-${product.id}`}
                    />
                    <img
                      src={product.imageUrl2}
                      alt={product[altKey] as string}
                      className="w-full h-64 object-cover rounded-t-md absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      data-testid={`img-product-hover-${product.id}`}
                    />
                  </CardHeader>
                  <CardContent className="flex-1 p-6">
                    <CardTitle className="mb-2 font-bold" data-testid={`text-product-title-${product.id}`}>
                      {product[titleKey] as string}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mb-4 text-sm" data-testid={`text-product-desc-${product.id}`}>
                      {product[descKey] as string}
                    </CardDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2" data-testid={`text-product-rating-${product.id}`}>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-4 h-4 ${
                                starIndex <= Math.round(product.ratingAverage)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                        {product.ratingCount > 0 ? (
                          <span className="text-sm text-muted-foreground">
                            {product.ratingAverage.toFixed(1)} ({product.ratingCount})
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">{t("products.noReviews")}</span>
                        )}
                      </div>
                      <p className="text-2xl font-bold" data-testid={`text-product-price-${product.id}`}>
                        CHF {product.price}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button
                      className="w-full"
                      disabled={product.quantityInStock === 0}
                      data-testid={`button-add-to-cart-${product.id}`}
                    >
                      {t("products.addToCart")}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
