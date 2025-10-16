# 📻 Radio Ads You Missed

A revolutionary web platform that allows users to search, replay, and claim offers from New Zealand radio advertisements. Never miss a great deal or promotion you heard on the radio again!

## ✨ Features

### Core Functionality
- 🔍 **Advanced Search** - Search through thousands of radio ads by keyword, brand, station, or category
- 🎵 **Audio Playback** - Custom audio player with real-time frequency visualizer
- 🎁 **Offer Management** - Browse and claim exclusive promotional offers
- 📊 **Analytics Dashboard** - Comprehensive admin analytics with charts and metrics
- 🏷️ **Categorization** - Organized by categories (Retail, Automotive, Food & Beverage, etc.)
- 📻 **Multi-Station** - Support for 10 major NZ radio stations
- 👤 **User Profiles** - Personal dashboard with favorites, history, and preferences
- 🔐 **Social Login** - Sign in with Google OAuth for instant access

### Admin Management System
- 🎛️ **Admin Dashboard** - Comprehensive admin panel with stats and quick actions
- 📢 **Ad Management** - Full CRUD operations for advertisements with file upload
- 📻 **Station Management** - Create, edit, and delete radio stations
- 🏷️ **Category Management** - Manage ad categories with slug generation
- 👥 **User Management** - View, edit roles, and manage user accounts
- 📊 **Analytics** - Advanced analytics with filtering and data visualization
- 📁 **File Upload** - Drag-and-drop upload for audio files and images
- 🔒 **Role-Based Access** - Three-tier permission system (USER, ADMIN, SUPER_ADMIN)

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
   NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"

   # Admin Secret Keys (for creating admin accounts)
   SUPER_ADMIN_SECRET_KEY="super-secret-key-2025"
   ADMIN_SECRET_KEY="admin-secret-key-2025"

   # Google OAuth (optional but recommended)
   # Get these from: https://console.cloud.google.com/apis/credentials
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # App Configuration
   NODE_ENV="development"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
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

## 🔐 Authentication & Access

### User Authentication
- **Regular Sign In/Up:** `/auth/signin` and `/auth/signup`
- **Google OAuth:** Click "Sign in with Google" button (requires setup)
- **Admin Portal:** `/admin/auth/signin` (link available on user signin page)

### Default Login Credentials

After seeding the database, you can use these credentials:

#### Admin Account
- **Portal:** `/admin/auth/signin`
- **Email:** admin@radioadsmissed.co.nz
- **Password:** admin123
- **Role:** ADMIN (full management access)
- **Access:** Admin dashboard, user management, content management

#### Demo User Account
- **Portal:** `/auth/signin`
- **Email:** demo@radioadsmissed.co.nz
- **Password:** demo123
- **Role:** USER (standard access)
- **Access:** User dashboard, favorites, search, play history

### Creating Admin Accounts

Admin accounts can be created in two ways:

1. **Via Admin Registration Page** (`/admin/auth/signup`)
   - Use secret keys from `.env.local`
   - SUPER_ADMIN_SECRET_KEY creates SUPER_ADMIN accounts
   - ADMIN_SECRET_KEY creates ADMIN accounts

2. **Promote Existing Users** (Super Admin only)
   - Go to `/admin/users`
   - Click Edit on any user
   - Change role to ADMIN or SUPER_ADMIN

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
│   │   ├── admin/             # Admin portal
│   │   │   ├── ads/
│   │   │   │   ├── create/    # Create new ad
│   │   │   │   └── edit/[id]/ # Edit existing ad
│   │   │   ├── analytics/     # Analytics dashboard
│   │   │   ├── auth/          # Admin authentication
│   │   │   │   ├── signin/    # Admin sign in
│   │   │   │   └── signup/    # Admin registration
│   │   │   ├── categories/    # Category management
│   │   │   ├── stations/      # Station management
│   │   │   ├── users/         # User management
│   │   │   └── page.tsx       # Admin dashboard
│   │   ├── ads/[id]/          # Ad detail page
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   │   ├── ads/       # Ad CRUD
│   │   │   │   ├── categories/ # Category CRUD
│   │   │   │   ├── stations/  # Station CRUD
│   │   │   │   ├── users/     # User management
│   │   │   │   └── stats/     # Admin statistics
│   │   │   ├── ads/           # Public ad endpoints
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── categories/    # Public categories
│   │   │   ├── stations/      # Public stations
│   │   │   └── user/          # User data endpoints
│   │   ├── auth/              # User authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── dashboard/         # User dashboard
│   │   ├── profile/           # User profile
│   │   ├── search/            # Search results page
│   │   ├── stations/          # Stations page
│   │   ├── categories/        # Categories page
│   │   ├── globals.css        # Global styles & animations
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── admin/
│   │   │   └── FileUpload.tsx # File upload component
│   │   ├── ads/
│   │   │   └── AdCardNew.tsx  # Ad card component
│   │   ├── audio/
│   │   │   └── AudioPlayer.tsx # Custom audio player
│   │   ├── effects/
│   │   │   └── FloatingParticles.tsx
│   │   └── ui/
│   │       ├── GlassmorphicCard.tsx
│   │       ├── HolographicText.tsx
│   │       ├── MagneticButton.tsx
│   │       ├── MorphingBlob.tsx
│   │       ├── Pagination.tsx
│   │       └── Navbar.tsx
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

