# Product Requirements Document (PRD)
# Radio Ads You Missed

**Version:** 1.0
**Date:** October 13, 2025
**Status:** Draft
**Owner:** Product Team

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Goals & Objectives](#goals--objectives)
4. [Target Audience](#target-audience)
5. [Product Overview](#product-overview)
6. [Features & Requirements](#features--requirements)
7. [Technical Requirements](#technical-requirements)
8. [User Stories](#user-stories)
9. [Success Metrics](#success-metrics)
10. [Project Phases](#project-phases)
11. [Future Considerations](#future-considerations)
12. [Appendix](#appendix)

---

## Executive Summary

**Radio Ads You Missed** is a web-based platform designed to bridge the gap between traditional radio advertising and digital engagement. The platform allows users to search, replay, and interact with radio advertisements from New Zealand radio stations, ensuring they never miss promotions, discounts, or special offers.

**Key Value Propositions:**
- On-demand access to radio advertisements
- Direct offer redemption and deal claiming
- Searchable archive of radio promotions
- Bridge between traditional media and digital interaction

**Target Launch:** Initial New Zealand market focus with scalability for international expansion.

---

## Problem Statement

### Current Pain Points:
1. **Missed Opportunities**: Users hear partial radio ads while driving/working but miss key details (phone numbers, promo codes, offer terms)
2. **No Replay Option**: Traditional radio is ephemeral - once an ad airs, there's no way to replay it
3. **Fragmented Information**: No centralized platform to discover current radio promotions across multiple stations
4. **Low Conversion**: Advertisers lose potential customers who were interested but couldn't capture offer details in time

### Solution:
A searchable, on-demand platform that archives radio advertisements and enables users to replay, search, and directly claim offers, creating value for both listeners and advertisers.

---

## Goals & Objectives

### Business Goals:
1. Create a sustainable platform connecting radio advertisers with engaged listeners
2. Increase radio advertising ROI by providing extended reach and measurable engagement
3. Build a scalable model that can expand beyond New Zealand

### Product Goals:
1. Launch MVP with core search, replay, and offer-claiming features within Phase 1
2. Onboard 5+ major New Zealand radio stations in first 6 months
3. Achieve 10,000 registered users within first year
4. Maintain platform performance (< 491 kB bundle size, < 2s load time)

### User Goals:
1. Easily find and replay missed radio advertisements
2. Access complete offer details and terms
3. Seamlessly claim promotions and special deals
4. Discover new offers across multiple stations

---

## Target Audience

### Primary Users:

**1. Radio Listeners (End Users)**
- **Demographics**: Ages 25-55, New Zealand residents
- **Behaviors**: Regular radio listeners (commuters, at-home workers)
- **Needs**: Access to missed promotional information, deal hunting, convenience

**2. Radio Advertisers**
- **Type**: Businesses advertising on NZ radio stations
- **Needs**: Extended reach, engagement metrics, measurable ROI

**3. Radio Stations**
- **Type**: New Zealand AM/FM radio stations
- **Needs**: Additional value proposition for advertisers, digital presence

### Secondary Users:

**4. Platform Administrators**
- **Type**: Internal team managing content and operations
- **Needs**: Efficient content management, analytics, user support tools

---

## Product Overview

### Platform Type:
Responsive web application (desktop and mobile)

### Core Functionality:
1. **Search & Discovery**: Find ads by keywords, brands, stations, or offer types
2. **Audio Streaming**: On-demand playback with advanced controls
3. **Offer Management**: Direct claiming and redemption of promotions
4. **User Engagement**: Favorites, alerts, and personalized recommendations
5. **Content Management**: Admin tools for uploading and managing ad inventory

### User Flow:
```
User Journey:
1. User hears partial ad on radio
2. Opens platform and searches by keyword/brand
3. Finds relevant ad in results
4. Replays ad (with option to skip to offer details)
5. Views linked offer details
6. Claims offer via integrated button/form
7. Receives confirmation and redemption instructions
```

---

## Features & Requirements

### 1. User-Facing Features

#### 1.1 Search Functionality
**Priority:** P0 (Critical)

**Requirements:**
- Full-text search across ad content, brands, products, and stations
- Auto-suggest/autocomplete for search queries
- Search history (for logged-in users)
- "Recently searched" quick access

**Advanced Filters:**
- Date range (today, this week, this month, custom range)
- Radio station (multi-select)
- Ad category (retail, automotive, food & beverage, etc.)
- Offer type (discount, free trial, event, etc.)
- Active offers only (toggle)

**Search Results Display:**
- Grid/list view toggle
- Sort by: Relevance, Date (newest/oldest), Popularity
- Pagination or infinite scroll
- Thumbnail/brand logo display
- Key offer highlights visible without clicking

---

#### 1.2 Audio Playback & Replay
**Priority:** P0 (Critical)

**Requirements:**
- Stream radio ads on demand
- Standard audio controls (play, pause, stop, seek)
- Playback speed control (0.5x, 1x, 1.25x, 1.5x, 2x)
- Volume control
- Timestamp display (current time / total duration)
- Progress bar with draggable seek functionality

**Advanced Features:**
- Skip to offer section (if metadata available)
- Repeat/loop functionality
- Keyboard shortcuts (spacebar = play/pause, arrow keys = seek)
- Background playback notification

**Technical:**
- Support for MP3, AAC, and WAV formats
- Adaptive bitrate streaming (if bandwidth limited)
- Audio caching for faster repeat playback
- Preload next ad in queue (if playlist mode)

---

#### 1.3 Offer Claiming
**Priority:** P0 (Critical)

**Requirements:**
- Clear "Claim Offer" or "Get Deal" call-to-action button
- Display offer details (terms, expiry, redemption method)
- Integration options:
  - External URL redirect (open in new tab)
  - Embedded form submission
  - Promo code display with copy button
  - QR code generation for in-store redemption

**User Experience:**
- One-click claiming for logged-in users
- Email/SMS confirmation with offer details
- Claimed offers visible in user dashboard
- Expiry reminders (optional notifications)

**Tracking:**
- Log claim events for analytics
- Prevent duplicate claims (if offer is one-per-user)
- Track redemption completions (if integration available)

---

#### 1.4 User Accounts & Personalization
**Priority:** P1 (High)

**Features:**
- User registration and login (email/password)
- Social authentication (Google, Facebook optional)
- User dashboard showing:
  - Recently played ads
  - Claimed offers
  - Favorites/saved ads
  - Active alerts

**Favorites:**
- Heart/star icon to save ads
- Dedicated "Favorites" page
- Remove from favorites option

**Alerts:**
- Set alerts for specific brands, categories, or keywords
- Notification delivery via:
  - In-platform notifications
  - Email alerts (opt-in)
  - Push notifications (future)
- Manage alert preferences in settings

---

#### 1.5 Browse & Discovery
**Priority:** P1 (High)

**Features:**
- Home page with featured/trending ads
- "New This Week" section
- Browse by station (station directory page)
- Browse by category (category navigation)
- "Ending Soon" offers section
- Recommended ads (based on listening history)

---

### 2. Admin Panel Features

#### 2.1 Content Management
**Priority:** P0 (Critical)

**Ad Upload & Management:**
- Bulk upload audio files
- Single ad upload form with fields:
  - Audio file (drag-and-drop)
  - Station
  - Brand/Advertiser
  - Product/Service
  - Category
  - Air date/time
  - Transcript/description
  - Offer details (if applicable)
  - Offer expiry date
  - External URL or redemption instructions
  - Tags/keywords
- Edit existing ads
- Delete/archive ads
- Preview ad before publishing

**Metadata Management:**
- Automatically extract duration from audio
- Optional timestamp tagging (e.g., "offer mentioned at 0:15")
- Thumbnail upload (brand logo)

---

#### 2.2 Station Management
**Priority:** P0 (Critical)

**Features:**
- Add/edit/remove radio stations
- Station details:
  - Name
  - Frequency
  - Location/region
  - Logo
  - Website URL
  - Status (active/inactive)
- View ads per station

---

#### 2.3 User Management
**Priority:** P1 (High)

**Features:**
- View all registered users
- User details (name, email, join date, activity)
- Search/filter users
- Disable/enable user accounts
- Export user list (CSV)

---

#### 2.4 Category & Tag Management
**Priority:** P1 (High)

**Features:**
- Create/edit/delete categories
- Create/edit/delete tags
- Assign multiple categories/tags to ads
- Category hierarchy support (optional)

---

#### 2.5 Analytics Dashboard
**Priority:** P1 (High)

**Metrics to Track:**
- Total ads uploaded
- Total users registered
- Total plays (overall and per ad)
- Total offer claims (overall and per offer)
- Most popular ads (by plays)
- Most claimed offers
- User engagement rate
- Average session duration
- Search queries (top searches)
- Traffic sources

**Visualizations:**
- Line charts for trends over time
- Bar charts for comparisons
- Pie charts for distribution
- Tables with sortable columns
- Date range selector

**Export:**
- Download reports as PDF or CSV
- Scheduled email reports (optional)

---

#### 2.6 Offer Management
**Priority:** P1 (High)

**Features:**
- View all offers
- Edit offer details and expiry dates
- Track claim counts per offer
- Enable/disable offers
- Link multiple ads to same offer

---

### 3. Technical Features

#### 3.1 Performance Optimization
**Priority:** P0 (Critical)

**Requirements:**
- Bundle size target: < 491 kB
- Initial load time: < 2 seconds (on 3G connection)
- Audio start playback: < 500ms
- Search results render: < 300ms

**Techniques:**
- Code splitting and lazy loading
- Image optimization (WebP format, lazy loading)
- Audio file compression
- CDN delivery for static assets
- Browser caching strategies
- Service worker for offline support (future)

---

#### 3.2 Audio Infrastructure
**Priority:** P0 (Critical)

**Requirements:**
- Audio storage solution (cloud storage)
- Streaming server or CDN with audio support
- Caching layer (browser cache + CDN cache)
- Format support: MP3 (primary), AAC, WAV
- Bitrate: 128 kbps (good balance of quality/size)

**Considerations:**
- Audio file naming convention
- Metadata extraction
- Secure signed URLs for audio files (prevent hotlinking)

---

#### 3.3 Security
**Priority:** P0 (Critical)

**Requirements:**
- HTTPS encryption for all traffic
- Secure authentication (JWT or session-based)
- Password hashing (bcrypt or Argon2)
- SQL injection prevention (parameterized queries/ORM)
- XSS protection (input sanitization, CSP headers)
- CSRF protection
- Rate limiting on API endpoints
- Secure file upload validation
- PII data encryption (user data)
- GDPR compliance (data export, deletion rights)

---

#### 3.4 Scalability
**Priority:** P1 (High)

**Requirements:**
- Horizontal scaling capability (load balancing)
- Database optimization (indexing, query optimization)
- Caching layer (Redis/Memcached)
- Asynchronous job processing (for uploads, notifications)
- Modular architecture for adding new stations/regions
- Multi-language support (i18n) for international expansion

---

#### 3.5 Responsive Design
**Priority:** P0 (Critical)

**Requirements:**
- Mobile-first design approach
- Breakpoints: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)
- Touch-optimized controls
- Accessible (WCAG 2.1 Level AA compliance)
- Cross-browser support (Chrome, Firefox, Safari, Edge)

---

## Technical Requirements

### Technology Stack Recommendations:

#### Frontend:
- **Framework**: Next.js (React-based, SEO-friendly, server-side rendering)
- **Styling**: Tailwind CSS (utility-first, lightweight)
- **State Management**: React Context API or Zustand (lightweight)
- **Audio Player**: React-H5-Audio-Player or custom Web Audio API implementation
- **Forms**: React Hook Form + Zod validation
- **API Client**: Axios or native fetch with interceptors

#### Backend:
- **Framework**: Next.js API Routes or Node.js + Express
- **Alternative**: Python FastAPI (if team prefers Python)
- **Database**: PostgreSQL (relational data) + Redis (caching)
- **ORM**: Prisma (TypeScript-first) or TypeORM
- **Authentication**: NextAuth.js or Passport.js
- **File Storage**: AWS S3, Cloudflare R2, or Google Cloud Storage
- **CDN**: Cloudflare or AWS CloudFront

#### Infrastructure:
- **Hosting**: Vercel (for Next.js) or AWS/GCP
- **Database Hosting**: Supabase, Railway, or AWS RDS
- **Audio Streaming**: CDN with audio optimization (Cloudflare, BunnyCDN)
- **Monitoring**: Sentry (error tracking), Google Analytics, Plausible
- **Email**: SendGrid, Postmark, or AWS SES

#### Development Tools:
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions or Vercel automated deployments
- **Testing**: Jest, React Testing Library, Playwright (E2E)
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

---

## User Stories

### As a Radio Listener:
1. I want to search for a radio ad I partially heard so that I can find the complete offer details
2. I want to filter ads by station so that I can find ads from my preferred station
3. I want to replay a radio ad so that I can hear the offer terms again
4. I want to skip to the offer section of an ad so that I don't have to listen to the entire ad
5. I want to claim an offer with one click so that I can quickly redeem the promotion
6. I want to save my favorite ads so that I can easily find them later
7. I want to set an alert for my favorite brands so that I'm notified when they have new offers
8. I want to view my claimed offers so that I can track which deals I've already used
9. I want to receive an email confirmation when I claim an offer so that I have the details saved

### As an Administrator:
1. I want to upload radio ads in bulk so that I can efficiently add new content
2. I want to link offers to ads so that users can claim promotions
3. I want to view analytics on ad engagement so that I can report ROI to advertisers
4. I want to manage user accounts so that I can handle support requests
5. I want to edit ad metadata so that I can correct mistakes or update information
6. I want to see which offers are most claimed so that I can understand user preferences
7. I want to export analytics reports so that I can share insights with stakeholders

### As an Advertiser:
1. I want to see how many times my ad was played so that I can measure reach
2. I want to know how many users claimed my offer so that I can track conversions
3. I want to update my offer expiry date so that I can extend or end promotions
4. I want to see demographic data of users engaging with my ads so that I can refine targeting

---

## Success Metrics

### Launch Metrics (First 3 Months):
- 5+ radio stations onboarded
- 500+ ads uploaded
- 1,000+ registered users
- 10,000+ ad replays
- 500+ offers claimed
- < 2s average page load time
- < 5% error rate

### Growth Metrics (6-12 Months):
- 10+ radio stations
- 2,000+ ads
- 10,000+ registered users
- 100,000+ ad replays
- 5,000+ offers claimed
- 20% month-over-month user growth
- 30% returning user rate

### Engagement Metrics:
- Average session duration: > 3 minutes
- Average ads per session: > 2
- Search-to-play conversion rate: > 40%
- Play-to-claim conversion rate: > 10%
- User retention (30-day): > 25%

### Technical Metrics:
- Uptime: 99.9%
- Page load time: < 2s (p95)
- Audio start time: < 500ms (p95)
- Mobile traffic: > 60%
- SEO: First page ranking for "NZ radio ads" keywords

---

## Project Phases

### Phase 1: MVP (Months 1-3)
**Goal**: Launch core platform with essential features

**Deliverables:**
- User-facing web app with search, browse, and replay
- Basic filters (station, date)
- Audio streaming infrastructure
- Admin panel for uploading ads
- Basic analytics dashboard
- Responsive design (mobile + desktop)
- User authentication
- Offer claiming (external URL redirect)

**Success Criteria:**
- 3-5 stations onboarded
- 200+ ads live
- Platform accessible and functional
- < 2s load time

---

### Phase 2: Enhanced Features (Months 4-6)
**Goal**: Add user engagement and personalization features

**Deliverables:**
- User accounts with dashboard
- Favorites functionality
- Alert system (email alerts)
- Advanced search filters
- Improved audio controls (playback speed, timestamps)
- Enhanced admin panel (bulk operations, better UX)
- Analytics improvements (engagement metrics)
- SEO optimization

**Success Criteria:**
- 5+ stations
- 1,000+ users registered
- 500+ offers claimed
- 20% returning users

---

### Phase 3: Growth & Optimization (Months 7-12)
**Goal**: Scale platform and improve retention

**Deliverables:**
- Push notifications
- SMS integration for offer confirmations
- Recommended ads (personalization engine)
- User listening history
- Social sharing features
- Performance optimizations
- A/B testing framework
- Advertiser self-service portal (optional)

**Success Criteria:**
- 10+ stations
- 10,000+ users
- Proven business model
- Positive user feedback/reviews

---

### Phase 4: Expansion (Year 2+)
**Goal**: Expand beyond New Zealand

**Deliverables:**
- Multi-region support
- Additional countries (Australia, UK, etc.)
- Multi-language support
- Mobile apps (iOS/Android)
- API for third-party integrations
- White-label solution for radio networks

---

## Future Considerations

### Potential Features:
1. **Mobile Apps**: Native iOS and Android apps for better offline support and notifications
2. **Voice Search**: "Hey Google, find that car dealership ad from The Rock FM"
3. **AI Transcription**: Automatic transcription of ads for better searchability
4. **Ad Insights**: Show users "people who listened to this also liked..."
5. **Playlist Creation**: Users can create playlists of ads
6. **Social Features**: Share ads with friends, comment on ads
7. **Gamification**: Badges for discovering new brands, claiming offers
8. **Integration with Smart Speakers**: "Alexa, play the latest ads from ZM"
9. **Podcast Integration**: Expand beyond radio to podcast ads

### Business Model Options:
1. **Commission on Claims**: Take percentage of offer redemptions
2. **Advertiser Subscriptions**: Charge advertisers for premium placement/analytics
3. **Station Partnerships**: Revenue share with radio stations
4. **Premium Users**: Ad-free experience, early access to offers
5. **Data Insights**: Anonymized listening data sold to market researchers

### Risks & Mitigations:

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Licensing issues with audio content | High | Medium | Secure agreements with stations upfront |
| Low user adoption | High | Medium | Strong marketing, partner with stations |
| Poor audio quality/streaming issues | High | Low | Robust testing, CDN with good coverage |
| High infrastructure costs | Medium | Medium | Optimize caching, usage-based pricing |
| Advertiser privacy concerns | Medium | Low | Clear data policies, anonymization |
| Competition from radio station apps | Medium | Medium | Focus on aggregation value, better UX |

---

## Appendix

### A. Data Models (Preliminary)

#### User
- id (UUID)
- email (unique)
- password_hash
- first_name
- last_name
- created_at
- last_login
- role (user/admin)

#### Ad
- id (UUID)
- title
- description
- audio_url
- duration (seconds)
- station_id (FK)
- brand
- category
- air_date
- created_at
- play_count
- tags (array)

#### Station
- id (UUID)
- name
- frequency
- location
- logo_url
- website_url
- active (boolean)

#### Offer
- id (UUID)
- ad_id (FK)
- title
- description
- terms
- expiry_date
- redemption_type (url/code/qr)
- redemption_value
- claim_count
- max_claims (optional)

#### Claim
- id (UUID)
- user_id (FK)
- offer_id (FK)
- claimed_at
- redeemed (boolean)
- redeemed_at

#### Favorite
- id (UUID)
- user_id (FK)
- ad_id (FK)
- created_at

#### Alert
- id (UUID)
- user_id (FK)
- type (brand/category/keyword)
- value
- active (boolean)

---

### B. API Endpoints (Preliminary)

**Public:**
- GET /api/ads (search, filters, pagination)
- GET /api/ads/:id
- GET /api/stations
- GET /api/categories

**Authenticated:**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/user/profile
- GET /api/user/favorites
- POST /api/user/favorites/:adId
- DELETE /api/user/favorites/:adId
- GET /api/user/claims
- POST /api/claims/:offerId
- GET /api/user/alerts
- POST /api/user/alerts
- DELETE /api/user/alerts/:id

**Admin:**
- POST /api/admin/ads (upload)
- PUT /api/admin/ads/:id
- DELETE /api/admin/ads/:id
- POST /api/admin/stations
- PUT /api/admin/stations/:id
- GET /api/admin/analytics
- GET /api/admin/users

---

### C. Design References
- Spotify (audio player controls)
- YouTube (search and filtering)
- Airbnb (clean, modern UI)
- SoundCloud (waveform visualization - optional)

---

### D. Compliance & Legal
- **Privacy Policy**: Required for user data collection
- **Terms of Service**: User agreements for platform usage
- **Copyright**: Licensing agreements with radio stations for audio content
- **GDPR**: If expanding to EU, ensure compliance
- **Accessibility**: WCAG 2.1 Level AA for government contracts (optional NZ requirement)

---

## Document Control

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Oct 13, 2025 | Product Team | Initial PRD creation |

**Approvals:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Technical Lead | | | |
| Stakeholder | | | |

---

**Next Steps:**
1. Review and approve PRD with stakeholders
2. Create technical architecture document
3. Design wireframes and mockups
4. Set up development environment
5. Begin Phase 1 implementation

