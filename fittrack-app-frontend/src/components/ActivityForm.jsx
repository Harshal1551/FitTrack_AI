import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  addActivities,
  getUserProfile,
} from "../services/api";

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

const MET_VALUES = {
  RUNNING: 8.0,
  WALKING: 3.5,
  SWIMMING: 6.0,
  CYCLING: 7.5,
  WEIGHT_TRAINING: 5.0,
  YOGA: 3.0,
  HIIT: 8.0,
  CARDIO: 6.0,
  STRETCHING: 2.3,
  OTHER: 3.5,
};

const ActivityForm = ({ onActivitiesAdded }) => {
  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: "",
    additionalMetrics: {},
  });

  const [weightKg, setWeightKg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const keycloakId = localStorage.getItem("userId");

        if (!keycloakId) {
          setErrorMessage("Please sign in to calculate calories.");
          return;
        }

        const response = await getUserProfile(keycloakId);
        const weight = Number(response.data.weightKg);

        if (Number.isFinite(weight) && weight > 0) {
          setWeightKg(weight);
        } else {
          setErrorMessage(
            "Please save your weight in your profile to calculate calories."
          );
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        setErrorMessage(
          "Could not load your profile weight. Please check your profile."
        );
      }
    };

    loadProfile();
  }, []);

  const duration = Number(activity.duration);

  const estimatedCalories =
    weightKg &&
    Number.isFinite(duration) &&
    duration > 0
      ? Math.round(
          ((MET_VALUES[activity.type] * 3.5 * weightKg) / 200) *
            duration
        )
      : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!Number.isFinite(duration) || duration <= 0) {
      setErrorMessage("Please enter a duration greater than zero.");
      return;
    }

    if (!weightKg) {
      setErrorMessage(
        "A valid saved profile weight is required before logging an activity."
      );
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
          inputProps={{
            min: 1,
            step: 1,
          }}
        />

        <Box
          className="rounded-xl border border-border p-3"
          sx={{ minHeight: 56 }}
        >
          <p className="text-xs text-muted">Estimated Calories Burned</p>
          <p className="text-xl font-semibold">
            {estimatedCalories !== null
              ? `${estimatedCalories} kcal`
              : "-- kcal"}
          </p>
        </Box>

        <div className="md:col-span-3">
          {errorMessage && (
            <p className="text-sm text-red-500 mb-3" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !weightKg}
            className="px-6 py-3 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition shadow-glow disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Add Activity"}
          </button>
        </div>
      </Box>

      <p className="text-xs text-muted mt-4">
        Calories are estimated using your saved profile weight and activity
        duration. The backend calculates and saves the final value.
      </p>
    </div>
  );
};

export default ActivityForm;
