import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { getFitnessAdvice } from "../services/api";

const AICoach = () => {

  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGetAdvice = async () => {

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      setLoading(true);

      const response = await getFitnessAdvice(userId);

      setAdvice(response.data.advice);

    } catch (error) {
      console.error("Failed to get AI fitness advice:", error);
      setAdvice("Unable to get fitness advice right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>

      <Typography variant="h4" sx={{ mb: 3 }}>
        🤖 AI Personal Fitness Coach
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography variant="h6" sx={{ mb: 1 }}>
            Get Personalized Fitness Advice
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Let AI analyze your workout activities and give you
            personalized recommendations.
          </Typography>

          <Button
            variant="contained"
            onClick={handleGetAdvice}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get AI Advice"}
          </Button>

        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {advice && !loading && (
        <Card>
          <CardContent>

            <Typography variant="h6" sx={{ mb: 2 }}>
              💡 Your Personalized Advice
            </Typography>

            <Typography
              component="div"
              sx={{
                whiteSpace: "pre-line",
                lineHeight: 1.7,
              }}
            >
              {advice}
            </Typography>

          </CardContent>
        </Card>
      )}

    </Box>
  );
};

export default AICoach;