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
      <Title>Insights</Title>

      <Box className="space-y-6">
        <Card className="p-4" elevation={0}>
          <CardHeader className="gap-3">
            <BarChart3Icon className="text-primary" />
            <h2 className="text-lg font-medium">Volume by Muscle Group</h2>
          </CardHeader>
          <CardContent>
            <VolumeByMuscleChart />
          </CardContent>
        </Card>

        <Card className="p-4" elevation={0}>
          <CardHeader className="gap-3">
            <TrophyIcon className="text-primary" />
            <h2 className="text-lg font-medium">Personal Records</h2>
          </CardHeader>
          <CardContent>
            <PersonalRecordsChart />
          </CardContent>
        </Card>

        <Card className="p-4" elevation={0}>
          <CardHeader className="gap-3">
            <CalendarIcon className="text-primary" />
            <h2 className="text-lg font-medium">Activity Calendar</h2>
          </CardHeader>
          <CardContent>
            <WorkoutCalendarChart />
          </CardContent>
        </Card>

        <Card className="p-4" elevation={0}>
          <CardHeader className="gap-3">
            <LineChartIcon className="text-primary" />
            <h2 className="text-lg font-medium">Monthly Consistency</h2>
          </CardHeader>
          <CardContent>
            <ConsistencyTrendChart />
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
