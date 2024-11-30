"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  className?: string;
  children: React.ReactNode;
  visible?: boolean;
  offset: number;
}

export function SlideIn({ className, children, visible, offset }: Props) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ x: -offset }}
          animate={{ x: 0 }}
          exit={{ x: -offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
