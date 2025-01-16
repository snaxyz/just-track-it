"use client";

import { Fab } from "@mui/material";
import { FabContainer } from "../layout/fab-container";
import { BotMessageSquareIcon } from "lucide-react";
import { MobileChatDrawer } from "./mobile-chat-drawer";
import { useState } from "react";

export function MobileChatFab() {
  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      <FabContainer>
        <Fab color="secondary" onClick={openDrawer}>
          <BotMessageSquareIcon size={16} />
        </Fab>
      </FabContainer>
      <MobileChatDrawer isOpen={isOpen} onClose={closeDrawer} />
    </>
  );
}