### Public Pages

#### Home Page (`/`)
- Hero section with animated radio icon
- Search bar with glassmorphic design
- Animated statistics cards
- Latest ads grid with hover effects
- CTA sections

#### Search Page (`/search`)
- Advanced search with filters
- Grid/Masonry view toggle
- Station, category, and offer filters
- Real-time search results
- Staggered card animations

#### Ad Detail Page (`/ads/[id]`)
- 3D card flip effect
- Custom audio player with visualizer
- Holographic offer cards
- Related ads sidebar
- Favorite and share buttons

#### Stations Page (`/stations`)
- Browse all radio stations
- Location-based filtering
- Station cards with details

#### Categories Page (`/categories`)
- Grid view of all categories
- Icon-based category cards
- Click to view category ads

### User Authentication

#### Sign In Page (`/auth/signin`)
- Glassmorphic form design
- Email/password authentication
- Google OAuth button
- Link to admin portal

#### Sign Up Page (`/auth/signup`)
- Registration form with validation
- Password confirmation
- Terms acceptance
- Google OAuth option

### User Pages (Protected)

#### User Dashboard (`/dashboard`)
- Activity overview and statistics
- Favorites count and recent plays
- Quick action buttons
- Recently played ads
- Sign out button

#### User Profile (`/profile`)
- Edit personal information
- Change password
- Two-factor authentication setup
- Notification preferences
- Activity history

### Admin Portal (ADMIN/SUPER_ADMIN only)

#### Admin Dashboard (`/admin`)
- Platform statistics (users, ads, stations, offers)
- Total plays and claims metrics
- Recent advertisements table
- Quick action buttons
- Pagination for ads list

#### Ad Management
- **Create Ad** (`/admin/ads/create`) - Upload audio/image, set metadata
- **Edit Ad** (`/admin/ads/edit/[id]`) - Update existing advertisements
- **Delete Ads** - From admin dashboard table

#### Station Management (`/admin/stations`)
- Grid view of all stations
- Create new station with modal
- Edit station details (name, frequency, location)
- Delete stations with protection

#### Category Management (`/admin/categories`)
- Grid view of all categories
- Create categories with auto-slug generation
- Edit category (name, slug, description, icon)
- Delete categories with protection

#### User Management (`/admin/users`) (ADMIN/SUPER_ADMIN only)
- List all users with pagination
- Search by email or name
- Filter by role (USER/ADMIN/SUPER_ADMIN)
- Edit user roles with permissions
- Delete users with cascade
- View user activity (favorites, plays, claims)

#### Analytics Dashboard (`/admin/analytics`)
- Comprehensive metrics and charts
- Date range filtering
- Export data capabilities
- Performance insights

#### Admin Authentication
- **Admin Sign In** (`/admin/auth/signin`) - Separate admin login
- **Admin Registration** (`/admin/auth/signup`) - Create admin with secret keys

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

## 🔧 Google OAuth Setup

To enable Google OAuth authentication:

1. **Create OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 Client ID

2. **Configure OAuth Consent Screen**
   - Set application name: "Radio Ads You Missed"
   - Add authorized domains: `localhost` (for development)
   - Set user support email

3. **Add Authorized Redirect URIs**
   ```
   Development: http://localhost:3000/api/auth/callback/google
   Production: https://yourdomain.com/api/auth/callback/google
   ```

4. **Update Environment Variables**
   - Copy Client ID and Client Secret
   - Add to `.env.local`:
     ```env
     GOOGLE_CLIENT_ID="your-actual-client-id-here.apps.googleusercontent.com"
     GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
     ```

5. **Restart Development Server**
   ```bash
   npm run dev
   ```

