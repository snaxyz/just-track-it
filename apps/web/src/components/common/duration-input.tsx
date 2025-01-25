"use client";

import { TextField } from "@mui/material";

interface Props {
  duration: string;
  onChange: (duration: string) => void;
}

export function DurationInput({ duration, onChange }: Props) {
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <TextField
      type="number"
      label="Duration (minutes)"
      value={duration}
      onChange={(e) => onChange(e.target.value)}
      onFocus={handleFocus}
      slotProps={{
        htmlInput: {
          min: 0,
          step: 1,
        },
      }}
      fullWidth
    />
  );
}
