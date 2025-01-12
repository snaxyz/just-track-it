"use client";

import { Box, Card, CardContent, Typography, ButtonGroup, Button } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { SunIcon, MonitorIcon, MoonIcon } from "lucide-react";

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
            <ButtonGroup variant="outlined" fullWidth>
              <Button
                onClick={() => setMode("light")}
                startIcon={<SunIcon size={16} />}
                color={mode === "light" ? "primary" : "inherit"}
              >
                Light
              </Button>
              <Button
                onClick={() => setMode("system")}
                startIcon={<MonitorIcon size={16} />}
                color={mode === "system" ? "primary" : "inherit"}
              >
                System
              </Button>
              <Button
                onClick={() => setMode("dark")}
                startIcon={<MoonIcon size={16} />}
                color={mode === "dark" ? "primary" : "inherit"}
              >
                Dark
              </Button>
            </ButtonGroup>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
