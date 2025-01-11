import { Card, Box, Skeleton } from "@mui/material";

export function ExercisesLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ px: 1 }}>
        <Skeleton variant="text" width={128} height={32} />
      </Box>

      {[...Array(3)].map((_, i) => (
        <Card key={i} sx={{ p: 3, mx: 3 }} variant="outlined">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="text" width={128} height={24} />
            <Box sx={{ display: "flex", gap: 2 }}>
              {[...Array(2)].map((_, j) => (
                <Skeleton key={j} variant="rounded" width={64} height={24} />
              ))}
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
