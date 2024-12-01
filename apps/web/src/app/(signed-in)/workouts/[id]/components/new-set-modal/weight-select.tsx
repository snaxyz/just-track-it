import { Select, SelectItem } from "@nextui-org/react";
import { ChangeEventHandler } from "react";

interface Props {
  weight: string;
  onChange: (weight: string) => void;
  maxWeight?: number;
  unit: "lbs" | "kg";
}

export function WeightSelect({
  weight,
  onChange,
  unit,
  maxWeight = unit === "lbs" ? 1200 : 600,
}: Props) {
  const increment = unit === "lbs" ? 2.5 : 1.25;

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select
      label={`Weight (${unit})`}
      fullWidth
      selectedKeys={[weight]}
      onChange={handleChange}
      size="sm"
    >
      {Array.from(
        { length: Math.ceil(maxWeight / increment) },
        (_, i) => i * increment
      ).map((value) => (
        <SelectItem key={value} value={value}>
          {value.toFixed(2)}
        </SelectItem>
      ))}
    </Select>
  );
}
