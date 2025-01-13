"use client";

import { IconButton } from "@mui/material";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import type { SessionData } from "@auth0/nextjs-auth0/types";
import { MobileDrawer } from "./mobile-drawer";

interface Props {
  user?: SessionData["user"];
}

export function MobileAppbarMenu({ user }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <>
      <IconButton
        onClick={onOpen}
        sx={{
          display: { xs: "flex", md: "none" },
        }}
      >
        <MenuIcon size={16} />
      </IconButton>
      <MobileDrawer isOpen={isOpen} onClose={onClose} user={user} />
    </>
  );
}
