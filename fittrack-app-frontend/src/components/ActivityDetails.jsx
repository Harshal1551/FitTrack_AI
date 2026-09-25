import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { getActivityDetails, getActivityById } from "../services/api"

const ICONS = {
  RUNNING: "🏃", WALKING: "🚶", SWIMMING: "🏊", CYCLING: "🚴",
  WEIGHT_TRAINING: "🏋️", YOGA: "🧘", HIIT: "⚡", CARDIO: "❤️",
  STRETCHING: "🤸", OTHER: "✨",
}

const ListSection = ({ title, icon, items, color }) => {
  if (!items || items.length === 0) return null
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${color}`}>
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-bg/60 border border-border text-sm text-white/90 leading-relaxed"
          >
            <span
              className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${color.replace("text-", "bg-")}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ActivityDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        // Fire both requests in parallel
        const [recRes, actRes] = await Promise.allSettled([
          getActivityDetails(id),   // recommendations/activity/{id}
          getActivityById(id),      // activities/{id}
        ])

        const rec = recRes.status === "fulfilled" ? recRes.value.data : null
        const act = actRes.status === "fulfilled" ? actRes.value.data : null

        // Merge: activity wins for type/duration/calories/createdAt
        setData({
          type: act?.type ?? rec?.activityType ?? "OTHER",
          duration: act?.duration ?? null,
          caloriesBurned: act?.caloriesBurned ?? null,
          createdAt: act?.createdAt ?? rec?.createdAt,
          recommendation: rec?.recommendation ?? null,
          improvements: rec?.improvements ?? [],
          suggestions: rec?.suggestions ?? [],
          safety: rec?.safety ?? [],
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivityDetail()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-40 rounded-2xl bg-surface border border-border animate-pulse" />
        <div className="h-64 rounded-2xl bg-surface border border-border animate-pulse" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-12 rounded-2xl bg-surface border border-border text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="font-semibold mb-1">Activity not found</p>
        <button
          onClick={() => navigate("/activities")}
          className="mt-4 text-primary text-sm hover:underline"
        >
          ← Back to dashboard
        </button>
      </div>
    )
  }

  const rec = data.recommendation

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate("/activities")}
        className="text-sm text-muted hover:text-white transition mb-4 inline-flex items-center gap-1"
      >
        ← Back to dashboard
      </button>

      {/* Activity summary */}
      <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden mb-6">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center text-3xl shrink-0">
            {ICONS[data.type] || "✨"}
          </div>

          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-muted mb-1">
              Activity
            </p>
            <h1 className="text-2xl font-bold capitalize mb-4">
              {data.type?.replace("_", " ").toLowerCase()}
            </h1>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-bg/60 border border-border">
                <p className="text-[10px] uppercase tracking-wide text-muted mb-1">
                  Duration
                </p>
                <p className="text-lg font-bold">
                  {data.duration ?? "—"}
                  {data.duration != null && (
                    <span className="text-xs text-muted font-normal ml-1">min</span>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-bg/60 border border-border">
                <p className="text-[10px] uppercase tracking-wide text-muted mb-1">
                  Calories
                </p>
                <p className="text-lg font-bold">
                  {data.caloriesBurned ?? "—"}
                  {data.caloriesBurned != null && (
                    <span className="text-xs text-muted font-normal ml-1">kcal</span>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-bg/60 border border-border">
                <p className="text-[10px] uppercase tracking-wide text-muted mb-1">
                  Date
                </p>
                <p className="text-sm font-medium">
                  {data.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      {rec ? (
        <div className="relative p-8 rounded-2xl bg-surface border border-primary/30 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <p className="font-semibold">AI Analysis</p>
              <p className="text-xs text-muted">Tailored to this workout</p>
            </div>
          </div>

          <p className="text-white/90 leading-relaxed whitespace-pre-line">
            {rec}
          </p>

          <ListSection
            title="Improvements"
            icon="📈"
            items={data.improvements}
            color="text-primary"
          />
          <ListSection
            title="Suggestions"
            icon="💡"
            items={data.suggestions}
            color="text-accent"
          />
          <ListSection
            title="Safety Guidelines"
            icon="🛡️"
            items={data.safety}
            color="text-amber-400"
          />
        </div>
      ) : (
        <div className="p-12 rounded-2xl bg-surface border border-border text-center">
          <p className="text-4xl mb-3">🤖</p>
          <p className="font-semibold mb-1">No AI analysis yet</p>
          <p className="text-sm text-muted">
            AI recommendations will appear here shortly after you log this activity.
          </p>
        </div>
      )}
    </div>
  )
}

export default ActivityDetails