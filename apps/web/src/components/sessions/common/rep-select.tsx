import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { ChevronDownIcon } from "lucide-react";

interface Props {
  reps: string;
  onChange: (reps: string) => void;
  maxReps?: number;
}

export function RepSelect({ reps, onChange, maxReps = 100 }: Props) {
  const options = Array.from({ length: maxReps }, (_, i) => (i + 1).toString());

  return (
    <>
      <Autocomplete
        className="hidden md:block"
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

      <div className="relative md:hidden rounded-xl bg-default-100 py-2 px-3 w-full focus-within:outline-2 focus-within:outline-offset-0 focus-within:outline focus-within:outline-primary">
        <label className="block text-sm mb-1 text-default-700 dark:text-default-500">
          Reps
        </label>
        <select
          className="w-full h-unit-10 bg-default-100 appearance-none focus:outline-none"
          value={reps}
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
