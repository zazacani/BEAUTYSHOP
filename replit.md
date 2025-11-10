# Müe & Nappy E-Commerce Platform

## Overview

Müe & Nappy is a modern, multilingual e-commerce platform for selling premium beauty products in the Swiss market. The platform features two distinct brands:
- **MÜE**: Hair and body care products (produits cheveux & corps)
- **NAPPY**: Hair care products (produits cheveux)

The application supports three languages (French, German, and English) and provides a complete online shopping experience with admin management capabilities.

The platform features a clean, minimalist design inspired by premium beauty retailers like Sephora and Aesop, with a focus on product-first presentation and user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 2025)

### Database Relations & Schema Fixes
- **Added Drizzle ORM Relations**: Implemented complete relation definitions in `shared/schema.ts` for all table relationships (orders↔orderItems, orders↔users, orders↔discountCodes, products↔reviews, etc.)
- **Fixed Order Status Updates**: Resolved "Cannot read properties of undefined (reading 'referencedTable')" error by properly defining relations
- **Review Submission Fix**: Corrected `insertReviewSchema` to exclude `userId` field (now automatically taken from authenticated user's JWT token for security)

### Admin Features
- **Discount Code Management**: 
  - Backend CRUD operations fully functional (POST, GET, DELETE /api/discount)
  - Fixed decimal-to-string conversion for discount values
  - React Rules of Hooks violation resolved in DiscountManagement component
  - Admin interface for creating percentage and fixed-amount discount codes

### Security Improvements
- User identity validation: `userId` now always extracted from JWT token, never trusted from frontend
- Server-side price recalculation for all orders
- Idempotent payment processing via unique `paymentIntentId` constraint

## System Architecture

### Frontend Architecture

**Framework & Build Tools:**
- React 18 with TypeScript for type-safe component development
- Vite for fast development and optimized production builds
- Wouter for lightweight client-side routing

**State Management:**
- TanStack Query (React Query) for server state management and caching
- React Context API for global state (authentication, language preferences)
- Local component state for UI interactions

**Styling & UI:**
- Tailwind CSS with custom configuration for utility-first styling
- shadcn/ui component library (New York variant) for consistent UI components
- Custom CSS variables for theming with light/dark mode support
- Google Fonts (Inter for UI, Playfair Display for headings)

**Key Design Patterns:**
- Component composition with reusable UI primitives
- Controlled components for forms with validation
- Custom hooks for shared logic (useIsMobile, useToast)
- Context providers for cross-cutting concerns (AuthContext, LanguageContext)

### Backend Architecture

**Framework & Runtime:**
- Express.js with TypeScript for type-safe API development
- Node.js 20+ runtime environment

**Architectural Pattern:**
- Service Layer pattern for business logic separation
- Repository pattern for data access abstraction
- SOLID principles throughout the codebase

**API Structure:**
- RESTful API design with resource-based endpoints
- JWT-based authentication with Bearer token scheme
- Role-based access control (USER/ADMIN roles)
- Middleware chain for authentication and authorization

**Core Services:**
- AuthService: Handles registration, login, and token management
- ProductService: Manages product CRUD operations and search
- DiscountService: Validates and applies discount codes
- OrderService: Processes orders with transaction support
- AdminService: Provides dashboard statistics and metrics
- UserService: Manages user profiles and password changes
- ReviewService: Manages product reviews and ratings

**Repositories:**
- UserRepository: User data access
- ProductRepository: Product data access with multilingual search
- DiscountRepository: Discount code management
- OrderRepository: Order and order item persistence with relational queries
- ReviewRepository: Product review management

### Database Design

**ORM & Migrations:**
- Drizzle ORM for type-safe database queries
- PostgreSQL dialect with Neon serverless support
- Migration system using drizzle-kit
- **Complete relation definitions** for all foreign key relationships

**Schema Design:**
- users: User accounts with role-based access, shipping address fields
- brands: Product brands (MÜE and NAPPY) with unique names
- products: Multilingual product catalog (titleFr/De/En, descriptionFr/De/En) with nullable brandId FK
- discountCodes: Single-use and multi-use discount codes (percentage or fixed amount)
- orders: Order records with status tracking and shipping information
- orderItems: Line items for each order with price at purchase
- reviews: Product reviews with ratings (1-5) and optional comments
- siteSettings: Global site configuration

**Key Features:**
- UUID primary keys for all tables
- Timestamp tracking (createdAt, updatedAt) for audit trails
- Decimal precision for monetary values (10,2)
- Foreign key relationships with referential integrity
- Indexes on frequently queried fields (email, code)
- Brand system with nullable FK (products can exist without brand assignment)
- **Unique constraint on orders.paymentIntentId** for payment idempotency
- **Unique constraint on reviews** (one review per user per product)
- **Drizzle relations** defined for all table relationships enabling `.with()` queries

### Authentication & Security

**Authentication Flow:**
- bcrypt password hashing with 10 rounds for secure storage
- JWT tokens with 7-day expiration period
- Token verification middleware for protected routes
- Automatic token refresh on valid requests
- User identity extraction from JWT (never trusted from frontend)

**Security Measures:**
- Environment variable-based JWT secret
- Password strength requirements enforced
- SQL injection prevention through parameterized queries
- XSS protection via React's built-in escaping
- CORS configuration for production deployments
- Server-side validation for all user inputs

**Authorization:**
- Role-based access control with USER and ADMIN roles
- Admin-only routes protected by requireAdmin middleware
- User-scoped data access (orders, profile, reviews)

### Internationalization (i18n)

**Implementation:**
- Custom LanguageContext for global language state
- Translation dictionary with nested keys
- LocalStorage persistence for language preference
- Dynamic content rendering based on selected language

**Supported Languages:**
- French (FR) - Primary language
- German (DE) - Secondary language
- English (EN) - Tertiary language

**Multilingual Data:**
- Database-level multilingual support for products
- Separate columns for each language (titleFr, titleDe, titleEn)
- Search across all language fields simultaneously

### File Structure

**Monorepo Organization:**
- `/client` - Frontend React application
- `/server` - Backend Express application
- `/shared` - Shared TypeScript types and schemas (with Drizzle relations)
- `/migrations` - Database migration files
- `/attached_assets` - Static assets and generated images

**Client Structure:**
- `/src/components` - Reusable UI components
- `/src/pages` - Route-based page components
- `/src/contexts` - React Context providers (Auth, Language)
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and API client

**Server Structure:**
- `/services` - Business logic layer
- `/repositories` - Data access layer (using Drizzle queries with relations)
- `/middleware` - Express middleware functions (auth, admin)
- `/db` - Database configuration and seed scripts

## External Dependencies

### Third-Party Services

**Email Service (Planned):**
- Password reset functionality requires email provider integration
- Contact form submissions may require email delivery service

**Delivery Estimation API (Planned):**
- Swiss Post API integration for delivery time calculation
- Alternative: Manual configuration of delivery estimates

**Payment Gateway (Stripe Payment Element):**
- **On-site payment processing** with Stripe Payment Element (no external redirects)
- Server-side price validation and recalculation for security
- CHF currency support for Swiss market
- **Idempotent order creation** via unique paymentIntentId constraint
- **Security features**:
  - User ownership validation against PaymentIntent metadata
  - Payment status verification (requires "succeeded" status)
  - Server-side price calculation prevents client tampering
- **User experience**:
  - Seamless checkout flow without leaving the site
  - "Try Another Card" option for failed payments
  - Iframe-safe implementation for Replit environment (redirect: "if_required")
- Test mode enabled with Stripe test keys
- Future enhancement: Webhook integration for payment notifications

### Key NPM Packages

**Frontend:**
- @tanstack/react-query - Server state management
- wouter - Lightweight routing
- @radix-ui/* - Headless UI primitives for shadcn/ui
- class-variance-authority - Component variant management
- date-fns - Date manipulation utilities
- @stripe/stripe-js & @stripe/react-stripe-js - Stripe Payment Element

**Backend:**
- @neondatabase/serverless - Neon PostgreSQL driver
- drizzle-orm - TypeScript ORM with relational queries
- bcryptjs - Password hashing
- jsonwebtoken - JWT token generation and verification
- express - Web framework
- stripe - Payment processing integration (API v2024-06-20)

**Development:**
- typescript - Type checking
- vite - Build tool and dev server
- drizzle-kit - Database migration tool
- tsx - TypeScript execution for scripts

### Database Provider

**Neon Serverless PostgreSQL:**
- Serverless PostgreSQL database
- WebSocket support for real-time queries
- Connection pooling with @neondatabase/serverless
- Automatic scaling and management

**Alternative: Docker PostgreSQL:**
- See DEPLOYMENT.md for Docker setup instructions
- Standard PostgreSQL 16+ compatible
- Suitable for self-hosted deployments

**Configuration:**
- DATABASE_URL environment variable required
- Connection string format: `postgresql://user:password@host:port/database`
- SSL/TLS enabled by default for Neon (optional for local Docker)

### Environment Variables

**Required:**
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - Secret key for JWT signing (minimum 32 characters recommended)
- STRIPE_SECRET_KEY - Stripe API secret key for payment processing
- STRIPE_PUBLIC_KEY - Stripe publishable key for frontend integration
- VITE_STRIPE_PUBLIC_KEY - Stripe publishable key for Vite frontend

**Optional:**
- NODE_ENV - Environment mode (development/production)
- PORT - Server port (defaults to 5000)
- REPLIT_DEV_DOMAIN - Development domain for Stripe redirects

### Admin Seeding

**Super Admin Account:**
- Email: admin@mue.ch
- Password: Admin@MUE2024
- Created via seed script: `npm run seed:admin`
- Used for initial platform administration

## Development & Deployment

### Local Development
```bash
npm install
npm run db:push        # Sync database schema
npm run seed:admin     # Create admin account
npm run dev            # Start development server (port 5000)
```

### Production Deployment
See **DEPLOYMENT.md** for complete Docker deployment guide with PostgreSQL database setup.

## Known Issues & Technical Debt

- Migration files need cleanup (some address columns lack proper migrations but exist in DB)
- Debug logging should be removed from production order status update route
- Email service integration pending for password reset functionality
- Stripe webhook integration planned for better payment notifications
