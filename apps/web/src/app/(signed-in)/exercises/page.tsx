import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Exercises } from "./exercises";
import { PrefetchExercises } from "./prefetch-exercises";
import { ExercisesAppbar } from "./exercises-appbar";
import { getUser } from "@/server/user";

export default async function ExercisesPage() {
  const user = await getUser();
  return (
    <PageContainer>
      <ExercisesAppbar user={user} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchExercises>
          <Exercises />
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
