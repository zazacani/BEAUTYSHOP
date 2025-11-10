import { FormEvent, useState } from "react";
import { useLocation } from "wouter";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/checkout-success",
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: t("checkout.paymentFailed"),
        description: error.message,
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        data-testid="button-pay"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("checkout.processing")}
          </>
        ) : (
          t("checkout.payNow")
        )}
      </Button>
    </form>
  );
}
