"use client";

import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export function PageContainer({ children }: Props) {
  const settings = useUserSettings();
  const sidebarCollapsed = settings?.sidebarCollapsed;

  return (
    <>
      <motion.div
        initial={{ marginLeft: sidebarCollapsed ? 0 : 248 }}
        animate={{ marginLeft: sidebarCollapsed ? 0 : 248 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("w-full flex hidden md:block overflow-auto")}
      >
        {children}
      </motion.div>
      <div className={cn("w-full flex md:hidden mt-12 overflow-auto")}>
        {children}
      </div>
    </>
  );
}