Once configured, users can sign in/up with Google on both user and admin authentication pages.

## 🌟 Unique Features

1. **Real-time Audio Visualization** - 32-bar frequency analyzer using Web Audio API
2. **3D Card Effects** - Interactive card flip with backface culling
3. **Magnetic Buttons** - Physics-based cursor following with spring animations
4. **Glassmorphism Throughout** - Modern glass-effect design pattern
5. **Particle System** - 60+ individually animated particles
6. **Morphing Backgrounds** - Organic blob shapes with smooth transitions
7. **Holographic Text** - Multi-color gradients with shimmer effects
8. **Staggered Animations** - Sequential entrance animations for lists
9. **Complete Admin System** - Full-featured content management system
10. **Role-Based Access Control** - Secure three-tier permission system
11. **File Upload System** - Drag-and-drop audio and image uploads
12. **Google OAuth Integration** - Seamless social authentication

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🔒 Security Features

- **JWT-based Authentication** - NextAuth v5 with secure session management
- **Password Hashing** - bcrypt with 10 salt rounds
- **Role-Based Access Control** - Three-tier permission system:
  - **USER** - Access to user dashboard, favorites, search, and profile
  - **ADMIN** - Full content management + user role editing (except super admins)
  - **SUPER_ADMIN** - Complete system access including admin management
- **Protected Routes** - Middleware-based route protection
- **API Security** - All admin endpoints require authentication and role check
- **Permission Checks** - Prevents privilege escalation:
  - Users cannot modify their own roles
  - Only SUPER_ADMIN can assign SUPER_ADMIN role
  - Only SUPER_ADMIN can delete other admins
- **Secret Key Authentication** - Admin account creation requires secret keys
- **Google OAuth** - Secure social authentication with automatic user creation
- **CSRF Protection** - Built-in NextAuth CSRF token validation
- **Cascade Deletion** - Safe data cleanup when deleting users
- **Email Verification** - Automatic verification for OAuth users

## 🚦 API Endpoints

### Public Endpoints
- `GET /api/ads` - List ads with pagination and filters
- `GET /api/ads/[id]` - Get ad details
- `GET /api/stations` - List radio stations
- `GET /api/categories` - List categories with ad counts
- `GET /api/offers/[id]` - Get offer details
- `POST /api/offers/[id]/claim` - Claim an offer

### Authentication Endpoints
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/session` - Get current session
- **Google OAuth**: `/api/auth/callback/google` - OAuth callback

### User Endpoints (Protected - USER role)
- `POST /api/ads/[id]/play` - Track ad play
- `POST /api/ads/[id]/favorite` - Add/remove favorite
- `GET /api/user/favorites` - Get user favorites
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/profile` - Update user profile

### Admin Endpoints (Protected - ADMIN/SUPER_ADMIN role)

#### Ad Management
- `POST /api/admin/ads` - Create new advertisement
- `PUT /api/admin/ads/[id]` - Update advertisement
- `DELETE /api/admin/ads/[id]` - Delete advertisement
- `POST /api/admin/upload` - Upload audio/image files

#### Station Management
- `POST /api/admin/stations` - Create new station
- `PUT /api/admin/stations/[id]` - Update station
- `DELETE /api/admin/stations/[id]` - Delete station (with protection)

#### Category Management
- `POST /api/admin/categories` - Create new category
- `PUT /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category (with protection)

#### User Management
- `GET /api/admin/users` - List users with search/filter/pagination
- `PUT /api/admin/users/[id]` - Update user role (permission checks)
- `DELETE /api/admin/users/[id]` - Delete user with cascade

#### Statistics & Analytics
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/analytics` - Get detailed analytics data

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

Built with ❤️ using Next.js, Prisma, Framer Motion, and NextAuth

**Current Version:** 2.0.0
**Last Updated:** January 2025

## 📝 Changelog

### Version 2.0.0 (January 2025)
- ✅ Complete admin management system
- ✅ User management with role editing
- ✅ Station and category CRUD operations
- ✅ File upload system for audio and images
- ✅ Google OAuth social authentication
- ✅ Analytics dashboard with metrics
- ✅ User dashboard and profile pages
- ✅ Role-based access control (USER/ADMIN/SUPER_ADMIN)
- ✅ Admin authentication with secret keys
- ✅ Pagination for all list views
- ✅ Search and filter functionality

### Version 1.0.0 (October 2025)
- Initial release with core features
- Home page with revolutionary UI
- Search functionality
- Ad detail pages with audio player
- Basic authentication
