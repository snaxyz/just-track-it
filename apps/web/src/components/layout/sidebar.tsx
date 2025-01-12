"use client";

import { Box, Drawer } from "@mui/material";
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
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
          <Link href="/">
            <Logo sx={{ fontSize: 20 }} />
          </Link>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <SidebarNavigation />
        </Box>
      </Box>
    </Drawer>
  );
}
