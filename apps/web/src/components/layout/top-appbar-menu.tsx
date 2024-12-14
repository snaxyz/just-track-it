"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@nextui-org/react";
import { MenuIcon } from "lucide-react";
import { SidebarNavigation } from "./sidebar-navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function TopAppbarMenu() {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      <Button isIconOnly radius="lg" variant="light" onPress={onOpen}>
        <MenuIcon size={16} />
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="xs">
        <DrawerContent>
          <DrawerHeader></DrawerHeader>
          <DrawerBody>
            <div className="flex justify-center">
              <SidebarNavigation
                className="flex flex-col"
                itemClasses="w-auto"
              />
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
