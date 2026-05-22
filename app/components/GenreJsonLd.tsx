'use client'

import Script from 'next/script'

interface GenreJsonLdProps {
  genreKey: string
  genreDisplay: string
}

export function GenreJsonLd({ genreKey, genreDisplay }: GenreJsonLdProps) {
  const slug = `best-${genreKey}-games-to-stream`
  const url = `https://streamscout.gg/${slug}`

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "StreamScout",
            "item": "https://streamscout.gg"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `Best ${genreDisplay} Games to Stream`,
            "item": url
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": `Best ${genreDisplay} Games to Stream on Twitch`,
        "description": `Real-time ranked list of the best ${genreDisplay.toLowerCase()} games to stream on Twitch right now. Updated every 10 minutes with live discoverability scores, viewer counts, and competition analysis.`,
        "url": url,
        "isPartOf": { "@id": "https://streamscout.gg/#website" },
        "about": {
          "@type": "Thing",
          "name": `${genreDisplay} Twitch Streaming`
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `What are the best ${genreDisplay.toLowerCase()} games to stream on Twitch?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `The best ${genreDisplay.toLowerCase()} games to stream change frequently based on viewer demand and competition. StreamScout ranks every ${genreDisplay.toLowerCase()} game on Twitch by a composite score of discoverability (45%), viability (35%), and engagement (20%), updated every 10 minutes. Games scoring 7+ out of 10 are strong picks for small streamers.`
            }
          },
          {
            "@type": "Question",
            "name": `How do I find ${genreDisplay.toLowerCase()} games with low competition on Twitch?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Look for ${genreDisplay.toLowerCase()} games with high viewer counts but few active streamers -- StreamScout calls these 'Hidden Gems.' Games with 5-150 active channels and 800+ viewers score highest for discoverability. Avoid oversaturated categories where thousands of streamers compete for the same audience.`
            }
          }
        ]
      }
    ]
  }

  return (
    <Script
      id={`ld-genre-${genreKey}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
