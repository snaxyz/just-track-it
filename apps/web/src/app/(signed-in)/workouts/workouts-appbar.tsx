"use client";

import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { DumbbellIcon, HomeIcon } from "lucide-react";
import { Box } from "@mui/material";
import { User } from "@auth0/nextjs-auth0/types";
import { SidebarWorkspaceDropdown } from "@/components/layout/sidebar-workspace-dropdown";

interface Props {
  user: User;
}

export function WorkoutsAppbar({ user }: Props) {
  return (
    <TopAppbarContainer
      sx={{
        py: 1,
        px: 2,
        display: { xs: "none", md: "flex" },
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<DumbbellIcon size={16} />} href="/workouts">
          Workouts
        </BreadcrumbItem>
      </Breadcrumbs>
      <Box sx={{ flexGrow: 1 }} />
      <SidebarWorkspaceDropdown name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
