# 📻 Radio Ads You Missed

A revolutionary web platform that allows users to search, replay, and claim offers from New Zealand radio advertisements. Never miss a great deal or promotion you heard on the radio again!

## ✨ Features

### Core Functionality
- 🔍 **Advanced Search** - Search through thousands of radio ads by keyword, brand, station, or category
- 🎵 **Audio Playback** - Custom audio player with real-time frequency visualizer
- 🎁 **Offer Management** - Browse and claim exclusive promotional offers
- 📊 **Analytics** - Track plays, searches, and popular advertisements
- 🏷️ **Categorization** - Organized by categories (Retail, Automotive, Food & Beverage, etc.)
- 📻 **Multi-Station** - Support for 10 major NZ radio stations

### Revolutionary UI/UX
- 🌈 **Glassmorphism Design** - Modern glass-effect cards with backdrop blur
- ✨ **3D Animations** - Card tilt effects with mouse tracking
- 🧲 **Magnetic Interactions** - Buttons that follow your cursor with physics
- 🎨 **Holographic Text** - Gradient text with shimmer effects
- 💫 **Floating Particles** - Atmospheric background animations
- 🌊 **Morphing Blobs** - Organic animated background shapes
- 📊 **Audio Visualizer** - Real-time 32-bar frequency visualization
- 🔄 **3D Card Flip** - Interactive flip animation for ad details
- 🎭 **Framer Motion** - Smooth physics-based animations throughout

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Advanced animation library
- **React Icons** - Icon library
- **@react-three/fiber** - 3D rendering support

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma 6.17.1** - Modern ORM
- **SQLite** - Lightweight database (easy setup, production-ready)
- **NextAuth v5** - Authentication with JWT sessions
- **bcryptjs** - Password hashing

### Tools & Services
- **Turbopack** - Fast bundler for Next.js
- **TypeScript** - Static type checking
- **ESLint** - Code linting

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd radio-ads-you-missed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Default Login Credentials

After seeding the database, you can use these credentials:

### Admin Account
- **Email:** admin@radioadsmissed.co.nz
- **Password:** admin123
- **Role:** ADMIN (full access)

### Demo User Account
- **Email:** demo@radioadsmissed.co.nz
- **Password:** demo123
- **Role:** USER (standard access)

## 📁 Project Structure

```
radio-ads-you-missed/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seed script
├── public/
│   └── sample-audio/          # Audio file storage
├── src/
│   ├── app/
│   │   ├── ads/[id]/          # Ad detail page
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── search/            # Search results page
│   │   ├── globals.css        # Global styles & animations
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── audio/
│   │   │   └── AudioPlayer.tsx    # Custom audio player
│   │   ├── effects/
│   │   │   └── FloatingParticles.tsx
│   │   └── ui/
│   │       ├── GlassmorphicCard.tsx
│   │       ├── HolographicText.tsx
│   │       ├── MagneticButton.tsx
│   │       └── MorphingBlob.tsx
│   ├── generated/
│   │   └── prisma/            # Generated Prisma client
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── prisma.ts          # Prisma client singleton
│   ├── utils/
│   │   ├── constants.ts       # App constants
│   │   └── helpers.ts         # Utility functions
│   └── middleware.ts          # Route protection
└── package.json
```

## 🎯 Key Pages

### Home Page (`/`)
- Hero section with animated radio icon
- Search bar with glassmorphic design
- Animated statistics cards
- Latest ads grid with hover effects
- CTA sections

### Search Page (`/search`)
- Advanced search with filters
- Grid/Masonry view toggle
- Station, category, and offer filters
- Real-time search results
- Staggered card animations

### Ad Detail Page (`/ads/[id]`)
- 3D card flip effect
- Custom audio player with visualizer
- Holographic offer cards
- Related ads sidebar
- Favorite and share buttons

### Sign In Page (`/auth/signin`)
- Glassmorphic form design
- Email/password authentication
- Google OAuth option
- Demo credentials display

