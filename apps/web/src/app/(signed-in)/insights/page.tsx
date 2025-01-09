import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { getUser } from "@/server/user";
import { InsightsAppbar } from "./insights-appbar";
import { Insights } from "./insights";

export default async function InsightsPage() {
  const user = await getUser();

  return (
    <PageContainer>
      {user && <InsightsAppbar user={user} />}
      <MainContainer className="px-4 md:px-3 md:py-4">
        <Insights />
      </MainContainer>
    </PageContainer>
  );
}
