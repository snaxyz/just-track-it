import { Autocomplete, AutocompleteRenderGetTagProps, Chip, TextField } from "@mui/material";

export interface Category {
  id: string;
  name: string;
}

const defaultCategories = [
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
].map((c) => ({ id: c, name: c }));

interface Props {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  fullWidth?: boolean;
}

function renderTags(value: Category[], getTagProps: AutocompleteRenderGetTagProps) {
  return value.map((option, index) => {
    const { key, ...props } = getTagProps({ index });
    return <Chip key={key} label={option.name} {...props} />;
  });
}

export function ExerciseCategorySelect({ selectedCategories, onCategoriesChange, fullWidth }: Props) {
  return (
    <Autocomplete
      multiple
      options={defaultCategories}
      getOptionLabel={(option) => option.name}
      value={defaultCategories.filter((cat) => selectedCategories.includes(cat.id))}
      onChange={(_, newValue) => {
        onCategoriesChange(newValue.map((v) => v.id));
      }}
      renderInput={(params) => <TextField {...params} label="Categories" fullWidth={fullWidth} />}
      renderTags={renderTags}
    />
  );
}
