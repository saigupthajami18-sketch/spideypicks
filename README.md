# 🕷️ Spidey Picks — Your Multiverse Movie Guide

A cinematic movie discovery platform built with **Next.js 16**, powered by real-time data from **The Movie Database (TMDB) API**. Designed with a Spider-Man multiverse theme featuring particle animations, glassmorphism UI, and smooth scroll-driven interactions.

🔗 **Live Demo**: _[Deploy to Vercel to get your live URL]_

---

## ✨ Features

### 🎬 Core Functionality
- **Real-time Movie Data** — Fetches trending, now playing, top rated, upcoming, and popular movies from the TMDB API with automatic retry logic and error handling
- **Movie Detail Pages** — Dynamic `[id]` routes with full movie info: backdrop hero, poster, rating, runtime, genres, cast & crew, and OTT streaming provider availability (via TMDB Watch Providers API)
- **Search** — Instant movie search via the navbar with real-time results in the Explore section
- **Genre-based Discovery** — Browse movies across 19+ genres with dynamic filtering
- **Watchlist** — Client-side persistent watchlist using `localStorage` with cross-component event synchronization via `CustomEvent` dispatching
- **Collection Watch Order** — For movies belonging to a franchise/collection (e.g., Spider-Man trilogy), automatically displays the chronological watch order

### 🎨 Design & UI
- **Spider-Web Particle Canvas** — Custom HTML5 Canvas animation in the hero section that renders 80 animated particles connected by proximity-based web lines
- **Scroll Sequence Animation** — Scroll-driven cinematic intro sequence
- **Auto-cycling Hero Carousel** — 5-movie featured carousel with crossfade transitions, progress dots, and thumbnail navigation
- **Multiverse Portal Section** — Animated CSS portal rings with rotating borders
- **Glassmorphism Components** — Frosted glass cards with backdrop-filter blur effects
- **Responsive Design** — Full mobile/tablet/desktop support with CSS media queries, hamburger navigation, and adaptive grid layouts
- **Movie Quiz** — Interactive Spider-Man themed movie trivia quiz section
- **Custom Spider SVG Logo** — Hand-crafted SVG spider icon in the navbar

### 🛠️ Technical Highlights
- **Server-Side Rendering (SSR)** — Main page uses Next.js `async` Server Components for API calls at build/request time (ISR with 1-hour revalidation)
- **Incremental Static Regeneration (ISR)** — `revalidate = 3600` ensures fresh data every hour without rebuilding
- **Parallel Data Fetching** — `Promise.all()` for 8 simultaneous TMDB API calls on the homepage
- **Error Boundaries** — Graceful error handling with themed "CONNECTION LOST" fallback UI
- **Type-Safe API Layer** — Fully typed TMDB service layer (`lib/tmdb.ts`) with TypeScript interfaces for Movie, Cast, Crew, Genre, Provider, and Video types
- **Automatic Retry** — TMDB fetch wrapper with configurable retries and 500ms exponential backoff
- **SEO Optimized** — Metadata API with Open Graph tags, semantic HTML structure, and descriptive title/description

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Google Fonts (Bebas Neue, Outfit, Space Grotesk)
│   ├── page.tsx            # Homepage — SSR with parallel TMDB API calls
│   ├── globals.css         # Design system — CSS variables, animations, components
│   └── movie/[id]/
│       └── page.tsx        # Dynamic movie detail page with collection watch order
├── components/
│   ├── Navbar.tsx          # Fixed navbar with scroll-aware glassmorphism + search
│   ├── HeroSection.tsx     # Canvas particle animation + auto-cycling carousel
│   ├── ScrollSequence.tsx  # Scroll-driven cinematic intro
│   ├── MovieSection.tsx    # Reusable horizontal-scroll movie row
│   ├── MovieCard.tsx       # Movie card with hover overlay + watchlist toggle
│   ├── ExploreSection.tsx  # Search + genre filter browsing
│   ├── MultiverseSection.tsx # Animated multiverse portal visual
│   ├── QuizSection.tsx     # Interactive movie trivia quiz
│   ├── WatchlistSection.tsx # Persistent watchlist display
│   ├── WatchlistButton.tsx # Add/remove watchlist CTA
│   ├── VideoTransition.tsx # Video transition effects
│   └── Footer.tsx          # Site footer
└── lib/
    └── tmdb.ts             # TMDB API service layer with types + retry logic
```

### Data Flow

```
TMDB API  →  lib/tmdb.ts (typed fetch + retry)  →  Server Components (SSR/ISR)
                                                          ↓
                                                    Client Components
                                                    (interactivity, localStorage)
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 + Custom CSS Variables + Inline Styles |
| **Animations** | Framer Motion, GSAP, HTML5 Canvas, CSS Keyframes |
| **3D/Visual** | Three.js (available for future enhancements) |
| **Icons** | Lucide React + Custom SVGs |
| **API** | TMDB (The Movie Database) REST API v3 |
| **State** | React useState/useEffect + localStorage + CustomEvent |
| **Fonts** | Google Fonts (Bebas Neue, Outfit, Space Grotesk) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/spidey-picks.git
cd spidey-picks

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
```

> 📝 Get a free TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🌐 Deployment (Vercel)

This project is optimized for **one-click deployment on Vercel**:

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add the environment variable:
   - `NEXT_PUBLIC_TMDB_API_KEY` = your TMDB API key
5. Click **Deploy**

That's it! Vercel auto-detects Next.js and handles everything.

### Alternative Platforms

| Platform | Command |
|----------|---------|
| **Vercel** | `vercel --prod` (CLI) |
| **Netlify** | Requires `@netlify/plugin-nextjs` |
| **Railway** | `npm run build && npm start` |
| **Docker** | Use Next.js standalone output mode |

---

## 📋 Resume Description

> **Spidey Picks — Multiverse Movie Discovery Platform**
>
> Built a full-stack movie discovery web app using **Next.js 16**, **TypeScript**, and the **TMDB API**, featuring server-side rendering with incremental static regeneration (ISR). Implemented parallel API data fetching for 8+ endpoints, a typed service layer with automatic retry logic, dynamic routing for 500K+ movies, and client-side state management using localStorage with cross-component event synchronization. Designed a premium UI with HTML5 Canvas particle animations, glassmorphism effects, scroll-driven interactions using Framer Motion & GSAP, and fully responsive layouts. Includes real-time search, genre filtering, OTT provider availability, collection watch ordering, and an interactive quiz feature.

### Key Technical Talking Points for Interviews

- **SSR vs CSR decision**: Homepage uses Server Components for SEO and fast initial load; interactive features (watchlist, search, quiz) are Client Components
- **ISR strategy**: `revalidate: 3600` balances freshness with build performance — no need for SSG rebuilds
- **Error resilience**: Retry wrapper with exponential backoff prevents flaky API responses from breaking the UI
- **Type safety**: Full TypeScript coverage from API response types to component props
- **Performance**: `Promise.all()` parallelizes 8 API calls — homepage data loads in ~1-2 seconds
- **State sync**: `CustomEvent` pattern syncs watchlist state across unrelated components without Redux/Context overhead

---

## 📄 License

MIT — free for personal and commercial use.
