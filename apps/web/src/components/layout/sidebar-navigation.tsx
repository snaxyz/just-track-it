"use client";

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import {
  ActivityIcon,
  DumbbellIcon,
  HomeIcon,
  LibrarySquareIcon,
  SettingsIcon,
  InfoIcon,
  MessageSquareIcon,
  HistoryIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SxProps, Theme } from "@mui/material/styles";

interface Props {
  sx?: SxProps<Theme>;
}

export function SidebarNavigation({ sx }: Props) {
  const pathname = usePathname();

  const listItemIconSx = {
    minWidth: 36,
    color: "text.secondary",
  };

  return (
    <Box component="nav" sx={{ display: "flex", flexDirection: "column", height: "100%", ...sx }}>
      <List dense>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/" selected={pathname === "/"}>
            <ListItemIcon sx={listItemIconSx}>
              <HomeIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/workouts"
            selected={pathname.includes("/workouts") || pathname.includes("/sessions")}
          >
            <ListItemIcon sx={listItemIconSx}>
              <DumbbellIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="Workouts" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/exercises" selected={pathname === "/exercises"}>
            <ListItemIcon sx={listItemIconSx}>
              <LibrarySquareIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="Exercises" />
          </ListItemButton>
        </ListItem>
        {/* <ListItem disablePadding>
          <ListItemButton component={Link} href="/insights" selected={pathname === "/insights"}>
            <ListItemIcon sx={listItemIconSx}>
              <ActivityIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="Insights" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/history" selected={pathname.includes("/history")}>
            <ListItemIcon sx={listItemIconSx}>
              <HistoryIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <List dense>
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/settings" selected={pathname === "/settings"}>
            <ListItemIcon sx={listItemIconSx}>
              <SettingsIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/about" target="_blank" rel="noopener noreferrer">
            <ListItemIcon sx={listItemIconSx}>
              <InfoIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        {/* <ListItem disablePadding>
          <ListItemButton component={Link} href="/feedback">
            <ListItemIcon sx={listItemIconSx}>
              <MessageSquareIcon size={16} />
            </ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItemButton>
        </ListItem> */}
      </List>
    </Box>
  );
}
