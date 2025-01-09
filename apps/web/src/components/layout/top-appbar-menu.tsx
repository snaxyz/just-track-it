"use client";

import { Box, Drawer, IconButton } from "@mui/material";
import { MenuIcon } from "lucide-react";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function TopAppbarMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    handleClose();
  }, [pathname]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <MenuIcon size={16} />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          className: "bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-stone-900 dark:to-stone-950",
        }}
      >
        <Box sx={{ width: 250 }} className="p-4">
          <div className="flex justify-center">
            <SidebarNavigation className="flex flex-col" itemClasses="w-auto" />
          </div>
        </Box>
      </Drawer>
    </>
  );
}
