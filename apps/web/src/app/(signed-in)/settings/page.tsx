import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <PageContainer>
      <MainContainer>
        <div>Settings</div>
        <ThemeToggle />
      </MainContainer>
    </PageContainer>
  );
}
