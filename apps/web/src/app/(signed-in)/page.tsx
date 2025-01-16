import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Dashboard } from "./dashboard";
import { DashboardAppbar } from "./dashboard-appbar";
import { getUser } from "@/server/user";
import { Title } from "@/components/title";
import { Box } from "@mui/material";
import { PrefetchRecentWorkouts } from "./prefetch-recent-workouts";

export default async function Page() {
  const user = await getUser();
  return (
    <PrefetchRecentWorkouts>
      <PageContainer>
        <DashboardAppbar user={user} />
        <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
          <Box sx={{ px: 1 }}>
            <Title>Recent workouts</Title>
          </Box>
          <Dashboard />
        </MainContainer>
      </PageContainer>
    </PrefetchRecentWorkouts>
  );
}
