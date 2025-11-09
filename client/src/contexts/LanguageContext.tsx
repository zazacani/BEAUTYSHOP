import { createContext, useContext, useState, useEffect } from "react";

type Language = "fr" | "de" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navigation
    "nav.products": "Produits",
    "nav.support": "Support",
    "nav.login": "Connexion",
    "nav.register": "Créer un compte",
    "nav.logout": "Déconnexion",
    "nav.profile": "Profil",
    "nav.admin": "Administration",
    
    // Home
    "home.title": "MUE",
    "home.subtitle": "Découvrez notre collection de produits de beauté premium",
    "home.cta": "Découvrir la collection",
    
    // Auth
    "auth.login": "Connexion",
    "auth.register": "Créer un compte",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.name": "Nom complet",
    "auth.confirmPassword": "Confirmer le mot de passe",
    "auth.forgotPassword": "Mot de passe oublié?",
    "auth.noAccount": "Pas de compte?",
    "auth.hasAccount": "Déjà un compte?",
    "auth.signIn": "Se connecter",
    "auth.signUp": "S'inscrire",
    "auth.createAccount": "Créer votre compte",
    
    // Products
    "products.title": "Nos Produits",
    "products.search": "Rechercher des produits...",
    "products.price": "Prix",
    "products.stock": "En stock",
    "products.outOfStock": "Rupture de stock",
    "products.addToCart": "Ajouter au panier",
    "products.review": "avis",
    "products.reviews": "avis",
    "products.noReviews": "Aucun avis",
    
    // Admin
    "admin.dashboard": "Tableau de bord",
    "admin.products": "Produits",
    "admin.discounts": "Codes promo",
    "admin.stats": "Statistiques",
    "admin.settings": "Paramètres",
    "admin.addProduct": "Ajouter un produit",
    "admin.editProduct": "Modifier le produit",
    "admin.deleteProduct": "Supprimer",
    "admin.siteSettings": "Paramètres du site",
    "admin.siteSettingsDesc": "Gérez les paramètres généraux de votre site",
    "admin.defaultLanguage": "Langue par défaut",
    "admin.defaultLanguageDesc": "Cette langue sera utilisée par défaut pour tous les nouveaux visiteurs",
    "admin.settingsUpdated": "Paramètres mis à jour",
    "admin.settingsUpdatedDesc": "Les paramètres du site ont été enregistrés avec succès",
    "admin.settingsUpdateError": "Erreur lors de la mise à jour des paramètres",
    
    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    
    // Support
    "support.title": "Support Client",
    "support.contactUs": "Contactez-nous",
    "support.email": "Email",
    "support.phone": "Téléphone",
    "support.hours": "Horaires d'ouverture",
    "support.hoursValue": "Lun-Ven: 9h00 - 18h00",
    "support.sendMessage": "Envoyez-nous un message",
    "support.name": "Nom",
    "support.message": "Message",
    "support.send": "Envoyer",
    "support.faq": "Questions Fréquentes",
    "support.faq1Q": "Quels sont les délais de livraison ?",
    "support.faq1A": "Les commandes sont généralement livrées en 2-3 jours ouvrables en Suisse.",
    "support.faq2Q": "Comment puis-je retourner un produit ?",
    "support.faq2A": "Vous pouvez retourner tout produit dans les 30 jours suivant la réception. Contactez-nous pour obtenir un numéro de retour.",
    "support.faq3Q": "Les produits sont-ils authentiques ?",
    "support.faq3A": "Tous nos produits sont 100% authentiques et proviennent directement des fabricants.",
    
    // Legal
    "legal.title": "Mentions Légales",
    "legal.companyInfo": "Informations sur l'entreprise",
    "legal.companyName": "Nom de l'entreprise",
    "legal.address": "Adresse",
    "legal.terms": "Conditions Générales de Vente",
    "legal.terms1Title": "1. Objet",
    "legal.terms1Text": "Les présentes conditions générales de vente régissent les ventes de produits de beauté effectuées par MUE SA.",
    "legal.terms2Title": "2. Commandes",
    "legal.terms2Text": "Toute commande passée sur notre site implique l'acceptation sans réserve des présentes conditions générales de vente.",
    "legal.terms3Title": "3. Prix",
    "legal.terms3Text": "Les prix sont indiqués en francs suisses (CHF) et incluent la TVA applicable.",
    "legal.terms4Title": "4. Livraison",
    "legal.terms4Text": "Les délais de livraison sont de 2-3 jours ouvrables en Suisse. Les frais de livraison sont calculés lors du passage de la commande.",
    "legal.terms5Title": "5. Retours",
    "legal.terms5Text": "Vous disposez d'un délai de 30 jours pour retourner tout produit ne vous convenant pas.",
    "legal.privacyTitle": "Politique de Confidentialité",
    "legal.privacy1Title": "Collecte des données",
    "legal.privacy1Text": "Nous collectons les données personnelles nécessaires au traitement de vos commandes et à l'amélioration de nos services.",
    "legal.privacy2Title": "Utilisation des données",
    "legal.privacy2Text": "Vos données sont utilisées uniquement pour le traitement de vos commandes et ne sont jamais partagées avec des tiers sans votre consentement.",
    "legal.privacy3Title": "Sécurité",
    "legal.privacy3Text": "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles.",
    
    // Cart
    "cart.title": "Panier",
    "cart.empty": "Votre panier est vide",
    "cart.subtotal": "Sous-total",
    "cart.discount": "Réduction",
    "cart.total": "Total",
    "cart.discountCode": "Code de réduction",
    "cart.apply": "Appliquer",
    "cart.checkout": "Passer la commande",
  },
  de: {
    // Navigation
    "nav.products": "Produkte",
    "nav.support": "Support",
    "nav.login": "Anmelden",
    "nav.register": "Registrieren",
    "nav.logout": "Abmelden",
    "nav.profile": "Profil",
    "nav.admin": "Verwaltung",
    
    // Home
    "home.title": "MUE",
    "home.subtitle": "Entdecken Sie unsere Premium-Schönheitsprodukte",
    "home.cta": "Kollektion entdecken",
    
    // Auth
    "auth.login": "Anmelden",
    "auth.register": "Registrieren",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Vollständiger Name",
    "auth.confirmPassword": "Passwort bestätigen",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.noAccount": "Noch kein Konto?",
    "auth.hasAccount": "Bereits ein Konto?",
    "auth.signIn": "Einloggen",
    "auth.signUp": "Registrieren",
    "auth.createAccount": "Konto erstellen",
    
    // Products
    "products.title": "Unsere Produkte",
    "products.search": "Produkte suchen...",
    "products.price": "Preis",
    "products.stock": "Auf Lager",
    "products.outOfStock": "Ausverkauft",
    "products.addToCart": "In den Warenkorb",
    "products.review": "Bewertung",
    "products.reviews": "Bewertungen",
    "products.noReviews": "Keine Bewertungen",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.products": "Produkte",
    "admin.discounts": "Rabattcodes",
    "admin.stats": "Statistiken",
    "admin.settings": "Einstellungen",
    "admin.addProduct": "Produkt hinzufügen",
    "admin.editProduct": "Produkt bearbeiten",
    "admin.deleteProduct": "Löschen",
    "admin.siteSettings": "Website-Einstellungen",
    "admin.siteSettingsDesc": "Verwalten Sie die allgemeinen Einstellungen Ihrer Website",
    "admin.defaultLanguage": "Standardsprache",
    "admin.defaultLanguageDesc": "Diese Sprache wird standardmäßig für alle neuen Besucher verwendet",
    "admin.settingsUpdated": "Einstellungen aktualisiert",
    "admin.settingsUpdatedDesc": "Die Website-Einstellungen wurden erfolgreich gespeichert",
    "admin.settingsUpdateError": "Fehler beim Aktualisieren der Einstellungen",
    
    // Common
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    
    // Support
    "support.title": "Kundensupport",
    "support.contactUs": "Kontaktieren Sie uns",
    "support.email": "E-Mail",
    "support.phone": "Telefon",
    "support.hours": "Öffnungszeiten",
    "support.hoursValue": "Mo-Fr: 9:00 - 18:00 Uhr",
    "support.sendMessage": "Senden Sie uns eine Nachricht",
    "support.name": "Name",
    "support.message": "Nachricht",
    "support.send": "Senden",
    "support.faq": "Häufig gestellte Fragen",
    "support.faq1Q": "Was sind die Lieferzeiten?",
    "support.faq1A": "Bestellungen werden in der Schweiz in der Regel innerhalb von 2-3 Werktagen geliefert.",
    "support.faq2Q": "Wie kann ich ein Produkt zurückgeben?",
    "support.faq2A": "Sie können jedes Produkt innerhalb von 30 Tagen nach Erhalt zurückgeben. Kontaktieren Sie uns für eine Rücksendenummer.",
    "support.faq3Q": "Sind die Produkte authentisch?",
    "support.faq3A": "Alle unsere Produkte sind 100% authentisch und stammen direkt vom Hersteller.",
    
    // Legal
    "legal.title": "Rechtliche Hinweise",
    "legal.companyInfo": "Unternehmensinformationen",
    "legal.companyName": "Firmenname",
    "legal.address": "Adresse",
    "legal.terms": "Allgemeine Geschäftsbedingungen",
    "legal.terms1Title": "1. Zweck",
    "legal.terms1Text": "Diese Allgemeinen Geschäftsbedingungen regeln den Verkauf von Schönheitsprodukten durch MUE SA.",
    "legal.terms2Title": "2. Bestellungen",
    "legal.terms2Text": "Jede auf unserer Website aufgegebene Bestellung bedeutet die vorbehaltlose Annahme dieser Allgemeinen Geschäftsbedingungen.",
    "legal.terms3Title": "3. Preise",
    "legal.terms3Text": "Die Preise sind in Schweizer Franken (CHF) angegeben und enthalten die geltende Mehrwertsteuer.",
    "legal.terms4Title": "4. Lieferung",
    "legal.terms4Text": "Die Lieferzeiten betragen in der Schweiz 2-3 Werktage. Die Versandkosten werden bei der Bestellung berechnet.",
    "legal.terms5Title": "5. Rückgabe",
    "legal.terms5Text": "Sie haben 30 Tage Zeit, um ein Produkt zurückzugeben, das Ihnen nicht gefällt.",
    "legal.privacyTitle": "Datenschutzrichtlinie",
    "legal.privacy1Title": "Datenerfassung",
    "legal.privacy1Text": "Wir erfassen die persönlichen Daten, die zur Bearbeitung Ihrer Bestellungen und zur Verbesserung unserer Dienstleistungen erforderlich sind.",
    "legal.privacy2Title": "Datenverwendung",
    "legal.privacy2Text": "Ihre Daten werden nur zur Bearbeitung Ihrer Bestellungen verwendet und niemals ohne Ihre Zustimmung an Dritte weitergegeben.",
    "legal.privacy3Title": "Sicherheit",
    "legal.privacy3Text": "Wir setzen angemessene Sicherheitsmaßnahmen zum Schutz Ihrer persönlichen Daten um.",
    
    // Cart
    "cart.title": "Warenkorb",
    "cart.empty": "Ihr Warenkorb ist leer",
    "cart.subtotal": "Zwischensumme",
    "cart.discount": "Rabatt",
    "cart.total": "Gesamt",
    "cart.discountCode": "Rabattcode",
    "cart.apply": "Anwenden",
    "cart.checkout": "Zur Kasse",
  },
  en: {
    // Navigation
    "nav.products": "Products",
    "nav.support": "Support",
    "nav.login": "Login",
    "nav.register": "Sign Up",
    "nav.logout": "Logout",
    "nav.profile": "Profile",
    "nav.admin": "Admin",
    
    // Home
    "home.title": "MUE",
    "home.subtitle": "Discover our premium beauty products collection",
    "home.cta": "Discover the collection",
    
    // Auth
    "auth.login": "Login",
    "auth.register": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot password?",
    "auth.noAccount": "No account?",
    "auth.hasAccount": "Already have an account?",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.createAccount": "Create your account",
    
    // Products
    "products.title": "Our Products",
    "products.search": "Search products...",
    "products.price": "Price",
    "products.stock": "In stock",
    "products.outOfStock": "Out of stock",
    "products.addToCart": "Add to cart",
    "products.review": "review",
    "products.reviews": "reviews",
    "products.noReviews": "No reviews",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.products": "Products",
    "admin.discounts": "Discount codes",
    "admin.stats": "Statistics",
    "admin.settings": "Settings",
    "admin.addProduct": "Add product",
    "admin.editProduct": "Edit product",
    "admin.deleteProduct": "Delete",
    "admin.siteSettings": "Site Settings",
    "admin.siteSettingsDesc": "Manage your site's general settings",
    "admin.defaultLanguage": "Default Language",
    "admin.defaultLanguageDesc": "This language will be used by default for all new visitors",
    "admin.settingsUpdated": "Settings Updated",
    "admin.settingsUpdatedDesc": "Site settings have been saved successfully",
    "admin.settingsUpdateError": "Error updating settings",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    
    // Support
    "support.title": "Customer Support",
    "support.contactUs": "Contact Us",
    "support.email": "Email",
    "support.phone": "Phone",
    "support.hours": "Opening Hours",
    "support.hoursValue": "Mon-Fri: 9:00 AM - 6:00 PM",
    "support.sendMessage": "Send us a message",
    "support.name": "Name",
    "support.message": "Message",
    "support.send": "Send",
    "support.faq": "Frequently Asked Questions",
    "support.faq1Q": "What are the delivery times?",
    "support.faq1A": "Orders are usually delivered within 2-3 business days in Switzerland.",
    "support.faq2Q": "How can I return a product?",
    "support.faq2A": "You can return any product within 30 days of receipt. Contact us to get a return number.",
    "support.faq3Q": "Are the products authentic?",
    "support.faq3A": "All our products are 100% authentic and come directly from the manufacturers.",
    
    // Legal
    "legal.title": "Legal Notice",
    "legal.companyInfo": "Company Information",
    "legal.companyName": "Company Name",
    "legal.address": "Address",
    "legal.terms": "Terms and Conditions",
    "legal.terms1Title": "1. Purpose",
    "legal.terms1Text": "These general terms and conditions govern the sale of beauty products by MUE SA.",
    "legal.terms2Title": "2. Orders",
    "legal.terms2Text": "Any order placed on our website implies unreserved acceptance of these general terms and conditions.",
    "legal.terms3Title": "3. Prices",
    "legal.terms3Text": "Prices are indicated in Swiss francs (CHF) and include applicable VAT.",
    "legal.terms4Title": "4. Delivery",
    "legal.terms4Text": "Delivery times are 2-3 business days in Switzerland. Shipping costs are calculated when placing the order.",
    "legal.terms5Title": "5. Returns",
    "legal.terms5Text": "You have 30 days to return any product that does not suit you.",
    "legal.privacyTitle": "Privacy Policy",
    "legal.privacy1Title": "Data Collection",
    "legal.privacy1Text": "We collect personal data necessary for processing your orders and improving our services.",
    "legal.privacy2Title": "Data Usage",
    "legal.privacy2Text": "Your data is used only for processing your orders and is never shared with third parties without your consent.",
    "legal.privacy3Title": "Security",
    "legal.privacy3Text": "We implement appropriate security measures to protect your personal data.",
    
    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.subtotal": "Subtotal",
    "cart.discount": "Discount",
    "cart.total": "Total",
    "cart.discountCode": "Discount code",
    "cart.apply": "Apply",
    "cart.checkout": "Checkout",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLanguage = async () => {
      const saved = localStorage.getItem("language");
      if (saved) {
        setLanguageState(saved as Language);
        setIsInitialized(true);
      } else {
        try {
          const response = await fetch("/api/settings");
          if (response.ok) {
            const settings = await response.json();
            const defaultLang = settings.defaultLanguage as Language || "fr";
            setLanguageState(defaultLang);
            localStorage.setItem("language", defaultLang);
          }
        } catch (error) {
          console.error("Failed to fetch default language:", error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    initializeLanguage();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("language", language);
    }
  }, [language, isInitialized]);

  const setLanguage = (lang: Language) => {
    console.log("Language changed to", lang.toUpperCase());
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
