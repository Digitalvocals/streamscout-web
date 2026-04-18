'use client'

import Link from 'next/link'
import { BannerHeader } from '../components/BannerHeader'

export default function SoundcheckLanding() {
  return (
    <main className="min-h-screen bg-bg-primary p-4 md:p-8">
      <BannerHeader />

      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-brand-primary hover:text-brand-primary/80 mb-8 inline-block"
        >
          &larr; Back to StreamScout
        </Link>

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Soundcheck
          </h1>
          <p className="text-xl text-text-secondary mb-2">
            Sound like a pro before you go live.
          </p>
          <p className="text-text-tertiary">
            A 30-second audio diagnostic that runs right inside OBS.
          </p>
        </div>

        {/* What it does */}
        <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            What it does
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2" style={{ color: 'var(--brand-primary)' }}>15s</div>
              <p className="text-text-primary font-medium">Talk</p>
              <p className="text-text-tertiary text-sm">Greet your chat like normal</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2" style={{ color: 'var(--brand-primary)' }}>10s</div>
              <p className="text-text-primary font-medium">Silence</p>
              <p className="text-text-tertiary text-sm">We measure your room noise</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2" style={{ color: 'var(--brand-primary)' }}>5s</div>
              <p className="text-text-primary font-medium">Game Audio</p>
              <p className="text-text-tertiary text-sm">We check your balance</p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            What you get
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold shrink-0"
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                85
              </div>
              <div>
                <p className="text-text-primary font-medium">A score out of 100</p>
                <p className="text-text-tertiary text-sm">
                  Green, yellow, or red. Know instantly if your audio is stream-ready.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(129, 140, 248, 0.15)' }}>
                <span style={{ color: '#818cf8', fontSize: '20px' }}>Fix</span>
              </div>
              <div>
                <p className="text-text-primary font-medium">Specific fixes, ranked by impact</p>
                <p className="text-text-tertiary text-sm">
                  Not "adjust your levels" -- actual steps like "lower Desktop Audio by 3 dB."
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(0, 220, 130, 0.15)' }}>
                <span style={{ color: '#00dc82', fontSize: '20px' }}>+13</span>
              </div>
              <div>
                <p className="text-text-primary font-medium">Track your improvement</p>
                <p className="text-text-tertiary text-sm">
                  See your score go up as you apply fixes. History tracked on your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What it measures */}
        <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            What it measures
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Mic Level', desc: 'LUFS loudness' },
              { name: 'Game Balance', desc: 'Voice-to-game ratio' },
              { name: 'Noise Floor', desc: 'Background hiss' },
              { name: 'True Peak', desc: 'Clipping detection' },
              { name: 'Dynamic Range', desc: 'Volume consistency' },
              { name: 'Hum Detection', desc: '50/60 Hz buzz' },
            ].map((metric) => (
              <div key={metric.name} className="border border-bg-hover rounded-lg p-3">
                <p className="text-text-primary font-medium text-sm">{metric.name}</p>
                <p className="text-text-tertiary text-xs">{metric.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            Your audio stays on your machine
          </h2>
          <p className="text-text-secondary">
            All audio processing happens locally inside OBS. No recordings, no uploads,
            no files on disk. Only numerical measurements (like "-17.2 LUFS") are sent to
            generate your report. We never hear your voice.
          </p>
        </section>

        {/* Coming Soon CTA */}
        <section className="bg-brand-primary/10 border border-brand-primary/30 rounded-lg p-8 mb-6 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Coming Soon
          </h2>
          <p className="text-text-secondary mb-4">
            Soundcheck is in beta testing with a small group of streamers.
            The OBS plugin will be available for free download soon.
          </p>
          <p className="text-text-tertiary text-sm">
            Want early access? Reach out at{' '}
            <a href="mailto:hello@streamscout.gg" className="text-brand-primary hover:underline">
              hello@streamscout.gg
            </a>
          </p>
        </section>

        {/* Already have it? */}
        <div className="text-center mb-12">
          <Link
            href="/soundcheck/dashboard"
            className="text-text-tertiary hover:text-brand-primary transition-colors text-sm"
          >
            Already have the plugin? Go to your dashboard &rarr;
          </Link>
        </div>
      </div>
    </main>
  )
}
