import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Workouts } from "./workouts";
import { PrefetchWorkouts } from "./prefetch-workouts";
import { PrefetchExercises } from "../exercises/prefetch-exercises";
import { getUser } from "@/server/user";
import { WorkoutsAppbar } from "./workouts-appbar";

export default async function WorkoutsPage() {
  const user = await getUser();
  return (
    <PageContainer>
      <WorkoutsAppbar user={user} />
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
