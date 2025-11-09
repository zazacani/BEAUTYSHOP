# Guide d'Administration - MUE E-commerce

## 🔐 Connexion Super Admin

### Identifiants

- **Email :** `admin@mue.ch`
- **Mot de passe :** `Admin@MUE2024`

### Comment se connecter

1. Allez sur `/login`
2. Entrez les identifiants ci-dessus
3. Vous serez automatiquement redirigé vers `/admin`

---

## ✨ Fonctionnalités Implémentées

### 🌍 Système Multi-langue (i18n)
- **Langues supportées :** Français, Allemand, Anglais
- **Sélecteur de langue :** Disponible dans la navigation
- **Stockage :** La préférence de langue est sauvegardée dans le localStorage

### 🔐 Authentification
- **Inscription :** `/register` - Créer un nouveau compte utilisateur
- **Connexion :** `/login` - Se connecter avec email et mot de passe
- **JWT Tokens :** Authentification sécurisée avec tokens JWT
- **Protection des routes :** Les routes admin sont protégées

### 📦 Catalogue Produits
- **Page catalogue :** `/products`
- **Recherche :** Recherche en temps réel par titre et description
- **Multi-langue :** Les produits s'affichent dans la langue sélectionnée
- **Effet hover :** Les images changent au survol (image 1 → image 2)

### 👨‍💼 Dashboard Admin (`/admin`)

#### Onglet Produits
- **Ajouter un produit :**
  - Titre (FR, DE, EN)
  - Description (FR, DE, EN)
  - Prix (CHF)
  - Stock
  - Image 1 (URL - affichage principal)
  - Image 2 (URL - affichage au survol)
  - Texte alternatif (FR, DE, EN)
  
- **Modifier un produit :** Cliquez sur l'icône crayon
- **Supprimer un produit :** Cliquez sur l'icône corbeille

#### Onglet Codes Promo
- Affiche tous les codes de réduction actifs
- Informations : code, type (pourcentage/fixe), valeur, usage unique

#### Onglet Statistiques
- Nombre total de produits
- Nombre total de commandes
- Nombre d'utilisateurs
- Revenus totaux

---

## 🛠️ Stack Technique

### Backend
- **Framework :** Express.js avec TypeScript
- **Base de données :** PostgreSQL (Neon)
- **ORM :** Drizzle ORM
- **Authentification :** JWT avec bcryptjs

### Frontend  
- **Framework :** React avec TypeScript
- **Routing :** Wouter
- **State Management :** TanStack Query (React Query)
- **UI Components :** Shadcn/ui
- **Styling :** Tailwind CSS

### Schéma de Base de Données

#### Table `users`
```sql
- id (VARCHAR, UUID)
- email (TEXT, UNIQUE)
- password (TEXT, hasheé)
- name (TEXT)
- role (TEXT: "USER" | "ADMIN")
- created_at (TIMESTAMP)
```

#### Table `products`
```sql
- id (VARCHAR, UUID)
- title_fr, title_de, title_en (TEXT)
- description_fr, description_de, description_en (TEXT)
- price (DECIMAL)
- quantity_in_stock (INTEGER)
- image_url_1, image_url_2 (TEXT)
- alt_text_fr, alt_text_de, alt_text_en (TEXT)
- created_at (TIMESTAMP)
```

#### Table `discount_codes`
```sql
- id (VARCHAR, UUID)
- code (TEXT, UNIQUE)
- type (TEXT: "PERCENTAGE" | "FIXED")
- value (DECIMAL)
- is_single_use (BOOLEAN)
- is_active (BOOLEAN)
- used_by (VARCHAR, nullable)
- created_at (TIMESTAMP)
```

#### Table `orders`
```sql
- id (VARCHAR, UUID)
- user_id (VARCHAR, FK)
- total_amount (DECIMAL)
- discount_amount (DECIMAL)
- discount_code_id (VARCHAR, nullable)
- status (TEXT)
- created_at (TIMESTAMP)
```

#### Table `order_items`
```sql
- id (VARCHAR, UUID)
- order_id (VARCHAR, FK)
- product_id (VARCHAR, FK)
- quantity (INTEGER)
- price_at_purchase (DECIMAL)
```

---

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Produits (Public)
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit
- `GET /api/products?search=query` - Rechercher des produits

### Produits (Admin uniquement)
- `POST /api/products` - Créer un produit
- `PUT /api/products/:id` - Modifier un produit
- `DELETE /api/products/:id` - Supprimer un produit

### Codes Promo (Admin uniquement)
- `GET /api/discount` - Liste tous les codes
- `POST /api/discount` - Créer un code
- `PUT /api/discount/:id` - Modifier un code
- `DELETE /api/discount/:id` - Supprimer un code

### Codes Promo (Utilisateur authentifié)
- `POST /api/discount/validate` - Valider un code

### Commandes (Utilisateur authentifié)
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Mes commandes
- `GET /api/orders/:id` - Détails d'une commande

### Statistiques (Admin uniquement)
- `GET /api/admin/stats` - Statistiques globales

### Profil (Utilisateur authentifié)
- `GET /api/user/profile` - Mon profil
- `PUT /api/user/profile` - Modifier mon profil
- `PUT /api/user/password` - Changer mot de passe

---

## 🚀 Commandes Utiles

```bash
# Lancer l'application en développement
npm run dev

# Créer le super admin
npm run seed:admin

# Push le schéma vers la base de données
npm run db:push

# Build pour la production
npm run build

# Lancer en production
npm run start
```

---

## 📝 Notes Importantes

1. **Sécurité :** Changez le mot de passe du super admin après la première connexion
2. **Images :** Les URLs d'images doivent être accessibles publiquement
3. **Multi-langue :** Tous les champs de texte doivent être remplis dans les 3 langues
4. **Tokens :** Les tokens JWT expirent après 7 jours
5. **Base de données :** Assurez-vous que `DATABASE_URL` et `JWT_SECRET` sont configurés

---

## 🔧 Variables d'Environnement Requises

```env
DATABASE_URL=<URL de votre base PostgreSQL>
JWT_SECRET=<Votre secret JWT>
PORT=5000
NODE_ENV=development
```

---

## 🎨 Design

- **Marque :** MUE
- **Couleurs :**
  - Fond : Blanc
  - Texte : Noir
  - Accent : Jaune

- **Effet produits :** Changement d'image au survol
- **Responsive :** Adapté mobile, tablette et desktop
