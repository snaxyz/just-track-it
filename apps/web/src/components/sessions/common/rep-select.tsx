import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface Props {
  reps: string;
  onChange: (reps: string) => void;
  maxReps?: number;
}

export function RepSelect({ reps, onChange, maxReps = 100 }: Props) {
  const options = Array.from({ length: maxReps }, (_, i) => (i + 1).toString());

  return (
    <Autocomplete
      label="Reps"
      fullWidth
      selectedKey={reps}
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
