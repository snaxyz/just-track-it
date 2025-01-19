"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { SunIcon, MonitorIcon, MoonIcon, TrashIcon, LogOutIcon, ScaleIcon } from "lucide-react";
import { useState } from "react";
import { deleteUserData } from "@/server/settings/delete-user-data";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SettingModel, WeightUnit } from "@local/db";
import { getUserSetting } from "@/app/api/setting/[key]/get-setting";
import { updateUserSetting } from "@/server/settings/update-user-setting";

export function Settings() {
  const queryClient = useQueryClient();
  const { mode, setMode } = useColorScheme();
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: weightUnitSetting, isLoading } = useQuery<SettingModel>({
    queryKey: ["setting-weight-unit"],
    queryFn: () => getUserSetting("weight_unit"),
  });

  const unit = weightUnitSetting?.value;

  if (!mode) {
    return null;
  }

  const handleDeleteData = async () => {
    await deleteUserData();
    setIsDeleteDialogOpen(false);
    router.refresh();
    queryClient.clear();
  };

  const handleWeightUnitChange = async (unit: WeightUnit) => {
    queryClient.setQueryData(["setting-weight-unit"], {
      ...weightUnitSetting,
      value: unit,
    });
    await updateUserSetting("weight_unit", unit);
  };

  return (
    <Box sx={{ pb: 3 }}>
      <Card variant="outlined">
        <CardContent>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Theme
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>Select your preferred color theme</Typography>
            <ButtonGroup variant="outlined" fullWidth disableElevation>
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

      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Weight Unit
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>Choose your preferred weight unit</Typography>
            <ButtonGroup variant="outlined" fullWidth disableElevation>
              <Button
                onClick={() => handleWeightUnitChange("kg")}
                startIcon={<ScaleIcon size={16} />}
                color={unit === "kg" ? "primary" : "inherit"}
                disabled={isLoading}
              >
                Kilograms
              </Button>
              <Button
                onClick={() => handleWeightUnitChange("lbs")}
                startIcon={<ScaleIcon size={16} />}
                color={unit === "lbs" ? "primary" : "inherit"}
                disabled={isLoading}
              >
                Pounds
              </Button>
            </ButtonGroup>
          </Box>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent sx={{ px: 0 }}>
          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Account
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>Manage your account settings</Typography>
            <Button component={Link} href="/auth/logout" variant="outlined" startIcon={<LogOutIcon size={16} />}>
              Sign out
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ px: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 2 }}>
              Advanced
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 2 }}>Danger zone: These actions cannot be undone</Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<TrashIcon size={16} />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete all data
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete All Data?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all your data? This includes all your workouts, exercises, and history. This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteData} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
