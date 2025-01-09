import { GradientCard } from "@/components/cards";
import { Skeleton } from "@nextui-org/react";

export function WorkoutsLoading() {
  return (
    <div className="space-y-3">
      <div className="px-1">
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {[...Array(3)].map((_, i) => (
        <GradientCard key={i} className="p-4 mx-3">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>

            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-24 rounded-full" />
              ))}
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-9 w-full rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </GradientCard>
      ))}
    </div>
  );
}
