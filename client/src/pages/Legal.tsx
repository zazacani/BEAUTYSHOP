import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Legal() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-serif font-bold mb-8 text-center">
            Mentions Légales
          </h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations sur l'entreprise</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Nom de l'entreprise:</strong> MUE SA
                </p>
                <p>
                  <strong>Adresse:</strong> Rue de la Beauté 123, 1201 Genève,
                  Suisse
                </p>
                <p>
                  <strong>Email:</strong> contact@mue.ch
                </p>
                <p>
                  <strong>Téléphone:</strong> +41 22 XXX XX XX
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conditions Générales de Vente</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>1. Objet</h3>
                <p>
                  Les présentes conditions générales de vente régissent les ventes
                  de produits de beauté effectuées par MUE SA.
                </p>

                <h3>2. Commandes</h3>
                <p>
                  Toute commande passée sur notre site implique l'acceptation sans
                  réserve des présentes conditions générales de vente.
                </p>

                <h3>3. Prix</h3>
                <p>
                  Les prix sont indiqués en francs suisses (CHF) et incluent la TVA
                  applicable.
                </p>

                <h3>4. Livraison</h3>
                <p>
                  Les délais de livraison sont de 2-3 jours ouvrables en Suisse. Les
                  frais de livraison sont calculés lors du passage de la commande.
                </p>

                <h3>5. Retours</h3>
                <p>
                  Vous disposez d'un délai de 30 jours pour retourner tout produit
                  ne vous convenant pas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Politique de Confidentialité</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>Collecte des données</h3>
                <p>
                  Nous collectons les données personnelles nécessaires au traitement
                  de vos commandes et à l'amélioration de nos services.
                </p>

                <h3>Utilisation des données</h3>
                <p>
                  Vos données sont utilisées uniquement pour le traitement de vos
                  commandes et ne sont jamais partagées avec des tiers sans votre
                  consentement.
                </p>

                <h3>Sécurité</h3>
                <p>
                  Nous mettons en œuvre des mesures de sécurité appropriées pour
                  protéger vos données personnelles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
