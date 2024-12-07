import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Workout } from "./workout";
import { PrefetchExercises } from "../../exercises/prefetch-exercises";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutPage({ params }: Props) {
  const { id } = await params;
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        {/* <PrefetchWorkoutHistory workoutId={id}>
          <WorkoutHistory />
        </PrefetchWorkoutHistory> */}
        <PrefetchExercises>
          <Workout id={id} />
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
