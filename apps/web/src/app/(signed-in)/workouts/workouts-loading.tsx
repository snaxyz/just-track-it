import { Card, Box, Skeleton } from "@mui/material";

export function WorkoutsLoading() {
  return (
    <Box className="space-y-3">
      <Box className="px-1">
        <Skeleton variant="text" width={128} height={32} />
      </Box>

      {[...Array(3)].map((_, i) => (
        <Card key={i} className="p-4 mx-3" elevation={0}>
          <Box className="space-y-4">
            <Box className="flex justify-between items-center">
              <Skeleton variant="text" width={192} height={24} />
              <Skeleton variant="rectangular" width={32} height={32} />
            </Box>

            <Box className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} variant="rounded" width={96} height={24} />
              ))}
            </Box>

            <Box className="flex gap-2">
              <Skeleton variant="rectangular" height={36} sx={{ flexGrow: 1 }} />
              <Skeleton variant="rectangular" width={36} height={36} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
