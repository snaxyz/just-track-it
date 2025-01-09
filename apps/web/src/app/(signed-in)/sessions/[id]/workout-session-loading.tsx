import { Card, Box, Skeleton } from "@mui/material";

export function WorkoutSessionLoading() {
  return (
    <Box className="space-y-3">
      <Box className="text-caption-light dark:text-caption text-xs">
        <Skeleton variant="text" width={96} height={16} />
      </Box>

      <Skeleton variant="rectangular" height={48} />

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4 bg-zinc-100 dark:bg-stone-900" elevation={0}>
          <Box className="space-y-4">
            <Box className="flex justify-between items-center">
              <Skeleton variant="text" width={128} height={24} />
              <Skeleton variant="rectangular" width={32} height={32} />
            </Box>

            {[...Array(2)].map((_, j) => (
              <Box key={j} className="flex items-center gap-4">
                <Skeleton variant="text" width={32} height={24} />
                <Skeleton variant="text" width={64} height={24} />
                <Skeleton variant="text" width={64} height={24} />
              </Box>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
}
