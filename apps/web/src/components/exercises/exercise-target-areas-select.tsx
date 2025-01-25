import { Autocomplete, AutocompleteRenderGetTagProps, Chip, TextField } from "@mui/material";

export interface TargetArea {
  id: string;
  name: string;
}

const defaultTargetAreas = [
  "Upper",
  "Lower",
  "Push",
  "Pull",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes (Butt)",
  "Calves",
  "Abs",
  "Obliques",
  "Core",
  "Full Body",
].map((c) => ({ id: c, name: c }));

interface Props {
  selectedTargetAreas: string[];
  onTargetAreasChange: (targetAreas: string[]) => void;
  fullWidth?: boolean;
}

function renderTags(value: TargetArea[], getTagProps: AutocompleteRenderGetTagProps) {
  return value.map((option, index) => {
    const { key, ...props } = getTagProps({ index });
    return <Chip key={key} label={option.name} {...props} />;
  });
}

export function ExerciseTargetAreasSelect({ selectedTargetAreas, onTargetAreasChange, fullWidth }: Props) {
  return (
    <Autocomplete
      multiple
      options={defaultTargetAreas}
      getOptionLabel={(option) => option.name}
      value={defaultTargetAreas.filter((cat) => selectedTargetAreas.includes(cat.id))}
      onChange={(_, newValue) => {
        onTargetAreasChange(newValue.map((v) => v.id));
      }}
      renderInput={(params) => <TextField {...params} label="Target areas" fullWidth={fullWidth} />}
      renderTags={renderTags}
    />
  );
}
