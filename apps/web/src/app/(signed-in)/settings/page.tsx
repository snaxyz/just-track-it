import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { getUser } from "@/server/user";
import { SettingsAppbar } from "./settings.appbar";
import { Settings } from "./settings";

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <PageContainer>
      {user && <SettingsAppbar user={user} />}
      <MainContainer className="px-4 md:px-3 md:py-4">
        <Settings />
      </MainContainer>
    </PageContainer>
  );
}
