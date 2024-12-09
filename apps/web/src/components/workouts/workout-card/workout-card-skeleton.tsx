import { Skeleton } from "@nextui-org/react";

export function WorkoutCardSkeleton() {
  return (
    <div className="rounded-lg bg-zinc-200 dark:bg-zinc-800 mb-3">
      <div className="flex w-full p-2 gap-2">
        <Skeleton className="h-6 rounded-lg grow bg-zinc-300 dark:bg-zinc-700"></Skeleton>
      </div>
      <div className="p-2">
        <Skeleton className="h-12 rounded-lg grow bg-zinc-300 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
