"use client";

import { Title } from "@/components/title";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
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
import { GradientCard } from "@/components/cards";

export function Insights() {
  return (
    <>
      <Title>Insights</Title>

      <div className="space-y-6">
        {/* Volume by Muscle Group Card */}
        <GradientCard className="p-4">
          <CardHeader className="gap-3">
            <BarChart3Icon className="text-primary" />
            <h2 className="text-lg font-medium">Volume by Muscle Group</h2>
          </CardHeader>
          <CardBody>
            <VolumeByMuscleChart />
          </CardBody>
        </GradientCard>

        {/* Personal Records Card */}
        <GradientCard className="p-4">
          <CardHeader className="gap-3">
            <TrophyIcon className="text-primary" />
            <h2 className="text-lg font-medium">Personal Records</h2>
          </CardHeader>
          <CardBody>
            <PersonalRecordsChart />
          </CardBody>
        </GradientCard>

        {/* Workout Calendar Card */}
        <GradientCard className="p-4">
          <CardHeader className="gap-3">
            <CalendarIcon className="text-primary" />
            <h2 className="text-lg font-medium">Activity Calendar</h2>
          </CardHeader>
          <CardBody>
            <WorkoutCalendarChart />
          </CardBody>
        </GradientCard>

        {/* Consistency Trend Card */}
        <GradientCard className="p-4">
          <CardHeader className="gap-3">
            <LineChartIcon className="text-primary" />
            <h2 className="text-lg font-medium">Monthly Consistency</h2>
          </CardHeader>
          <CardBody>
            <ConsistencyTrendChart />
          </CardBody>
        </GradientCard>
      </div>
    </>
  );
}
