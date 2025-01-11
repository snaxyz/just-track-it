"use client";

import { Box, SxProps, Theme } from "@mui/material";
import { getUserSettings } from "@/server/settings";
import { useQuery } from "@tanstack/react-query";
import { SlideIn } from "../animations/slide-in";
import { useUserId } from "@/lib/hooks/use-user";

interface Props {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function SidebarContainer({ children, sx }: Props) {
  const userId = useUserId();
  const { data } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getUserSettings(userId),
  });

  const collapsed = data?.sidebarCollapsed;

  return (
    <SlideIn
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
        height: "100%",
        width: 200,
        overflow: "auto",
        ...sx,
      }}
      visible={!collapsed}
      offset={200}
    >
      {children}
    </SlideIn>
  );
}
