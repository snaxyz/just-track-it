import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { WeightUnit } from "@local/database";

interface Props {
  weight: string;
  onChange: (weight: string) => void;
  maxWeight?: number;
  unit: WeightUnit;
}

export function WeightSelect({
  weight,
  onChange,
  unit,
  maxWeight = unit === "lbs" ? 1200 : 600,
}: Props) {
  const increment = unit === "lbs" ? 2.5 : 1.25;
  const options = Array.from(
    { length: Math.ceil(maxWeight / increment) },
    (_, i) => (i * increment).toFixed(2)
  );

  return (
    <Autocomplete
      label={`Weight (${unit})`}
      fullWidth
      selectedKey={parseFloat(weight).toFixed(2)} // Normalize weight
      onSelectionChange={(key) => key && onChange(key.toString())}
      allowsCustomValue={false}
      isClearable={false}
    >
      {options.map((value) => (
        <AutocompleteItem key={value} value={value}>
          {value}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
