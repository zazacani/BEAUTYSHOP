import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, User, LogOut, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { totalItems, setCartOpen } = useCart();
  const [location, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <h1 className="text-2xl font-serif cursor-pointer" data-testid="link-home">
            MUE
          </h1>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" data-testid="link-products">
              {t("nav.products")}
            </Button>
          </Link>
          <Link href="/support">
            <Button variant="ghost" data-testid="link-support">
              {t("nav.support")}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" data-testid="button-language">
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage("fr")} data-testid="button-lang-fr">
                Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("de")} data-testid="button-lang-de">
                Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("en")} data-testid="button-lang-en">
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
            data-testid="button-cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full px-1 text-xs"
                data-testid="badge-cart-count"
              >
                {totalItems}
              </Badge>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-user-menu">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium" data-testid="text-user-name">{user.name}</p>
                  <p className="text-xs text-muted-foreground" data-testid="text-user-email">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => setLocation("/admin")} data-testid="link-admin">
                    <Shield className="mr-2 w-4 h-4" />
                    {t("nav.admin")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    setLocation("/");
                  }}
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" data-testid="link-login">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="link-register">
                  {t("nav.register")}
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
