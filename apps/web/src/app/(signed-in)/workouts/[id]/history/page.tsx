import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { WorkoutHistory } from "./workout-history";
import { PrefetchWorkoutHistory } from "./prefetch-workout-history";
import { getUser } from "@/server/user";
import { HistoryAppbar } from "./history-appbar";
import { getWorkoutHistory } from "@/server/workouts/get-workout-history";
import { Box } from "@mui/material";
import { Title } from "@/components/title";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutHistoryPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser();
  const history = await getWorkoutHistory(id);
  return (
    <PageContainer>
      <HistoryAppbar user={user} id={id} />
      <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
        <Box sx={{ px: 1 }}>
          <Title>{history?.workoutName}</Title>
        </Box>
        <PrefetchWorkoutHistory workoutId={id}>
          <WorkoutHistory />
        </PrefetchWorkoutHistory>
      </MainContainer>
    </PageContainer>
  );
}
