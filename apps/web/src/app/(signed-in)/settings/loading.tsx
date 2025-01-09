import { PageContainer } from "@/components/layout/page-container";
import { SettingsAppbar } from "./settings.appbar";
import { MainContainer } from "@/components/layout/main-container";
import { getUser } from "@/server/user";
import { Title } from "@/components/title";

export default async function Loading() {
  const user = await getUser();
  return (
    <PageContainer>
      <SettingsAppbar user={user} />
      <MainContainer className="px-2 md:px-3 md:py-4">
        <Title>Settings</Title>
      </MainContainer>
    </PageContainer>
  );
}
