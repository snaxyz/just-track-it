"use client";

import { MainContainer } from "@/components/layout/main-container";
import { PageContainer } from "@/components/layout/page-container";
import { Subtitle } from "@/components/subtitle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Title } from "@/components/title";
import { Button, Link } from "@nextui-org/react";

export default function SettingsPage() {
  return (
    <PageContainer>
      <MainContainer className="px-2 md:px-3 md:py-4">
        <Title>Settings</Title>
        <section className="flex flex-col gap-2 mb-6">
          <ThemeToggle expanded />
        </section>
        <section className="flex flex-col gap-2">
          <Button variant="light" as={Link} href="/auth/logout">
            Logout
          </Button>
        </section>
      </MainContainer>
    </PageContainer>
  );
}
