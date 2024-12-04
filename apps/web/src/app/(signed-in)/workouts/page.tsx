import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Workouts } from "./workouts";
import { PrefetchWorkouts } from "./prefetch-workouts";

export default async function WorkoutsPage() {
  return (
    <PageContainer>
      <MainContainer className="px-2">
        <PrefetchWorkouts>
          <Workouts />
        </PrefetchWorkouts>
      </MainContainer>
    </PageContainer>
  );
}
