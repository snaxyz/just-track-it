"use client";

import { Title } from "@/components/title";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import {
  ActivityIcon,
  BarChart3Icon,
  TrendingUpIcon,
  TrophyIcon,
  ScaleIcon,
  CalendarIcon,
  LineChartIcon,
} from "lucide-react";
import {
  ExerciseProgressChart,
  VolumeByMuscleChart,
  WorkoutFrequencyChart,
  PersonalRecordsChart,
  WeightDistributionChart,
  WorkoutCalendarChart,
  ConsistencyTrendChart,
} from "@/components/insights";

export function Insights() {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <Card sx={{ p: 4 }} variant="outlined">
          <CardHeader
            sx={{ gap: 3 }}
            avatar={<BarChart3Icon className="text-primary" />}
            title={<Box sx={{ typography: "h6" }}>Volume by Muscle Group</Box>}
          />
          <CardContent>
            <VolumeByMuscleChart />
          </CardContent>
        </Card>

        <Card sx={{ p: 4 }} variant="outlined">
          <CardHeader
            sx={{ gap: 3 }}
            avatar={<TrophyIcon className="text-primary" />}
            title={<Box sx={{ typography: "h6" }}>Personal Records</Box>}
          />
          <CardContent>
            <PersonalRecordsChart />
          </CardContent>
        </Card>

        <Card sx={{ p: 4 }} variant="outlined">
          <CardHeader
            sx={{ gap: 3 }}
            avatar={<CalendarIcon className="text-primary" />}
            title={<Box sx={{ typography: "h6" }}>Activity Calendar</Box>}
          />
          <CardContent>
            <WorkoutCalendarChart />
          </CardContent>
        </Card>

        <Card sx={{ p: 4 }} variant="outlined">
          <CardHeader
            sx={{ gap: 3 }}
            avatar={<LineChartIcon className="text-primary" />}
            title={<Box sx={{ typography: "h6" }}>Monthly Consistency</Box>}
          />
          <CardContent>
            <ConsistencyTrendChart />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
