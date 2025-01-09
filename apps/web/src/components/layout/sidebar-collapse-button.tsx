"use client";

import { useToggleSidebar } from "@/lib/hooks/use-toggle-sidebar";
import { IconButton } from "@mui/material";
import { MenuIcon } from "lucide-react";

interface Props {
  collapsed?: boolean;
}

export function SidebarCollapseButton({ collapsed }: Props) {
  const collapse = useToggleSidebar({ collapsed });

  return (
    <IconButton onClick={collapse}>
      <MenuIcon size={16} />
    </IconButton>
  );
}
