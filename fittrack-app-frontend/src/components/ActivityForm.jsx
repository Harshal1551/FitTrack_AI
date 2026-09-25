import React, { useState } from "react"
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, TextField,
} from "@mui/material"
import { addActivities } from "../services/api"

const ACTIVITY_TYPES = [
  { value: "RUNNING", label: "🏃 Running" },
  { value: "WALKING", label: "🚶 Walking" },
  { value: "SWIMMING", label: "🏊 Swimming" },
  { value: "CYCLING", label: "🚴 Cycling" },
  { value: "WEIGHT_TRAINING", label: "🏋️ Weight Training" },
  { value: "YOGA", label: "🧘 Yoga" },
  { value: "HIIT", label: "⚡ HIIT" },
  { value: "CARDIO", label: "❤️ Cardio" },
  { value: "STRETCHING", label: "🤸 Stretching" },
  { value: "OTHER", label: "✨ Other" },
]

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {},
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addActivities({
        ...activity,
        duration: Number(activity.duration),
        caloriesBurned: Number(activity.caloriesBurned),
      })
      onActivitiesAdded()
      setActivity({ type: "RUNNING", duration: "", caloriesBurned: "", additionalMetrics: {} })
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-surface border border-border mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold">Log a new activity</h2>
          <p className="text-xs text-muted mt-0.5">
            Track your workout in seconds.
          </p>
        </div>
        <span className="text-2xl">➕</span>
      </div>

      <Box component="form" onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4 items-end">
        <FormControl fullWidth>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          >
            {ACTIVITY_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Duration (minutes)"
          type="number"
          value={activity.duration}
          onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        />

        <TextField
          fullWidth
          label="Calories burned"
          type="number"
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
        />

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition shadow-glow disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Add Activity"}
          </button>
        </div>
      </Box>
    </div>
  )
}

export default ActivityForm