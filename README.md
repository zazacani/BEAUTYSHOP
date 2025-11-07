# Beauté Suisse - E-Commerce Platform

Application e-commerce multilingue (FR/DE/EN) pour la vente de produits de beauté en Suisse.

## Stack Technique

### Backend
- **Framework**: Express.js avec TypeScript
- **Base de données**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentification**: JWT + bcrypt
- **Architecture**: Service Layer + Repository Pattern (SOLID principles)

### Frontend
- **Framework**: React 18 avec TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Build**: Vite

## Prérequis

- Node.js 20+
- Docker & Docker Compose (pour déploiement local)
- PostgreSQL 15+ (si installation locale sans Docker)

## Installation Locale (Développement)

### 1. Cloner et installer les dépendances

\`\`\`bash
git clone <repository-url>
cd beaute-suisse
npm install
\`\`\`

### 2. Configuration de l'environnement

Créer un fichier \`.env\` à la racine :

\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/beaute_suisse
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
\`\`\`

### 3. Initialiser la base de données

\`\`\`bash
# Générer et appliquer les migrations
npm run db:push

# Seeder les données de test
npm run db:seed
\`\`\`

### 4. Lancer l'application

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur http://localhost:5000

## Déploiement Docker (Production-Ready)

### Option 1: Déploiement complet avec Docker Compose

\`\`\`bash
# 1. Créer un fichier .env avec le JWT secret
echo "JWT_SECRET=$(openssl rand -hex 32)" > .env

# 2. Builder et lancer tous les services
docker-compose up --build

# L'app sera accessible sur http://localhost:5000
\`\`\`

### Option 2: Déploiement manuel avec Docker

\`\`\`bash
# 1. Créer le réseau Docker
docker network create beaute-network

# 2. Lancer PostgreSQL
docker run -d \\
  --name beaute-postgres \\
  --network beaute-network \\
  -e POSTGRES_USER=beaute \\
  -e POSTGRES_PASSWORD=beaute_password \\
  -e POSTGRES_DB=beaute_suisse \\
  -v beaute-data:/var/lib/postgresql/data \\
  -p 5432:5432 \\
  postgres:15-alpine

# 3. Attendre que PostgreSQL soit prêt
docker exec beaute-postgres pg_isready -U beaute

# 4. Builder l'image de l'application
docker build -t beaute-suisse .

# 5. Générer un JWT secret sécurisé
export JWT_SECRET=$(openssl rand -hex 32)

# 6. Lancer l'application
docker run -d \\
  --name beaute-app \\
  --network beaute-network \\
  -p 5000:5000 \\
  -e DATABASE_URL=postgres://beaute:beaute_password@beaute-postgres:5432/beaute_suisse \\
  -e JWT_SECRET=$JWT_SECRET \\
  -e NODE_ENV=production \\
  beaute-suisse

# 7. Initialiser la base de données (première installation uniquement)
docker exec beaute-app npm run db:push
docker exec beaute-app npm run db:seed
\`\`\`

### Commandes Docker Utiles

\`\`\`bash
# Voir les logs
docker-compose logs -f

# Redémarrer les services
docker-compose restart

# Arrêter les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Accéder au shell du conteneur
docker-compose exec app sh

# Exécuter les migrations dans le conteneur
docker-compose exec app npm run db:push
\`\`\`

## Structure du Projet

\`\`\`
beaute-suisse/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   └── lib/             # Utilitaires frontend
│   └── index.html
├── server/                   # Backend Express
│   ├── db/                  # Configuration DB et seeds
│   ├── repositories/        # Couche d'accès aux données
│   ├── services/            # Logique métier
│   ├── middleware/          # Middleware Express
│   └── routes.ts            # Définition des routes API
├── shared/                  # Code partagé
│   └── schema.ts            # Schémas Drizzle + Zod
├── Dockerfile               # Image Docker de production
├── docker-compose.yml       # Configuration Docker Compose
└── package.json
\`\`\`

## API Endpoints

### Authentification
- \`POST /api/auth/register\` - Créer un compte
- \`POST /api/auth/login\` - Se connecter

### Produits (Public)
- \`GET /api/products\` - Liste tous les produits
- \`GET /api/products?search=query\` - Rechercher des produits
- \`GET /api/products/:id\` - Détails d'un produit

### Produits (Admin uniquement)
- \`POST /api/products\` - Créer un produit
- \`PUT /api/products/:id\` - Mettre à jour un produit
- \`DELETE /api/products/:id\` - Supprimer un produit

### Codes de réduction
- \`POST /api/discount/validate\` - Valider un code de réduction
- \`GET /api/discount\` - Liste des codes (Admin)

### Commandes
- \`POST /api/orders\` - Créer une commande
- \`GET /api/orders\` - Liste des commandes utilisateur
- \`GET /api/orders/:id\` - Détails d'une commande

## Données de Test

Après avoir exécuté \`npm run db:seed\`, vous aurez accès à :

**Comptes utilisateurs:**
- Admin: \`admin@beautesuisse.ch\` / \`admin123\`
- User: \`user@beautesuisse.ch\` / \`user123\`

**Codes de réduction:**
- \`WELCOME10\` - 10% de réduction (usage multiple)
- \`SUMMER20\` - 20% de réduction (usage multiple)
- \`FIRSTORDER\` - 15 CHF de réduction (usage unique)

**6 produits** de beauté avec descriptions en FR/DE/EN

## Architecture & Patterns

### Repository Pattern
Abstraction de la couche d'accès aux données pour faciliter les tests et la maintenabilité.

\`\`\`typescript
class ProductRepository {
  async findAll(): Promise<Product[]>
  async findById(id: string): Promise<Product | undefined>
  async search(query: string): Promise<Product[]>
}
\`\`\`

### Service Layer
Logique métier isolée des contrôleurs pour respecter le principe de responsabilité unique (SOLID).

\`\`\`typescript
class ProductService {
  constructor(private productRepository: ProductRepository)
  async getAllProducts(): Promise<Product[]>
  async checkStock(productId: string, quantity: number): Promise<boolean>
}
\`\`\`

### Dependency Injection
Les services reçoivent leurs dépendances via le constructeur pour faciliter les tests et le découplage.

## Multilinguisme

L'application supporte 3 langues : Français, Allemand, Anglais.

Les produits stockent leurs données dans les 3 langues :
- \`titleFr\`, \`titleDe\`, \`titleEn\`
- \`descriptionFr\`, \`descriptionDe\`, \`descriptionEn\`
- \`altTextFr\`, \`altTextDe\`, \`altTextEn\`

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- Authentification JWT avec expiration 7 jours
- Middleware de protection des routes admin
- Validation des entrées avec Zod
- Protection CSRF via tokens

## Scripts Disponibles

\`\`\`bash
npm run dev          # Développement avec hot-reload
npm run build        # Build de production
npm start            # Lancer en mode production
npm run db:push      # Appliquer le schéma à la DB
npm run db:seed      # Seeder les données de test
npm run db:studio    # Interface Drizzle Studio
\`\`\`

## Contribution

Ce projet suit les principes SOLID et utilise des design patterns établis. Lors de l'ajout de nouvelles fonctionnalités :

1. Créer un repository pour l'accès aux données
2. Implémenter la logique métier dans un service
3. Ajouter les routes dans \`server/routes.ts\`
4. Valider les entrées avec Zod schemas
5. Ajouter les types dans \`shared/schema.ts\`

## Production

Pour un déploiement en production :

1. **OBLIGATOIRE**: Définir JWT_SECRET avec \`openssl rand -hex 32\` - l'application refusera de démarrer sans cette variable
2. Utiliser une base de données PostgreSQL managée (Neon, Supabase, etc.)
3. Configurer les variables d'environnement appropriées
4. Activer HTTPS
5. Configurer les CORS selon vos besoins

**⚠️ IMPORTANT**: Le JWT_SECRET est maintenant obligatoire pour des raisons de sécurité. L'application échouera au démarrage si cette variable n'est pas définie.

## Support

Pour toute question ou problème, consulter la documentation ou ouvrir une issue.
