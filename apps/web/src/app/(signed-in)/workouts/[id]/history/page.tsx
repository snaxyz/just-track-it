import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { PrefetchWorkoutHistory } from "./prefetch-history";
import { WorkoutHistoryList } from "./history-list";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkoutHistoryPage({ params }: Props) {
  const { id } = await params;
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchWorkoutHistory workoutId={id}>
          <WorkoutHistoryList />
        </PrefetchWorkoutHistory>
      </MainContainer>
    </PageContainer>
  );
}
