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
    <>
      <Autocomplete
        className="hidden md:block"
        options={options}
        value={parseFloat(weight).toFixed(2)}
        onChange={(_, newValue) => newValue && onChange(newValue)}
        disableClearable
        renderInput={(params) => <TextField {...params} label={`Weight (${unit})`} fullWidth />}
      />

      <div className="relative md:hidden rounded-xl bg-default-100 py-2 px-3 w-full focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline focus-within:outline-primary">
        <label className="block text-sm mb-1 text-default-700 dark:text-default-500">Weight ({unit})</label>
        <select
          className="w-full h-unit-10 bg-default-100 appearance-none focus:outline-none"
          value={parseFloat(weight).toFixed(2)}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDownIcon size={16} />
        </div>
      </div>
    </>
  );
}
