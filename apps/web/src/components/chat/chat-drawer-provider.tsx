"use client";

import { useState, createContext, ReactNode } from "react";

export const ChatDrawerContext = createContext({
  isOpen: false,
  toggleDrawer: () => {},
});

export function ChatDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen((open) => !open);
  return <ChatDrawerContext.Provider value={{ isOpen, toggleDrawer }}>{children}</ChatDrawerContext.Provider>;
}
