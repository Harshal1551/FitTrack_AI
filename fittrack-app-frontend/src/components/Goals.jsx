import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import { createGoal, getGoals, deleteGoal } from "../services/api";

const Goals = () => {

    const [goals, setGoals] = useState([]);

    const [goal, setGoal] = useState({
        goalType: "ACTIVITIES",
        targetValue: "",
        unit: "activities",
        startDate: "",
        targetDate: ""
    });

    const fetchGoals = async () => {
        try {
            const response = await getGoals();
            setGoals(response.data);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createGoal(goal);

            setGoal({
                goalType: "ACTIVITIES",
                targetValue: "",
                unit: "activities",
                startDate: "",
                targetDate: ""
            });

            fetchGoals();

        } catch (error) {
            console.error("Failed to create goal:", error);
        }
    };

    const handleDelete = async (goalId) => {
        try {
            await deleteGoal(goalId);
            fetchGoals();
        } catch (error) {
            console.error("Failed to delete goal:", error);
        }
    };

    const handleGoalTypeChange = (e) => {

        const type = e.target.value;

        let unit = "activities";

        if (type === "CALORIES") {
            unit = "kcal";
        } else if (type === "DURATION") {
            unit = "minutes";
        }

        setGoal({
            ...goal,
            goalType: type,
            unit: unit
        });
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>

            <Typography variant="h4" sx={{ mb: 3 }}>
                Fitness Goals
            </Typography>

            <Card sx={{ mb: 4 }}>
                <CardContent>

                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Create New Goal
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Goal Type</InputLabel>

                            <Select
                                value={goal.goalType}
                                label="Goal Type"
                                onChange={handleGoalTypeChange}
                            >
                                <MenuItem value="ACTIVITIES">
                                    Number of Activities
                                </MenuItem>

                                <MenuItem value="DURATION">
                                    Exercise Duration
                                </MenuItem>

                                <MenuItem value="CALORIES">
                                    Calories Burned
                                </MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label={`Target (${goal.unit})`}
                            value={goal.targetValue}
                            onChange={(e) =>
                                setGoal({
                                    ...goal,
                                    targetValue: Number(e.target.value)
                                })
                            }
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            required
                            type="datetime-local"
                            label="Start Date"
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                            value={goal.startDate}
                            onChange={(e) =>
                                setGoal({
                                    ...goal,
                                    startDate: e.target.value
                                })
                            }
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            required
                            type="datetime-local"
                            label="Target Date"
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
                            }}
                            value={goal.targetDate}
                            onChange={(e) =>
                                setGoal({
                                    ...goal,
                                    targetDate: e.target.value
                                })
                            }
                            sx={{ mb: 2 }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Create Goal
                        </Button>

                    </Box>

                </CardContent>
            </Card>

            <Typography variant="h5" sx={{ mb: 2 }}>
                My Goals
            </Typography>

            {goals.length === 0 ? (
                <Typography>
                    No goals created yet.
                </Typography>
            ) : (
                goals.map((item) => (
                    <Card key={item.id} sx={{ mb: 2 }}>
                        <CardContent>

                            <Typography variant="h6">
                                {item.goalType}
                            </Typography>

                            <Typography sx={{ mb: 1 }}>
                                Progress: {item.currentValue} / {item.targetValue} {item.unit}
                            </Typography>

                            <LinearProgress
                                variant="determinate"
                                value={
                                    item.targetValue > 0
                                        ? Math.min(
                                            (item.currentValue / item.targetValue) * 100,
                                            100
                                        )
                                        : 0
                                }
                                sx={{ height: 10, borderRadius: 5, mb: 1 }}
                            />

                            <Typography>
                                {item.targetValue > 0
                                    ? Math.min(
                                        Math.round(
                                            (item.currentValue / item.targetValue) * 100
                                        ),
                                        100
                                    )
                                    : 0}% Complete
                            </Typography>

                            <Typography sx={{ mt: 1 }}>
                                Status: {item.completed ? "Completed" : "In Progress"}
                            </Typography>

                            <Button
                                variant="outlined"
                                color="error"
                                sx={{ mt: 2 }}
                                onClick={() => handleDelete(item.id)}
                            >
                                Delete
                            </Button>

                        </CardContent>
                    </Card>
                ))
            )}

        </Box>
    );
};

export default Goals;