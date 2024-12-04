"use client";

import { IconButton } from "@/components/icon-button";
import { FabContainer } from "@/components/layout/fab-container";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Title } from "@/components/title";
import { createWorkoutAndRedirect } from "@/server/workouts";
import { ActivityIcon } from "lucide-react";

export default function DashboardPage() {
  return (
    <PageContainer>
      <MainContainer className="px-2">
        <div className="pb-24">
          <Title>Recent workouts</Title>
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
