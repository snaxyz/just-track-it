import { Card, Skeleton } from "@nextui-org/react";

export function WorkoutHistoryLoading() {
  return (
    <div className="space-y-3 pb-24">
      <div className="px-3">
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4 mx-3">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 rounded-lg" />

            {[...Array(2)].map((_, j) => (
              <div key={j} className="space-y-2">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-lg" />
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
