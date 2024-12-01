import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEventHandler } from "react";

interface Props {
  reps: string;
  onChange: (reps: string) => void;
  maxReps?: number;
}

export function RepSelect({ reps, onChange, maxReps = 100 }: Props) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select
      label="Reps"
      fullWidth
      selectedKeys={[reps]}
      onChange={handleChange}
      size="sm"
    >
      {Array.from({ length: maxReps }, (_, i) => (
        <SelectItem key={(i + 1).toString()} value={(i + 1).toString()}>
          {(i + 1).toString()}
        </SelectItem>
      ))}
    </Select>
  );
}
