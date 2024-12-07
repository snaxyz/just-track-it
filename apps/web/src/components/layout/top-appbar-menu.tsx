"use client";

import { Button, useDisclosure } from "@nextui-org/react";
import { MenuIcon, XIcon } from "lucide-react";
import { RightDrawer } from "./right-drawer";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function TopAppbarMenu() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      <Button isIconOnly radius="lg" size="sm" variant="light" onPress={onOpen}>
        <MenuIcon size={16} />
      </Button>
      <RightDrawer
        className="bg-zinc-100 dark:bg-zinc-900 border-l border-divider"
        isOpen={isOpen}
      >
        <div className="flex items-center justify-end p-2 mb-2">
          <Button
            isIconOnly
            size="sm"
            radius="lg"
            variant="light"
            onPress={onClose}
          >
            <XIcon size={16} />
          </Button>
        </div>
        <div className="flex justify-center">
          <SidebarNavigation className="flex flex-col" itemClasses="w-auto" />
        </div>
      </RightDrawer>
    </>
  );
}
