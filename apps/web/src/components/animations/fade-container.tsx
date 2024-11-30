import { AnimatePresence, motion } from "framer-motion";

interface FadeContainerProps {
  isVisible?: boolean;
  children: React.ReactNode;
}

export function FadeContainer({ isVisible, children }: FadeContainerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }} // Adjust duration to your preference
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
