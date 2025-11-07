# Design Guidelines: Beauté Suisse E-commerce Platform

## Design Approach
**Reference-Based: E-commerce Excellence**
Primary inspiration from premium e-commerce experiences:
- **Sephora/Glossier**: Clean product presentation with strong visual hierarchy
- **Aesop**: Minimalist aesthetic with focus on product imagery
- **Net-a-Porter**: Sophisticated grid layouts and refined typography

Key Principle: Product-first design with elegant simplicity - let the beauty products be the hero.

## Core Design Elements

### A. Typography
**Font System** (Google Fonts):
- **Primary**: 'Inter' - Clean, modern sans-serif for UI and body text
- **Accent**: 'Playfair Display' - Elegant serif for product titles and hero headlines

**Hierarchy**:
- Hero Headlines: text-5xl md:text-6xl font-serif (Playfair)
- Product Titles: text-2xl font-semibold
- Section Headers: text-3xl font-bold
- Body Text: text-base leading-relaxed
- Captions/Meta: text-sm text-gray-600

### B. Layout System
**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 24**
- Component padding: p-6 or p-8
- Section spacing: py-16 md:py-24
- Grid gaps: gap-6 or gap-8

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Product grids: grid-cols-2 md:grid-cols-3 lg:grid-cols-4

### C. Color Implementation
**Strict Palette** (as specified):
- Background: White (#FFFFFF)
- Primary Text: Black (#000000)
- Accent/CTAs: Yellow (#FCD34D - Tailwind yellow-300 or #F59E0B - yellow-500)

**Usage Rules**:
- Yellow ONLY for: Primary buttons, active states, sale badges, key CTAs
- Black for: All text, borders, icons
- Subtle grays ONLY for: Disabled states, dividers (gray-200)

### D. Component Library

**Product Cards**:
- White background with subtle shadow on hover (hover:shadow-xl)
- Image aspect ratio: aspect-square
- Hover effect: Swap image_1 to image_2 with smooth transition
- Yellow "Add to Cart" button at bottom
- Price in bold black, discount price with strikethrough

**Navigation**:
- Fixed header with white background, black text
- Logo left, language selector + search + cart right
- Sticky navigation: sticky top-0 z-50 backdrop-blur-sm bg-white/95

**Buttons**:
- Primary: bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-yellow-500
- Secondary: border-2 border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white
- Ghost: text-black underline hover:text-yellow-500

**Forms**:
- Clean input fields: border-2 border-gray-200 focus:border-yellow-400 rounded-lg px-4 py-3
- Labels above inputs, text-sm font-medium
- Error states: border-red-500 with red text below

**Shopping Cart**:
- Slide-in drawer from right
- Product thumbnails with quantity controls
- Yellow checkout button at bottom
- Discount code input with apply button

**Admin Dashboard**:
- Sidebar navigation with white background
- Data tables with alternating row colors (subtle gray-50)
- Yellow accent for active menu items

### E. Page-Specific Layouts

**Homepage**:
- Hero section: Full-width image banner (h-96 md:h-screen) with overlay text, yellow CTA button with backdrop-blur-md bg-white/20
- Immediate product grid below (no gap)
- Featured categories as image cards with yellow hover border

**Product Detail**:
- Two-column layout (lg:grid-cols-2)
- Left: Large product images with thumbnail carousel
- Right: Product info sticky on scroll, quantity selector, yellow "Add to Cart"
- Delivery estimate section with subtle border

**Admin Product Form**:
- Tabbed interface for languages (FR/DE/EN)
- Image upload with preview
- Yellow "Save Product" button

## Images

**Product Images**: 
- Primary use: Product catalog, detail pages (user-uploaded via admin)
- Quality: High-resolution, white/neutral backgrounds preferred
- Format: Square aspect ratio for consistency

**Hero Section**:
- Large banner image featuring beauty products or lifestyle imagery
- Placement: Homepage hero (h-96 md:h-screen)
- Overlay: Semi-transparent with yellow CTA button (backdrop-blur-md for glass effect)

**Category Pages**:
- Category header image (h-64) with category name overlay

**Admin**: No decorative images, functional product thumbnails only

## Animations
Minimal and purposeful:
- Image hover swap: transition-opacity duration-300
- Cart slide-in: transition-transform duration-300
- Button hovers: transition-colors duration-200
- NO scroll-triggered animations or complex effects