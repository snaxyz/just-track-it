import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { getUser } from "@/server/user";
import { HistoryAppbar } from "./history-appbar";
import { PrefetchHistory } from "./prefetch-history";
import { History } from "./history";
import { Title } from "@/components/title";

export default async function Page() {
  const user = await getUser();
  return (
    <PageContainer>
      <HistoryAppbar user={user} />
      <MainContainer sx={{ px: { xs: 1, md: 2 }, py: { md: 3 } }}>
        <Title>History</Title>
        <PrefetchHistory>
          <History />
        </PrefetchHistory>
      </MainContainer>
    </PageContainer>
  );
}
