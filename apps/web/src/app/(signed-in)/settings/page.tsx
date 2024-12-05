import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { ThemeToggle } from "@/components/theme-toggle";
import { Title } from "@/components/title";

export default function SettingsPage() {
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <Title>Settings</Title>
        <ThemeToggle />
      </MainContainer>
    </PageContainer>
  );
}
