# Guide de Déploiement - Müe & Nappy E-Commerce

Ce guide explique comment déployer la plateforme e-commerce Müe & Nappy avec Docker de A à Z.

## Table des Matières

1. [Prérequis](#prérequis)
2. [Architecture de Déploiement](#architecture-de-déploiement)
3. [Configuration de la Base de Données PostgreSQL avec Docker](#configuration-de-la-base-de-données-postgresql-avec-docker)
4. [Configuration de l'Application](#configuration-de-lapplication)
5. [Déploiement avec Docker Compose](#déploiement-avec-docker-compose)
6. [Migrations et Initialisation](#migrations-et-initialisation)
7. [Vérification et Tests](#vérification-et-tests)
8. [Maintenance et Sauvegarde](#maintenance-et-sauvegarde)

---

## Prérequis

### Logiciels Requis

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Node.js** (version 20+) - pour le développement local
- **npm** (version 9+)
- **Git** - pour cloner le projet

### Vérification des Installations

```bash
# Vérifier Docker
docker --version
# Sortie attendue: Docker version 20.10.x ou supérieur

# Vérifier Docker Compose
docker compose version
# Sortie attendue: Docker Compose version v2.x.x ou supérieur

# Vérifier Node.js
node --version
# Sortie attendue: v20.x.x ou supérieur

# Vérifier npm
npm --version
# Sortie attendue: 9.x.x ou supérieur
```

---

## Architecture de Déploiement

L'application est composée de 3 conteneurs Docker :

1. **postgres** - Base de données PostgreSQL 16
2. **app** - Application Node.js (Frontend + Backend)
3. **nginx** (optionnel) - Reverse proxy pour la production

```
┌─────────────────────────────────────┐
│         NGINX (Port 80/443)         │
│     Reverse Proxy & SSL/TLS         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Application Node.js            │
│   (Frontend Vite + Backend Express) │
│           Port 5000                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      PostgreSQL Database            │
│           Port 5432                 │
└─────────────────────────────────────┘
```

---

## Configuration de la Base de Données PostgreSQL avec Docker

### Étape 1 : Créer le Réseau Docker

```bash
# Créer un réseau Docker pour permettre la communication entre conteneurs
docker network create mue-network
```

### Étape 2 : Lancer PostgreSQL avec Docker

```bash
# Lancer un conteneur PostgreSQL
docker run -d \
  --name mue-postgres \
  --network mue-network \
  -e POSTGRES_USER=mueadmin \
  -e POSTGRES_PASSWORD=SecurePassword123! \
  -e POSTGRES_DB=mue_nappy_db \
  -p 5432:5432 \
  -v mue-postgres-data:/var/lib/postgresql/data \
  postgres:16-alpine

# Explication des options :
# -d : Mode détaché (arrière-plan)
# --name : Nom du conteneur
# --network : Réseau Docker pour la communication inter-conteneurs
# -e : Variables d'environnement
# -p : Mappage de port (hôte:conteneur)
# -v : Volume persistant pour les données
```

### Étape 3 : Vérifier que PostgreSQL est Démarré

```bash
# Vérifier le statut du conteneur
docker ps | grep mue-postgres

# Vérifier les logs
docker logs mue-postgres

# Se connecter à PostgreSQL (pour vérification)
docker exec -it mue-postgres psql -U mueadmin -d mue_nappy_db
# Dans psql, taper \l pour lister les bases de données
# Taper \q pour quitter
```

---

## Configuration de l'Application

### Étape 1 : Cloner le Projet

```bash
# Cloner le repository
git clone https://github.com/votre-repo/mue-nappy.git
cd mue-nappy
```

### Étape 2 : Créer le Fichier .env

Créez un fichier `.env` à la racine du projet :

```bash
# Créer le fichier .env
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://mueadmin:SecurePassword123!@mue-postgres:5432/mue_nappy_db

# JWT Secret (générer une clé sécurisée)
JWT_SECRET=votre-cle-secrete-jwt-minimum-32-caracteres

# Stripe API Keys (mode test)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_votre_cle_publique_stripe

# Environment
NODE_ENV=production
PORT=5000
EOF
```

### Étape 3 : Générer une Clé JWT Sécurisée

```bash
# Générer une clé aléatoire sécurisée de 64 caractères
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copier le résultat et remplacer JWT_SECRET dans .env
```

### Étape 4 : Configurer les Clés Stripe

1. Créez un compte sur [https://stripe.com](https://stripe.com)
2. Obtenez vos clés API (mode test) depuis le Dashboard
3. Remplacez les valeurs dans `.env`

---

## Déploiement avec Docker Compose

### Étape 1 : Créer le Dockerfile

Créez un fichier `Dockerfile` à la racine du projet :

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm ci

# Copier le code source
COPY . .

# Build du frontend
RUN npm run build

# Image de production
FROM node:20-alpine

WORKDIR /app

# Copier package.json et installer uniquement les dépendances de production
COPY package*.json ./
RUN npm ci --only=production

# Copier le code compilé depuis le builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/db ./db
COPY --from=builder /app/migrations ./migrations

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["node", "server/index.js"]
```

### Étape 2 : Créer docker-compose.yml

Créez un fichier `docker-compose.yml` à la racine du projet :

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: mue-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: mueadmin
      POSTGRES_PASSWORD: SecurePassword123!
      POSTGRES_DB: mue_nappy_db
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mueadmin -d mue_nappy_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - mue-network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mue-app
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://mueadmin:SecurePassword123!@postgres:5432/mue_nappy_db
      JWT_SECRET: ${JWT_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_PUBLIC_KEY: ${STRIPE_PUBLIC_KEY}
      NODE_ENV: production
      PORT: 5000
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - mue-network
    volumes:
      - ./attached_assets:/app/attached_assets

volumes:
  postgres-data:
    driver: local

networks:
  mue-network:
    driver: bridge
```

### Étape 3 : Lancer le Déploiement

```bash
# Construire et démarrer tous les conteneurs
docker compose up -d --build

# Vérifier que les conteneurs sont démarrés
docker compose ps

# Voir les logs en temps réel
docker compose logs -f
```

---

## Migrations et Initialisation

### Étape 1 : Exécuter les Migrations de Base de Données

```bash
# Se connecter au conteneur de l'application
docker compose exec app sh

# À l'intérieur du conteneur, exécuter les migrations
npm run db:push

# Quitter le conteneur
exit
```

**Alternative (depuis l'hôte) :**

```bash
# Exécuter la commande directement
docker compose exec app npm run db:push
```

### Étape 2 : Créer le Compte Administrateur

```bash
# Créer le compte admin avec le script de seed
docker compose exec app npm run seed:admin

# Vérification : le compte admin a été créé
# Email: admin@mue.ch
# Mot de passe: Admin@MUE2024
```

### Étape 3 : Seed des Données de Test (Optionnel)

Si vous avez des scripts de seed pour les produits, marques, etc. :

```bash
# Exécuter vos scripts de seed personnalisés
docker compose exec app npm run seed:products
docker compose exec app npm run seed:brands
```

---

## Vérification et Tests

### Étape 1 : Vérifier l'Application

```bash
# Tester si l'application répond
curl http://localhost:5000/api/settings

# Résultat attendu : JSON avec les paramètres du site
```

### Étape 2 : Tester l'Authentification

```bash
# Créer un utilisateur de test
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Résultat attendu : JSON avec token JWT et informations utilisateur
```

### Étape 3 : Vérifier la Base de Données

```bash
# Se connecter à PostgreSQL
docker compose exec postgres psql -U mueadmin -d mue_nappy_db

# Vérifier les tables
\dt

# Compter les utilisateurs
SELECT COUNT(*) FROM users;

# Quitter
\q
```

### Étape 4 : Accéder à l'Interface Web

Ouvrez votre navigateur et accédez à :
- **Application** : http://localhost:5000
- **Connexion admin** : admin@mue.ch / Admin@MUE2024

---

## Maintenance et Sauvegarde

### Sauvegarder la Base de Données

```bash
# Créer un dossier pour les backups
mkdir -p backups

# Sauvegarder la base de données
docker compose exec -T postgres pg_dump -U mueadmin mue_nappy_db > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Vérifier la sauvegarde
ls -lh backups/
```

### Restaurer une Sauvegarde

```bash
# Restaurer depuis une sauvegarde
cat backups/backup_YYYYMMDD_HHMMSS.sql | docker compose exec -T postgres psql -U mueadmin -d mue_nappy_db
```

### Voir les Logs

```bash
# Logs de tous les services
docker compose logs -f

# Logs de l'application uniquement
docker compose logs -f app

# Logs de PostgreSQL uniquement
docker compose logs -f postgres

# Dernières 100 lignes
docker compose logs --tail=100 app
```

### Redémarrer les Services

```bash
# Redémarrer tous les services
docker compose restart

# Redémarrer uniquement l'application
docker compose restart app

# Redémarrer uniquement PostgreSQL
docker compose restart postgres
```

### Arrêter et Supprimer les Conteneurs

```bash
# Arrêter les conteneurs
docker compose stop

# Arrêter et supprimer les conteneurs (garde les volumes)
docker compose down

# Arrêter, supprimer les conteneurs ET les volumes (ATTENTION : perte de données)
docker compose down -v
```

### Mettre à Jour l'Application

```bash
# Récupérer les dernières modifications
git pull origin main

# Reconstruire et redémarrer
docker compose up -d --build

# Exécuter les migrations si nécessaire
docker compose exec app npm run db:push
```

---

## Configuration NGINX pour la Production (Optionnel)

### Créer nginx.conf

Créez un fichier `nginx.conf` :

```nginx
upstream mue_app {
    server app:5000;
}

server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;

    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votredomaine.com www.votredomaine.com;

    # Certificats SSL (utiliser Let's Encrypt)
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    # Configuration SSL recommandée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Taille maximale des fichiers uploadés
    client_max_body_size 10M;

    # Logs
    access_log /var/log/nginx/mue_access.log;
    error_log /var/log/nginx/mue_error.log;

    # Proxy vers l'application
    location / {
        proxy_pass http://mue_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Assets statiques
    location /assets {
        proxy_pass http://mue_app/assets;
        proxy_cache_valid 200 1d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Ajouter NGINX à docker-compose.yml

Ajoutez ce service dans `docker-compose.yml` :

```yaml
  nginx:
    image: nginx:alpine
    container_name: mue-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    networks:
      - mue-network
```

---

## Troubleshooting (Dépannage)

### L'application ne démarre pas

```bash
# Vérifier les logs
docker compose logs app

# Vérifier que PostgreSQL est prêt
docker compose exec postgres pg_isready -U mueadmin
```

### Erreur de connexion à la base de données

```bash
# Vérifier les variables d'environnement
docker compose exec app env | grep DATABASE_URL

# Tester la connexion depuis le conteneur app
docker compose exec app sh
ping postgres
exit
```

### Problème de permissions

```bash
# Donner les bonnes permissions au dossier attached_assets
sudo chown -R 1000:1000 attached_assets
```

### Réinitialiser complètement

```bash
# ATTENTION : Supprime toutes les données
docker compose down -v
docker compose up -d --build
docker compose exec app npm run db:push
docker compose exec app npm run seed:admin
```

---

## Checklist de Déploiement

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Clé JWT générée (32+ caractères)
- [ ] Clés Stripe configurées
- [ ] Base de données PostgreSQL démarrée
- [ ] Application construite et démarrée
- [ ] Migrations exécutées (`npm run db:push`)
- [ ] Compte admin créé (`npm run seed:admin`)
- [ ] Test de connexion admin réussi
- [ ] Sauvegarde automatique configurée
- [ ] Certificats SSL configurés (production)
- [ ] Logs vérifiés sans erreur

---

## Support et Ressources

### Documentation Officielle
- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe Documentation](https://stripe.com/docs)

### Commandes Utiles

```bash
# Voir l'utilisation des ressources
docker stats

# Nettoyer les images non utilisées
docker image prune -a

# Voir les volumes
docker volume ls

# Inspecter un conteneur
docker inspect mue-app

# Exécuter une commande dans le conteneur
docker compose exec app sh
```

---

**Votre plateforme e-commerce Müe & Nappy est maintenant déployée avec Docker ! 🚀**
