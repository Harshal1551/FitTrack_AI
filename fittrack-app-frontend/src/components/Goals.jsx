import React, { useEffect, useState } from "react"
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import {
  createGoal,
  getGoals,
  deleteGoal,
  getActivities,
} from "../services/api"

const GOAL_META = {
  ACTIVITIES: { icon: "🏃", label: "Activities", unit: "activities", color: "lime" },
  DURATION:   { icon: "⏱️", label: "Duration",   unit: "minutes",    color: "cyan" },
  CALORIES:   { icon: "🔥", label: "Calories",   unit: "kcal",       color: "lime" },
}

/* ---------------------------------------------------------------
   Safely parse a date value from Spring Boot.
   Handles both:
     - "2026-09-02T08:30:00"  (ISO string — your case)
     - [2026, 9, 2, 8, 30, 0] (array — Jackson default fallback)
--------------------------------------------------------------- */
const parseDate = (val) => {
  if (!val) return null
  if (Array.isArray(val)) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = val
    return new Date(y, mo - 1, d, h, mi, s)
  }
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

/* ---------------------------------------------------------------
   GoalCard
--------------------------------------------------------------- */
const GoalCard = ({ goal, onDelete, allActivities }) => {
  const meta = GOAL_META[goal.goalType] || GOAL_META.ACTIVITIES

  const start = parseDate(goal.startDate)

  // Only count activities created at or after the goal's start date
  const relevant = allActivities.filter((a) => {
    if (!start) return true
    const t = parseDate(a.createdAt)
    if (!t) return false
    return t.getTime() >= start.getTime()
  })

  let currentValue = 0
  if (goal.goalType === "ACTIVITIES") {
    currentValue = relevant.length
  } else if (goal.goalType === "DURATION") {
    currentValue = relevant.reduce((sum, a) => sum + (a.duration || 0), 0)
  } else if (goal.goalType === "CALORIES") {
    currentValue = relevant.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0)
  }

  const target = goal.targetValue || 1
  const pct = Math.min(Math.round((currentValue / target) * 100), 100)
  const isComplete = currentValue >= target

  const dueDate = parseDate(goal.targetDate)

  return (
    <div className="relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition overflow-hidden group">
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition ${
          meta.color === "lime" ? "bg-primary" : "bg-accent"
        }`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-bg border border-border flex items-center justify-center text-xl">
              {meta.icon}
            </div>
            <div>
              <p className="font-semibold">{meta.label}</p>
              <p className="text-xs text-muted">
                Target: {goal.targetValue} {goal.unit}
              </p>
            </div>
          </div>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-xs text-muted hover:text-red-400 transition"
            title="Delete goal"
          >
            ✕
          </button>
        </div>

        <div className="mb-3">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-2xl font-bold">
              {currentValue}
              <span className="text-sm font-normal text-muted">
                {" "}/ {goal.targetValue} {goal.unit}
              </span>
            </span>
            <span
              className={`text-sm font-semibold ${
                isComplete ? "text-primary" : "text-muted"
              }`}
            >
              {pct}%
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-bg overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                meta.color === "lime"
                  ? "bg-gradient-to-r from-primary to-accent"
                  : "bg-gradient-to-r from-accent to-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className={isComplete ? "text-primary" : "text-muted"}>
            {isComplete ? "✅ Completed" : "⏳ In Progress"}
          </span>
          {dueDate && (
            <span className="text-muted">
              Due {dueDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------
   Main Goals page
--------------------------------------------------------------- */
const Goals = () => {
  const [goals, setGoals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [goal, setGoal] = useState({
    goalType: "ACTIVITIES",
    targetValue: "",
    unit: "activities",
    startDate: "",
    targetDate: "",
  })

  const fetchGoals = async () => {
    try {
      const response = await getGoals()
      setGoals(response.data || [])
    } catch (error) {
      console.error("Failed to fetch goals:", error)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await getActivities()
      setActivities(response.data || [])
    } catch (error) {
      console.error("Failed to fetch activities:", error)
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([fetchGoals(), fetchActivities()])
      setLoading(false)
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createGoal(goal)
      setGoal({
        goalType: "ACTIVITIES",
        targetValue: "",
        unit: "activities",
        startDate: "",
        targetDate: "",
      })
      await Promise.all([fetchGoals(), fetchActivities()])
    } catch (error) {
      console.error("Failed to create goal:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (goalId) => {
    try {
      await deleteGoal(goalId)
      fetchGoals()
    } catch (error) {
      console.error("Failed to delete goal:", error)
    }
  }

  const handleGoalTypeChange = (e) => {
    const type = e.target.value
    let unit = "activities"
    if (type === "CALORIES") unit = "kcal"
    else if (type === "DURATION") unit = "minutes"
    setGoal({ ...goal, goalType: type, unit })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Fitness Goals 🎯</h1>
        <p className="text-muted text-sm mt-1">
          Set targets and track your progress.
        </p>
      </div>

      {/* Create goal form */}
      <div className="p-6 rounded-2xl bg-surface border border-border mb-8">
        <h2 className="text-lg font-semibold mb-5">Create a new goal</h2>

        <Box component="form" onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <FormControl fullWidth>
            <InputLabel>Goal Type</InputLabel>
            <Select
              value={goal.goalType}
              label="Goal Type"
              onChange={handleGoalTypeChange}
            >
              <MenuItem value="ACTIVITIES">🏃 Number of Activities</MenuItem>
              <MenuItem value="DURATION">⏱️ Exercise Duration</MenuItem>
              <MenuItem value="CALORIES">🔥 Calories Burned</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            type="number"
            label={`Target (${goal.unit})`}
            value={goal.targetValue}
            onChange={(e) =>
              setGoal({ ...goal, targetValue: Number(e.target.value) })
            }
          />

          <TextField
            fullWidth
            required
            type="datetime-local"
            label="Start Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={goal.startDate}
            onChange={(e) => setGoal({ ...goal, startDate: e.target.value })}
          />

          <TextField
            fullWidth
            required
            type="datetime-local"
            label="Target Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={goal.targetDate}
            onChange={(e) => setGoal({ ...goal, targetDate: e.target.value })}
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition shadow-glow disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Goal"}
            </button>
          </div>
        </Box>
      </div>

      {/* Goals list */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">My goals</h2>
        <span className="text-xs text-muted">{goals.length} total</span>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-surface border border-border animate-pulse"
            />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="p-12 rounded-2xl bg-surface border border-border text-center">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-semibold mb-1">No goals yet</p>
          <p className="text-sm text-muted">
            Create your first goal above to start tracking.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onDelete={handleDelete}
              allActivities={activities}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Goals