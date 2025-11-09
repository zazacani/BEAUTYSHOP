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
      } else {
        try {
          const response = await fetch("/api/settings");
          if (response.ok) {
            const settings = await response.json();
            if (settings.defaultLanguage) {
              setLanguageState(settings.defaultLanguage as Language);
            }
          }
        } catch (error) {
          console.error("Failed to fetch default language:", error);
        }
      }
      setIsInitialized(true);
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
