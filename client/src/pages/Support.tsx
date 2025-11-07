import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support form submitted:", { name, email, message });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} currentLanguage="FR" isAuthenticated={false} />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">
            Support Client
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">contact@beautesuisse.ch</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                  <p className="font-medium">+41 22 XXX XX XX</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Horaires d'ouverture
                  </p>
                  <p className="font-medium">Lun-Ven: 9h00 - 18h00</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                    <Label htmlFor="message">Message</Label>
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
                    Envoyer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Quels sont les délais de livraison ?
                </h3>
                <p className="text-muted-foreground">
                  Les commandes sont généralement livrées en 2-3 jours ouvrables en
                  Suisse.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Comment puis-je retourner un produit ?
                </h3>
                <p className="text-muted-foreground">
                  Vous pouvez retourner tout produit dans les 30 jours suivant la
                  réception. Contactez-nous pour obtenir un numéro de retour.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Les produits sont-ils authentiques ?
                </h3>
                <p className="text-muted-foreground">
                  Tous nos produits sont 100% authentiques et proviennent directement
                  des fabricants.
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
