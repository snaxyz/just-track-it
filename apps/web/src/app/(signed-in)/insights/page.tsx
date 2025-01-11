import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { getUser } from "@/server/user";
import { InsightsAppbar } from "./insights-appbar";
import { Insights } from "./insights";
import { Title } from "@/components/title";

export default async function InsightsPage() {
  const user = await getUser();

  return (
    <PageContainer>
      {user && <InsightsAppbar user={user} />}
      <MainContainer sx={{ px: { xs: 4, md: 3 }, py: { md: 4 } }}>
        <Title>Insights</Title>
        <Insights />
      </MainContainer>
    </PageContainer>
  );
}
