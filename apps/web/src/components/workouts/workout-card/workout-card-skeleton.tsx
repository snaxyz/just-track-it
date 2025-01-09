"use client";

import { Box, Skeleton } from "@mui/material";

export function WorkoutCardSkeleton() {
  return (
    <Box className="rounded-lg bg-zinc-100 dark:bg-stone-900 mb-3">
      <Box className="flex w-full p-2 gap-2">
        <Skeleton variant="rectangular" className="h-6 rounded-lg grow bg-stone-100 dark:bg-stone-800" />
      </Box>
      <Box className="p-2">
        <Skeleton variant="rectangular" className="h-12 rounded-lg grow bg-stone-100 dark:bg-stone-800" />
      </Box>
    </Box>
  );
}
