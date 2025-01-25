"use client";

import { TextField } from "@mui/material";
import { WeightUnit } from "@local/db";

interface Props {
  weight: string;
  onChange: (weight: string) => void;
  unit: WeightUnit;
  error?: string;
}

export function WeightInput({ weight, onChange, unit, error }: Props) {
  const step = unit === "lbs" ? 2.5 : 1.25;

  const handleChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const sanitized = value.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const parts = sanitized.split(".");
    const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : sanitized;

    onChange(formatted);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <TextField
      type="number"
      label={`Weight (${unit})`}
      value={weight}
      onChange={(e) => handleChange(e.target.value)}
      onFocus={handleFocus}
      error={!!error}
      helperText={error}
      slotProps={{
        htmlInput: {
          min: 0,
          step: step,
          // Reasonable max values
          max: unit === "lbs" ? 1200 : 500,
        },
      }}
      fullWidth
    />
  );
}
