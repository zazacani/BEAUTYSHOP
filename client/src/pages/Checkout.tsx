import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPayment, setShowPayment] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "CH",
  });

  useEffect(() => {
    if (!user) {
      setLocation("/");
      return;
    }

    if (cartItems.length === 0) {
      setLocation("/");
      return;
    }
  }, [user, cartItems, setLocation]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleContinueToPayment = async () => {
    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      setError(t("checkout.addressRequired"));
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        shippingAddress,
      });
      const data = await response.json();
      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.shippingAddress")}</CardTitle>
                <CardDescription>{t("checkout.enterShippingDetails")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("checkout.firstName")}</Label>
                    <Input
                      id="firstName"
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      placeholder={t("checkout.firstNamePlaceholder")}
                      disabled={showPayment}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("checkout.lastName")}</Label>
                    <Input
                      id="lastName"
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      placeholder={t("checkout.lastNamePlaceholder")}
                      disabled={showPayment}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t("checkout.address")}</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    placeholder={t("checkout.addressPlaceholder")}
                    disabled={showPayment}
                    data-testid="input-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">{t("checkout.addressLine2")}</Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                    placeholder={t("checkout.addressLine2Placeholder")}
                    disabled={showPayment}
                    data-testid="input-address-line-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">{t("checkout.postalCode")}</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder={t("checkout.postalCodePlaceholder")}
                      disabled={showPayment}
                      data-testid="input-postal-code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("checkout.city")}</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder={t("checkout.cityPlaceholder")}
                      disabled={showPayment}
                      data-testid="input-city"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">{t("checkout.country")}</Label>
                  <Input
                    id="country"
                    value="Suisse / Switzerland"
                    disabled
                    data-testid="input-country"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive" data-testid="text-error">
                    {error}
                  </p>
                )}

                {!showPayment && (
                  <Button
                    onClick={handleContinueToPayment}
                    disabled={loading}
                    className="w-full"
                    data-testid="button-continue-payment"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("checkout.processing")}
                      </>
                    ) : (
                      t("checkout.continueToPayment")
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {showPayment && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("checkout.paymentDetails")}</CardTitle>
                  <CardDescription>{t("checkout.securePayment")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm />
                    </Elements>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                    data-testid={`order-item-${item.id}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t("checkout.quantity")}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      CHF {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>{t("checkout.total")}</span>
                    <span data-testid="total-amount">CHF {subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
