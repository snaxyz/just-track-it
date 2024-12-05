import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Exercises } from "./exercises";
import { PrefetchExercises } from "./prefetch-exercises";

export default async function ExercisesPage() {
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchExercises>
          <Exercises />
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
