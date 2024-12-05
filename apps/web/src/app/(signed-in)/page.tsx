"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { Grow } from "@/components/layout/grow";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Title } from "@/components/title";
import { createWorkoutAndRedirect } from "@/server/workouts";
import { startWorkoutAndRedirect } from "@/server/workouts/start-workout";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import {
  ActivityIcon,
  LineChartIcon,
  StarIcon,
  CalendarIcon,
  HistoryIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

export default function DashboardPage() {
  const handleStartWorkout = useCallback(async (workoutId: string) => {
    await startWorkoutAndRedirect(workoutId);
  }, []);

  const card = (
    <Card
      className="mb-3 bg-zinc-200 dark:bg-zinc-800 z-0"
      shadow="none"
      fullWidth
    >
      <CardHeader className="capitalize pb-0">
        <span
          className="text-nowrap text-ellipsis overflow-hidden mr-2"
          title={"Full body strength"}
        >
          Full body strength
        </span>
        <Grow />
        <IconButton as={Link} href={`/workouts/${"testing"}/history`}>
          <HistoryIcon size={16} />
        </IconButton>
      </CardHeader>
      <CardBody>
        <div className="text-caption-light dark:text-caption text-xs mb-2">
          Completed on Nov 30, 2024
        </div>
        <Button
          fullWidth
          variant="flat"
          startContent={<ActivityIcon size={16} />}
          size="sm"
          radius="lg"
          color="secondary"
          onClick={() => handleStartWorkout("testing")}
        >
          Start workout
        </Button>
      </CardBody>
    </Card>
  );

  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <div className="pb-24">
          <section className="mb-6">
            <Title>Recent workouts</Title>
            <div className="space-y-3">
              {card}
              {card}
              {card}
            </div>
          </section>

          <section>
            <Title>My stats</Title>
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-zinc-200 dark:bg-zinc-800 z-0" shadow="none">
                <CardHeader className="pb-0 gap-2">
                  <LineChartIcon size={20} />
                  <span>Total Workouts</span>
                </CardHeader>
                <CardBody>
                  <p className="text-xl font-bold">25</p>
                </CardBody>
              </Card>
              <Card className="bg-zinc-200 dark:bg-zinc-800 z-0" shadow="none">
                <CardHeader className="pb-0 gap-2">
                  <StarIcon size={20} />
                  <span>Longest Streak</span>
                </CardHeader>
                <CardBody>
                  <p className="text-xl font-bold">7 days</p>
                </CardBody>
              </Card>
              <Card className="bg-zinc-200 dark:bg-zinc-800 z-0" shadow="none">
                <CardHeader className="pb-0 gap-2">
                  <CalendarIcon size={20} />
                  <span>Workouts This Week</span>
                </CardHeader>
                <CardBody>
                  <p className="text-xl font-bold">3</p>
                </CardBody>
              </Card>
            </div>
          </section>

          {/* Suggestions Section ? */}
        </div>
        <FabContainer>
          <IconButton
            color="primary"
            variant="solid"
            onClick={() => createWorkoutAndRedirect()}
          >
            <ActivityIcon size={16} />
          </IconButton>
        </FabContainer>
      </MainContainer>
    </PageContainer>
  );
}
