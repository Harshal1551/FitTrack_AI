import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/`;

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (userId) {
        config.headers["X-User-ID"] = userId;
    }

    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});

export const getActivities = () => api.get("/activities");

export const addActivities = (activity) => api.post("/activities", activity);

export const getActivityDetails = (id) =>
    api.get(`/recommendations/activity/${id}`);

export const getActivityStats = () => api.get("/activities/stats");

export const getGoals = () =>
    api.get("/goals");

export const createGoal = (goal) =>
    api.post("/goals", goal);

export const deleteGoal = (goalId) => api.delete(`/goals/${goalId}`);

export const getFitnessAdvice = (userId) =>
    api.post("/coach/advice", { userId });

export const getActivityById = (id) => api.get(`/activities/${id}`);

export const getAdaptivePlan = () =>
    api.get("/adaptive/plan");
