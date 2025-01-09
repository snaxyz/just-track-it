import { Card, Skeleton } from "@mui/material";

export function ExercisesLoading() {
  return (
    <div className="space-y-3">
      <div className="px-1">
        <Skeleton variant="text" width={128} height={32} />
      </div>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-3 mx-3" elevation={0}>
          <div className="flex flex-col gap-2">
            <Skeleton variant="text" width={128} height={24} />
            <div className="flex gap-2">
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} variant="rounded" width={64} height={24} />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
