"use client";

import { BreadcrumbItem } from "@nextui-org/react";
import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Breadcrumbs } from "@nextui-org/react";
import { HomeIcon, SettingsIcon } from "lucide-react";
import { Grow } from "@/components/layout/grow";
import { User } from "@auth0/nextjs-auth0/types";
import { SidebarWorkspaceDropdown } from "@/components/layout/sidebar-workspace-dropdown";

interface Props {
  user: User;
}

export function SettingsAppbar({ user }: Props) {
  return (
    <TopAppbarContainer className="py-3 px-4 hidden md:flex sticky top-0 bg-stone-50 dark:bg-stone-950 z-50">
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem
          startContent={<SettingsIcon size={16} />}
          href="/settings"
        >
          Settings
        </BreadcrumbItem>
      </Breadcrumbs>
      <Grow />
      <SidebarWorkspaceDropdown name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
