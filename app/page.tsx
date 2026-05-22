import { Suspense } from 'react'
import Script from 'next/script'
import GameList from '@/components/GameList'
import { GameListSkeleton } from '@/components/Skeletons'
import { BannerHeader } from '@/app/components/BannerHeader'

export const revalidate = 600 // ISR: Regenerate every 10 minutes

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://streamscout-api.sparkslab.ai'

async function getInitialGames() {
  try {
    const res = await fetch(`${API_URL}/api/v1/analyze?limit=100`, {
      next: { revalidate: 600 }
    })
    
    if (!res.ok) throw new Error('Failed to fetch')
    
    const data = await res.json()
    return {
      games: data.top_opportunities || [],
      hasError: false
    }
  } catch (error) {
    console.error('Error fetching games:', error)
    return {
      games: [],
      hasError: true
    }
  }
}

export default async function Home() {
  const { games, hasError } = await getInitialGames()
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the best game to stream on Twitch right now?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The best game to stream changes every day. StreamScout analyzes every game on Twitch every 10 minutes and ranks them by a composite score of discoverability (45%), viability (35%), and engagement (20%). Games scoring 7+ out of 10 are strong picks for small streamers looking to grow."
        }
      },
      {
        "@type": "Question",
        "name": "How does StreamScout's scoring algorithm work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StreamScout scores every game across three dimensions: Discoverability (45% weight) measures whether new streamers can get found -- games with 5-150 active channels score highest. Viability (35%) checks if there is a real audience watching, requiring 800-30,000 concurrent viewers. Engagement (20%) measures how actively the audience is watching. These combine into an overall opportunity score updated every 10 minutes with live Twitch data."
        }
      },
      {
        "@type": "Question",
        "name": "What are Hidden Gem games on Twitch?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Hidden Gems are games where viewership is growing but the number of streamers has stayed flat. This means there is increasing audience demand with limited competition -- the ideal window for a small streamer to establish themselves before the category gets crowded. StreamScout automatically detects and badges these momentum signals."
        }
      },
      {
        "@type": "Question",
        "name": "Is StreamScout free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, StreamScout is completely free. No signup required, no paywalls, no premium tiers. The full game analyzer with every game on Twitch, genre filtering, trend detection, and historical analytics is available to everyone at streamscout.gg."
        }
      },
      {
        "@type": "Question",
        "name": "How often does StreamScout update its data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StreamScout refreshes its data every 10 minutes by pulling live stream counts directly from the Twitch API. Historical trends are tracked over a 14-day rolling window to detect momentum shifts like rising games, hidden gems, and crowding categories."
        }
      }
    ]
  }

  return (
    <main className="min-h-screen bg-bg-primary p-4 md:p-8">
      <Script
        id="ld-faq-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Banner Header */}
      <BannerHeader />
      
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <p className="text-body text-text-secondary mb-2">
            Find games where you can actually get discovered. Ranked by real data, updated every 10 minutes.
          </p>
          <p className="text-caption text-text-tertiary">
            Our algorithm weighs <span className="text-brand-primary font-semibold">discoverability</span> (45%), <span className="text-brand-primary font-semibold">viability</span> (35%), and <span className="text-brand-primary font-semibold">engagement</span> (20%) to find opportunities most streamers miss.
          </p>
          <p className="text-caption text-text-tertiary mt-2">
            Scores <span className="text-brand-primary font-semibold">7+</span> are strong picks. Look for <span className="text-brand-primary font-semibold">Hidden Gem</span> badges - high-potential games most streamers overlook.
          </p>
        </div>
        
        {/* Game List */}
        <Suspense fallback={<GameListSkeleton />}>
          <GameList initialGames={games} hasError={hasError} />
        </Suspense>
      </div>
    </main>
  )
}
