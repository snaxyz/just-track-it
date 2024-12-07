import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Workouts } from "./workouts";
import { PrefetchWorkouts } from "./prefetch-workouts";
import { PrefetchExercises } from "../exercises/prefetch-exercises";

export default async function WorkoutsPage() {
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchExercises>
          <PrefetchWorkouts>
            <Workouts />
          </PrefetchWorkouts>
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
