import React, { useEffect, useState } from "react";
import {
  getActivityStats,
  getUserProfile,
  updateUserProfile,
} from "../services/api";

/* --- helpers --- */
const StatCard = ({ icon, label, value, unit, accent, trend }) => (
  <div className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden group hover:border-primary/40 transition">
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
      <p className="text-xs uppercase tracking-wider text-muted mb-1">
        {label}
      </p>
      <p className="text-3xl font-bold leading-none">
        {value}
        {unit && (
          <span className="text-sm font-normal text-muted ml-1">
            {unit}
          </span>
        )}
      </p>
    </div>
  </div>
);

const ScoreRing = ({ score }) => {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative p-6 rounded-2xl bg-surface border border-border">
      <p className="text-xs uppercase tracking-wider text-muted mb-4">
        Fitness Score
      </p>

      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="#232A33"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="url(#grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
            <defs>
              <linearGradient
                id="grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
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
            {score >= 80
              ? "Excellent 🔥"
              : score >= 60
                ? "Good 👍"
                : "Keep pushing 💪"}
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Based on your activity frequency, duration, and calorie burn.
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- main --- */
const FitnessDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingWeight, setEditingWeight] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [savingWeight, setSavingWeight] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const fetchProfile = async () => {
    const keycloakId = localStorage.getItem("userId");

    if (!keycloakId) {
      setProfileError("User ID not found. Please sign in again.");
      setProfileLoading(false);
      return;
    }

    try {
      setProfileError("");
      const response = await getUserProfile(keycloakId);
      setProfile(response.data);
      setWeightInput(
        response.data.weightKg == null
          ? ""
          : String(response.data.weightKg)
      );
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfileError(
        "Could not load your profile. Please verify your user ID and API Gateway routing."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getActivityStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch activity stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchProfile();
  }, []);

  const handleSaveWeight = async (event) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const weight = Number(weightInput);

    if (!Number.isFinite(weight) || weight < 1 || weight > 500) {
      setProfileError("Enter a weight between 1 and 500 kg.");
      return;
    }

    const keycloakId = localStorage.getItem("userId");

    if (!keycloakId) {
      setProfileError("User ID not found. Please sign in again.");
      return;
    }

    setSavingWeight(true);

    try {
      const response = await updateUserProfile(keycloakId, {
        weightKg: weight,
      });

      setProfile(response.data);
      setWeightInput(String(response.data.weightKg));
      setEditingWeight(false);
      setProfileMessage("Weight updated successfully.");
    } catch (error) {
      console.error("Failed to update weight:", error);
      setProfileError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Could not update weight. Please check the API Gateway and Keycloak ID."
      );
    } finally {
      setSavingWeight(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-surface border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-muted text-sm mt-1">
          Here's your fitness snapshot for today.
        </p>
      </div>

      {/* Saved profile weight */}
      <section className="p-6 rounded-2xl bg-surface border border-border mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted mb-2">
              Your Profile Weight
            </p>

            {profileLoading ? (
              <p className="text-sm text-muted">Loading profile...</p>
            ) : (
              <p className="text-3xl font-bold">
                {profile?.weightKg ?? "Not set"}
                {profile?.weightKg != null && (
                  <span className="text-sm font-normal text-muted ml-2">
                    kg
                  </span>
                )}
              </p>
            )}

            <p className="text-xs text-muted mt-2">
              Used to estimate calories for new activities.
            </p>
          </div>

          {!profileLoading && !editingWeight && (
            <button
              type="button"
              onClick={() => {
                setWeightInput(
                  profile?.weightKg == null
                    ? ""
                    : String(profile.weightKg)
                );
                setProfileError("");
                setProfileMessage("");
                setEditingWeight(true);
              }}
              className="px-4 py-2 rounded-xl bg-primary text-bg font-semibold hover:bg-primary/90 transition"
            >
              Update Weight
            </button>
          )}
        </div>

        {editingWeight && (
          <form
            onSubmit={handleSaveWeight}
            className="mt-5 flex flex-wrap items-end gap-3"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-weight" className="text-sm">
                Weight (kg)
              </label>
              <input
                id="profile-weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                required
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                className="px-4 py-3 rounded-xl bg-surface border border-border outline-none"
                placeholder="e.g. 70.5"
              />
            </div>

            <button
              type="submit"
              disabled={savingWeight}
              className="px-4 py-3 rounded-xl bg-primary text-bg font-semibold disabled:opacity-50"
            >
              {savingWeight ? "Saving..." : "Save Weight"}
            </button>

            <button
              type="button"
              disabled={savingWeight}
              onClick={() => {
                setEditingWeight(false);
                setProfileError("");
                setWeightInput(
                  profile?.weightKg == null
                    ? ""
                    : String(profile.weightKg)
                );
              }}
              className="px-4 py-3 rounded-xl border border-border disabled:opacity-50"
            >
              Cancel
            </button>
          </form>
        )}

        {profileError && (
          <p className="text-sm text-red-500 mt-3" role="alert">
            {profileError}
          </p>
        )}

        {profileMessage && (
          <p className="text-sm text-primary mt-3" role="status">
            {profileMessage}
          </p>
        )}
      </section>

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

      <ScoreRing score={stats.fitnessScore} />
    </div>
  );
};

export default FitnessDashboard;
