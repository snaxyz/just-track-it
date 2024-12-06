import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEventHandler } from "react";

interface Props {
  set: string;
  onChange: (set: string) => void;
  maxSets?: number;
  disabled?: boolean;
}

export function SetSelect({ set, onChange, maxSets = 20, disabled }: Props) {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select
      label="Set"
      fullWidth
      selectedKeys={[set]}
      onChange={handleChange}
      size="sm"
      isDisabled={disabled}
    >
      {Array.from({ length: maxSets }, (_, i) => (
        <SelectItem key={(i + 1).toString()} value={(i + 1).toString()}>
          {(i + 1).toString()}
        </SelectItem>
      ))}
    </Select>
  );
}
