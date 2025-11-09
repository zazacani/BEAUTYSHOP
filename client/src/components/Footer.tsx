import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">MUE</h3>
            <p className="text-muted-foreground text-sm">
              Votre destination pour les produits de beauté premium en Suisse
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liens Rapides</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/products" data-testid="link-footer-products">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Produits
                </span>
              </Link>
              <Link href="/support" data-testid="link-footer-support">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Support
                </span>
              </Link>
              <Link href="/legal" data-testid="link-footer-legal">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  Mentions Légales
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Email: contact@mue.ch
            </p>
            <p className="text-sm text-muted-foreground">
              Téléphone: +41 22 XXX XX XX
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © {currentYear} MUE. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
