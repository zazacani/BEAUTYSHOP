import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Müe & Nappy</h3>
            <p className="text-muted-foreground text-sm">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/products" data-testid="link-footer-products">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t("footer.products")}
                </span>
              </Link>
              <Link href="/support" data-testid="link-footer-support">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t("footer.support")}
                </span>
              </Link>
              <Link href="/legal" data-testid="link-footer-legal">
                <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  {t("footer.legal")}
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footer.contact")}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {t("footer.email")}: contact@mue.ch
            </p>
            <p className="text-sm text-muted-foreground">
              {t("footer.phone")}: +41 22 XXX XX XX
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © {currentYear} Müe & Nappy. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
