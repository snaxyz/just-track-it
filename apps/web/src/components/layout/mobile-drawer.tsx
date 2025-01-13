"use client";

import { Box, Drawer } from "@mui/material";
import { SidebarNavigation } from "./sidebar-navigation";
import { AvatarMenu } from "./avatar-menu";
import type { SessionData } from "@auth0/nextjs-auth0/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user?: SessionData["user"];
}

export function MobileDrawer({ isOpen, onClose, user }: Props) {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: 200,
          pt: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center" }}>
        {user && <AvatarMenu name={user.name ?? ""} picture={user.picture} />}
        <Box sx={{ mt: 4, flexGrow: 1, width: "100%" }}>
          <SidebarNavigation />
        </Box>
      </Box>
    </Drawer>
  );
}
