import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize user id to not include characters
 */
export function normalizeUserId(userId: string) {
  return userId.replace(/\|/g, "");
}
