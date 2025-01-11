import { Card, Box, Skeleton } from "@mui/material";

export function WorkoutsLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ px: 1 }}>
        <Skeleton variant="text" width={128} height={32} />
      </Box>

      {[...Array(3)].map((_, i) => (
        <Card key={i} variant="outlined" sx={{ px: 4, mx: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Skeleton variant="text" width={192} height={24} />
              <Skeleton variant="rectangular" width={32} height={32} />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} variant="rounded" width={96} height={24} />
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" height={36} sx={{ flexGrow: 1 }} />
              <Skeleton variant="rectangular" width={36} height={36} />
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
