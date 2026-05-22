# StreamScout

**Find Twitch games where you can actually get discovered.**

StreamScout analyzes the entire Twitch catalog in real-time to surface streaming opportunities most creators miss. Our scoring algorithm identifies games with strong viewership but low competition -- the sweet spot where new streamers can grow.

**Live at [streamscout.gg](https://streamscout.gg)**

---

## How It Works

StreamScout scores every active game on Twitch across three dimensions:

| Signal | Weight | What it measures |
|--------|--------|-----------------|
| **Discoverability** | 45% | Can a new streamer get found? Penalizes oversaturated categories. |
| **Viability** | 35% | Is there actually an audience watching? Filters out dead games. |
| **Engagement** | 20% | How engaged is the audience? Higher engagement = more growth potential. |

Data refreshes every 10 minutes. Scores update automatically. No manual curation.

---

## Features

- **Opportunity Scoring** -- Composite algorithm ranks 2,000+ games by streaming potential
- **Genre Filtering** -- 13 genre categories with AND/OR multi-select
- **Trend Detection** -- Momentum badges (Hidden Gem, Rising, Crowding) from viewer/channel velocity
- **Historical Analytics** -- Sparkline trends, best streaming times by day, 14-day history
- **Find Alternatives** -- Burnt out on a game? Get similar recommendations ranked by opportunity
- **Soundcheck** -- OBS plugin that scores your audio quality and coaches improvements
- **SEO-Optimized Genre Pages** -- Dedicated pages for every major streaming category

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, ISR) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Search | Fuse.js (client-side fuzzy matching) |
| Virtualization | react-window (performant long lists) |
| Hosting | Vercel (edge, 10-min ISR revalidation) |
| Backend | Flask API ([separate repo](https://github.com/Digitalvocals/Oracle_BE)) |
| Database | PostgreSQL on Railway |

---

## Architecture

```
                    Vercel (Edge)                          Railway
               +-------------------+              +-------------------+
  User -----→ | Next.js SSR/ISR   | ---REST---→  | Flask API         |
               | - Game list       |              | - Scoring engine  |
               | - Genre pages     |              | - Twitch poller   |
               | - Soundcheck UI   |              | - Cache layer     |
               +-------------------+              +--------+----------+
                                                           |
                                                  +--------v----------+
                                                  | PostgreSQL        |
                                                  | - Snapshots       |
                                                  | - Analytics       |
                                                  | - Soundcheck      |
                                                  +-------------------+
                                                           ^
                                                           |
                                                  +--------+----------+
                                                  | Twitch API        |
                                                  | (800 req/min cap) |
                                                  +-------------------+
```

**Caching strategy:** Three-tier fallback (memory -> file -> database) ensures the app never shows an empty state, even during cold starts or API outages.

---

## Local Development

```bash
# Install dependencies
npm install

# Set environment variable
export NEXT_PUBLIC_API_URL=https://streamscout-api.sparkslab.ai

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  page.tsx                          # Home -- ranked opportunity list
  layout.tsx                        # Root layout, metadata, analytics
  best-[genre]-games-to-stream/     # 13 genre-specific pages (SEO)
  soundcheck/                       # Audio diagnostic tool
  components/
    BannerHeader.tsx                # Hero banner
    streamscout-ui.tsx              # Shared UI primitives
components/
  GameCard.tsx                      # Individual game opportunity card
  GameList.tsx                      # Filterable, searchable game list
  Skeletons.tsx                     # Loading states
public/
  og-image.png                      # Social sharing image
  sitemap.xml                       # SEO sitemap
```

---

## Product Metrics

- **2,100+ users** since launch
- **6,800+ page views**
- **2,000+ games** scored and ranked in real-time
- **10-minute refresh cycle** -- always current data
- **13 genre categories** with dedicated SEO pages

---

## About

StreamScout was built in 15 days from concept to production. Product strategy, scoring algorithm design, and development direction by a 16-year Amazon product manager. Technical implementation via AI-augmented development (Claude Code) -- demonstrating that strong product thinking paired with modern AI tools can ship real products to real users at startup speed.

The product identified a gap in the Twitch creator tools market: most streamers pick games based on gut feel or copying top creators. StreamScout replaces intuition with data -- surfacing the games where small streamers have the best mathematical chance of being discovered.
