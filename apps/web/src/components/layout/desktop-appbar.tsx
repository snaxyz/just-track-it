"use client";

import { TopAppbarContainer } from "@/components/layout/top-appbar-container";
import { Box, IconButton, Drawer } from "@mui/material";
import { User } from "@auth0/nextjs-auth0/types";
import { AvatarMenu } from "@/components/layout/avatar-menu";
import { MessageSquareIcon } from "lucide-react";
import { ReactNode, useState } from "react";

const drawerWidth = 320;

interface Props {
  user: User;
  children?: ReactNode;
}

export function DesktopAppbar({ user, children }: Props) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <TopAppbarContainer
        sx={{
          display: { xs: "none", md: "flex" },
          position: "sticky",
          top: 0,
        }}
      >
        {children}
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={() => setIsChatOpen(true)} size="small" sx={{ mr: 1 }} aria-label="Open AI chat">
          <MessageSquareIcon size={16} />
        </IconButton>
        <AvatarMenu name={user.name ?? ""} picture={user.picture} />
      </TopAppbarContainer>

      <Drawer
        anchor="right"
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        variant="persistent"
        sx={{
          display: { xs: "none", md: "block" },
          width: isChatOpen ? drawerWidth : 0,
          transition: "width 0.2s",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "background.paper",
            borderLeft: 1,
            borderColor: "divider",
          },
        }}
      >
        {/* Chat content will go here */}
      </Drawer>
    </>
  );
}
