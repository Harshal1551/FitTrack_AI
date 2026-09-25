import React, { useEffect, useState } from "react";
import { getActivityStats } from "../services/api";

/* --- helpers --- */
const StatCard = ({ icon, label, value, unit, accent, trend }) => (
  <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-primary/40 transition">
    {/* glow */}
    <div
      className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition ${
        accent === "lime" ? "bg-primary" : "bg-accent"
      }`}
    />
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trend > 0
                ? "bg-primary/10 text-primary"
                : "bg-danger/10 text-danger"
            }`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-xs uppercase tracking-wider text-muted mb-1">{label}</p>
      <p className="text-3xl font-bold leading-none">
        {value}
        {unit && <span className="text-sm font-normal text-muted ml-1">{unit}</span>}
      </p>
    </div>
  </div>
)

const ScoreRing = ({ score }) => {
  const radius = 54
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ

  return (
    <div className="relative p-6 rounded-2xl bg-surface border border-border">
      <p className="text-xs uppercase tracking-wider text-muted mb-4">
        Fitness Score
      </p>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64" cy="64" r={radius}
              fill="none" stroke="#232A33" strokeWidth="10"
            />
            <circle
              cx="64" cy="64" r={radius}
              fill="none"
              stroke="url(#grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A3E635" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-xs text-muted">/ 100</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/90 font-medium mb-1">
            {score >= 80 ? "Excellent 🔥" : score >= 60 ? "Good 👍" : "Keep pushing 💪"}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Based on your activity frequency, duration, and calorie burn.
          </p>
        </div>
      </div>
    </div>
  )
}

/* --- main --- */
const FitnessDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getActivityStats()
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch activity stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-surface border border-border animate-pulse" />
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-muted text-sm mt-1">
          Here's your fitness snapshot for today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="🏃"
          label="Total Activities"
          value={stats.totalActivities}
          accent="lime"
          trend={12}
        />
        <StatCard
          icon="⏱️"
          label="Total Duration"
          value={stats.totalDuration}
          unit="min"
          accent="cyan"
        />
        <StatCard
          icon="🔥"
          label="Calories Burned"
          value={stats.totalCalories}
          unit="kcal"
          accent="lime"
          trend={8}
        />
        <StatCard
          icon="📈"
          label="Avg Duration"
          value={stats.averageDuration}
          unit="min"
          accent="cyan"
        />
      </div>

      {/* Fitness score ring */}
      <ScoreRing score={stats.fitnessScore} />
    </div>
  )
}

export default FitnessDashboard