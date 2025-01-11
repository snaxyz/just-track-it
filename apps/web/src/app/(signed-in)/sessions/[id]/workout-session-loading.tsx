import { Card, Box, Skeleton } from "@mui/material";

export function WorkoutSessionLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ color: "text.secondary", typography: "caption" }}>
        <Skeleton variant="text" width={96} height={16} />
      </Box>

      <Skeleton variant="rectangular" height={48} />

      {[...Array(3)].map((_, i) => (
        <Card key={i} sx={{ p: 4 }} variant="outlined">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="text" width={128} height={24} />
              <Skeleton variant="rectangular" width={32} height={32} />
            </Box>

            {[...Array(2)].map((_, j) => (
              <Box key={j} sx={{ display: "flex", alignItems: "center", gap: 4 }}>
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
