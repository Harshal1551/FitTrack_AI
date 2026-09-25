import React, { useState } from "react"
import { getFitnessAdvice } from "../services/api"

/**
 * Splits the AI text into structured blocks:
 *   "Overall: something..."  → { heading: "Overall", body: "something..." }
 *   "Just a paragraph..."    → { heading: null, body: "..." }
 */
const formatAdvice = (text) => {
  if (!text) return []
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean)

  return paragraphs.map((p) => {
    const trimmed = p.trim()
    // Match "Heading: rest" on the first line
    const match = trimmed.match(/^([A-Z][A-Za-z0-9\s/&'-]{1,40}):\s*([\s\S]*)$/)
    if (match) {
      return { heading: match[1].trim(), body: match[2].trim() }
    }
    return { heading: null, body: trimmed }
  })
}

const AICoach = () => {
  const [advice, setAdvice] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGetAdvice = async () => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      console.error("User ID not found")
      return
    }

    try {
      setLoading(true)
      const response = await getFitnessAdvice(userId)
      setAdvice(response.data.advice || "")
    } catch (error) {
      console.error("Failed to get AI fitness advice:", error)
      setAdvice("Unable to get fitness advice right now. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const blocks = formatAdvice(advice)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <span>🤖</span> AI Personal Coach
        </h1>
        <p className="text-muted text-sm mt-1">
          Get personalized advice based on your actual workout data.
        </p>
      </div>

      {/* CTA card */}
      <div className="relative p-8 rounded-2xl bg-surface border border-border overflow-hidden mb-6">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative">
          <h2 className="text-xl font-semibold mb-2">
            Ready for your analysis?
          </h2>
          <p className="text-sm text-muted mb-6 max-w-lg leading-relaxed">
            Our AI will look at your activity history — types, durations,
            calories — and generate tailored recommendations to help you
            improve faster.
          </p>

          <button
            onClick={handleGetAdvice}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-bg font-semibold hover:opacity-90 transition shadow-glow disabled:opacity-60 inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-bg border-t-transparent animate-spin" />
                Analyzing your data...
              </>
            ) : (
              <>✨ Get AI Advice</>
            )}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="p-6 rounded-2xl bg-surface border border-border animate-pulse space-y-3">
          <div className="h-4 w-1/3 bg-border rounded" />
          <div className="h-3 w-full bg-border rounded" />
          <div className="h-3 w-5/6 bg-border rounded" />
          <div className="h-3 w-4/6 bg-border rounded" />
        </div>
      )}

      {/* Advice output */}
      {advice && !loading && (
        <div className="relative p-8 rounded-2xl bg-surface border border-primary/30 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-xl">
              💡
            </div>
            <div>
              <p className="font-semibold">Your Personalized Advice</p>
              <p className="text-xs text-muted">Generated just now</p>
            </div>
          </div>

          <div className="space-y-6">
            {blocks.map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {block.heading}
                  </h3>
                )}
                <p className="text-white/85 leading-relaxed whitespace-pre-line text-[15px]">
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!advice && !loading && (
        <div className="p-12 rounded-2xl bg-surface border border-border text-center">
          <p className="text-4xl mb-3">🧠</p>
          <p className="font-semibold mb-1">No advice yet</p>
          <p className="text-sm text-muted">
            Click the button above to get your first AI-powered recommendation.
          </p>
        </div>
      )}
    </div>
  )
}

export default AICoach