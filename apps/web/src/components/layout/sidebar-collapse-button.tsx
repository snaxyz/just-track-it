"use client";

import { useToggleSidebar } from "@/lib/hooks/use-toggle-sidebar";
import { Button } from "@nextui-org/react";
import { MenuIcon } from "lucide-react";

interface Props {
  collapsed?: boolean;
}

export function SidebarCollapseButton({ collapsed }: Props) {
  const collapse = useToggleSidebar({ collapsed });

  return (
    <Button
      isIconOnly
      radius="full"
      size="sm"
      variant="light"
      onClick={collapse}
    >
      <MenuIcon size={16} />
    </Button>
  );
}
