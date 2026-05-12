# 🛍️ MACENG MARKET - Dragon Nest Item Store

A modern, professional item store platform built with Nuxt 3, Vue 3, and TypeScript. Dedicated to selling Dragon Nest items with a clean, responsive interface.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit **http://localhost:3000** 🛍️

## 📁 Project Structure

```
├── pages/              # Store pages (catalog, item detail, admin)
├── components/         # Vue components
├── composables/        # Reusable logic
├── server/            # API endpoints
├── public/            # Static assets
├── assets/            # CSS & images
└── prisma/            # Database schema (Item, Order, User, Review)
```

## ✨ Features

- ✅ **Item Catalog** - Browse and search items
- ✅ **Category Filtering** - Filter by category and attributes
- ✅ **Item Reviews** - User ratings and reviews
- ✅ **Admin Panel** - Manage products, orders, users
- ✅ **Mobile Responsive** - Perfect on all devices
- ✅ **TypeScript** - Type-safe development
- ✅ **Prisma ORM** - Database management
- ✅ **SSR Ready** - Server-side rendering

## 📚 Documentation

- [MACENG_MARKET_DESIGN.md](MACENG_MARKET_DESIGN.md) - Store design blueprint
- [PROJECT_INSTRUCTIONS.md](PROJECT_INSTRUCTIONS.md) - Development guidelines

## 📦 Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Backend**: Node.js API routes
- **Database**: SQLite (Prisma ORM)
- **Styling**: CSS with responsive design
- **Build**: Vite

## 🔐 Environment Variables

Create `.env` from `.env.example`:

```env
DATABASE_URL="file:./dev.db"
SITE_TITLE="MACENG MARKET"
SITE_DESCRIPTION="Dragon Nest item store"
```

## 📄 License

MIT License - Free to use and modify

---

**Version**: 1.0.0  
**Status**: Store Launch Ready ✨
