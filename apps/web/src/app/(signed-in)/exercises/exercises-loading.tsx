import { GradientCard } from "@/components/cards";
import { Card, Skeleton } from "@nextui-org/react";

export function ExercisesLoading() {
  return (
    <div className="space-y-3">
      <div className="px-1">
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {[...Array(3)].map((_, i) => (
        <GradientCard key={i} className="p-3 mx-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="flex gap-2">
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </GradientCard>
      ))}
    </div>
  );
}
