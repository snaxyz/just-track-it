import { Drawer } from "@mui/material";
import { Chat } from "./chat";
import { ChatDrawerToolbar } from "./chat-drawer-toolbar";

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
      <ChatDrawerToolbar onClose={onClose} />
      <Chat />
    </Drawer>
  );
}
