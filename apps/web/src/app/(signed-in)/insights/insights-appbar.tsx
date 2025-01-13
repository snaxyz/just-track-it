"use client";

import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Breadcrumbs, BreadcrumbItem } from "@/components/breadcrumbs";
import { ChartSplineIcon, HomeIcon } from "lucide-react";
import { Box } from "@mui/material";
import { User } from "@auth0/nextjs-auth0/types";
import { AvatarMenu } from "@/components/layout/avatar-menu";

interface Props {
  user: User;
}

export function InsightsAppbar({ user }: Props) {
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
        <BreadcrumbItem startContent={<ChartSplineIcon size={16} />} href="/insights">
          Insights
        </BreadcrumbItem>
      </Breadcrumbs>
      <Box sx={{ flexGrow: 1 }} />
      <AvatarMenu name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
