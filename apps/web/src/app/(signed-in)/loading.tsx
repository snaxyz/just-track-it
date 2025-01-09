import { PageContainer } from "@/components/layout/page-container";
import { DashboardAppbar } from "./dashboard-appbar";
import { MainContainer } from "@/components/layout/main-container";
import { getUser } from "@/server/user";
import { Title } from "@/components/title";

export default async function Loading() {
  const user = await getUser();
  return (
    <PageContainer>
      <DashboardAppbar user={user} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <Title> </Title>
      </MainContainer>
    </PageContainer>
  );
}
