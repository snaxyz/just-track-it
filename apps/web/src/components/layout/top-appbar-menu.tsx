"use client";

import { Box, Drawer, IconButton } from "@mui/material";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { SidebarWorkspaceDropdown } from "./sidebar-workspace-dropdown";
import { SidebarNavigation } from "./sidebar-navigation";
import type { SessionData } from "@auth0/nextjs-auth0/types";

interface Props {
  user?: SessionData["user"];
}

export function TopAppbarMenu({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{
          display: { xs: "flex", md: "none" },
        }}
      >
        <MenuIcon size={16} />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={onClose}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
            p: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {user && <SidebarWorkspaceDropdown name={user.name ?? ""} picture={user.picture} />}
          <Box sx={{ mt: 4, flexGrow: 1 }}>
            <SidebarNavigation />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
