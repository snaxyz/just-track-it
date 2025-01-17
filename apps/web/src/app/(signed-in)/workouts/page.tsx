import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Workouts } from "./workouts";
import { PrefetchWorkouts } from "./prefetch-workouts";
import { getUser } from "@/server/user";
import { WorkoutsAppbar } from "./workouts-appbar";
import { Title } from "@/components/title";
import { Box } from "@mui/material";

export default async function WorkoutsPage() {
  const user = await getUser();
  return (
    <PrefetchWorkouts>
      <PageContainer>
        <WorkoutsAppbar user={user} />
        <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
          <Box sx={{ px: 1 }}>
            <Title>Workouts</Title>
          </Box>
          <Workouts />
        </MainContainer>
      </PageContainer>
    </PrefetchWorkouts>
  );
}
