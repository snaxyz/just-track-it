"use client";

import { Skeleton } from "@nextui-org/react";

export function WorkoutCardSkeleton() {
  return (
    <div className="rounded-lg bg-zinc-100 dark:bg-stone-900 mb-3">
      <div className="flex w-full p-2 gap-2">
        <Skeleton className="h-6 rounded-lg grow bg-stone-100 dark:bg-stone-800"></Skeleton>
      </div>
      <div className="p-2">
        <Skeleton className="h-12 rounded-lg grow bg-stone-100 dark:bg-stone-800" />
      </div>
    </div>
  );
}
