import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Exercises } from "./exercises";
import { PrefetchExercises } from "./prefetch-exercises";
import { getUser } from "@/server/user";
import { ExercisesAppbar } from "./exercises-appbar";
import { Box, Drawer } from "@mui/material";
import { Title } from "@/components/title";

export default async function ExercisesPage() {
  const user = await getUser();
  return (
    <PageContainer>
      <ExercisesAppbar user={user} />
      <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
        <Title>Exercises</Title>
        <PrefetchExercises>
          <Exercises />
        </PrefetchExercises>
      </MainContainer>
    </PageContainer>
  );
}
