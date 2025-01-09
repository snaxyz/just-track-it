import { GradientCard } from "@/components/cards";
import { Skeleton } from "@nextui-org/react";

export function WorkoutSessionLoading() {
  return (
    <div className="space-y-3">
      <div className="text-caption-light dark:text-caption text-xs">
        <Skeleton className="h-4 w-24 rounded-lg" />
      </div>

      <Skeleton className="h-12 w-full rounded-lg" />

      {[...Array(3)].map((_, i) => (
        <GradientCard key={i} className="p-4 bg-zinc-100 dark:bg-stone-900">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-32 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>

            {[...Array(2)].map((_, j) => (
              <div key={j} className="flex items-center gap-4">
                <Skeleton className="h-6 w-8 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </GradientCard>
      ))}
    </div>
  );
}
