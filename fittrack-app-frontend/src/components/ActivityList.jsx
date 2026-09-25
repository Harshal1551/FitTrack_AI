import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { getActivities } from "../services/api"

const ICONS = {
  RUNNING: "🏃", WALKING: "🚶", SWIMMING: "🏊", CYCLING: "🚴",
  WEIGHT_TRAINING: "🏋️", YOGA: "🧘", HIIT: "⚡", CARDIO: "❤️",
  STRETCHING: "🤸", OTHER: "✨",
}

const ActivityList = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities()
        setActivities(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-surface border border-border animate-pulse" />
        ))}
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-surface border border-border text-center">
        <p className="text-4xl mb-3">🏁</p>
        <p className="font-semibold mb-1">No activities yet</p>
        <p className="text-sm text-muted">Log your first workout above to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent activities</h2>
        <span className="text-xs text-muted">{activities.length} total</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => navigate(`/activities/${activity.id}`)}
            className="text-left p-5 rounded-2xl bg-surface border border-border hover:border-primary/50 hover:bg-surface/80 transition group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-bg border border-border flex items-center justify-center text-2xl">
                {ICONS[activity.type] || "✨"}
              </div>
              <span className="text-xs text-muted group-hover:text-primary transition">→</span>
            </div>

            <p className="font-semibold capitalize mb-3">
              {activity.type?.replace("_", " ").toLowerCase()}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted">
              <span>⏱️ {activity.duration} min</span>
              <span>🔥 {activity.caloriesBurned} kcal</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ActivityList