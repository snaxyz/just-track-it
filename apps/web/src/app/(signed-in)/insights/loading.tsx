import { PageContainer } from "@/components/layout/page-container";
import { InsightsAppbar } from "./insights-appbar";
import { MainContainer } from "@/components/layout/main-container";
import { getUser } from "@/server/user";

export default async function Loading() {
  const user = await getUser();
  return (
    <PageContainer>
      <InsightsAppbar user={user} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <div>loading</div>
      </MainContainer>
    </PageContainer>
  );
}