### Sign Up Page (`/auth/signup`)
- Multi-step registration form
- Password confirmation
- Terms acceptance
- Social signup option

## 🎨 Custom Animations

The project includes custom CSS animations:

- `gradient-x`, `gradient-y`, `gradient-xy` - Multi-directional gradient animations
- `float` - Vertical floating effect
- `pulse-glow` - Pulsing shadow animation
- Custom scrollbar with gradient
- Mesh gradient backgrounds
- Holographic effects
- Neon glow text shadows

## 📊 Database Schema

### Main Models
- **User** - User accounts and authentication
- **Station** - Radio stations (10 NZ stations)
- **Category** - Ad categories (10 categories)
- **Ad** - Radio advertisements
- **Offer** - Promotional offers linked to ads
- **Claim** - User offer claims
- **Favorite** - User favorite ads
- **PlayHistory** - Ad play tracking
- **SearchHistory** - User search history
- **Alert** - User alerts for keywords

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:migrate       # Create and run migrations
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:seed          # Seed database with sample data

# Combined
npm run postinstall      # Auto-generate Prisma client after install
```

## 🌟 Unique Features

1. **Real-time Audio Visualization** - 32-bar frequency analyzer using Web Audio API
2. **3D Card Effects** - Interactive card flip with backface culling
3. **Magnetic Buttons** - Physics-based cursor following with spring animations
4. **Glassmorphism Throughout** - Modern glass-effect design pattern
5. **Particle System** - 60+ individually animated particles
6. **Morphing Backgrounds** - Organic blob shapes with smooth transitions
7. **Holographic Text** - Multi-color gradients with shimmer effects
8. **Staggered Animations** - Sequential entrance animations for lists

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🔒 Security Features

- JWT-based authentication with NextAuth v5
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Role-based access control (USER, ADMIN, SUPER_ADMIN)
- CSRF protection
- Secure session management

## 🚦 API Endpoints

### Public Endpoints
- `GET /api/ads` - List ads with filters
- `GET /api/ads/[id]` - Get ad details
- `GET /api/stations` - List radio stations
- `GET /api/categories` - List categories
- `GET /api/offers/[id]` - Get offer details
- `POST /api/offers/[id]/claim` - Claim an offer

### Protected Endpoints
- `POST /api/ads/[id]/play` - Track ad play (optional auth)
- `POST /api/ads/[id]/favorite` - Add to favorites (requires auth)
- `GET /api/user/favorites` - Get user favorites (requires auth)

### Admin Endpoints
- `POST /api/admin/ads` - Create new ad (requires ADMIN role)
- `PUT /api/admin/ads/[id]` - Update ad (requires ADMIN role)
- `DELETE /api/admin/ads/[id]` - Delete ad (requires ADMIN role)

## 🎭 Animation Libraries Used

- **Framer Motion** - Core animation framework
- **React Spring** - Physics-based animations
- **CSS Custom Properties** - Dynamic styling
- **Web Audio API** - Audio visualization
- **Three.js** (ready for 3D features)

## 📈 Performance Optimizations

- Turbopack for fast development builds
- Image optimization with Next.js Image component
- Route prefetching
- Code splitting with dynamic imports
- SQLite for lightweight database operations
- Efficient component re-renders with React hooks

## 🤝 Contributing

This is a portfolio/demo project. Feel free to fork and customize for your own use!

## 📄 License

This project is created for educational and portfolio purposes.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Prisma Team** - Excellent ORM
- **Framer Motion** - Beautiful animations
- **NZ Radio Stations** - Inspiration for the project concept
- **Vercel** - Hosting platform

## 📞 Support

For issues or questions:
1. Check the [documentation](https://docs.nextjs.org)
2. Review the code comments
3. Check the Prisma schema for data structure

---

Built with ❤️ using Next.js, Prisma, and Framer Motion

**Current Version:** 1.0.0
**Last Updated:** October 2025
