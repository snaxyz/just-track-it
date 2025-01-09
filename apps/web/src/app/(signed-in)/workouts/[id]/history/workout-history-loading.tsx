import { Card, Box, Skeleton } from "@mui/material";

export function WorkoutHistoryLoading() {
  return (
    <Box className="space-y-3 pb-24">
      <Box className="px-1">
        <Skeleton variant="text" width={192} height={32} />
      </Box>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4 mx-3" elevation={0}>
          <Box className="space-y-4">
            <Skeleton variant="text" width={96} height={16} />

            {[...Array(2)].map((_, j) => (
              <Box key={j} className="space-y-2">
                <Skeleton variant="text" width={128} height={24} />
                <Box className="flex gap-2">
                  <Skeleton variant="text" width={64} height={24} />
                  <Skeleton variant="text" width={64} height={24} />
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );
}
