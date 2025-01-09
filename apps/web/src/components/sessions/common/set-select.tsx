import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface Props {
  set: string;
  onChange: (set: string) => void;
  maxSets?: number;
  disabled?: boolean;
}

export function SetSelect({ set, onChange, maxSets = 20, disabled }: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>Set</InputLabel>
      <Select value={set} label="Set" onChange={handleChange}>
        {Array.from({ length: maxSets }, (_, i) => (
          <MenuItem key={(i + 1).toString()} value={(i + 1).toString()}>
            {(i + 1).toString()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
