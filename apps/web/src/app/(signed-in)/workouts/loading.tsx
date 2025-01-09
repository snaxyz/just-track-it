import { PageContainer } from "@/components/layout/page-container";
import { WorkoutsAppbar } from "./workouts-appbar";
import { MainContainer } from "@/components/layout/main-container";
import { getUser } from "@/server/user";
import { Title } from "@/components/title";

export default async function Loading() {
  const user = await getUser();
  return (
    <PageContainer>
      <WorkoutsAppbar user={user} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <div className="px-1">
          <Title>Workouts</Title>
        </div>
      </MainContainer>
    </PageContainer>
  );
}
