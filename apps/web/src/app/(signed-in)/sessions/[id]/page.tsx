import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { PrefetchExercises } from "../../exercises/prefetch-exercises";
import { PrefetchWorkoutSession } from "./prefetch-workout-session";
import { WorkoutSession } from "./workout-session";
import { getWorkoutSessionServer } from "@/server/workout-sessions/get-workout-session";
import { SessionAppbar } from "./session-appbar";
import { getUser } from "@/server/user";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutSessionPage({ params }: Props) {
  const { id } = await params;
  const workout = await getWorkoutSessionServer(id);
  const user = await getUser();
  return (
    <PageContainer>
      <SessionAppbar user={user} id={id} workoutName={workout.workout.name} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchExercises>
          <PrefetchWorkoutSession sessionId={id}>
            <WorkoutSession />
          </PrefetchWorkoutSession>
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
