import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { PrefetchExercises } from "../../exercises/prefetch-exercises";
import { PrefetchWorkoutSession } from "./prefetch-workout-session";
import { WorkoutSession } from "./workout-session";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutPage({ params }: Props) {
  const { id } = await params;
  return (
    <PageContainer>
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
