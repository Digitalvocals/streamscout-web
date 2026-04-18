'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BannerHeader } from '../../components/BannerHeader'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-90f4a9.up.railway.app'

interface SoundcheckScore {
  id: number
  score: number
  traffic_light: string
  archetype: string
  created_at: string
}

interface SoundcheckReport {
  id: number
  score: number
  traffic_light: string
  archetype: string
  measurements: Record<string, number>
  report: {
    score: number
    traffic_light: string
    archetype: string
    issues: Array<{
      severity: string
      metric: string
      headline: string
      detail: string
      fix: string
      score_impact: string
    }>
    wins: string[]
    raw_measurements: Record<string, number>
  }
  is_override: boolean
  override_score: number | null
  created_at: string
}

const ARCHETYPES: Record<string, { label: string; desc: string }> = {
  'voice-forward': {
    label: 'Voice-Forward (Just Chatting, Talk Shows)',
    desc: 'Your voice is the show. Game audio is background or absent.',
  },
  'balanced': {
    label: 'Balanced (RPG, Adventure, Story Games)',
    desc: 'Voice and game share the stage. Both matter to your viewers.',
  },
  'game-forward': {
    label: 'Game-Forward (FPS, Racing, Rhythm)',
    desc: 'Game audio is part of the experience. Voice stays clear but game is prominent.',
  },
  'game-dominant': {
    label: 'Game-Dominant (Music, Horror Ambiance)',
    desc: 'Game audio drives the stream. Voice is commentary, not the main event.',
  },
}

const TRAFFIC_COLORS: Record<string, string> = {
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
}

