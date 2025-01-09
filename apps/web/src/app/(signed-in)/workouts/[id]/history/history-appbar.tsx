"use client";

import { BreadcrumbItem } from "@nextui-org/react";
import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Breadcrumbs } from "@nextui-org/react";
import { DumbbellIcon, HistoryIcon, HomeIcon } from "lucide-react";
import { Grow } from "@/components/layout/grow";
import { User } from "@auth0/nextjs-auth0/types";
import { SidebarWorkspaceDropdown } from "@/components/layout/sidebar-workspace-dropdown";

interface Props {
  user: User;
  id: string;
}

export function HistoryAppbar({ user, id }: Props) {
  return (
    <TopAppbarContainer className="py-3 px-4 hidden md:flex sticky top-0 bg-stone-50 dark:bg-stone-950 z-50">
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem
          startContent={<DumbbellIcon size={16} />}
          href="/workouts"
        >
          Workouts
        </BreadcrumbItem>
        <BreadcrumbItem
          startContent={<HistoryIcon size={16} />}
          href={`/workouts/${id}/history`}
        >
          History
        </BreadcrumbItem>
      </Breadcrumbs>
      <Grow />
      <SidebarWorkspaceDropdown name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
