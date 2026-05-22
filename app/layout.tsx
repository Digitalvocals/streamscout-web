import { FavoritesProvider } from './context/FavoritesContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StreamScout - Find Your Best Twitch Streaming Opportunities',
  description: 'Real-time analysis of every Twitch game. Discover hidden streaming opportunities with low competition and high discoverability. Free forever.',
  keywords: 'twitch streaming, best games to stream, twitch analytics, streaming opportunities, grow twitch channel, small streamer tips, twitch growth, stream discoverability',
  authors: [{ name: 'StreamScout' }],
  creator: 'StreamScout',
  publisher: 'StreamScout',
  metadataBase: new URL('https://streamscout.gg'),
  alternates: {
    canonical: 'https://streamscout.gg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://streamscout.gg',
    siteName: 'StreamScout',
    title: 'StreamScout - Find Your Best Twitch Streaming Opportunities',
    description: 'Real-time analysis of every Twitch game. Discover hidden streaming opportunities for small streamers.',
    images: [
      {
        url: 'https://streamscout.gg/og-image.png',
        width: 1200,
        height: 630,
        alt: 'StreamScout - Stop competing. Start getting discovered.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@StreamScoutGG',
    creator: '@StreamScoutGG',
    title: 'StreamScout - Find Your Best Twitch Streaming Opportunities',
    description: 'Real-time analysis of every Twitch game. Discover hidden streaming opportunities for small streamers.',
    images: ['https://streamscout.gg/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-6164260798755117',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X5JXBGFR5Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X5JXBGFR5Z');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6164260798755117"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Structured Data: Organization + WebSite */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://streamscout.gg/#organization",
                "name": "StreamScout",
                "url": "https://streamscout.gg",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://streamscout.gg/streamscout-logo.jpg"
                },
                "description": "Real-time Twitch analytics that help small streamers find games with high discoverability and low competition.",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "hello@streamscout.gg",
                  "contactType": "customer support"
                },
                "sameAs": [
                  "https://twitter.com/StreamScoutGG",
                  "https://twitch.tv/DigitalVocals"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://streamscout.gg/#website",
                "url": "https://streamscout.gg",
                "name": "StreamScout",
                "publisher": { "@id": "https://streamscout.gg/#organization" },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://streamscout.gg/?search={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "WebApplication",
                "@id": "https://streamscout.gg/#app",
                "name": "StreamScout",
                "url": "https://streamscout.gg",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "Find Twitch games where you can actually get discovered. Scores 2,000+ games across discoverability, viability, and engagement -- updated every 10 minutes.",
                "featureList": [
                  "Real-time opportunity scoring for 2,000+ Twitch games",
                  "Genre filtering across 13 categories",
                  "Trend detection with momentum badges",
                  "Historical analytics with sparkline trends",
                  "Find Alternatives recommendations",
                  "Soundcheck audio diagnostics for OBS"
                ]
              }
            ]
          }) }}
        />
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </body>
    </html>
  )
}