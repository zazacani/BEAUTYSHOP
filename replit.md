# Beauté Suisse E-Commerce Platform

## Overview

Beauté Suisse is a modern, multilingual e-commerce platform for selling beauty products in the Swiss market. The application supports three languages (French, German, and English) and provides a complete online shopping experience with admin management capabilities.

The platform features a clean, minimalist design inspired by premium beauty retailers like Sephora and Aesop, with a focus on product-first presentation and user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

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

**Repositories:**
- UserRepository: User data access
- ProductRepository: Product data access with multilingual search
- DiscountRepository: Discount code management
- OrderRepository: Order and order item persistence

### Database Design

**ORM & Migrations:**
- Drizzle ORM for type-safe database queries
- PostgreSQL dialect with Neon serverless support
- Migration system using drizzle-kit

**Schema Design:**
- users: User accounts with role-based access
- products: Multilingual product catalog (titleFr/De/En, descriptionFr/De/En)
- discountCodes: Single-use and multi-use discount codes
- orders: Order records with status tracking
- orderItems: Line items for each order

**Key Features:**
- UUID primary keys for all tables
- Timestamp tracking (createdAt) for audit trails
- Decimal precision for monetary values (10,2)
- Foreign key relationships with referential integrity
- Indexes on frequently queried fields (email, code)

### Authentication & Security

**Authentication Flow:**
- bcrypt password hashing with 10 rounds for secure storage
- JWT tokens with 7-day expiration period
- Token verification middleware for protected routes
- Automatic token refresh on valid requests

**Security Measures:**
- Environment variable-based JWT secret
- Password strength requirements enforced
- SQL injection prevention through parameterized queries
- XSS protection via React's built-in escaping
- CORS configuration for production deployments

**Authorization:**
- Role-based access control with USER and ADMIN roles
- Admin-only routes protected by requireAdmin middleware
- User-scoped data access (orders, profile)

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
- `/shared` - Shared TypeScript types and schemas
- `/migrations` - Database migration files
- `/attached_assets` - Static assets and generated images

**Client Structure:**
- `/src/components` - Reusable UI components
- `/src/pages` - Route-based page components
- `/src/contexts` - React Context providers
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions and API client

**Server Structure:**
- `/services` - Business logic layer
- `/repositories` - Data access layer
- `/middleware` - Express middleware functions
- `/db` - Database configuration and seed scripts

## External Dependencies

### Third-Party Services

**Email Service (Planned):**
- Password reset functionality requires email provider integration
- Contact form submissions may require email delivery service

**Delivery Estimation API (Planned):**
- Swiss Post API integration for delivery time calculation
- Alternative: Manual configuration of delivery estimates

**Payment Gateway (Not Implemented):**
- Stripe or similar payment processor needed for checkout
- PCI compliance considerations for payment handling

### Key NPM Packages

**Frontend:**
- @tanstack/react-query - Server state management
- wouter - Lightweight routing
- @radix-ui/* - Headless UI primitives for shadcn/ui
- class-variance-authority - Component variant management
- date-fns - Date manipulation utilities

**Backend:**
- @neondatabase/serverless - Neon PostgreSQL driver
- drizzle-orm - TypeScript ORM
- bcryptjs - Password hashing
- jsonwebtoken - JWT token generation and verification
- express - Web framework

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

**Configuration:**
- DATABASE_URL environment variable required
- Connection string format: `postgresql://user:password@host:port/database`
- SSL/TLS enabled by default

### Environment Variables

**Required:**
- DATABASE_URL - PostgreSQL connection string
- JWT_SECRET - Secret key for JWT signing

**Optional:**
- NODE_ENV - Environment mode (development/production)
- PORT - Server port (defaults to Vite/Express defaults)

### Admin Seeding

**Super Admin Account:**
- Email: admin@mue.ch
- Password: Admin@MUE2024
- Created via seed script: `npm run seed:admin`
- Used for initial platform administration