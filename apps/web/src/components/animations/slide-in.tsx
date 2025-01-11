"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Box, SxProps, Theme } from "@mui/material";

interface Props {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  visible?: boolean;
  offset: number;
}

export function SlideIn({ sx, children, visible, offset }: Props) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <Box
          component={motion.div}
          initial={{ x: -offset }}
          animate={{ x: 0 }}
          exit={{ x: -offset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          sx={sx}
        >
          {children}
        </Box>
      )}
    </AnimatePresence>
  );
}
