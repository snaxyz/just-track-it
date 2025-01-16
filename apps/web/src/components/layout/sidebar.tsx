"use client";

import { Box, Drawer, Link as MuiLink } from "@mui/material";
import { Logo } from "../logo";
import { SidebarNavigation } from "./sidebar-navigation";
import Link from "next/link";

const drawerWidth = 200;

export function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <Logo sx={{ fontSize: 20, color: "text.primary" }} />
        </Link>
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <SidebarNavigation />
      </Box>
    </Drawer>
  );
}
