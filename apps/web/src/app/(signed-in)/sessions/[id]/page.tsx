import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { WorkoutSession } from "./workout-session";
import { PrefetchWorkoutSession } from "./prefetch-workout-session";
import { PrefetchExercises } from "../../exercises/prefetch-exercises";
import { getUser } from "@/server/user";
import { SessionAppbar } from "./session-appbar";
import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";
import { DateTime } from "@/components/date-time";
import { Box } from "@mui/material";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutSessionPage({ params }: Props) {
  const { id } = await params;
  const user = await getUser();
  const workoutSession = await getWorkoutSessionServer(id);
  return (
    <PageContainer>
      <SessionAppbar user={user} id={id} workoutName={workoutSession?.workout.name ?? ""} />
      <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
        {workoutSession && (
          <Box sx={{ mb: 2, color: "text.secondary", typography: "caption" }}>
            <DateTime iso={workoutSession.startedAt ?? ""} />
          </Box>
        )}
        <PrefetchExercises>
          <PrefetchWorkoutSession sessionId={id}>
            <WorkoutSession />
          </PrefetchWorkoutSession>
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
