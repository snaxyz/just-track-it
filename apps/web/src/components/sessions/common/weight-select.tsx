import { Autocomplete, TextField } from "@mui/material";
import { WeightUnit } from "@local/db";
import { ChevronDownIcon } from "lucide-react";

interface Props {
  weight: string;
  onChange: (weight: string) => void;
  maxWeight?: number;
  unit: WeightUnit;
}

export function WeightSelect({ weight, onChange, unit, maxWeight = unit === "lbs" ? 1200 : 600 }: Props) {
  const increment = unit === "lbs" ? 2.5 : 1.25;
  const options = Array.from({ length: Math.ceil(maxWeight / increment) }, (_, i) => (i * increment).toFixed(2));

  return (
    <Autocomplete
      options={options}
      value={parseFloat(weight).toFixed(2)}
      onChange={(_, newValue) => newValue && onChange(newValue)}
      disableClearable
      renderInput={(params) => <TextField {...params} label={`Weight (${unit})`} fullWidth />}
    />
  );
}
