"use client";

import { Box, Card, CardContent, Typography, RadioGroup, FormControlLabel, Radio, useColorScheme } from "@mui/material";

export function Settings() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Card variant="outlined">
        <CardContent>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Theme
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>Select your preferred color theme</Typography>
            <RadioGroup value={mode} onChange={(e) => setMode(e.target.value as "light" | "dark" | "system")}>
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
              <FormControlLabel value="system" control={<Radio />} label="System" />
            </RadioGroup>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
