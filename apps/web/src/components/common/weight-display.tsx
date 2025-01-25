"use client";

import { getUserSetting } from "@/app/api/setting/[key]/get-setting";
import { SettingModel, WeightUnit } from "@local/db";
import { Box, SxProps, Theme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

interface Props {
  weight: number;
  sx?: SxProps<Theme>;
  showUnit?: boolean;
  precision?: number;
}

function kgToLbs(kg: number): number {
  return kg * 2.20462262185;
}

export function WeightDisplay({ weight, sx, showUnit = true, precision = 0 }: Props) {
  const { data: weightUnitSetting, isLoading } = useQuery<SettingModel>({
    queryKey: ["setting-weight-unit"],
    queryFn: () => getUserSetting("weight_unit"),
  });

  const unit = weightUnitSetting?.value;
  const displayWeight = unit === "kg" ? weight : kgToLbs(weight);
  const formattedWeight = Number(displayWeight.toFixed(precision));

  if (isLoading) return null;

  if (showUnit) {
    return (
      <Box component="span" sx={sx}>
        {formattedWeight} {unit}
      </Box>
    );
  }

  return (
    <Box component="span" sx={sx}>
      {formattedWeight}
    </Box>
  );
}
