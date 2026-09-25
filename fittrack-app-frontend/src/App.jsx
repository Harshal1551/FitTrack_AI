import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "react-oauth2-code-pkce"
import { useDispatch } from "react-redux"
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router"

import { setCredentials } from "./store/authSlice"
import { Button, Box } from "@mui/material"

import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import ActivityForm from "./components/ActivityForm"
import ActivityList from "./components/ActivityList"
import ActivityDetails from "./components/ActivityDetails"
import FitnessDashboard from "./components/FitnessDashboard"
import Goals from "./components/Goals"
import AICoach from "./components/AICoach"
import AdaptivePlan from "./components/AdaptivePlan"

const ActivitiesPage = () => (
  <Box component="section" sx={{ p: 2 }}>
    <FitnessDashboard />
    <ActivityForm onActivitiesAdded={() => window.location.reload()} />
    <ActivityList />
  </Box>
)

function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext)
  const dispatch = useDispatch()
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }))
      setAuthReady(true)
    }
  }, [token, tokenData, dispatch])

  // Logged out → show Landing
  if (!token) {
    return (
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <Landing
                onLogin={() => {
                  console.log("🔐 logIn() triggered")
                  logIn()
                }}
              />
            }
          />
        </Routes>
      </Router>
    )
  }

  // Logged in → show App shell
  return (
    <Router>
      <Navbar variant="app" onLogout={logOut} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="*" element={<Navigate to="/activities" replace />} />
          <Route path="/adaptive-plan" element={<AdaptivePlan />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App