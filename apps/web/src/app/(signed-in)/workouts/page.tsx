"use client";

import { FabContainer } from "@/components/layout/fab-container";
import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { createWorkoutAndRedirect } from "@/server/workouts";
import { Button } from "@nextui-org/react";
import { PlusIcon } from "lucide-react";

export default function WorkoutsPage() {
  return (
    <PageContainer>
      <MainContainer>
        <div>Workouts</div>
        <FabContainer>
          <Button
            isIconOnly
            variant="solid"
            radius="full"
            size="sm"
            color="primary"
            onClick={() => createWorkoutAndRedirect()}
          >
            <PlusIcon size={16} />
          </Button>
        </FabContainer>
      </MainContainer>
    </PageContainer>
  );
}
