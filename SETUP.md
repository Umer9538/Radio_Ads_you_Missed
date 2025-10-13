# Radio Ads You Missed - Setup Guide

## Initial Setup Complete

The project foundation has been successfully set up with the following:

### ✅ Completed Setup

1. **Next.js 15** with TypeScript and App Router
2. **Tailwind CSS v4** for styling
3. **Prisma ORM** with PostgreSQL
4. **NextAuth v5** for authentication
5. **React Query** for server state management
6. **Zustand** for client state management
7. **Howler.js** for audio playback
8. **Project Structure** organized and ready

---

## Next Steps to Get Started

### 1. Database Setup

**Great news!** The project uses **SQLite** for the database, which means:
- ✅ No separate database server needed
- ✅ No installation required
- ✅ Database file is automatically created
- ✅ Perfect for development and small-to-medium deployments

The database file (`dev.db`) is already created in the `prisma/` folder and ready to use!

#### For Production (Optional):
If you need to scale, you can switch to PostgreSQL later by:
- Updating the datasource in `prisma/schema.prisma`
- Using Supabase, Neon, or any PostgreSQL provider

### 2. Update Environment Variables

The `.env.local` file is already configured with SQLite:

```bash
DATABASE_URL="file:./dev.db"  # ✅ Already set up
NEXTAUTH_SECRET="development-secret-key-change-in-production-min-32-chars"
```

For production, generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Database is Ready!

The database has already been created and the Prisma client generated. You can:

```bash
# View your database in a GUI
npm run db:studio

# If you make schema changes, push them with:
npm run db:push

# Or create a migration (for version control):
npm run db:migrate
```

### 4. Optional: Seed Database

Create a seed file to populate initial data:

**Create `prisma/seed.ts`:**
```typescript
import { PrismaClient } from '@prisma/client'
import { DEFAULT_CATEGORIES, DEFAULT_STATIONS } from '@/utils/constants'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    })
  }

  // Create stations
  for (const station of DEFAULT_STATIONS) {
    await prisma.station.upsert({
      where: { name: station.name },
      update: {},
      create: {
        name: station.name,
        frequency: station.frequency,
        location: station.location,
      },
    })
  }

  console.log('✅ Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Then install tsx and run the seed:
```bash
npm install -D tsx
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed database with initial data |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── ads/          # Ads endpoints
│   │   ├── stations/     # Stations endpoints
│   │   ├── offers/       # Offers endpoints
│   │   └── admin/        # Admin endpoints
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── admin/            # Admin panel components
│   ├── audio/            # Audio player components
│   ├── search/           # Search components
│   └── auth/             # Authentication components
├── lib/                   # Core libraries
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # NextAuth configuration
│   ├── env.ts            # Environment validation
│   └── providers.tsx     # React providers
├── stores/                # Zustand stores
│   └── audioStore.ts     # Audio player state
├── types/                 # TypeScript types
│   └── index.ts          # Type definitions
├── utils/                 # Utility functions
│   ├── constants.ts      # App constants
│   └── helpers.ts        # Helper functions
└── hooks/                 # Custom React hooks

prisma/
└── schema.prisma         # Database schema

```

---

## Database Schema Overview

### Core Models:
- **User** - User accounts with authentication
- **Station** - Radio stations
- **Category** - Ad categories
- **Ad** - Radio advertisements
- **Offer** - Promotional offers linked to ads
- **Claim** - User offer claims
- **Favorite** - User favorites
- **Alert** - User alerts for new ads
- **PlayHistory** - Analytics for ad plays
- **SearchHistory** - Search analytics

### Authentication Models (NextAuth):
- **Account** - OAuth accounts
- **Session** - User sessions
- **VerificationToken** - Email verification

---

## Development Workflow

### Phase 1: Core Features (Current)
1. ✅ Project setup and configuration
2. ⏳ Build API endpoints for ads, stations, categories
3. ⏳ Create search functionality
4. ⏳ Build audio player component
5. ⏳ Implement offer claiming
6. ⏳ Create user authentication pages

### Phase 2: Admin Panel
1. Admin dashboard
2. Ad upload and management
3. Station management
4. Analytics dashboard

### Phase 3: User Features
1. User dashboard
2. Favorites and history
3. Alert system
4. Profile management

---

## Troubleshooting

### Prisma Client Not Found
```bash
npm run db:generate
```

### Database File Missing
The database file should be at `prisma/dev.db`. If missing:
```bash
npm run db:push
```

### Permission Errors
Ensure the `prisma/` directory is writable

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors with Prisma Types
```bash
# Regenerate Prisma client
npm run db:generate
# Restart TypeScript server in VS Code
```

---

## Additional Configuration Needed

### For Production:

1. **Storage Setup (Cloudflare R2 / AWS S3)**
   - Set up bucket for audio files
   - Configure CDN
   - Update env variables

2. **Email Service (Resend)**
   - Sign up at resend.com
   - Get API key
   - Configure email templates

3. **Redis Cache (Upstash)**
   - Create Redis database
   - Get connection URL and token

4. **OAuth Providers (Optional)**
   - Google: Get client ID/secret from Google Cloud Console
   - Facebook: Get app ID/secret from Facebook Developers

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://authjs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

---

## Support

For issues or questions, refer to the PRD.md for detailed feature specifications.

**Happy Coding! 🚀**
