"use client";

import { useContext } from "react";
import { Drawer } from "@mui/material";
import { Chat } from "./chat";
import { ChatDrawerContext } from "./chat-drawer-provider";
import { ChatDrawerToolbar } from "./chat-drawer-toolbar";

export function ChatDrawer() {
  const { isOpen, toggleDrawer } = useContext(ChatDrawerContext);
  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={isOpen}
      onClose={toggleDrawer}
      sx={{
        display: { xs: "none", md: "block" },
        width: isOpen ? 280 : 0,
        flexShrink: 0,
        overflow: "hidden",
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderLeft: 1,
          borderColor: "divider",
        },
      }}
    >
      <ChatDrawerToolbar onClose={toggleDrawer} />
      <Chat />
    </Drawer>
  );
}
