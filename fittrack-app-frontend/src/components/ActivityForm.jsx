import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { addActivities } from "../services/api";

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
];

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    additionalMetrics: {},
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const duration = Number(activity.duration);

    if (!Number.isFinite(duration) || duration <= 0) {
      setErrorMessage("Please enter a duration greater than zero.");
      return;
    }

    setSubmitting(true);

    try {
      await addActivities({
        type: activity.type,
        duration,
        additionalMetrics: activity.additionalMetrics,
      });

      setActivity({
        type: "RUNNING",
        duration: "",
        additionalMetrics: {},
      });

      if (onActivitiesAdded) {
        onActivitiesAdded();
      }
    } catch (error) {
      console.error("Failed to add activity:", error);

      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save activity. Please check your profile weight and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

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

      <Box
        component="form"
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-4 items-end"
      >
        <FormControl fullWidth>
          <InputLabel id="activity-type-label">
            Activity Type
          </InputLabel>

          <Select
            labelId="activity-type-label"
            value={activity.type}
            label="Activity Type"
            onChange={(e) =>
              setActivity((previous) => ({
                ...previous,
                type: e.target.value,
              }))
            }
          >
            {ACTIVITY_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          required
          label="Duration (minutes)"
          type="number"
          value={activity.duration}
          onChange={(e) =>
            setActivity((previous) => ({
              ...previous,
              duration: e.target.value,
            }))
          }
          slotProps={{
            htmlInput: {
              min: 1,
              step: 1,
            },
          }}
        />

        <div className="md:col-span-3">
          {errorMessage && (
            <p className="text-sm text-red-500 mb-3" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition shadow-glow disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Add Activity"}
          </button>
        </div>
      </Box>

      <p className="text-xs text-muted mt-4">
        Calories are estimated automatically using your saved profile weight.
      </p>
    </div>
  );
};

export default ActivityForm;
