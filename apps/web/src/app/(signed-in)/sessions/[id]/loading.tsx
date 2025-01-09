"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SessionAppbar } from "./session-appbar";
import { MainContainer } from "@/components/layout/main-container";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user";
import { Skeleton } from "@mui/material";
import { WorkoutSessionLoading } from "./workout-session-loading";

export default function Loading() {
  const user = useUser();
  const params = useParams<{ id: string }>();
  return (
    <PageContainer>
      <SessionAppbar user={user} id={params.id} workoutName="" />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <div className="mb-2 text-caption-light dark:text-caption text-xs">
          <Skeleton variant="text" width={120} height={20} />
        </div>
        <WorkoutSessionLoading />
      </MainContainer>
    </PageContainer>
  );
}
