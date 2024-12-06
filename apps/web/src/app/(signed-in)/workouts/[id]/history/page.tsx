import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { PrefetchWorkoutHistory } from "./prefetch-workout-history";
import { WorkoutHistory } from "./workout-history";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutHistoryPage({ params }: Props) {
  const { id } = await params;
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchWorkoutHistory workoutId={id}>
          <WorkoutHistory />
        </PrefetchWorkoutHistory>
      </MainContainer>
    </PageContainer>
  );
}
