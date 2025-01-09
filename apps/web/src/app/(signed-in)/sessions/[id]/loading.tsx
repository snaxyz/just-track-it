"use client";

import { PageContainer } from "@/components/layout/page-container";
import { SessionAppbar } from "./session-appbar";
import { MainContainer } from "@/components/layout/main-container";
import { useParams } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user";
import { Skeleton } from "@nextui-org/react";
import { WorkoutSessionLoading } from "./workout-session-loading";

export default function Loading() {
  const user = useUser();
  const params = useParams<{ id: string }>();
  return (
    <PageContainer>
      <SessionAppbar user={user} id={params.id} workoutName="" />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <div className="mb-2 text-caption-light dark:text-caption text-xs">
          <Skeleton />
        </div>
        <WorkoutSessionLoading />
      </MainContainer>
    </PageContainer>
  );
}
