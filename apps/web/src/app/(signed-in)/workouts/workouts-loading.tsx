import { Card, Box, Skeleton, CardHeader, CardContent, Stack } from "@mui/material";

export function WorkoutsLoading() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {[...Array(3)].map((_, i) => (
        <Card key={i} variant="outlined" sx={{ mb: 3 }}>
          <CardHeader
            title={<Skeleton variant="text" width={192} />}
            action={
              <Stack direction="row" spacing={1}>
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="circular" width={32} height={32} />
              </Stack>
            }
            sx={{
              "& .MuiCardHeader-title": {
                typography: "subtitle1",
                fontWeight: 500,
              },
            }}
          />
          <CardContent>
            <Skeleton variant="text" sx={{ mb: 2 }} width="60%" />
            <Skeleton variant="rounded" height={36} sx={{ mt: 2 }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
