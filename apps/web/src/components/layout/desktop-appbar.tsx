"use client";

import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Box, IconButton } from "@mui/material";
import { User } from "@auth0/nextjs-auth0/types";
import { AvatarMenu } from "@/components/layout/avatar-menu";
import { MessageSquareIcon } from "lucide-react";
import { ReactNode, useContext } from "react";
import { ChatDrawerContext } from "../chat/chat-drawer-provider";

interface Props {
  user: User;
  children?: ReactNode;
}

export function DesktopAppbar({ user, children }: Props) {
  const { toggleDrawer } = useContext(ChatDrawerContext);
  return (
    <TopAppbarContainer
      sx={{
        display: { xs: "none", md: "flex" },
        position: "sticky",
        top: 0,
      }}
    >
      {children}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={toggleDrawer} size="small" sx={{ mr: 1 }} aria-label="Open AI chat">
        <MessageSquareIcon size={16} />
      </IconButton>
      <AvatarMenu name={user.name ?? ""} picture={user.picture} />
    </TopAppbarContainer>
  );
}
