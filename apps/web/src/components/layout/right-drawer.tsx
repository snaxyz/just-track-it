import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  className?: string;
  isOpen?: boolean;
  children: React.ReactNode;
}

export function RightDrawer({ className, isOpen, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className={cn(
            "fixed top-0 right-0 z-40 h-full w-[200px] bg-background overflow-auto",
            // "border-l border-zinc-300 dark:border-zinc-700", // left border
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
