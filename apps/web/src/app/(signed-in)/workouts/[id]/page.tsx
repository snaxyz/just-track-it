import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { PrefetchExercises } from "../../exercises/prefetch-exercises";
import { PrefetchWorkoutHistory } from "./prefetch-workout";
import { Workout } from "./workout";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutPage({ params }: Props) {
  const { id } = await params;
  return (
    <PageContainer>
      <MainContainer className="px-2">
        <PrefetchExercises>
          <PrefetchWorkoutHistory historyId={id}>
            <Workout />
          </PrefetchWorkoutHistory>
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
