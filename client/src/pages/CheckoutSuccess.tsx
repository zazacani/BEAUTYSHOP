import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CheckoutSuccess() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">{t("payment.success.title")}</CardTitle>
            <CardDescription>{t("payment.success.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t("payment.success.confirmation")}
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/">
                <Button
                  className="w-full"
                  data-testid="button-home"
                >
                  {t("payment.success.backToHome")}
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="outline"
                  className="w-full"
                  data-testid="button-products"
                >
                  {t("payment.success.continueShopping")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
