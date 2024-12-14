"use client";

import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Subtitle } from "@/components/subtitle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Title } from "@/components/title";
import { deleteUserData } from "@/server/settings/delete-user-data";
import { Button, Link } from "@nextui-org/react";

export default function SettingsPage() {
  const handleDeleteData = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all your data? This action cannot be undone."
      )
    ) {
      await deleteUserData();
    }
  };

  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <Title>Settings</Title>
        <section className="flex flex-col gap-2 mb-6">
          <ThemeToggle expanded />
        </section>
        <section className="flex flex-col gap-2">
          <Subtitle>Account</Subtitle>
          <div className="flex flex-col gap-2">
            <Button variant="light" as={Link} href="/auth/logout">
              Logout
            </Button>
            <Button color="danger" variant="flat" onPress={handleDeleteData}>
              Delete All Data
            </Button>
          </div>
        </section>
      </MainContainer>
    </PageContainer>
  );
}
