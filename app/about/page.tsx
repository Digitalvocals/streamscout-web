'use client'

import Link from 'next/link'
import Script from 'next/script'
import { BannerHeader } from '../components/BannerHeader'

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is StreamScout?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "StreamScout is a free tool that helps small streamers find games with good discoverability potential on Twitch. It analyzes every game on Twitch every 10 minutes and ranks them by opportunity score, helping streamers find games where they can actually get noticed."
      }
    },
    {
      "@type": "Question",
      "name": "Why was StreamScout built?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most small streamers hear the advice 'don't stream oversaturated games' but have no data to identify which games they should stream instead. StreamScout replaces guesswork with real-time analytics, making discoverability data accessible to everyone for free."
      }
    },
    {
      "@type": "Question",
      "name": "How does StreamScout's algorithm work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The algorithm scores games across three factors: Discoverability (can viewers find you in this category), Viability (is there enough viewership to be worth streaming), and Engagement (are viewers actively watching). These combine into an overall opportunity score updated every 10 minutes with live Twitch data."
      }
    },
    {
      "@type": "Question",
      "name": "What is Soundcheck?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Soundcheck is a free OBS plugin that runs a 30-second audio diagnostic before you go live. It measures mic level, game balance, noise floor, true peak, dynamic range, and hum detection -- then gives a score out of 100 with specific fixes ranked by impact. All audio processing happens locally inside OBS; no recordings are uploaded."
      }
    },
    {
      "@type": "Question",
      "name": "Does StreamScout cost anything?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. StreamScout is free forever with no paywalls, no premium tiers, and no signup required. Just visit streamscout.gg and use it."
      }
    }
  ]
}

export default function About() {
  return (
    <main className="min-h-screen bg-bg-primary p-4 md:p-8">
      <Script
        id="ld-faq-about"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BannerHeader />

      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-brand-primary hover:text-brand-primary/80 mb-8 inline-block">
          &larr; Back to StreamScout
        </Link>

        <h1 className="text-3xl font-bold text-text-primary mb-6">About StreamScout</h1>

        <div className="space-y-6 text-text-secondary">
          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">What is StreamScout?</h2>
            <p>
              StreamScout is a free tool that helps small streamers find games with
              good discoverability potential on Twitch. We analyze every game on Twitch every
              10 minutes and rank them by opportunity score - helping you find games
              where you can actually get noticed.
            </p>
          </section>

          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Why We Built This</h2>
            <p>
              As a small streamer, you've probably heard the advice: "don't stream
              oversaturated games." But which games <em className="text-brand-primary">should</em> you stream? That's
              the question StreamScout answers.
            </p>
            <p className="mt-2">
              We built this tool to solve our own problem - and decided to share it
              with the streaming community for free.
            </p>
          </section>

          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">How It Works</h2>
            <p className="mb-2">Our algorithm considers three factors:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong className="text-brand-primary">Discoverability</strong> - Can viewers actually find you in this category?</li>
              <li><strong className="text-brand-primary">Viability</strong> - Is there enough viewership to be worth streaming?</li>
              <li><strong className="text-brand-primary">Engagement</strong> - Are viewers actively watching, or just lurking?</li>
            </ul>
            <p className="mt-2">
              We combine these into an overall opportunity score, updated every 10 minutes
              with live Twitch data.
            </p>
          </section>

          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Our Values</h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong className="text-brand-primary">Free forever</strong> - No paywalls, no premium tiers</li>
              <li><strong className="text-brand-primary">No signup required</strong> - Just visit and use it</li>
              <li><strong className="text-brand-primary">Transparent</strong> - See all the data, not just what we pick for you</li>
              <li><strong className="text-brand-primary">Privacy-first</strong> - We don't collect your personal information</li>
            </ul>
          </section>

          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Soundcheck</h2>
            <p>
              Our free <a href="/soundcheck" className="text-brand-primary hover:underline">Soundcheck</a> tool
              runs a 30-second audio diagnostic right inside OBS. It measures your mic level, game balance,
              noise floor, and more -- then gives you a score and specific fixes before you go live.
            </p>
            <p className="mt-2">
              No audio data leaves your machine. The OBS plugin measures locally and only sends
              numbers to generate your report.
            </p>
          </section>

          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">About the Creator</h2>
            <p>
              StreamScout was created by a fellow streamer who wanted to make
              discoverability data accessible to everyone - not just those who can
              afford expensive analytics tools.
            </p>
            <p className="mt-2">
              Find me on Twitch:{' '}
              <a
                href="https://twitch.tv/DigitalVocals"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline"
              >
                twitch.tv/DigitalVocals
              </a>
            </p>
          </section>

          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Feedback & Suggestions</h2>
            <p>
              Have ideas for new features? Found a bug? We'd love to hear from you:{' '}
              <a href="mailto:hello@streamscout.gg" className="text-brand-primary hover:underline">
                hello@streamscout.gg
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
