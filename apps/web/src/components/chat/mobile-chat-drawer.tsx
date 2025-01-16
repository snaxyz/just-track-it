import { Drawer, IconButton, Toolbar, Typography } from "@mui/material";
import { Chat } from "./chat";
import { XIcon } from "lucide-react";
import { Grow } from "../layout/grow";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileChatDrawer({ isOpen, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: 300,
        },
      }}
    >
      <Toolbar sx={{ position: "sticky", top: 0, background: "inherit" }}>
        <Typography>Chat</Typography>
        <Grow />
        <IconButton onClick={onClose}>
          <XIcon size={16} />
        </IconButton>
      </Toolbar>
      <Chat />
    </Drawer>
  );
}
