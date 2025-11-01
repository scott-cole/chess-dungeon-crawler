"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  keyName: string;
  className?: string; // Add className prop
}

export default function ScreenWrapper({ children, keyName, className = "" }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyName}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`flex flex-col items-center justify-center min-h-screen w-full ${className}`} // Apply className here
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