function getToken(): string {
  if (typeof window === 'undefined') return ''
  let token = localStorage.getItem('soundcheck_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('soundcheck_token', token)
  }
  return token
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function SoundcheckPage() {
  const [token, setToken] = useState('')
  const [latest, setLatest] = useState<SoundcheckReport | null>(null)
  const [history, setHistory] = useState<SoundcheckScore[]>([])
  const [pairingCode, setPairingCode] = useState('')
  const [pairingExpiry, setPairingExpiry] = useState(0)
  const [isPaired, setIsPaired] = useState(false)
  const [loading, setLoading] = useState(true)
  const [archetype, setArchetype] = useState('')
  const [archetypeUpdating, setArchetypeUpdating] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async (userToken: string) => {
    try {
      const [latestRes, historyRes] = await Promise.allSettled([
        axios.get(`${API_URL}/api/v1/soundcheck/latest`, {
          params: { user_token: userToken },
        }),
        axios.get(`${API_URL}/api/v1/soundcheck/history`, {
          params: { user_token: userToken, limit: 20 },
        }),
      ])

      if (latestRes.status === 'fulfilled') {
        setLatest(latestRes.value.data)
        setArchetype(latestRes.value.data.archetype || '')
        setIsPaired(true)
      }
      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value.data.history || [])
      }
    } catch {
      // No data yet is fine
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = getToken()
    setToken(t)
    fetchData(t)
  }, [fetchData])

  useEffect(() => {
    if (pairingExpiry <= 0) return
    const interval = setInterval(() => {
      setPairingExpiry((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setPairingCode('')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [pairingExpiry])

  const generatePairingCode = async () => {
    setError('')
    try {
      const res = await axios.post(`${API_URL}/api/v1/soundcheck/pair`, {
        user_token: token,
      })
      setPairingCode(res.data.pairing_code)
      setPairingExpiry(res.data.expires_in)
    } catch {
      setError('Failed to generate pairing code. Try again.')
    }
  }

  const unpair = async () => {
    try {
      await axios.delete(`${API_URL}/api/v1/soundcheck/pair`, {
        data: { user_token: token },
      })
      setIsPaired(false)
      setPairingCode('')
    } catch {
      setError('Failed to unpair.')
    }
  }

  const updateArchetype = async (newArchetype: string) => {
    setArchetypeUpdating(true)
    try {
      await axios.put(`${API_URL}/api/v1/soundcheck/archetype`, {
        user_token: token,
        archetype: newArchetype,
      })
      setArchetype(newArchetype)
    } catch {
      setError('Failed to update archetype.')
    } finally {
      setArchetypeUpdating(false)
    }
  }

  const bestScore = history.length > 0
    ? Math.max(...history.map((h) => h.score))
    : null
  const avgLast5 = history.length > 0
    ? Math.round(
        history.slice(0, Math.min(5, history.length)).reduce((s, h) => s + h.score, 0) /
        Math.min(5, history.length)
      )
    : null

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

        <h1 className="text-3xl font-bold text-text-primary mb-2">Soundcheck</h1>
        <p className="text-text-secondary mb-8">
          Pre-stream audio diagnostic. Sound like a pro before you go live.
        </p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-red-400 hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Pairing Section */}
        <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-3">
            OBS Plugin Pairing
          </h2>

          {isPaired ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-text-secondary">Plugin paired</span>
              </div>
              <button
                onClick={unpair}
                className="text-sm text-text-tertiary hover:text-red-400 transition-colors"
              >
                Unpair
              </button>
            </div>
          ) : pairingCode ? (
            <div>
              <p className="text-text-secondary mb-3">
                Enter this code in the OBS Soundcheck dock:
              </p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-mono font-bold text-brand-primary tracking-[0.3em]">
                  {pairingCode}
                </span>
                <span className="text-text-tertiary text-sm">
                  Expires in {Math.floor(pairingExpiry / 60)}:{String(pairingExpiry % 60).padStart(2, '0')}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-text-secondary mb-3">
                Connect your OBS plugin to see your soundcheck results here.
              </p>
              <button
                onClick={generatePairingCode}
                className="px-4 py-2 bg-brand-primary text-bg-primary font-semibold rounded-md hover:bg-brand-primary/90 transition-colors"
              >
                Generate Pairing Code
              </button>
            </div>
          )}
        </section>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-bg-elevated border border-bg-hover rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-bg-hover rounded w-1/3 mb-4" />
                <div className="h-4 bg-bg-hover rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : !latest ? (
          <section className="bg-bg-elevated border border-bg-hover rounded-lg p-8 text-center">
            <p className="text-text-secondary text-lg mb-2">No soundcheck results yet</p>
            <p className="text-text-tertiary">
              Pair your OBS plugin and run a soundcheck to see your results here.
            </p>
          </section>
        ) : (
          <>
            {/* Current Score Card */}
            <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-text-primary mb-1">
                    Latest Soundcheck
                  </h2>
                  <p className="text-text-tertiary text-sm">{formatDate(latest.created_at)}</p>
                </div>
                <div className="text-right">
                  <div
                    className="text-4xl font-bold font-mono"
                    style={{ color: TRAFFIC_COLORS[latest.traffic_light] || '#e5e7eb' }}
                  >
                    {latest.score}
                  </div>
                  <div
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ color: TRAFFIC_COLORS[latest.traffic_light] || '#e5e7eb' }}
                  >
                    {latest.traffic_light}
                  </div>
                </div>
              </div>

              {/* Archetype badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-secondary/20 text-brand-secondary text-sm font-medium">
                  {ARCHETYPES[latest.archetype]?.label || latest.archetype}
                </span>
              </div>

              {/* Issues */}
              {latest.report?.issues && latest.report.issues.length > 0 && (
                <div className="space-y-3 mb-4">
                  {latest.report.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="border-l-4 pl-4 py-2"
                      style={{ borderColor: TRAFFIC_COLORS[issue.severity] || '#f59e0b' }}
                    >
                      <p className="text-text-primary font-medium">{issue.headline}</p>
                      <p className="text-text-secondary text-sm mt-1">{issue.detail}</p>
                      <p className="text-text-tertiary text-sm mt-1">
                        Fix: {issue.fix}
                        {issue.score_impact && (
                          <span className="text-brand-primary ml-2">({issue.score_impact})</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Wins */}
              {latest.report?.wins && latest.report.wins.length > 0 && (
                <div className="space-y-1">
                  {latest.report.wins.map((win, i) => (
                    <p key={i} className="text-emerald-400 text-sm">
                      {win}
                    </p>
                  ))}
                </div>
              )}

              <p className="text-text-tertiary text-sm mt-4">
                Run again in OBS to update your score.
              </p>
            </section>

            {/* Score History */}
            {history.length > 1 && (
              <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Score History
                </h2>

                {bestScore !== null && avgLast5 !== null && (
                  <div className="flex gap-6 mb-4 text-sm">
                    <div>
                      <span className="text-text-tertiary">Best: </span>
                      <span className="text-brand-primary font-semibold">{bestScore}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Last {Math.min(5, history.length)} avg: </span>
                      <span className="text-text-primary font-semibold">{avgLast5}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Total runs: </span>
                      <span className="text-text-primary">{history.length}</span>
                    </div>
                  </div>
                )}

                {/* Simple bar chart */}
                <div className="flex items-end gap-1 h-32 mb-2">
                  {[...history].reverse().map((h, i) => (
                    <div key={h.id} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div
                        className="w-full rounded-t transition-all"
                        style={{
                          height: `${h.score}%`,
                          backgroundColor: TRAFFIC_COLORS[h.traffic_light] || '#6b7280',
                          opacity: 0.8,
                          minHeight: '4px',
                        }}
                      />
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-bg-primary border border-bg-hover rounded px-2 py-1 text-xs text-text-primary whitespace-nowrap z-10">
                        {h.score}/100 - {formatDate(h.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-text-tertiary text-xs">
                  <span>Oldest</span>
                  <span>Latest</span>
                </div>
              </section>
            )}

            {/* Metrics Breakdown */}
            <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className="flex items-center justify-between w-full text-left"
              >
                <h2 className="text-xl font-semibold text-text-primary">
                  Detailed Metrics
                </h2>
                <span className="text-text-tertiary">
                  {showMetrics ? '[-]' : '[+]'}
                </span>
              </button>

              {showMetrics && latest.measurements && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <MetricCard
                    label="Mic Level"
                    value={`${latest.measurements.mic_lufs?.toFixed(1) || 'N/A'} LUFS`}
                    target="-18 to -14"
                    status={metricStatus(latest.measurements.mic_lufs, -18, -14)}
                  />
                  <MetricCard
                    label="True Peak"
                    value={`${latest.measurements.true_peak_dbfs?.toFixed(1) || 'N/A'} dBFS`}
                    target="Below -1.0"
                    status={(latest.measurements.true_peak_dbfs ?? -10) < -1 ? 'good' : 'bad'}
                  />
                  <MetricCard
                    label="Game Level"
                    value={`${latest.measurements.game_lufs?.toFixed(1) || 'N/A'} LUFS`}
                    target="Varies by archetype"
                    status="neutral"
                  />
                  <MetricCard
                    label="Voice-Game Ratio"
                    value={`${latest.measurements.mic_to_game_ratio_db?.toFixed(1) || 'N/A'} dB`}
                    target="6-10 dB (balanced)"
                    status={metricStatus(latest.measurements.mic_to_game_ratio_db, 6, 10)}
                  />
                  <MetricCard
                    label="Noise Floor"
                    value={`${latest.measurements.noise_floor_dbfs?.toFixed(1) || 'N/A'} dBFS`}
                    target="Below -55"
                    status={(latest.measurements.noise_floor_dbfs ?? -60) < -55 ? 'good' : (latest.measurements.noise_floor_dbfs ?? -60) < -45 ? 'warn' : 'bad'}
                  />
                  <MetricCard
                    label="Dynamic Range"
                    value={`${latest.measurements.dynamic_range_db?.toFixed(1) || 'N/A'} dB`}
                    target="6-14 dB"
                    status={metricStatus(latest.measurements.dynamic_range_db, 6, 14)}
                  />
                </div>
              )}
            </section>

            {/* Archetype Picker */}
            <section className="bg-bg-elevated border border-bg-hover rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Audio Archetype
              </h2>
              <p className="text-text-tertiary text-sm mb-4">
                Your archetype determines target ranges for scoring. Changing it will affect future scores.
              </p>

              <div className="space-y-2">
                {Object.entries(ARCHETYPES).map(([key, { label, desc }]) => (
                  <button
                    key={key}
                    onClick={() => updateArchetype(key)}
                    disabled={archetypeUpdating}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      archetype === key
                        ? 'border-brand-secondary bg-brand-secondary/10'
                        : 'border-bg-hover hover:border-bg-hover/80 hover:bg-bg-hover/50'
                    }`}
                  >
                    <p className={`font-medium ${archetype === key ? 'text-brand-secondary' : 'text-text-primary'}`}>
                      {label}
                    </p>
                    <p className="text-text-tertiary text-sm mt-1">{desc}</p>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-text-tertiary text-sm mt-12 mb-8">
          <p>
            Soundcheck measures your audio locally in OBS -- no audio data leaves your machine.
          </p>
          <p className="mt-1">
            Only numerical measurements are sent to generate your report.
          </p>
        </div>
      </div>
    </main>
  )
}

function MetricCard({
  label,
  value,
  target,
  status,
}: {
  label: string
  value: string
  target: string
  status: 'good' | 'warn' | 'bad' | 'neutral'
}) {
  const borderColor = {
    good: 'border-emerald-500/50',
    warn: 'border-amber-500/50',
    bad: 'border-red-500/50',
    neutral: 'border-bg-hover',
  }[status]

  const dotColor = {
    good: 'bg-emerald-500',
    warn: 'bg-amber-500',
    bad: 'bg-red-500',
    neutral: 'bg-gray-500',
  }[status]

  return (
    <div className={`border ${borderColor} rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-text-secondary text-sm">{label}</span>
      </div>
      <p className="text-text-primary font-mono text-lg">{value}</p>
      <p className="text-text-tertiary text-xs mt-1">Target: {target}</p>
    </div>
  )
}

function metricStatus(value: number | undefined, min: number, max: number): 'good' | 'warn' | 'bad' | 'neutral' {
  if (value === undefined || value === null) return 'neutral'
  if (value >= min && value <= max) return 'good'
  const dist = value < min ? min - value : value - max
  if (dist <= 4) return 'warn'
  return 'bad'
}
