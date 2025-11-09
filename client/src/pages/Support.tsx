import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Support() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support form submitted:", { name, email, message });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">
            {t("support.title")}
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>{t("support.contactUs")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("support.email")}</p>
                  <p className="font-medium">contact@mue.ch</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t("support.phone")}</p>
                  <p className="font-medium">+41 22 XXX XX XX</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("support.hours")}
                  </p>
                  <p className="font-medium">{t("support.hoursValue")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("support.sendMessage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("support.name")}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("support.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">{t("support.message")}</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      data-testid="input-message"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit">
                    {t("support.send")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("support.faq")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  {t("support.faq1Q")}
                </h3>
                <p className="text-muted-foreground">
                  {t("support.faq1A")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {t("support.faq2Q")}
                </h3>
                <p className="text-muted-foreground">
                  {t("support.faq2A")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {t("support.faq3Q")}
                </h3>
                <p className="text-muted-foreground">
                  {t("support.faq3A")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
