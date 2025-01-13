"use client";

import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { DumbbellIcon, HistoryIcon, HomeIcon } from "lucide-react";
import { Box } from "@mui/material";
import { User } from "@auth0/nextjs-auth0/types";
import { AvatarMenu } from "@/components/layout/avatar-menu";

interface Props {
  user: User;
  id: string;
}

export function HistoryAppbar({ user, id }: Props) {
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
        <BreadcrumbItem startContent={<DumbbellIcon size={16} />} href="/workouts">
          Workouts
        </BreadcrumbItem>
        <BreadcrumbItem startContent={<HistoryIcon size={16} />} href={`/workouts/${id}/history`}>
          History
        </BreadcrumbItem>
      </Breadcrumbs>
      <Box sx={{ flexGrow: 1 }} />
      <AvatarMenu name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
