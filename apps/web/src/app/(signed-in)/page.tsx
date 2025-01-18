import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Dashboard } from "./dashboard";
import { DashboardAppbar } from "./dashboard-appbar";
import { getUser } from "@/server/user";
import { Title } from "@/components/title";
import { Box } from "@mui/material";
import { PrefetchRecentWorkouts } from "./prefetch-recent-workouts";
import { Suspense } from "react";
import { WorkoutsLoading } from "./workouts/workouts-loading";

export default async function Page() {
  const user = await getUser();
  return (
    <PageContainer>
      <DashboardAppbar user={user} />
      <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
        <Suspense fallback={<WorkoutsLoading />}>
          <PrefetchRecentWorkouts>
            <Dashboard />
          </PrefetchRecentWorkouts>
        </Suspense>
      </MainContainer>
    </PageContainer>
  );
}
