"use client";

import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { HomeIcon, SettingsIcon } from "lucide-react";
import { Box } from "@mui/material";
import { User } from "@auth0/nextjs-auth0/types";
import { SidebarWorkspaceDropdown } from "@/components/layout/sidebar-workspace-dropdown";

interface Props {
  user: User;
}

export function SettingsAppbar({ user }: Props) {
  return (
    <TopAppbarContainer
      sx={{
        display: { xs: "none", md: "flex" },
        position: "sticky",
        top: 0,
      }}
    >
      <Breadcrumbs>
        <BreadcrumbItem startContent={<HomeIcon size={16} />} href="/">
          Home
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<SettingsIcon size={16} />} href="/settings">
          Settings
        </BreadcrumbItem>
      </Breadcrumbs>
      <Box sx={{ flexGrow: 1 }} />
      <SidebarWorkspaceDropdown name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
