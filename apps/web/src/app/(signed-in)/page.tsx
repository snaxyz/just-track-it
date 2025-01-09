import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Dashboard } from "./dashboard";
import { PrefetchRecentWorkouts } from "./prefetch-recent-workouts";
import { DashboardAppbar } from "./dashboard-appbar";
import { getUser } from "@/server/user";

export default async function DashboardPage() {
  const user = await getUser();
  return (
    <PageContainer>
      <DashboardAppbar user={user} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <PrefetchRecentWorkouts>
          <Dashboard />
        </PrefetchRecentWorkouts>
      </MainContainer>
    </PageContainer>
  );
}
