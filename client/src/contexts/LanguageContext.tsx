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
    "admin.addProduct": "Ajouter un produit",
    "admin.editProduct": "Modifier le produit",
    "admin.deleteProduct": "Supprimer",
    
    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.cancel": "Annuler",
    "common.save": "Enregistrer",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
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
    "admin.addProduct": "Produkt hinzufügen",
    "admin.editProduct": "Produkt bearbeiten",
    "admin.deleteProduct": "Löschen",
    
    // Common
    "common.loading": "Laden...",
    "common.error": "Fehler",
    "common.success": "Erfolg",
    "common.cancel": "Abbrechen",
    "common.save": "Speichern",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
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
    "admin.addProduct": "Add product",
    "admin.editProduct": "Edit product",
    "admin.deleteProduct": "Delete",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "fr";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
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
