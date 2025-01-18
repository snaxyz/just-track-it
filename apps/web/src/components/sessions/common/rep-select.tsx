import { Autocomplete, TextField } from "@mui/material";
import { ChevronDownIcon } from "lucide-react";

interface Props {
  reps: string;
  onChange: (reps: string) => void;
  maxReps?: number;
}

export function RepSelect({ reps, onChange, maxReps = 100 }: Props) {
  const options = Array.from({ length: maxReps }, (_, i) => (i + 1).toString());

  return (
    <Autocomplete
      options={options}
      value={reps}
      onChange={(_, newValue) => newValue && onChange(newValue)}
      disableClearable
      renderInput={(params) => <TextField {...params} label="Reps" fullWidth />}
    />
  );
}
