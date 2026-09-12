import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";
import { getActivityStats } from "../services/api";

const FitnessDashboard = () => {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getActivityStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch activity stats:", error);
            }
        };

        fetchStats();
    }, []);

    if (!stats) {
        return <Typography>Loading dashboard...</Typography>;
    }

    return (
        <Box sx={{ mb: 4 }}>

            <Typography variant="h4" sx={{ mb: 3 }}>
                Fitness Dashboard
            </Typography>

            <Grid container spacing={2}>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                Total Activities
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalActivities}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                Total Duration
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalDuration}
                            </Typography>
                            <Typography variant="body2">
                                minutes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                Calories Burned
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalCalories}
                            </Typography>
                            <Typography variant="body2">
                                kcal
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                Average Duration
                            </Typography>
                            <Typography variant="h4">
                                {stats.averageDuration}
                            </Typography>
                            <Typography variant="body2">
                                minutes / activity
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="body2">
                                Fitness Score
                            </Typography>

                            <Typography variant="h4">
                                {stats.fitnessScore}/100
                            </Typography>

                            <Typography variant="body2">
                                Overall Fitness
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>

        </Box>
    );
};

export default FitnessDashboard;
