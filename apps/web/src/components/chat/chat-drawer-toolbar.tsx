import { IconButton, Typography, Toolbar } from "@mui/material";
import { XIcon } from "lucide-react";
import { Grow } from "../layout/grow";

interface Props {
  onClose: () => void;
}

export function ChatDrawerToolbar({ onClose }: Props) {
  return (
    <Toolbar sx={{ position: "sticky", top: 0, background: "inherit" }}>
      <Typography>Chat</Typography>
      <Grow />
      <IconButton onClick={onClose}>
        <XIcon size={16} />
      </IconButton>
    </Toolbar>
  );
}
