import { Link, useLocation } from "wouter";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PaymentCancel() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">{t("payment.cancel.title")}</CardTitle>
            <CardDescription>{t("payment.cancel.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t("payment.cancel.message")}
            </p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setLocation("/")}
                data-testid="button-home"
              >
                {t("payment.cancel.backToHome")}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/products")}
                data-testid="button-products"
              >
                {t("payment.cancel.continueShopping")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
